import { Router } from "express";
import { TeacherController } from "../controllers/teachers.controller";

const router = Router();

router.get("/", TeacherController.getAll);
router.get("/:id", TeacherController.getById);
router.post("/", TeacherController.create);
router.put("/:id", TeacherController.update);
router.delete("/:id", TeacherController.delete);

export default router;
