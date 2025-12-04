import { db } from "../database/db";
import { User } from "../models/user.model";

export class UserService {

  // ✔ Obtener todos
  static async getAll(): Promise<User[]> {
    return await db.query("SELECT * FROM users");
  }

  // ✔ Obtener por ID
  static async getById(id: number): Promise<User | null> {
    const rows = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // ✔ Crear usuario
  static async create(data: User): Promise<User> {
    await db.query(
      `INSERT INTO users (institution_id, email, password, role, name)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.institution_id,
        data.email,
        data.password,
        data.role,
        data.name
      ]
    );

    const created = await db.query("SELECT TOP 1 * FROM users ORDER BY id DESC");
    return created[0];
  }

  // ✔ Actualizar usuario
  static async update(id: number, data: Partial<User>): Promise<User | null> {
    await db.query(
      `UPDATE users SET 
        institution_id = ?, 
        email = ?, 
        password = ?, 
        role = ?, 
        name = ?
       WHERE id = ?`,
      [
        data.institution_id,
        data.email,
        data.password,
        data.role,
        data.name,
        id
      ]
    );

    const updated = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return updated.length > 0 ? updated[0] : null;
  }

  // ✔ Eliminar usuario
  static async delete(id: number): Promise<boolean> {
    const deleted = await db.query(
      "DELETE FROM users OUTPUT DELETED.id WHERE id = ?",
      [id]
    );

    return deleted.length > 0;
  }
}
