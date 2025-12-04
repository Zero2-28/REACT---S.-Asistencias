import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/forms.css";
import "../styles/pages.css";

function AttendanceForm() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    teacher_id: "",
    date: "",
    check_in_time: "",
    check_out_time: "",
    status: "present",
    notes: "",
    institution_id: 1, // por ahora fijo
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarData = async () => {
      try {
        const s = await http.get("/students");
        const t = await http.get("/teachers");

        setStudents(s.data);
        setTeachers(t.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar estudiantes o docentes");
      }
    };

    cargarData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await http.post("/attendance", {
        ...form,
        institution_id: 1, // aseguramos que va
      });

      setMensaje("Asistencia registrada correctamente ✔");

      setForm({
        student_id: "",
        teacher_id: "",
        date: "",
        check_in_time: "",
        check_out_time: "",
        status: "present",
        notes: "",
        institution_id: 1,
      });
    } catch (err) {
      console.error(err);
      setError("Error registrando la asistencia ❌");
    }
  };

  return (
    <PageContainer>
      <h2 className="page-title">Registrar asistencia</h2>

      {mensaje && <p className="msg-success">{mensaje}</p>}
      {error && <p className="msg-error">{error}</p>}

      <div className="form-container">
        <form className="attendance-form" onSubmit={guardar}>
          {/* Estudiante */}
          <label>Estudiante</label>
          <select
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione estudiante</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.student_code} (ID: {s.id})
              </option>
            ))}
          </select>

          {/* Docente */}
          <label>Docente</label>
          <select
            name="teacher_id"
            value={form.teacher_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione docente</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.teacher_code} (ID: {t.id})
              </option>
            ))}
          </select>

          {/* Fecha */}
          <label>Fecha</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          {/* Hora entrada */}
          <label>Hora de entrada</label>
          <input
            type="time"
            name="check_in_time"
            value={form.check_in_time}
            onChange={handleChange}
          />

          {/* Hora salida */}
          <label>Hora de salida</label>
          <input
            type="time"
            name="check_out_time"
            value={form.check_out_time}
            onChange={handleChange}
          />

          {/* Estado */}
          <label>Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="present">Presente</option>
            <option value="absent">Ausente</option>
            <option value="late">Tardanza</option>
            <option value="excused">Justificado</option>
          </select>

          {/* Notas */}
          <label>Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Opcional"
          />

          <button type="submit" className="btn-primary">
            Guardar asistencia
          </button>
        </form>
      </div>
    </PageContainer>
  );
}

export default AttendanceForm;
