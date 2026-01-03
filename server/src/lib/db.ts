import mongoose from "mongoose";
import { ConsoleNinja } from "./console-ninja.js";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }
  ConsoleNinja.info("Connecting to MongoDB");
  await mongoose.connect(uri);
  ConsoleNinja.info("MongoDB connected");
};
