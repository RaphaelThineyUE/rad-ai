import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, Chip, Tab, Tabs } from "@nextui-org/react";
import api from "../lib/api";
import { Patient, TreatmentRecord } from "../types";
import PatientTimeline from "../components/patient/PatientTimeline";
import TreatmentComparison from "../components/patient/TreatmentComparison";
import TreatmentComparisonCharts from "../components/patient/TreatmentComparisonCharts";

const PatientDetail = () => {
  const { id } = useParams();

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
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{patient.full_name}</h2>
            <p className="text-sm text-slate-500">
              {patient.gender} • DOB {new Date(patient.date_of_birth).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="flat">
              {patient.cancer_stage}
            </Chip>
            <Badge color="secondary">ER {patient.er_status || "Unknown"}</Badge>
            <Badge color="secondary">PR {patient.pr_status || "Unknown"}</Badge>
            <Badge color="secondary">HER2 {patient.her2_status || "Unknown"}</Badge>
          </div>
        </div>
      </Card>

      <Tabs aria-label="Patient tabs">
        <Tab key="overview" title="Overview">
          <div className="rad-card p-6 space-y-3">
            <p className="text-sm text-slate-600">Diagnosis date: {new Date(patient.diagnosis_date).toLocaleDateString()}</p>
            <p className="text-sm text-slate-600">Cancer type: {patient.cancer_type}</p>
            <p className="text-sm text-slate-600">Initial plan: {patient.initial_treatment_plan || "Not set"}</p>
          </div>
        </Tab>
        <Tab key="timeline" title="Timeline">
          <div className="rad-card p-6">
            <PatientTimeline patient={patient} treatments={treatments} />
          </div>
        </Tab>
        <Tab key="treatments" title="Treatments">
          <div className="rad-card p-6 space-y-3">
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
        </Tab>
        <Tab key="comparison" title="Treatment Comparison">
          <div className="space-y-6">
            <div className="rad-card p-6">
              <TreatmentComparison patient={patient} />
            </div>
            <TreatmentComparisonCharts outcomeData={outcomeData} stageData={stageData} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
