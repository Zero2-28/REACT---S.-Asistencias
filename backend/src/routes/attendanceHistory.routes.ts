import { Router } from "express";
import { AttendanceHistoryController } from "../controllers/attendanceHistory.controller";

const router = Router();

router.get("/", AttendanceHistoryController.getAll);
router.get("/attendance/:attendance_id", AttendanceHistoryController.getByAttendance);
router.post("/", AttendanceHistoryController.create);

export default router;
