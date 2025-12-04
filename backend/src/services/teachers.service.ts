import { db } from "../database/db";
import { Teacher } from "../models/teacher.model";

export class TeacherService {

  static async getAll(): Promise<Teacher[]> {
    return await db.query("SELECT * FROM teachers");
  }

  static async getById(id: number): Promise<Teacher | null> {
    const rows = await db.query("SELECT * FROM teachers WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data: Teacher): Promise<Teacher> {
    await db.query(
      `INSERT INTO teachers
      (user_id, institution_id, teacher_code, phone, hire_date)
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.institution_id,
        data.teacher_code,
        data.phone ?? null,
        data.hire_date ?? new Date()
      ]
    );

    const created = await db.query("SELECT TOP 1 * FROM teachers ORDER BY id DESC");
    return created[0];
  }

  static async update(id: number, data: Partial<Teacher>): Promise<Teacher | null> {
    await db.query(
      `UPDATE teachers SET 
        user_id = ?, institution_id = ?, teacher_code = ?, phone = ?, hire_date = ?
       WHERE id = ?`,
      [
        data.user_id,
        data.institution_id,
        data.teacher_code,
        data.phone ?? null,
        data.hire_date ?? new Date(),
        id
      ]
    );

    const updated = await db.query("SELECT * FROM teachers WHERE id = ?", [id]);
    return updated.length > 0 ? updated[0] : null;
  }

  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM teachers OUTPUT DELETED.id WHERE id = ?",
      [id]
    );
    return deleted.length > 0;
  }
}
