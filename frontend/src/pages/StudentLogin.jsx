import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import "../styles/student-login.css";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await http.post("/auth/login", { email, password });

      if (res.data.role !== "student") {
        return setError("Solo los estudiantes pueden ingresar aquí.");
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/student/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="sl-page">
      <div className="sl-bg" aria-hidden="true">
        <div className="sl-blob sl-blob-1" />
        <div className="sl-blob sl-blob-2" />
        <div className="sl-grid" />
      </div>

      <main className="sl-card">
        <header className="sl-header">
          <div className="sl-badge">Estudiante</div>
          <h2 className="sl-title">Inicia sesión</h2>
          <p className="sl-subtitle">Accede a tu panel y revisa tus asistencias.</p>
        </header>

        {error && <div className="sl-error">{error}</div>}

        <form className="sl-form" onSubmit={login}>
          <label className="sl-label">Email</label>
          <input
            className="sl-input"
            type="email"
            placeholder="correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="sl-label">Contraseña</label>
          <input
            className="sl-input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="sl-btn" type="submit">Ingresar</button>
        </form>

        <div className="sl-footer">
          <button className="sl-link" type="button" onClick={() => navigate("/login")}>
            ← Volver
          </button>
        </div>
      </main>
    </div>
  );
}

export default StudentLogin;
