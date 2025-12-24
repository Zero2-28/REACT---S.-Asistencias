import { Request, Response } from "express";
import { InstitutionService } from "../services/institutions.service";

export class InstitutionController {

  static async getAll(req: Request, res: Response) {
    try {
      const data = await InstitutionService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener instituciones", error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const data = await InstitutionService.getById(Number(req.params.id));
      if (!data) return res.status(404).json({ message: "Institución no encontrada" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener institución", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const newItem = await InstitutionService.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: "Error al crear institución", error });
    }
  }

  // ✅ UPDATE
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await InstitutionService.update(id, req.body);

      if (!updated) return res.status(404).json({ message: "Institución no encontrada" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar institución", error });
    }
  }

  // ✅ DELETE
  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await InstitutionService.delete(id);

      if (!success) return res.status(404).json({ message: "Institución no encontrada" });

      res.json({ deleted: true });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar institución", error });
    }
  }
}
