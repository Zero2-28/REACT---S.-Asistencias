import { Router } from "express";
import { InstitutionController } from "../controllers/institutions.controller";
import { requireRole } from "../middleware/requireRole"; 


const router = Router();

// Rutas protegidas con middleware de rol Admin
//router.get("/", InstitutionController.getAll); PARA VISUALIZAR LOS GETS LIBRES
router.get("/", requireRole(["admin"]), InstitutionController.getAll);
router.get("/:id", requireRole(["admin"]), InstitutionController.getById);

router.post("/", requireRole(["admin"]), InstitutionController.create);
router.put("/:id", requireRole(["admin"]), InstitutionController.update);
router.delete("/:id", requireRole(["admin"]), InstitutionController.delete); 


export default router;
