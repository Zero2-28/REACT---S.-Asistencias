import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import "../styles/teacher-login.css";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await http.post("/auth/login", { email, password });

      if (res.data.role !== "teacher") {
        return setError("Solo los docentes pueden ingresar aquí.");
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/teacher/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="tl-page">
      <div className="tl-bg" aria-hidden="true">
        <div className="tl-blob tl-blob-1" />
        <div className="tl-blob tl-blob-2" />
        <div className="tl-grid" />
      </div>

      <main className="tl-card">
        <header className="tl-header">
          <div className="tl-badge">Docente</div>
          <h2 className="tl-title">Inicia sesión</h2>
          <p className="tl-subtitle">Gestiona tu panel y registra asistencias.</p>
        </header>

        {error && <div className="tl-error">{error}</div>}

        <form className="tl-form" onSubmit={login}>
          <label className="tl-label">Email</label>
          <input
            className="tl-input"
            type="email"
            placeholder="correo docente"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="tl-label">Contraseña</label>
          <input
            className="tl-input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="tl-btn" type="submit">Ingresar</button>
        </form>

        <div className="tl-footer">
          <button className="tl-link" type="button" onClick={() => navigate("/login")}>
            ← Volver
          </button>
        </div>
      </main>
    </div>
  );
}

export default TeacherLogin;
