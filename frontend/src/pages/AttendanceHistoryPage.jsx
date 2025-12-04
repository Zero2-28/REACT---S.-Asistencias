import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function AttendanceHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    http.get("/attendance-history").then((res) => setHistory(res.data));
  }, []);

  return (
    <PageContainer>
      <h2 className="page-title">Historial de Asistencias</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asistencia</th>
            <th>Modificado por</th>
            <th>Estado previo</th>
            <th>Nuevo estado</th>
            <th>Comentario</th>
            <th>Fecha cambio</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.attendance_id}</td>
              <td>{h.modified_by}</td>
              <td>{h.previous_status}</td>
              <td>{h.new_status}</td>
              <td>{h.change_reason}</td>
              <td>{h.modified_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default AttendanceHistoryPage;
