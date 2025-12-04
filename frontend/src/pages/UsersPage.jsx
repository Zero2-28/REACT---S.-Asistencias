import { useEffect, useState } from "react";
import http from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    http.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <PageContainer>
      <h2 className="page-title">Usuarios registrados</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Institución</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Creado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.institution_id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.name}</td>
              <td>{new Date(u.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default UsersPage;
