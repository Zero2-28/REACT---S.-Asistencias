import { db } from "../database/db";
import { Student } from "../models/student.model";

export class StudentService {

  static async getAll(): Promise<Student[]> {
    return await db.query("SELECT * FROM students");
  }

  static async getById(id: number): Promise<Student | null> {
    const rows = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

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

    const created = await db.query("SELECT TOP 1 * FROM students ORDER BY id DESC");
    return created[0];
  }

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

    const updated = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    return updated.length > 0 ? updated[0] : null;
  }

  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM students OUTPUT DELETED.id WHERE id = ?",
      [id]
    );
    return deleted.length > 0;
  }
}
