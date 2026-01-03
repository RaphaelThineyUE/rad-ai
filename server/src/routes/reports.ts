import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  createReport,
  deleteReport,
  getReport,
  listReports,
  processReport,
  updateReport,
  uploadReport
} from "../controllers/reports.js";
import { requireAuth } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

const router = Router();

router.use(requireAuth);
router.post("/upload", upload.single("file"), uploadReport);
router.post("/", createReport);
router.post("/process", processReport);
router.get("/", listReports);
router.get("/:id", getReport);
router.patch("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;
