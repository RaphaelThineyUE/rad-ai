import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Chip, Tab, Tabs } from "../lib/radix";
import api from "../lib/api";
import { Patient, TreatmentRecord } from "../types";
import PatientTimeline from "../components/patient/PatientTimeline";
import TreatmentComparison from "../components/patient/TreatmentComparison";
import TreatmentComparisonCharts from "../components/patient/TreatmentComparisonCharts";

const PatientDetail = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState("overview");

  const patientQuery = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/patients/${id}`);
      return data.patient as Patient;
    }
  });

  const treatmentsQuery = useQuery({
    queryKey: ["treatments", id],
    queryFn: async () => {
      const { data } = await api.get("/api/treatments", { params: { patient_id: id } });
      return data.treatments as TreatmentRecord[];
    }
  });

  if (patientQuery.isLoading || !patientQuery.data) {
    return <div className="rad-card p-6">Loading patient...</div>;
  }

  const patient = patientQuery.data;
  const treatments = treatmentsQuery.data || [];

  const outcomeData = treatments.map((treatment) => ({
    name: treatment.treatment_type,
    value: 1
  }));

  const stageData = [
    { name: patient.cancer_stage, value: 1 },
    { name: "Other", value: Math.max(1, 4 - 1) }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{patient.full_name}</h2>
            <p className="text-sm text-slate-500">
              {patient.gender} • DOB {new Date(patient.date_of_birth).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="outlined" label={patient.cancer_stage} />
            <Chip color="secondary" variant="outlined" label={`ER ${patient.er_status || "Unknown"}`} />
            <Chip color="secondary" variant="outlined" label={`PR ${patient.pr_status || "Unknown"}`} />
            <Chip color="secondary" variant="outlined" label={`HER2 ${patient.her2_status || "Unknown"}`} />
          </div>
        </CardContent>
      </Card>

      <div>
        <Tabs
          value={tabValue}
          onChange={(_event, value) => setTabValue(value)}
          aria-label="Patient tabs"
        >
          <Tab value="overview" label="Overview" />
          <Tab value="timeline" label="Timeline" />
          <Tab value="treatments" label="Treatments" />
          <Tab value="comparison" label="Treatment Comparison" />
        </Tabs>
        {tabValue === "overview" && (
          <div className="rad-card p-6 space-y-3 mt-4">
            <p className="text-sm text-slate-600">Diagnosis date: {new Date(patient.diagnosis_date).toLocaleDateString()}</p>
            <p className="text-sm text-slate-600">Cancer type: {patient.cancer_type}</p>
            <p className="text-sm text-slate-600">Initial plan: {patient.initial_treatment_plan || "Not set"}</p>
          </div>
        )}
        {tabValue === "timeline" && (
          <div className="rad-card p-6 mt-4">
            <PatientTimeline patient={patient} treatments={treatments} />
          </div>
        )}
        {tabValue === "treatments" && (
          <div className="rad-card p-6 space-y-3 mt-4">
            {treatments.length ? (
              treatments.map((treatment) => (
                <div key={treatment._id} className="p-4 border border-pink-100 rounded-xl">
                  <p className="text-sm font-semibold">{treatment.treatment_type}</p>
                  <p className="text-xs text-slate-500">Outcome: {treatment.treatment_outcome || "Ongoing"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No treatments recorded.</p>
            )}
          </div>
        )}
        {tabValue === "comparison" && (
          <div className="space-y-6 mt-4">
            <div className="rad-card p-6">
              <TreatmentComparison patient={patient} />
            </div>
            <TreatmentComparisonCharts outcomeData={outcomeData} stageData={stageData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
