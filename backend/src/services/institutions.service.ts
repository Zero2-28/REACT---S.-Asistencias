import { db } from "../database/db";
import { Institution } from "../models/institution.model";

export class InstitutionService {

  static async getAll(): Promise<Institution[]> {
    return await db.query("SELECT * FROM institutions");
  }

  static async getById(id: number): Promise<Institution | null> {
    const rows = await db.query("SELECT * FROM institutions WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data: Institution): Promise<Institution> {
    await db.query(
      `INSERT INTO institutions (name, code, address, phone, email, logo_url, subscription_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.code,
        data.address ?? null,
        data.phone ?? null,
        data.email ?? null,
        data.logo_url ?? null,
        data.subscription_status ?? "active"
      ]
    );

    const created = await db.query("SELECT TOP 1 * FROM institutions ORDER BY id DESC");
    return created[0];
  }
}
