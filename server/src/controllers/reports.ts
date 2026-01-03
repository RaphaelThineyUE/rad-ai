import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { RadiologyReport } from "../models/RadiologyReport.js";
import { ConsoleNinja } from "../lib/console-ninja.js";
import pdfParse from "pdf-parse";
import fs from "fs/promises";
import { analyzeReport, generateSummary } from "../lib/ai.js";

export const uploadReport = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Missing PDF file" });
  }
  ConsoleNinja.info("PDF uploaded", { filename: req.file.originalname });
  res.json({
    filename: req.file.originalname,
    file_url: `/uploads/${req.file.filename}`,
    file_size: req.file.size
  });
};

export const createReport = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Create report record", { patientId: req.body.patient_id });
  const report = await RadiologyReport.create({
    ...req.body,
    created_by: req.user?.id,
    status: "processing"
  });
  res.status(201).json({ report });
};

export const processReport = async (req: AuthRequest, res: Response) => {
  const { report_id, file_url } = req.body as {
    report_id: string;
    file_url: string;
  };
  ConsoleNinja.info("Process report", { report_id });
  const report = await RadiologyReport.findById(report_id);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  const start = Date.now();
  const localPath = file_url.startsWith("/uploads") ? `${process.cwd()}${file_url}` : file_url;
  const buffer = await fs.readFile(localPath);
  const pdfData = await pdfParse(buffer);
  const extracted = await analyzeReport(pdfData.text);
  const summary = await generateSummary(extracted);
  report.status = "completed";
  report.raw_text = pdfData.text;
  report.processing_time_ms = Date.now() - start;
  report.summary = summary;
  report.birads = extracted.birads;
  report.breast_density = extracted.breast_density;
  report.exam = extracted.exam;
  report.findings = extracted.findings || [];
  report.recommendations = extracted.recommendations || [];
  report.red_flags = extracted.red_flags || [];
  await report.save();
  res.json({ report });
};

export const listReports = async (req: AuthRequest, res: Response) => {
  const { patient_id, status } = req.query as { patient_id?: string; status?: string };
  const query: Record<string, unknown> = {};
  if (patient_id) query.patient_id = patient_id;
  if (status) query.status = status;
  ConsoleNinja.info("List reports", query);
  const reports = await RadiologyReport.find(query).sort("-created_date");
  res.json({ reports });
};

export const getReport = async (req: AuthRequest, res: Response) => {
  const report = await RadiologyReport.findById(req.params.id);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  res.json({ report });
};

export const updateReport = async (req: AuthRequest, res: Response) => {
  const report = await RadiologyReport.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  res.json({ report });
};

export const deleteReport = async (req: AuthRequest, res: Response) => {
  const report = await RadiologyReport.findByIdAndDelete(req.params.id);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  res.json({ message: "Report deleted" });
};
