import React, { useEffect, useState } from "react";
import axios from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/teacherDashboard.css"; // 👈 CSS del panel
import { Link } from "react-router-dom";

function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.teacher_id) return;

    const fetchData = async () => {
      try {
        // 1) Datos del docente
        const teacherRes = await axios.get(`/teachers/${user.teacher_id}`);
        setTeacher(teacherRes.data);

        // 2) Estudiantes filtrados por institución
        const studentsRes = await axios.get("/students");
        const filtered = studentsRes.data.filter(
          (s) => s.institution_id === user.institution_id
        );
        setStudents(filtered);

        // 3) Asistencias del día (comparando solo YYYY-MM-DD)
        const attendanceRes = await axios.get("/attendance");
        const today = new Date().toISOString().slice(0, 10);

        const todayAttendance = attendanceRes.data.filter((a) => {
          const aDate = new Date(a.date).toISOString().slice(0, 10);
          return a.teacher_id === user.teacher_id && aDate === today;
        });

        setAttendanceToday(todayAttendance);
      } catch (error) {
        console.error("Error cargando panel del docente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <PageContainer>
        <p>Cargando datos...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="teacher-dashboard">
        {/* Header del panel */}
        <header className="teacher-header">
          <h1 className="page-title">Panel del Docente</h1>
          <p className="teacher-subtitle">
            Visualiza tus asistencias del día y tus estudiantes.
          </p>
        </header>

        {/* Tarjeta principal del docente */}
        {teacher && (
          <section className="teacher-header-card">
            <div className="teacher-main-info">
              <h2>{teacher.name}</h2>
              <p className="teacher-code">
                <span>Código docente:</span> {teacher.teacher_code}
              </p>
              <p className="teacher-inst">
                <span>Institución:</span> #{teacher.institution_id}
              </p>
            </div>

            <div className="teacher-meta">
              <div className="teacher-badge">Docente activo</div>

              <div className="teacher-stat">
                <span className="teacher-stat-label">Estudiantes</span>
                <span className="teacher-stat-value">{students.length}</span>
              </div>

              <div className="teacher-stat">
                <span className="teacher-stat-label">Asistencias hoy</span>
                <span className="teacher-stat-value">
                  {attendanceToday.length}
                </span>
              </div>

              <div className="teacher-actions">
                <Link className="btn-primary" to="/attendance-form">
                  Tomar asistencia
                </Link>
                {/* 👇 Botón pensado para “editar asistencias de hoy” (misma ruta, misma pantalla) */}
                <Link className="btn-secondary" to="/attendance-form">
                  Editar Asistencia
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Grid principal: Asistencias hoy + Mis estudiantes */}
        <section className="teacher-main-grid">
          {/* Asistencias del día */}
          <div className="teacher-card">
            <div className="teacher-card-header">
              <h2>Asistencias Registradas Hoy</h2>
              <span className="teacher-tag">
                {attendanceToday.length === 0
                  ? "Sin registros"
                  : `${attendanceToday.length} registro(s)`}
              </span>
            </div>

            {attendanceToday.length === 0 ? (
              <p className="teacher-empty">
                No tienes asistencias registradas hoy.
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Fecha</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceToday.map((a) => (
                      <tr key={a.id}>
                        <td>{a.student_name || "—"}</td>
                        <td>
                          {new Date(a.date).toISOString().slice(0, 10)}
                        </td>
                        <td>
                          {a.check_in_time
                            ? new Date(a.check_in_time)
                                .toISOString()
                                .slice(11, 16)
                            : "-"}
                        </td>
                        <td>
                          {a.check_out_time
                            ? new Date(a.check_out_time)
                                .toISOString()
                                .slice(11, 16)
                            : "-"}
                        </td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mis estudiantes */}
          <div className="teacher-card">
            <div className="teacher-card-header">
              <h2>Mis Estudiantes</h2>
              <span className="teacher-tag secondary">
                {students.length} en total
              </span>
            </div>

            {students.length === 0 ? (
              <p className="teacher-empty">No se encontraron estudiantes.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Grado</th>
                      <th>Sección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.student_code}</td>
                        <td>{s.student_name ?? s.name ?? "—"}</td>
                        <td>{s.grade}</td>
                        <td>{s.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

export default TeacherDashboard;
