import { db } from "../database/db";
import { AttendanceHistory } from "../models/attendanceHistory.model";

export class AttendanceHistoryService {

  static async getAll(): Promise<AttendanceHistory[]> {
    return await db.query("SELECT * FROM attendance_history");
  }

  static async getById(id: number): Promise<AttendanceHistory | null> {
    const rows = await db.query("SELECT * FROM attendance_history WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getByAttendance(attendance_id: number): Promise<AttendanceHistory[]> {
    return await db.query(
      "SELECT * FROM attendance_history WHERE attendance_id = ?",
      [attendance_id]
    );
  }

  static async create(data: AttendanceHistory): Promise<AttendanceHistory> {
    await db.query(
      `INSERT INTO attendance_history
      (attendance_id, modified_by, previous_status, new_status,
       previous_check_in, new_check_in, previous_check_out, new_check_out,
       change_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.attendance_id,
        data.modified_by,
        data.previous_status ?? null,
        data.new_status ?? null,
        data.previous_check_in ?? null,
        data.new_check_in ?? null,
        data.previous_check_out ?? null,
        data.new_check_out ?? null,
        data.change_reason ?? null
      ]
    );

    const created = await db.query("SELECT TOP 1 * FROM attendance_history ORDER BY id DESC");
    return created[0];
  }

  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM attendance_history OUTPUT DELETED.id WHERE id = ?",
      [id]
    );
    return deleted.length > 0;
  }
}
