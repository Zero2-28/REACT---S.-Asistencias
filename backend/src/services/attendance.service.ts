import { db } from "../database/db";
import { Attendance } from "../models/attendance.model";

export class AttendanceService {

  // ⭐ Obtener TODAS las asistencias con nombres de estudiante y docente
  static async getAll() {
    return await db.query(`
      SELECT 
        a.id,
        a.student_id,
        a.teacher_id,
        a.institution_id,
        a.date,
        a.check_in_time,
        a.check_out_time,
        a.status,
        a.notes,

        -- Estudiante
        us.name AS student_name,
        s.student_code,

        -- Docente
        ut.name AS teacher_name,
        t.teacher_code

      FROM attendance a
      LEFT JOIN students s ON s.id = a.student_id
      LEFT JOIN users us ON us.id = s.user_id
      LEFT JOIN teachers t ON t.id = a.teacher_id
      LEFT JOIN users ut ON ut.id = t.user_id

      ORDER BY a.date DESC;
    `);
  }

  static async getById(id: number): Promise<Attendance | null> {
    const rows = await db.query("SELECT * FROM attendance WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data: Attendance): Promise<Attendance> {
    await db.query(
      `INSERT INTO attendance
       (student_id, teacher_id, institution_id, date, check_in_time, check_out_time, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.student_id,
        data.teacher_id,
        data.institution_id,
        data.date,
        data.check_in_time ?? null,
        data.check_out_time ?? null,
        data.status,
        data.notes ?? null
      ]
    );

    const created = await db.query("SELECT TOP 1 * FROM attendance ORDER BY id DESC");
    return created[0];
  }

  static async update(id: number, data: Partial<Attendance>): Promise<Attendance | null> {
    await db.query(
      `UPDATE attendance SET
        student_id = ?, teacher_id = ?, institution_id = ?, 
        date = ?, check_in_time = ?, check_out_time = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        data.student_id,
        data.teacher_id,
        data.institution_id,
        data.date,
        data.check_in_time ?? null,
        data.check_out_time ?? null,
        data.status,
        data.notes ?? null,
        id
      ]
    );

    const updated = await db.query("SELECT * FROM attendance WHERE id = ?", [id]);
    return updated.length > 0 ? updated[0] : null;
  }

  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM attendance OUTPUT DELETED.id WHERE id = ?",
      [id]
    );
    return deleted.length > 0;
  }

  // ⭐ Obtener asistencias de un estudiante con nombre del docente
  static async getByStudent(student_id: number) {
    return await db.query(`
      SELECT 
        a.id,
        a.date,
        a.check_in_time,
        a.check_out_time,
        a.status,
        a.notes,

        -- Docente
        t.teacher_code,
        u.name AS teacher_name

      FROM attendance a
      LEFT JOIN teachers t ON t.id = a.teacher_id
      LEFT JOIN users u ON u.id = t.user_id
      WHERE a.student_id = ?
      ORDER BY a.date DESC
    `, [student_id]);
  }
}
