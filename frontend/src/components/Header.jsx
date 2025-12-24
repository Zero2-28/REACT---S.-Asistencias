import { Link } from "react-router-dom";
import "../styles/layouts.css";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  const role = user.role;

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h2 className="app-header-title">Sistema de Asistencia</h2>
      </div>

      <nav className="app-header-nav">
        {/* === MENU PARA ADMIN === */}
        {role === "admin" && (
          <>
            <Link className="nav-link" to="/admin/dashboard">
              Panel
            </Link>
            <Link className="nav-link" to="/admin/users">
              Usuarios
            </Link>
            <Link className="nav-link" to="/admin/students">
              Estudiantes
            </Link>
            <Link className="nav-link" to="/admin/teachers">
              Docentes
            </Link>
            <Link className="nav-link" to="/admin/attendance-history">
              Historial
            </Link>
          </>
        )}

        {/* === MENU PARA DOCENTE === */}
        {role === "teacher" && (
          <>
            <Link className="nav-link" to="/teacher/dashboard">
              Mi Panel
            </Link>
            <Link className="nav-link" to="/attendance-form">
              Registrar Asistencia
            </Link>
            <Link className="nav-link" to="/students">
              Mis Estudiantes
            </Link>
          </>
        )}

        {/* === MENU PARA ESTUDIANTE === */}
        {role === "student" && (
          <>
            <Link className="nav-link" to="/student/dashboard">
              Mi Panel
            </Link>
          </>
        )}

        {/* --- LOGOUT --- */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="logout-btn"
          type="button"
        >
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
}

export default Header;
