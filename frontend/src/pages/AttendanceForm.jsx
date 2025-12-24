import { useEffect, useMemo, useRef, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/forms.css";
import "../styles/pages.css";
import "../styles/attendance-form.css";

function AttendanceForm() {
  // ✅ user estable (no cambia en cada render)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const teacherId = user?.teacher_id;
  const institutionId = user?.institution_id ?? 1;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const nowTime = useMemo(() => new Date().toTimeString().slice(0, 5), []);

  const [students, setStudents] = useState([]);
  const [markedToday, setMarkedToday] = useState(new Set());
  const [todayRecordsByStudent, setTodayRecordsByStudent] = useState({});
  // { [studentId]: attendanceRowCompleta }

  const [selected, setSelected] = useState({});
  // { [studentId]: { present: bool, status: "present|late|excused", notes: "" } }

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 modal para "Quitar asistencia"
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // (DEV) evita doble ejecución por StrictMode
  const ranOnce = useRef(false);

  useEffect(() => {
    if (!teacherId) return;

    if (process.env.NODE_ENV === "development" && ranOnce.current) return;
    ranOnce.current = true;

    const cargarData = async () => {
      setLoading(true);
      setMensaje("");
      setError("");

      try {
        // 1) estudiantes (filtrados por institución)
        const s = await http.get("/students");
        const filtered = s.data.filter(
          (st) => st.institution_id === institutionId
        );
        setStudents(filtered);

        // 2) asistencias del día del docente
        const a = await http.get("/attendance");
        const todayRecords = a.data.filter(
          (x) =>
            x.teacher_id === teacherId &&
            String(x.date).slice(0, 10) === today
        );

        const ids = todayRecords.map((x) => x.student_id);
        setMarkedToday(new Set(ids));

        const map = {};
        todayRecords.forEach((rec) => {
          map[rec.student_id] = rec;
        });
        setTodayRecordsByStudent(map);

        // 3) inicializar selección
        const init = {};
        filtered.forEach((st) => {
          const att = map[st.id];
          if (att) {
            init[st.id] = {
              present: true,
              status: att.status || "present",
              notes: att.notes || "",
            };
          } else {
            init[st.id] = {
              present: false,
              status: "present",
              notes: "",
            };
          }
        });
        setSelected(init);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar estudiantes/asistencias.");
      } finally {
        setLoading(false);
      }
    };

    cargarData();
  }, [teacherId, institutionId, today]);

  const togglePresent = (studentId) => {
    setSelected((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: "present", notes: "" }),
        present: !prev[studentId]?.present,
      },
    }));
  };

  const changeStatus = (studentId, status) => {
    setSelected((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { present: false, notes: "" }),
        status,
      },
    }));
  };

  const changeNotes = (studentId, notes) => {
    setSelected((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { present: false, status: "present" }),
        notes,
      },
    }));
  };

  // 🔹 abrir modal para quitar asistencia
  const openDeleteModal = (student) => {
    setMensaje("");
    setError("");
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  // 🔹 confirmar DELETE /attendance/:id
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    const studentId = studentToDelete.id;
    const rec = todayRecordsByStudent[studentId];
    if (!rec) {
      setError("No se encontró el registro de asistencia para este estudiante.");
      closeDeleteModal();
      return;
    }

    try {
      await http.delete(`/attendance/${rec.id}`);

      // 1) actualizar set de marcados
      setMarkedToday((prevSet) => {
        const next = new Set(prevSet);
        next.delete(studentId);
        return next;
      });

      // 2) actualizar mapa de registros de hoy
      setTodayRecordsByStudent((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });

      // 3) resetear selección de ese alumno
      setSelected((prev) => ({
        ...prev,
        [studentId]: {
          present: false,
          status: "present",
          notes: "",
        },
      }));

      setMensaje("Asistencia eliminada ✔");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error al eliminar la asistencia ❌"
      );
    } finally {
      closeDeleteModal();
    }
  };

  const guardar = async () => {
    setMensaje("");
    setError("");
    setSaving(true);

    try {
      const presentNew = students.filter(
        (st) => selected[st.id]?.present && !markedToday.has(st.id)
      );
      const presentExisting = students.filter(
        (st) => selected[st.id]?.present && markedToday.has(st.id)
      );

      if (presentNew.length === 0 && presentExisting.length === 0) {
        setError("No hay asistencias seleccionadas para guardar.");
        return;
      }

      // 1) Crear nuevos registros
      const createPromises = presentNew.map((st) =>
        http.post("/attendance", {
          student_id: st.id,
          teacher_id: teacherId,
          institution_id: institutionId,
          date: today,
          check_in_time: nowTime,
          check_out_time: null,
          status: selected[st.id]?.status || "present",
          notes: selected[st.id]?.notes || "",
        })
      );

      // 2) Actualizar existentes
      const updatePromises = presentExisting.map((st) => {
        const old = todayRecordsByStudent[st.id];
        if (!old) return Promise.resolve();

        const updated = {
          ...old,
          status: selected[st.id]?.status || old.status,
          notes:
            selected[st.id]?.notes !== undefined
              ? selected[st.id].notes
              : old.notes || "",
        };

        return http.put(`/attendance/${old.id}`, updated);
      });

      await Promise.all([...createPromises, ...updatePromises]);

      // 🔄 Refrescar estado local
      const a = await http.get("/attendance");
      const todayRecords = a.data.filter(
        (x) =>
          x.teacher_id === teacherId &&
          String(x.date).slice(0, 10) === today
      );

      const ids = todayRecords.map((x) => x.student_id);
      setMarkedToday(new Set(ids));

      const map = {};
      todayRecords.forEach((rec) => {
        map[rec.student_id] = rec;
      });
      setTodayRecordsByStudent(map);

      const init = {};
      students.forEach((st) => {
        const att = map[st.id];
        if (att) {
          init[st.id] = {
            present: true,
            status: att.status || "present",
            notes: att.notes || "",
          };
        } else {
          init[st.id] = {
            present: false,
            status: "present",
            notes: "",
          };
        }
      });
      setSelected(init);

      setMensaje("Asistencias registradas / actualizadas ✔");
    } catch (err) {
      console.error(err);
      console.log("POST/PUT /attendance RESP:", err?.response?.data);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error registrando la asistencia ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <h2 className="page-title">Registrar / editar asistencia (hoy)</h2>

      {mensaje && <p className="msg-success">{mensaje}</p>}
      {error && <p className="msg-error">{error}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="form-container">
          {students.length === 0 ? (
            <p>No hay estudiantes para tu institución.</p>
          ) : (
            // 👇 wrapper ancho + barra + tabla
            <div className="attendance-table-wrapper">
              <div className="attendance-info-bar">
                <div>
                  <strong>Fecha:</strong> {today}
                </div>
                <div>
                  <strong>Hora actual:</strong> {nowTime}
                </div>
              </div>

              <table className="table attendance-table">
                <thead>
                  <tr>
                    <th>Asistió</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Grado</th>
                    <th>Sección</th>
                    <th>Estado</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const isMarked = markedToday.has(s.id);
                    const row =
                      selected[s.id] || {
                        present: false,
                        status: "present",
                        notes: "",
                      };

                    return (
                      <tr
                        key={s.id}
                        style={isMarked ? { opacity: 0.9 } : undefined}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={!!row.present}
                            disabled={isMarked}
                            onChange={() => togglePresent(s.id)}
                          />
                        </td>

                        <td>{s.student_code}</td>
                        <td>{s.student_name || s.name || "—"}</td>
                        <td>{s.grade}</td>
                        <td>{s.section}</td>

                        <td>
                          <select
                            value={row.status}
                            disabled={!row.present}
                            onChange={(e) =>
                              changeStatus(s.id, e.target.value)
                            }
                          >
                            <option value="present">Presente</option>
                            <option value="late">Tardanza</option>
                            <option value="excused">Justificado</option>
                          </select>
                        </td>

                        <td>
                          <input
                            type="text"
                            placeholder="Opcional"
                            value={row.notes}
                            disabled={!row.present}
                            onChange={(e) =>
                              changeNotes(s.id, e.target.value)
                            }
                          />
                        </td>

                        <td>
                          {isMarked && (
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => openDeleteModal(s)}
                            >
                              Quitar Asistencia
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn-primary"
              onClick={guardar}
              disabled={saving || loading || !teacherId}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {/* 🔹 MODAL PERSONALIZADO PARA CONFIRMAR QUITAR */}
      {deleteModalOpen && studentToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15,23,42,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px 24px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(15,23,42,0.35)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8, color: "#111827" }}>
              Quitar asistencia
            </h3>
            <p
              style={{
                marginBottom: 16,
                color: "#4b5563",
                fontSize: "0.95rem",
              }}
            >
              ¿Seguro que quieres quitar la asistencia de hoy para{" "}
              <strong>
                {studentToDelete.student_name || studentToDelete.name}
              </strong>
              ?
              <br />
              Podrás volver a marcarla luego si fue un error.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={closeDeleteModal}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#111827",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-remove"
              >
                Quitar Asistencia
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default AttendanceForm;
