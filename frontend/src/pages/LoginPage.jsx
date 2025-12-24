import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      {/* Fondo suave */}
      <div className="login-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />
      </div>

      <main className="login-shell" role="main">
        {/* Panel izquierdo */}
        <aside className="login-left" aria-hidden="true">
          <div className="brand">
              <div className="brand-logo">
                <svg
                  className="brand-logo-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {/* fondo del ícono */}
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="3"
                    ry="3"
                    fill="white"
                  />
                  {/* línea superior del calendario */}
                  <rect x="3" y="8" width="18" height="2" fill="#dbeafe" />
                  {/* check de asistencia */}
                  <path
                    d="M9.2 15.3 7.3 13.4 6.2 14.5 9.2 17.5 17 9.7 15.9 8.6z"
                    fill="#2563eb"
                  />
                  {/* “anillos” del calendario */}
                  <rect x="8" y="3" width="2" height="4" rx="1" fill="#2563eb" />
                  <rect x="14" y="3" width="2" height="4" rx="1" fill="#2563eb" />
                </svg>
              </div>
              <div className="brand-text">SISTEMA DE ASISTENCIA - SAN JUAN</div>
          </div>


          <h2 className="left-title">
            Hola,<br />Bienvenido!
          </h2>

          <p className="left-sub">
            Accede como estudiante o docente.
          </p>

          <button className="left-cta" type="button">
            Ver más
          </button>
        </aside>

        {/* Panel derecho */}
        <section className="login-right">
          <header className="login-header">
            <div className="login-badge">Acceso</div>
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Selecciona tu tipo de acceso</p>
          </header>

          <div className="login-actions">
            <button
              className="login-btn student"
              onClick={() => navigate("/login/student")}
              type="button"
            >
              <span className="icon" aria-hidden="true">👨‍🎓</span>
              <span className="text">
                <span className="label">Estudiante</span>
                <span className="desc">Ingresa a tu panel</span>
              </span>
              <span className="chev" aria-hidden="true">→</span>
            </button>

            <button
              className="login-btn teacher"
              onClick={() => navigate("/login/teacher")}
              type="button"
            >
              <span className="icon" aria-hidden="true">👨‍🏫</span>
              <span className="text">
                <span className="label">Docente</span>
                <span className="desc">Gestiona tus clases</span>
              </span>
              <span className="chev" aria-hidden="true">→</span>
            </button>
          </div>
           <button
            className="login-btn admin"
            onClick={() => navigate("/login/admin")}
            type="button"
            >
          <span className="icon" aria-hidden="true">🛡️</span>
          <span className="text">
              <span className="label">Admin</span>
              <span className="desc">Control total del sistema</span>
            </span>
            <span className="chev" aria-hidden="true">→</span>
          </button>
          
          <footer className="login-footer">
            <span className="hint">Tip:</span> Puedes cambiar de acceso cuando quieras.
          </footer>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
