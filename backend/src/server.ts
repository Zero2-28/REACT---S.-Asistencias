import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 🔥 Importar rutas
import institutionsRoutes from "./routes/institutions.routes";
import usersRoutes from "./routes/users.routes";
import studentsRoutes from "./routes/students.routes";
import teachersRoutes from "./routes/teachers.routes";
import attendanceRoutes from "./routes/attendance.routes";
import attendanceHistoryRoutes from "./routes/attendanceHistory.routes";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas montadas con prefijo API
app.use("/api/institutions", institutionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance-history", attendanceHistoryRoutes);

// Ruta inicial simple
app.get("/", (req, res) => {
  res.send("🔥 Backend Asistencia corriendo correctamente!");
});

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
