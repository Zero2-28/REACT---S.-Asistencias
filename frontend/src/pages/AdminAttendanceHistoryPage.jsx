import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/forms.css";
function AdminAttendanceHistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // tu /attendance ya devuelve student_name y teacher_name (lo confirmaste con Postman)
        const res = await http.get("/attendance");
        setItems(res.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <p>Cargando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title">Admin • Historial de Asistencias</h1>

      {items.length === 0 ? (
        <p>No hay registros.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Docente</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{String(a.date).split("T")[0]}</td>
                <td>{a.student_name}</td>
                <td>{a.teacher_name}</td>
                <td>{a.check_in_time ? String(a.check_in_time).substring(11, 16) : "-"}</td>
                <td>{a.check_out_time ? String(a.check_out_time).substring(11, 16) : "-"}</td>
                <td>{a.status}</td>
                <td>{a.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageContainer>
  );
}

export default AdminAttendanceHistoryPage;
