import { Request, Response } from "express";
import { StudentService } from "../services/students.service";

export class StudentController {

  static async getAll(req: Request, res: Response) {
    try {
      const data = await StudentService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estudiantes", error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const data = await StudentService.getById(Number(req.params.id));
      if (!data)
        return res.status(404).json({ message: "Estudiante no encontrado" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estudiante", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const created = await StudentService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al crear estudiante", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await StudentService.update(Number(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estudiante", error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await StudentService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar estudiante", error });
    }
  }
}
