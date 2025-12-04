import { Request, Response } from "express";
import { TeacherService } from "../services/teachers.service";

export class TeacherController {

  static async getAll(req: Request, res: Response) {
    try {
      const data = await TeacherService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener docentes", error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const data = await TeacherService.getById(Number(req.params.id));
      if (!data)
        return res.status(404).json({ message: "Docente no encontrado" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener docente", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const created = await TeacherService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al crear docente", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await TeacherService.update(Number(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar docente", error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await TeacherService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar docente", error });
    }
  }
}
