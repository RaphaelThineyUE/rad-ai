import mongoose, { Schema, InferSchemaType } from "mongoose";

const treatmentSchema = new Schema(
  {
    created_by: { type: String },
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient" },
    treatment_type: {
      type: String,
      enum: [
        "Surgery",
        "Chemotherapy",
        "Radiation",
        "Hormone Therapy",
        "Targeted Therapy",
        "Immunotherapy",
        "Other"
      ]
    },
    treatment_start_date: { type: Date, required: true },
    treatment_end_date: { type: Date },
    medication_details: { type: String },
    treatment_outcome: {
      type: String,
      enum: [
        "Complete Response",
        "Partial Response",
        "Stable Disease",
        "Progressive Disease",
        "Recurrence",
        "Remission",
        "Other"
      ]
    },
    side_effects: { type: String },
    follow_up_date: { type: Date },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: "created_date", updatedAt: "updated_date" } }
);

export type TreatmentRecordDocument = InferSchemaType<typeof treatmentSchema>;
export const TreatmentRecord = mongoose.model("TreatmentRecord", treatmentSchema);
