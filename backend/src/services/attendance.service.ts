import { db } from "../database/db";
import { Attendance } from "../models/attendance.model";

export class AttendanceService {

  static async getAll(): Promise<Attendance[]> {
    return await db.query("SELECT * FROM attendance");
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
}
