import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";

export class AttendanceController {

  static async getAll(req: Request, res: Response) {
    try {
      const data = await AttendanceService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener asistencias", error });
    }
  }

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

  static async create(req: Request, res: Response) {
    try {
      const created = await AttendanceService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al registrar asistencia", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await AttendanceService.update(Number(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar asistencia", error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await AttendanceService.delete(Number(req.params.id));
      res.json({ deleted: success });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar asistencia", error });
    }
  }
}
