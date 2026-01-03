import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { analyzeReport, compareTreatments, consolidateReports, generateSummary } from "../lib/ai.js";
import { ConsoleNinja } from "../lib/console-ninja.js";

export const analyzeReportText = async (req: AuthRequest, res: Response) => {
  const { text } = req.body as { text: string };
  ConsoleNinja.info("AI analyze report text");
  const data = await analyzeReport(text);
  res.json({ data });
};

export const generatePatientSummary = async (req: AuthRequest, res: Response) => {
  const { extracted_data } = req.body;
  ConsoleNinja.info("AI generate summary");
  const summary = await generateSummary(extracted_data);
  res.json({ summary });
};

export const consolidateReportSet = async (req: AuthRequest, res: Response) => {
  const { reports } = req.body as { reports: unknown[] };
  ConsoleNinja.info("AI consolidate reports", { count: reports?.length });
  const summary = await consolidateReports(reports);
  res.json({ summary });
};

export const compareTreatmentOptions = async (req: AuthRequest, res: Response) => {
  const { patient, options } = req.body as { patient: unknown; options: string[] };
  ConsoleNinja.info("AI compare treatments", { optionCount: options?.length });
  const result = await compareTreatments(patient, options);
  res.json({ result });
};
