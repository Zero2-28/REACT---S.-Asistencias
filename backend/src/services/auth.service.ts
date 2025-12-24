import { db } from "../database/db";

export class AuthService {
  // LOGIN GENERAL (student o teacher)
  static async login(email: string, password: string) {
    const rows = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (!rows[0]) return null;

    const user = rows[0]; // user encontrado

    // Obtener student_id si es student
    let student_id = null;
    if (user.role === "student") {
      const std = await db.query(
        "SELECT id FROM students WHERE user_id = ?",
        [user.id]
      );

      if (std[0]) student_id = std[0].id;
    }

    // Obtener teacher_id si es teacher
    let teacher_id = null;
    if (user.role === "teacher") {
      const teacher = await db.query(
        "SELECT id FROM teachers WHERE user_id = ?",
        [user.id]
      );

      if (teacher[0]) teacher_id = teacher[0].id;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institution_id: user.institution_id,
      student_id,
      teacher_id,
    };
  }
}
