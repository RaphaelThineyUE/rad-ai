import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    full_name: { type: String },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: "created_date", updatedAt: "updated_date" } }
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);
