export interface User {
  _id: string;
  email: string;
  full_name?: string;
  role: "admin" | "user";
}

export interface Patient {
  _id: string;
  full_name: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  ethnicity?: string;
  diagnosis_date: string;
  cancer_type: string;
  cancer_stage: string;
  tumor_size_cm?: number;
  lymph_node_positive?: boolean;
  er_status?: string;
  pr_status?: string;
  her2_status?: string;
  menopausal_status?: string;
  initial_treatment_plan?: string;
}

export interface RadiologyReport {
  _id: string;
  patient_id: string;
  filename: string;
  file_url?: string;
  file_size?: number;
  status: "pending" | "processing" | "completed" | "failed";
  summary?: string;
  birads?: {
    value?: number;
    confidence?: "low" | "medium" | "high";
    evidence?: string[];
  };
  breast_density?: { value?: string; evidence?: string[] };
  exam?: { type?: string; laterality?: string; evidence?: string[] };
  findings?: Array<{
    laterality?: string;
    location?: string;
    description?: string;
    assessment?: string;
    evidence?: string[];
  }>;
  recommendations?: Array<{
    action?: string;
    timeframe?: string;
    evidence?: string[];
  }>;
  red_flags?: string[];
  created_date?: string;
}

export interface TreatmentRecord {
  _id: string;
  patient_id: string;
  treatment_type: string;
  treatment_start_date: string;
  treatment_end_date?: string;
  medication_details?: string;
  treatment_outcome?: string;
  side_effects?: string;
  follow_up_date?: string;
}
