import { useMemo, useState } from "react";
import { Tab, Tabs } from "../lib/mui";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "../lib/api";
import { Patient, TreatmentRecord } from "../types";

const chartColors = ["#f472b6", "#fb7185", "#f97316", "#60a5fa", "#4ade80"];

const PatientAnalytics = () => {
  const [tabValue, setTabValue] = useState("demographics");
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data } = await api.get("/api/patients");
      return data.patients as Patient[];
    }
  });

  const treatmentsQuery = useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const { data } = await api.get("/api/treatments");
      return data.treatments as TreatmentRecord[];
    }
  });

  const stageData = useMemo(() => {
    const counts: Record<string, number> = {};
    (patientsQuery.data || []).forEach((patient) => {
      counts[patient.cancer_stage] = (counts[patient.cancer_stage] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patientsQuery.data]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    (patientsQuery.data || []).forEach((patient) => {
      counts[patient.cancer_type] = (counts[patient.cancer_type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patientsQuery.data]);

  const outcomeData = useMemo(() => {
    const counts: Record<string, number> = {};
    (treatmentsQuery.data || []).forEach((treatment) => {
      const key = treatment.treatment_outcome || "Other";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [treatmentsQuery.data]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rad-card p-4">
          <p className="text-sm text-slate-500">Total Patients</p>
          <p className="text-2xl font-semibold">{patientsQuery.data?.length || 0}</p>
        </div>
        <div className="rad-card p-4">
          <p className="text-sm text-slate-500">Treatment Records</p>
          <p className="text-2xl font-semibold">{treatmentsQuery.data?.length || 0}</p>
        </div>
        <div className="rad-card p-4">
          <p className="text-sm text-slate-500">Distinct Types</p>
          <p className="text-2xl font-semibold">{typeData.length}</p>
        </div>
      </div>

      <div>
        <Tabs
          value={tabValue}
          onChange={(_event, value) => setTabValue(value)}
          aria-label="Analytics tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="demographics" label="Demographics" />
          <Tab value="diagnostic" label="Diagnostic" />
          <Tab value="treatment" label="Treatment" />
        </Tabs>
        {tabValue === "demographics" && (
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="rad-card p-4 h-72">
              <h4 className="text-sm font-semibold mb-4">Cancer Stage</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" outerRadius={90}>
                    {stageData.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rad-card p-4 h-72">
              <h4 className="text-sm font-semibold mb-4">Cancer Type</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#fb7185" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {tabValue === "diagnostic" && (
          <div className="rad-card p-4 h-72 mt-4">
            <h4 className="text-sm font-semibold mb-4">Diagnostic Type Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {tabValue === "treatment" && (
          <div className="rad-card p-4 h-72 mt-4">
            <h4 className="text-sm font-semibold mb-4">Treatment Outcomes</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4ade80" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAnalytics;
