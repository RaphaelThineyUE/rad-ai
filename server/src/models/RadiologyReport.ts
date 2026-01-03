import mongoose, { Schema, InferSchemaType } from "mongoose";

const reportSchema = new Schema(
  {
    created_by: { type: String },
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    filename: { type: String, required: true },
    file_url: { type: String },
    file_size: { type: Number },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    summary: { type: String },
    birads: {
      value: { type: Number },
      confidence: { type: String, enum: ["low", "medium", "high"] },
      evidence: [{ type: String }]
    },
    breast_density: {
      value: { type: String },
      evidence: [{ type: String }]
    },
    exam: {
      type: { type: String },
      laterality: { type: String },
      evidence: [{ type: String }]
    },
    comparison: {
      prior_exam_date: { type: String },
      evidence: [{ type: String }]
    },
    findings: [
      {
        laterality: { type: String },
        location: { type: String },
        description: { type: String },
        assessment: { type: String },
        evidence: [{ type: String }]
      }
    ],
    recommendations: [
      {
        action: { type: String },
        timeframe: { type: String },
        evidence: [{ type: String }]
      }
    ],
    red_flags: [{ type: String }],
    processing_time_ms: { type: Number },
    raw_text: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: "created_date", updatedAt: "updated_date" } }
);

reportSchema.index({ patient_id: 1, filename: 1 }, { unique: true });

export type RadiologyReportDocument = InferSchemaType<typeof reportSchema>;
export const RadiologyReport = mongoose.model("RadiologyReport", reportSchema);
