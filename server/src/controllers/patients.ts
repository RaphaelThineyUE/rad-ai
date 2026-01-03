import { Response } from "express";
import { Patient } from "../models/Patient.js";
import { AuthRequest } from "../middleware/auth.js";
import { ConsoleNinja } from "../lib/console-ninja.js";

export const listPatients = async (req: AuthRequest, res: Response) => {
  const { stage, cancer_type, sort } = req.query as {
    stage?: string;
    cancer_type?: string;
    sort?: string;
  };
  const query: Record<string, unknown> = {};
  if (stage) query.cancer_stage = stage;
  if (cancer_type) query.cancer_type = cancer_type;
  ConsoleNinja.info("List patients", query);
  const patients = await Patient.find(query).sort(sort || "-created_date");
  res.json({ patients });
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Create patient", { createdBy: req.user?.id });
  const patient = await Patient.create({ ...req.body, created_by: req.user?.id });
  res.status(201).json({ patient });
};

export const getPatient = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Get patient", { id: req.params.id });
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.json({ patient });
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Update patient", { id: req.params.id });
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.json({ patient });
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Delete patient", { id: req.params.id });
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.json({ message: "Patient deleted" });
};
