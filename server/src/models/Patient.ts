import mongoose, { Schema, InferSchemaType } from "mongoose";

const patientSchema = new Schema(
  {
    created_by: { type: String },
    full_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    ethnicity: { type: String },
    diagnosis_date: { type: Date, required: true },
    cancer_type: { type: String, required: true },
    cancer_stage: {
      type: String,
      enum: ["Stage 0", "Stage I", "Stage II", "Stage III", "Stage IV", "Unknown"],
      default: "Unknown"
    },
    tumor_size_cm: { type: Number },
    lymph_node_positive: { type: Boolean },
    er_status: { type: String, enum: ["Positive", "Negative", "Unknown"], default: "Unknown" },
    pr_status: { type: String, enum: ["Positive", "Negative", "Unknown"], default: "Unknown" },
    her2_status: { type: String, enum: ["Positive", "Negative", "Unknown"], default: "Unknown" },
    menopausal_status: { type: String },
    initial_treatment_plan: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: "created_date", updatedAt: "updated_date" } }
);

export type PatientDocument = InferSchemaType<typeof patientSchema>;
export const Patient = mongoose.model("Patient", patientSchema);
