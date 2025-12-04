import { Request, Response } from "express";
import { AttendanceHistoryService } from "../services/attendanceHistory.service";

export class AttendanceHistoryController {

  static async getAll(req: Request, res: Response) {
    try {
      const data = await AttendanceHistoryService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial", error });
    }
  }

  static async getByAttendance(req: Request, res: Response) {
    try {
      const id = Number(req.params.attendance_id);
      const data = await AttendanceHistoryService.getByAttendance(id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const created = await AttendanceHistoryService.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ message: "Error al registrar historial", error });
    }
  }
}
