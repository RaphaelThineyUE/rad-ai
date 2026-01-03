import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import reportRoutes from "./routes/reports.js";
import treatmentRoutes from "./routes/treatments.js";
import aiRoutes from "./routes/ai.js";
import { errorHandler } from "./middleware/error-handler.js";
import { ConsoleNinja } from "./lib/console-ninja.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  ConsoleNinja.info("GET /health check");
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      ConsoleNinja.info(`Server running on ${port}`);
    });
  })
  .catch((error) => {
    ConsoleNinja.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
