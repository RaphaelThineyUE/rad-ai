import { Router } from "express";
import {
  analyzeReportText,
  compareTreatmentOptions,
  consolidateReportSet,
  generatePatientSummary
} from "../controllers/ai.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.post("/analyze-report", analyzeReportText);
router.post("/generate-summary", generatePatientSummary);
router.post("/consolidate-reports", consolidateReportSet);
router.post("/compare-treatments", compareTreatmentOptions);

export default router;
