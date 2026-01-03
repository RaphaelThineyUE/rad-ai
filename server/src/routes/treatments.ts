import { Router } from "express";
import {
  createTreatment,
  deleteTreatment,
  getTreatment,
  listTreatments,
  updateTreatment
} from "../controllers/treatments.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listTreatments);
router.post("/", createTreatment);
router.get("/:id", getTreatment);
router.patch("/:id", updateTreatment);
router.delete("/:id", deleteTreatment);

export default router;
