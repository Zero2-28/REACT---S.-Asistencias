import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/forms.css";

const emptyForm = {
  institution_id: 1,
  name: "",
  email: "",
  password: "",
  role: "student",
};

function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await http.get("/users");
      setItems(res.data);
    } catch (e) {
      setErr("No se pudo cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMsg("");
    setErr("");
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      institution_id: u.institution_id ?? 1,
      name: u.name ?? "",
      email: u.email ?? "",
      password: "", // por seguridad no precargamos
      role: u.role ?? "student",
    });
    setMsg("");
    setErr("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      if (!form.name || !form.email || !form.role) {
        return setErr("Completa nombre, email y rol.");
      }

      if (!editingId) {
        // CREATE
        await http.post("/users", form);
        setMsg("Usuario creado ✔");
      } else {
        // UPDATE (si password está vacío, igual lo mandamos; si tu backend no quiere, quítalo)
        await http.put(`/users/${editingId}`, form);
        setMsg("Usuario actualizado ✔");
      }

      startCreate();
      await load();
    } catch (e2) {
      setErr("Error guardando usuario.");
    }
  };

  const remove = async (id) => {
    setMsg("");
    setErr("");
    const ok = window.confirm("¿Eliminar usuario?");
    if (!ok) return;

    try {
      await http.delete(`/users/${id}`);
      setMsg("Usuario eliminado ✔");
      await load();
    } catch (e) {
      setErr("No se pudo eliminar. Puede estar relacionado a estudiante/docente.");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Cargando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title">Admin • Usuarios</h1>

      {msg && <p className="msg-success">{msg}</p>}
      {err && <p className="msg-error">{err}</p>}

      <div className="form-container" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "Editar usuario" : "Crear usuario"}</h3>

        <form className="attendance-form" onSubmit={submit}>
          <label>Institución (ID)</label>
          <input
            name="institution_id"
            type="number"
            value={form.institution_id}
            onChange={onChange}
            required
          />

          <label>Nombre</label>
          <input name="name" value={form.name} onChange={onChange} required />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />

          <label>Contraseña {editingId ? "(opcional si tu backend lo permite)" : ""}</label>
          <input name="password" type="password" value={form.password} onChange={onChange} />

          <label>Rol</label>
          <select name="role" value={form.role} onChange={onChange}>
            <option value="student">student</option>
            <option value="teacher">teacher</option>
            <option value="admin">admin</option>
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" type="submit">
              {editingId ? "Guardar cambios" : "Crear"}
            </button>
            <button className="btn-secondary" type="button" onClick={startCreate}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Institución</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th style={{ width: 220 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.institution_id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-primary" type="button" onClick={() => startEdit(u)}>
                    Editar
                  </button>
                  <button className="btn-danger" type="button" onClick={() => remove(u.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default AdminUsersPage;
