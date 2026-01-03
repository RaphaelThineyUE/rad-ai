import { Request, Response, NextFunction } from "express";
import { ConsoleNinja } from "../lib/console-ninja.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  ConsoleNinja.error("Unhandled error", err.message);
  res.status(500).json({ message: "Something went wrong" });
};
