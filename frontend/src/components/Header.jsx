import { Link } from "react-router-dom";
import "../styles/layouts.css";

function Header() {
  return (
    <header className="header">
      <h2>Sistema Asistencia</h2>

      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/users">Usuarios</Link>
        <Link to="/students">Estudiantes</Link>
        <Link to="/teachers">Docentes</Link>
        <Link to="/attendance">Asistencias</Link>
        <Link to="/attendance-history">Historial</Link>
        <Link to="/attendance-form">Registrar Asistencia</Link>
      </nav>
    </header>
  );
}

export default Header;
