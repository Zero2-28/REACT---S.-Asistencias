import { Request, Response } from "express";
import { StudentService } from "../services/students.service";

export class StudentController {

  // Obtener todos los estudiantes
  static async getAll(req: Request, res: Response) {
    try {
      const data = await StudentService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estudiantes", error });
    }
  }

  // Obtener estudiante por ID
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

  // Crear estudiante
  static async create(req: Request, res: Response) {
    try {
      const created = await StudentService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al crear estudiante", error });
    }
  }

  // Actualizar estudiante
  static async update(req: Request, res: Response) {
    try {
      const updated = await StudentService.update(
        Number(req.params.id),
        req.body
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estudiante", error });
    }
  }

  // Eliminar estudiante
  static async delete(req: Request, res: Response) {
    try {
      const success = await StudentService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar estudiante", error });
    }
  }

  // ⭐ NUEVO: Obtener estado de asistencia del día por docente
  static async getTodayAttendance(req: Request, res: Response) {
    try {
      const teacher_id = Number(req.params.teacher_id);

      const data = await StudentService.getStudentsWithTodayAttendance(
        teacher_id
      );

      return res.json(data);

    } catch (error) {
      console.error("Error obteniendo asistencia del día:", error);
      return res.status(500).json({
        message: "Error al obtener asistencia del día",
        error
      });
    }
  }
}
