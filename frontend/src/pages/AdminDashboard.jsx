import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import "../styles/pages.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <PageContainer>
      <h1 className="page-title">Panel del Admin</h1>
      <p>Bienvenido{user?.name ? `, ${user.name}` : ""}.</p>

      <div className="admin-grid">
        <Link className="admin-card" to="/admin/users">
          <h3>Users (CRUD)</h3>
          <p>Crear, editar y eliminar usuarios.</p>
        </Link>

        <Link className="admin-card" to="/admin/students">
          <h3>Students (CRUD)</h3>
          <p>Gestionar estudiantes.</p>
        </Link>

        <Link className="admin-card" to="/admin/teachers">
          <h3>Teachers (CRUD)</h3>
          <p>Gestionar docentes.</p>
        </Link>

        <Link className="admin-card" to="/admin/attendance-history">
          <h3>Attendance History</h3>
          <p>Ver asistencias registradas (todos).</p>
        </Link>
      </div>
    </PageContainer>
  );
}

export default AdminDashboard;
