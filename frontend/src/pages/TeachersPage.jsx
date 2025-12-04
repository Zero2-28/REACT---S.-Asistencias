import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    http.get("/teachers").then((res) => setTeachers(res.data));
  }, []);

  return (
    <PageContainer>
      <h2 className="page-title">Docentes registrados</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Institución</th>
            <th>Código</th>
            <th>Teléfono</th>
            <th>Contratado</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.user_id}</td>
              <td>{t.institution_id}</td>
              <td>{t.teacher_code}</td>
              <td>{t.phone}</td>
              <td>{t.hire_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default TeachersPage;
