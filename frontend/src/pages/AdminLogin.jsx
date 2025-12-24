import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import "../styles/admin-login.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await http.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        return setError("Solo admins pueden ingresar aquí.");
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="admin-login-page">
      <main className="admin-login-card">
        <h2 className="admin-title">Login Admin</h2>

        {error && <p className="msg-error">{error}</p>}

        <form className="admin-form" onSubmit={login}>
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="admin-btn" type="submit">Ingresar</button>
        </form>
      </main>
    </div>
  );
}

export default AdminLogin;
