export default function PrivateLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h3>Bienvenido, {user?.name}</h3>
      <hr />
      {children}
    </div>
  );
}
