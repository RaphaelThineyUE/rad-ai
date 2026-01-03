import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { TreatmentRecord } from "../models/TreatmentRecord.js";
import { ConsoleNinja } from "../lib/console-ninja.js";

export const listTreatments = async (req: AuthRequest, res: Response) => {
  const { patient_id } = req.query as { patient_id?: string };
  const query: Record<string, unknown> = {};
  if (patient_id) query.patient_id = patient_id;
  ConsoleNinja.info("List treatments", query);
  const treatments = await TreatmentRecord.find(query).sort("-treatment_start_date");
  res.json({ treatments });
};

export const createTreatment = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Create treatment", { patientId: req.body.patient_id });
  const treatment = await TreatmentRecord.create({
    ...req.body,
    created_by: req.user?.id
  });
  res.status(201).json({ treatment });
};

export const getTreatment = async (req: AuthRequest, res: Response) => {
  const treatment = await TreatmentRecord.findById(req.params.id);
  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json({ treatment });
};

export const updateTreatment = async (req: AuthRequest, res: Response) => {
  const treatment = await TreatmentRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json({ treatment });
};

export const deleteTreatment = async (req: AuthRequest, res: Response) => {
  const treatment = await TreatmentRecord.findByIdAndDelete(req.params.id);
  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json({ message: "Treatment deleted" });
};
