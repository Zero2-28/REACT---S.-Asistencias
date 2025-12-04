import { Router } from "express";
import { InstitutionController } from "../controllers/institutions.controller";

const router = Router();

router.get("/", InstitutionController.getAll);
router.get("/:id", InstitutionController.getById);
router.post("/", InstitutionController.create);

export default router;
