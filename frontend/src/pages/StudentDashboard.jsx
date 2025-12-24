import React, { useEffect, useMemo, useState } from "react";
import axios from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/studentCalendar.css"; // ya lo tenías

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  // 📅 fecha seleccionada (YYYY-MM-DD)
  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );
  const [selectedDate, setSelectedDate] = useState(today);

  // 🔄 cargar datos
  useEffect(() => {
    if (!user || !user.student_id) return;

    const fetchData = async () => {
      try {
        // Estudiante
        const studentRes = await axios.get(`/students/${user.student_id}`);
        setStudent(studentRes.data);

        // Asistencias del estudiante (todas)
        const attendanceRes = await axios.get(
          `/attendance/student/${user.student_id}`
        );
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error("Error cargando dashboard estudiante:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 🧠 normalizar fecha a YYYY-MM-DD
  const normalizeDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };

  // 📌 mapa: { "2025-12-10": [asistencia1, asistencia2, ...], ... }
  const attendanceByDate = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const d = normalizeDate(a.date);
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(a);
    });
    return map;
  }, [attendance]);

  // lista de asistencias del día seleccionado
  const selectedDayAttendance = attendanceByDate[selectedDate] || [];

  // resumen rápido
  const totalClases = attendance.length;
  const totalPresentes = attendance.filter((a) => a.status === "present").length;
  const totalTardanzas = attendance.filter((a) => a.status === "late").length;
  const totalJustificados = attendance.filter(
    (a) => a.status === "excused"
  ).length;

  // ====== LÓGICA DEL CALENDARIO (mes actual) ======
  const currentDate = new Date(); // mes actual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = firstDayOfMonth.getDay(); // 0=Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // huecos antes del día 1
  for (let i = 0; i < (firstWeekday === 0 ? 6 : firstWeekday - 1); i++) {
    calendarDays.push(null);
  }
  // días reales del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    calendarDays.push(dateStr);
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric",
  });

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return "Sin fecha seleccionada";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Cargando datos...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="student-dashboard">
        {/* ====== ENCABEZADO ====== */}
        <header className="sd-header">
          <div>
            <h1 className="sd-title">Panel del Estudiante</h1>
            <p className="sd-subtitle">
              Revisa tu asistencia y las clases en las que fuiste registrado.
            </p>
          </div>
          {student && (
            <div className="sd-badge">
              <span className="sd-badge-name">{student.name}</span>
              <span className="sd-badge-code">{student.student_code}</span>
            </div>
          )}
        </header>

        {/* ====== CARDS RESUMEN ====== */}
        <section className="sd-summary">
          <div className="sd-card sd-card-main">
            <h2>Resumen de asistencia</h2>
            <p className="sd-card-text">
              Control rápido de tu asistencia registrada en el sistema.
            </p>
            <div className="sd-stats">
              <div className="sd-stat">
                <span className="sd-stat-label">Clases registradas</span>
                <span className="sd-stat-value">{totalClases}</span>
              </div>
              <div className="sd-stat">
                <span className="sd-stat-label">Presentes</span>
                <span className="sd-stat-value positive">
                  {totalPresentes}
                </span>
              </div>
              <div className="sd-stat">
                <span className="sd-stat-label">Tardanzas</span>
                <span className="sd-stat-value warning">
                  {totalTardanzas}
                </span>
              </div>
              <div className="sd-stat">
                <span className="sd-stat-label">Justificados</span>
                <span className="sd-stat-value info">
                  {totalJustificados}
                </span>
              </div>
            </div>
          </div>

          {student && (
            <div className="sd-card sd-card-side">
              <h3>Datos del estudiante</h3>
              <p>
                <strong>Grado:</strong> {student.grade}
              </p>
              <p>
                <strong>Sección:</strong> {student.section}
              </p>
              <p>
                <strong>Institución:</strong> #{student.institution_id}
              </p>
            </div>
          )}
        </section>

        {/* ====== LAYOUT PRINCIPAL: CALENDARIO + LISTA ====== */}
        <section className="sd-main-layout">
          {/* CALENDARIO */}
          <div className="sd-card calendar-card">
            <div className="calendar-header">
              <div>
                <h2>Calendario de asistencias</h2>
                <p className="calendar-subtitle">
                  Haz clic en un día para ver qué docentes te tomaron lista.
                </p>
              </div>
              <span className="calendar-month">{monthLabel}</span>
            </div>

            <div className="calendar-grid">
              {/* Encabezados de días */}
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((label) => (
                <div key={label} className="calendar-weekday">
                  {label}
                </div>
              ))}

              {/* Celdas del mes */}
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) {
                  return <div key={`empty-${idx}`} className="calendar-day empty" />;
                }

                const hasAttendance = !!attendanceByDate[dateStr];
                const isSelected = selectedDate === dateStr;
                const isToday = today === dateStr;

                const dayNumber = new Date(dateStr).getDate();

                const classes = [
                  "calendar-day",
                  hasAttendance ? "has-attendance" : "",
                  isSelected ? "selected" : "",
                  isToday ? "today" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={dateStr}
                    type="button"
                    className={classes}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <span className="day-number">{dayNumber}</span>
                    {hasAttendance && <span className="day-dot" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LISTA FILTRADA POR DÍA SELECCIONADO */}
          <div className="sd-card attendance-card">
            <div className="attendance-header">
              <h2>Asistencias del día seleccionado</h2>
              <p className="attendance-date">{formatSelectedDate(selectedDate)}</p>
            </div>

            {selectedDayAttendance.length === 0 ? (
              <p className="attendance-empty">
                No tienes asistencias registradas en esta fecha.
              </p>
            ) : (
              <ul className="attendance-list">
                {selectedDayAttendance.map((a) => (
                  <li key={a.id} className="attendance-item">
                    <div className="attendance-main">
                      <span className="teacher-name">
                        {a.teacher_name || "Docente no registrado"}
                      </span>
                      <span
                        className={`status-pill status-${a.status || "unknown"}`}
                      >
                        {a.status === "present" && "Presente"}
                        {a.status === "late" && "Tardanza"}
                        {a.status === "excused" && "Justificado"}
                        {a.status === "absent" && "Ausente"}
                        {!a.status && "Sin estado"}
                      </span>
                    </div>
                    <div className="attendance-meta">
                      <span>
                        Entrada:{" "}
                        {a.check_in_time
                          ? new Date(a.check_in_time)
                              .toISOString()
                              .slice(11, 16)
                          : "-"}
                      </span>
                      <span>
                        Salida:{" "}
                        {a.check_out_time
                          ? new Date(a.check_out_time)
                              .toISOString()
                              .slice(11, 16)
                          : "-"}
                      </span>
                    </div>
                    {a.notes && (
                      <p className="attendance-notes">Nota: {a.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

export default StudentDashboard;
