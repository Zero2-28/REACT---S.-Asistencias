import { Router } from "express";
import { TeacherController } from "../controllers/teachers.controller";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/", TeacherController.getAll);
router.get("/:id", TeacherController.getById);

// Rutas protegidas con middleware de rol Admin
router.post("/", requireRole(["admin"]), TeacherController.create);
router.put("/:id", requireRole(["admin"]), TeacherController.update);
router.delete("/:id", requireRole(["admin"]), TeacherController.delete);

export default router;
