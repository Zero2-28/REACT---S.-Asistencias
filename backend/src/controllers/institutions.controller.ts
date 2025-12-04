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
      if (!data) 
        return res.status(404).json({ message: "Institución no encontrada" });

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
}
