import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";

const router = Router();

router.get("/", AttendanceController.getAll);
router.get("/:id", AttendanceController.getById);
router.post("/", AttendanceController.create);
router.put("/:id", AttendanceController.update);
router.delete("/:id", AttendanceController.delete);

export default router;
