import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  listPatients,
  updatePatient
} from "../controllers/patients.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listPatients);
router.post("/", createPatient);
router.get("/:id", getPatient);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
