import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/forms.css";
const empty = {
  institution_id: 1,
  name: "",
  email: "",
  password: "",
  teacher_code: "",
};

function AdminTeachersPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await http.get("/teachers");
      setItems(res.data);
    } catch (e) {
      setErr("No se pudo cargar docentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setEditing(null);
    setForm(empty);
    setMsg("");
    setErr("");
  };

  const startEdit = (t) => {
    setEditing(t);
    setForm({
      institution_id: t.institution_id ?? 1,
      name: t.name ?? "",
      email: t.email ?? "",
      password: "",
      teacher_code: t.teacher_code ?? "",
    });
    setMsg("");
    setErr("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      if (!editing) {
        // CREATE user + teacher
        const userRes = await http.post("/users", {
          institution_id: Number(form.institution_id),
          name: form.name,
          email: form.email,
          password: form.password,
          role: "teacher",
        });

        const userId = userRes.data?.id;
        if (!userId) return setErr("No se recibió user_id al crear usuario.");

        await http.post("/teachers", {
          user_id: userId,
          institution_id: Number(form.institution_id),
          teacher_code: form.teacher_code,
        });

        setMsg("Docente creado ✔");
      } else {
        // UPDATE user + teacher
        if (editing.user_id) {
          await http.put(`/users/${editing.user_id}`, {
            institution_id: Number(form.institution_id),
            name: form.name,
            email: form.email,
            password: form.password, // opcional
            role: "teacher",
          });
        }

        await http.put(`/teachers/${editing.id}`, {
          institution_id: Number(form.institution_id),
          teacher_code: form.teacher_code,
        });

        setMsg("Docente actualizado ✔");
      }

      reset();
      await load();
    } catch (e2) {
      setErr("Error guardando docente.");
    }
  };

  const remove = async (t) => {
    setMsg("");
    setErr("");
    const ok = window.confirm("¿Eliminar docente? (también eliminará su usuario si es posible)");
    if (!ok) return;

    try {
      await http.delete(`/teachers/${t.id}`);
      if (t.user_id) {
        try {
          await http.delete(`/users/${t.user_id}`);
        } catch {}
      }
      setMsg("Docente eliminado ✔");
      await load();
    } catch (e) {
      setErr("No se pudo eliminar docente.");
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
      <h1 className="page-title">Admin • Docentes</h1>

      {msg && <p className="msg-success">{msg}</p>}
      {err && <p className="msg-error">{err}</p>}

      <div className="form-container" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>{editing ? "Editar docente" : "Crear docente"}</h3>

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

          <label>Contraseña {editing ? "(opcional)" : ""}</label>
          <input name="password" type="password" value={form.password} onChange={onChange} />

          <label>Código docente</label>
          <input name="teacher_code" value={form.teacher_code} onChange={onChange} required />

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" type="submit">
              {editing ? "Guardar cambios" : "Crear"}
            </button>
            <button className="btn-secondary" type="button" onClick={reset}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Email</th>
            <th style={{ width: 220 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.teacher_code}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-primary" type="button" onClick={() => startEdit(t)}>
                    Editar
                  </button>
                  <button className="btn-danger" type="button" onClick={() => remove(t)}>
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

export default AdminTeachersPage;
