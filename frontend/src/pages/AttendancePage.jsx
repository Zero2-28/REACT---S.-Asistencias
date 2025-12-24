import React, { useEffect, useState } from "react";
import axios from "../api/http";
import PageContainer from "../components/PageContainer";
import "../styles/tables.css";
import "../styles/pages.css";

function AttendancePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [attendance, setAttendance] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener TODAS las asistencias
        const attendanceRes = await axios.get("/attendance");
        const allAttendance = attendanceRes.data;

        // Filtrar solo las asistencias del estudiante
        const studentAttendance = allAttendance.filter(
          (a) => a.student_id === user.student_id
        );

        setAttendance(studentAttendance);

        // Obtener lista de docentes para mostrar su nombre
        const teacherRes = await axios.get("/teachers");
        setTeachers(teacherRes.data);

      } catch (error) {
        console.error("Error obteniendo asistencias:", error);
      }
    };

    loadData();
  }, [user.student_id]);

  // Obtener nombre del docente por ID
  const getTeacherName = (teacher_id) => {
    const teacher = teachers.find((t) => t.id === teacher_id);
    return teacher ? teacher.name : "Docente";
  };

  return (
    <PageContainer>
      <h1 className="page-title">Mis Asistencias</h1>

      {attendance.length === 0 ? (
        <p>No tienes asistencias registradas aún.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Docente</th>
              <th>Notas</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.check_in_time || "-"}</td>
                <td>{a.check_out_time || "-"}</td>
                <td>{a.status}</td>
                <td>{getTeacherName(a.teacher_id)}</td>
                <td>{a.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageContainer>
  );
}

export default AttendancePage;
