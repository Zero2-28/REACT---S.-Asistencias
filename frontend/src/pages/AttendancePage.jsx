import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    http.get("/attendance").then((res) => setAttendance(res.data));
  }, []);

  return (
    <PageContainer>
      <h2 className="page-title">Asistencias</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Docente</th>
            <th>Institución</th>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.student_id}</td>
              <td>{a.teacher_id}</td>
              <td>{a.institution_id}</td>
              <td>{a.date}</td>
              <td>{a.check_in_time}</td>
              <td>{a.check_out_time}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default AttendancePage;
