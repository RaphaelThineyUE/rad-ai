import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";
import { ConsoleNinja } from "../lib/console-ninja.js";

const signToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(user, process.env.JWT_SECRET || "radreport_secret", {
    expiresIn: "7d"
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body as {
    email: string;
    password: string;
    full_name?: string;
  };
  ConsoleNinja.info("Register attempt", { email });
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password_hash, full_name });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  ConsoleNinja.info("Login attempt", { email });
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.json({ token, user });
};

export const me = async (req: AuthRequest, res: Response) => {
  ConsoleNinja.info("Fetch current user", { userId: req.user?.id });
  const user = await User.findById(req.user?.id).select("-password_hash");
  return res.json({ user });
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  const updates = req.body as { full_name?: string; email?: string };
  ConsoleNinja.info("Update current user", { userId: req.user?.id });
  const user = await User.findByIdAndUpdate(req.user?.id, updates, {
    new: true
  }).select("-password_hash");
  return res.json({ user });
};
