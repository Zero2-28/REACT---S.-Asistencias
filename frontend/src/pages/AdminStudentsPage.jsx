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
  student_code: "",
  grade: "",
  section: "",
};

function AdminStudentsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null); // guarda el student completo
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await http.get("/students");
      setItems(res.data);
    } catch (e) {
      setErr("No se pudo cargar estudiantes.");
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

  const startEdit = (s) => {
    setEditing(s);
    setForm({
      institution_id: s.institution_id ?? 1,
      name: s.name ?? "",
      email: s.email ?? "",
      password: "",
      student_code: s.student_code ?? "",
      grade: s.grade ?? "",
      section: s.section ?? "",
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
        // CREATE: 1) crear user (role student)  2) crear student con user_id
        const userRes = await http.post("/users", {
          institution_id: Number(form.institution_id),
          name: form.name,
          email: form.email,
          password: form.password,
          role: "student",
        });

        const userId = userRes.data?.id;
        if (!userId) return setErr("No se recibió user_id al crear usuario.");

        await http.post("/students", {
          user_id: userId,
          institution_id: Number(form.institution_id),
          student_code: form.student_code,
          grade: form.grade,
          section: form.section,
        });

        setMsg("Estudiante creado ✔");
      } else {
        // UPDATE: update user + update student
        if (editing.user_id) {
          await http.put(`/users/${editing.user_id}`, {
            institution_id: Number(form.institution_id),
            name: form.name,
            email: form.email,
            password: form.password, // opcional
            role: "student",
          });
        }

        await http.put(`/students/${editing.id}`, {
          institution_id: Number(form.institution_id),
          student_code: form.student_code,
          grade: form.grade,
          section: form.section,
        });

        setMsg("Estudiante actualizado ✔");
      }

      reset();
      await load();
    } catch (e2) {
      setErr("Error guardando estudiante.");
    }
  };

  const remove = async (s) => {
    setMsg("");
    setErr("");
    const ok = window.confirm("¿Eliminar estudiante? (también eliminará su usuario si es posible)");
    if (!ok) return;

    try {
      await http.delete(`/students/${s.id}`);
      // si tienes endpoint users delete y no hay FK bloqueando:
      if (s.user_id) {
        try {
          await http.delete(`/users/${s.user_id}`);
        } catch {}
      }
      setMsg("Estudiante eliminado ✔");
      await load();
    } catch (e) {
      setErr("No se pudo eliminar estudiante.");
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
      <h1 className="page-title">Admin • Estudiantes</h1>

      {msg && <p className="msg-success">{msg}</p>}
      {err && <p className="msg-error">{err}</p>}

      <div className="form-container" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>{editing ? "Editar estudiante" : "Crear estudiante"}</h3>

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

          <label>Código</label>
          <input name="student_code" value={form.student_code} onChange={onChange} required />

          <label>Grado</label>
          <input name="grade" value={form.grade} onChange={onChange} required />

          <label>Sección</label>
          <input name="section" value={form.section} onChange={onChange} required />

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
            <th>Grado</th>
            <th>Sección</th>
            <th>Email</th>
            <th style={{ width: 220 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.student_code}</td>
              <td>{s.name}</td>
              <td>{s.grade}</td>
              <td>{s.section}</td>
              <td>{s.email}</td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-primary" type="button" onClick={() => startEdit(s)}>
                    Editar
                  </button>
                  <button className="btn-danger" type="button" onClick={() => remove(s)}>
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

export default AdminStudentsPage;
