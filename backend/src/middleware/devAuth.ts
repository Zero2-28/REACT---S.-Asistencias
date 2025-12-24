import { Request, Response, NextFunction } from "express";
import { db } from "../database/db";

// Agrega: req.user = { id, role, institution_id } (si existe x-user-id)
export const devAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const raw = req.header("x-user-id");
    if (!raw) {
      (req as any).user = null;
      return next();
    }

    const userId = Number(raw);
    if (!userId) {
      (req as any).user = null;
      return next();
    }

    const rows = await db.query(
      "SELECT id, role, institution_id, name, email FROM users WHERE id = ?",
      [userId]
    );

    (req as any).user = rows?.[0] ?? null;
    return next();
  } catch (e) {
    (req as any).user = null;
    return next();
  }
};
