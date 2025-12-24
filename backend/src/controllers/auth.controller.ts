import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email y password requeridos" });
      }

      const user = await AuthService.login(email, password);

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error interno", error });
    }
  }
}
