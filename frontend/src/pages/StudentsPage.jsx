import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    http.get("/students").then((res) => setStudents(res.data));
  }, []);

  return (
    <PageContainer>
      <h2 className="page-title">Estudiantes registrados</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Institución</th>
            <th>Código</th>
            <th>Grado</th>
            <th>Sección</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.user_id}</td>
              <td>{s.institution_id}</td>
              <td>{s.student_code}</td>
              <td>{s.grade}</td>
              <td>{s.section}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default StudentsPage;
