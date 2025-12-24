import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";
import "../styles/teacherStudents.css"; // 👈 nuevo estilo

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.teacher_id) return;

    http
      .get(`/students/with-attendance/today/${user.teacher_id}`)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error:", err));
  }, [user]);

  const getStatusLabel = (status) => {
    if (!status) return "No registrado";
    switch (status) {
      case "present":
        return "Presente";
      case "late":
        return "Tardanza";
      case "excused":
        return "Justificado";
      case "absent":
        return "Ausente";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "status-none";
    switch (status) {
      case "present":
        return "status-present";
      case "late":
        return "status-late";
      case "excused":
        return "status-excused";
      case "absent":
        return "status-absent";
      default:
        return "status-none";
    }
  };

  return (
    <PageContainer>
      <div className="teacher-students-page">
        <header className="teacher-students-header">
          <h2 className="page-title">Mis Estudiantes</h2>
          <p className="teacher-students-subtitle">
            Revisa el listado de estudiantes y su estado de asistencia en el día.
          </p>
        </header>

        <section className="teacher-students-card">
          {students.length === 0 ? (
            <p className="teacher-students-empty">
              No hay estudiantes registrados hoy para tu institución o aún no se ha tomado asistencia.
            </p>
          ) : (
            <div className="teacher-students-table-wrapper">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Grado</th>
                    <th>Sección</th>
                    <th>Estado Hoy</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.student_code}</td>
                      <td>{s.student_name}</td>
                      <td>{s.grade}</td>
                      <td>{s.section}</td>
                      <td>
                        <span
                          className={`status-pill ${getStatusClass(
                            s.today_status
                          )}`}
                        >
                          {getStatusLabel(s.today_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

export default StudentsPage;
