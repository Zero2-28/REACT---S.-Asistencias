import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";

export class AttendanceController {

  // Obtener todas las asistencias
  static async getAll(req: Request, res: Response) {
    try {
      const data = await AttendanceService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener asistencias", error });
    }
  }

  // Obtener asistencia por ID
  static async getById(req: Request, res: Response) {
    try {
      const data = await AttendanceService.getById(Number(req.params.id));

      if (!data)
        return res.status(404).json({ message: "Registro no encontrado" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener registro", error });
    }
  }

  // Crear nueva asistencia
  static async create(req: Request, res: Response) {
    try {
      const created = await AttendanceService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al registrar asistencia", error });
    }
  }

  // Actualizar asistencia
  static async update(req: Request, res: Response) {
    try {
      const updated = await AttendanceService.update(
        Number(req.params.id),
        req.body
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar asistencia", error });
    }
  }

  // Eliminar asistencia
  static async delete(req: Request, res: Response) {
    try {
      const success = await AttendanceService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar asistencia", error });
    }
  }

  // ⭐ NUEVO: Obtener asistencias de un estudiante, incluyendo el docente
  static async getByStudent(req: Request, res: Response) {
    try {
      const student_id = Number(req.params.student_id);

      const data = await AttendanceService.getByStudent(student_id);

      return res.json(data);

    } catch (error) {
      console.error("❌ Error obteniendo asistencias del estudiante:", error);
      res.status(500).json({
        message: "Error obteniendo asistencias del estudiante",
        error,
      });
    }
  }
}
