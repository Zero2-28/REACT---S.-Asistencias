import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios", error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(Number(req.params.id));
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const created = await UserService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await UserService.update(Number(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario", error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await UserService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario", error });
    }
  }
}
