import { Router } from "express";
import { StudentController } from "../controllers/students.controller";
import { devAuth } from "../middleware/devAuth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/", StudentController.getAll);
router.get("/:id", StudentController.getById);

// Rutas protegidas con middleware de rol Admin
router.post("/", requireRole(["admin"]), StudentController.create);
router.put("/:id", requireRole(["admin"]), StudentController.update);
router.delete("/:id", requireRole(["admin"]), StudentController.delete);

// ⭐ NUEVA RUTA
router.get("/with-attendance/today/:teacher_id", StudentController.getTodayAttendance);

export default router;
