import { Router } from "express";
import { StudentController } from "../controllers/students.controller";

const router = Router();

router.get("/", StudentController.getAll);
router.get("/:id", StudentController.getById);
router.post("/", StudentController.create);
router.put("/:id", StudentController.update);
router.delete("/:id", StudentController.delete);

export default router;
