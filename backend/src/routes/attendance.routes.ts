import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/", AttendanceController.getAll);

// primero rutas “especiales”
router.get("/student/:student_id", AttendanceController.getByStudent);

// luego la genérica
router.get("/:id", AttendanceController.getById);

// registrar/editar: teacher o admin
router.post("/", requireRole(["teacher", "admin"]), AttendanceController.create);
router.put("/:id", requireRole(["teacher", "admin"]), AttendanceController.update);

// eliminar: solo admin
router.delete("/:id", requireRole(["teacher", "admin"]), AttendanceController.delete);

export default router;
