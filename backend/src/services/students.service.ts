import { db } from "../database/db";
import { Student } from "../models/student.model";

export class StudentService {

  // 🔹 Obtener todos los estudiantes con JOIN a users para traer el nombre
  static async getAll(): Promise<any[]> {
    return await db.query(`
      SELECT 
        s.id,
        s.student_code,
        s.grade,
        s.section,
        s.institution_id,
        u.name AS student_name,
        u.email,
        u.id AS user_id
      FROM students s
      JOIN users u ON u.id = s.user_id
      ORDER BY s.id
    `);
  }

  // 🔹 Obtener estudiante por ID (con JOIN)
  static async getById(id: number): Promise<any | null> {
    const rows = await db.query(`
      SELECT 
        s.id,
        s.student_code,
        s.grade,
        s.section,
        s.institution_id,
        u.name AS student_name,
        u.email,
        u.id AS user_id
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `, [id]);

    return rows.length > 0 ? rows[0] : null;
  }

  // 🔹 Crear estudiante
  static async create(data: Student): Promise<Student> {
    await db.query(
      `INSERT INTO students
      (user_id, institution_id, student_code, grade, section, phone, parent_contact, enrollment_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.institution_id,
        data.student_code,
        data.grade ?? null,
        data.section ?? null,
        data.phone ?? null,
        data.parent_contact ?? null,
        data.enrollment_date ?? new Date(),
        data.status ?? "active"
      ]
    );

    const created = await db.query(`
      SELECT TOP 1 
        s.id,
        s.student_code,
        s.grade,
        s.section,
        s.institution_id,
        u.name AS student_name,
        u.email,
        u.id AS user_id
      FROM students s
      JOIN users u ON u.id = s.user_id
      ORDER BY s.id DESC
    `);

    return created[0];
  }

  // 🔹 Actualizar estudiante
  static async update(id: number, data: Partial<Student>): Promise<Student | null> {
    await db.query(
      `UPDATE students SET
        user_id = ?, institution_id = ?, student_code = ?, grade = ?, 
        section = ?, phone = ?, parent_contact = ?, enrollment_date = ?, status = ?
       WHERE id = ?`,
      [
        data.user_id,
        data.institution_id,
        data.student_code,
        data.grade ?? null,
        data.section ?? null,
        data.phone ?? null,
        data.parent_contact ?? null,
        data.enrollment_date ?? new Date(),
        data.status ?? "active",
        id
      ]
    );

    const updated = await db.query(`
      SELECT 
        s.id,
        s.student_code,
        s.grade,
        s.section,
        s.institution_id,
        u.name AS student_name,
        u.email,
        u.id AS user_id
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `, [id]);

    return updated.length > 0 ? updated[0] : null;
  }

  // 🔹 Eliminar estudiante
  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM students OUTPUT DELETED.id WHERE id = ?",
      [id]
    );
    return deleted.length > 0;
  }

  // ⭐ NUEVO: Obtener estudiantes + estado de asistencia de HOY para un docente
  static async getStudentsWithTodayAttendance(teacher_id: number) {
    const today = new Date().toISOString().split("T")[0];

    const query = `
      SELECT 
        s.id,
        s.student_code,
        u.name AS student_name,
        s.grade,
        s.section,
        a.status AS today_status
      FROM students s
      INNER JOIN users u ON s.user_id = u.id
      LEFT JOIN attendance a 
        ON a.student_id = s.id 
        AND a.date = @p0 
        AND a.teacher_id = @p1
      WHERE s.institution_id = (
        SELECT institution_id FROM teachers WHERE id = @p1
      )
      ORDER BY s.grade, s.section, s.student_code;
    `;

    return await db.query(query, [today, teacher_id]);
  }
}
