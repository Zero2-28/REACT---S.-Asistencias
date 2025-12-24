import { Request, Response, NextFunction } from "express";
import { db } from "../database/db";

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userIdHeader = req.header("x-user-id");

    if (!userIdHeader) {
      return res.status(401).json({ message: "No autenticado (falta x-user-id)" });
    }

    const userId = Number(userIdHeader);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "x-user-id inválido" });
    }

    try {
      const rows = await db.query(
        "SELECT id, role, institution_id, name, email FROM users WHERE id = ?",
        [userId]
      );

      if (!rows[0]) {
        return res.status(401).json({ message: "Usuario no existe" });
      }

      // ✅ inyectamos el user para que el resto lo use si quiere
      (req as any).user = rows[0];

      if (!roles.includes(rows[0].role)) {
        return res.status(403).json({ message: "No autorizado" });
      }

      next();
    } catch (err) {
      console.error("requireRole error:", err);
      return res.status(500).json({ message: "Error interno en requireRole" });
    }
  };
};
