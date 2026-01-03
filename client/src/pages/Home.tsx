import { useMemo, useState } from "react";
import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select } from "../lib/mui";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import api from "../lib/api";
import { consoleNinja } from "../lib/consoleNinja";
import { Patient, RadiologyReport } from "../types";
import FileDropzone from "../components/reports/FileDropzone";
import ReportsList from "../components/reports/ReportsList";
import ReportDetail from "../components/reports/ReportDetail";
import ConsolidatedView from "../components/reports/ConsolidatedView";

const Home = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [activeReport, setActiveReport] = useState<RadiologyReport | undefined>();
  const [consolidatedOpen, setConsolidatedOpen] = useState(false);
  const [consolidatedSummary, setConsolidatedSummary] = useState("");

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data } = await api.get("/api/patients");
      return data.patients as Patient[];
    }
  });

  const reportsQuery = useQuery({
    queryKey: ["reports", selectedPatient],
    queryFn: async () => {
      if (!selectedPatient) return [] as RadiologyReport[];
      const { data } = await api.get("/api/reports", {
        params: { patient_id: selectedPatient }
      });
      return data.reports as RadiologyReport[];
    }
  });

  const stats = useMemo(() => {
    const reports = reportsQuery.data || [];
    const total = reports.length;
    const analyzed = reports.filter((r) => r.status === "completed").length;
    const needsReview = reports.filter((r) => r.status === "failed").length;
    return { total, analyzed, needsReview };
  }, [reportsQuery.data]);

  const handleUpload = async (file: File) => {
    if (!selectedPatient) {
      toast.error("Select a patient before uploading.");
      return;
    }
    const existing = reportsQuery.data?.some((report) => report.filename === file.name);
    if (existing) {
      toast.error("A report with this filename already exists.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/api/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const reportRes = await api.post("/api/reports", {
        patient_id: selectedPatient,
        filename: uploadRes.data.filename,
        file_url: uploadRes.data.file_url,
        file_size: uploadRes.data.file_size
      });

      await api.post("/api/reports/process", {
        report_id: reportRes.data.report._id,
        file_url: uploadRes.data.file_url
      });

      toast.success("Report processed successfully.");
      reportsQuery.refetch();
    } catch (error) {
      consoleNinja.error("Upload failed", error);
      toast.error("Upload failed.");
    }
  };

  const handleDelete = async (report: RadiologyReport) => {
    try {
      await api.delete(`/api/reports/${report._id}`);
      toast.success("Report deleted.");
      setActiveReport(undefined);
      reportsQuery.refetch();
    } catch (error) {
      toast.error("Unable to delete report.");
    }
  };

  const handleConsolidate = async () => {
    const completed = (reportsQuery.data || []).filter((r) => r.status === "completed");
    if (completed.length < 2) return;
    const { data } = await api.post("/api/ai/consolidate-reports", {
      reports: completed
    });
    setConsolidatedSummary(data.summary);
    setConsolidatedOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: stats.total },
          { label: "Analyzed", value: stats.analyzed },
          { label: "Needs Review", value: stats.needsReview }
        ].map((card) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="space-y-1">
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-800">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="rad-card p-5">
        <FormControl fullWidth>
          <InputLabel id="select-patient-label">Select patient</InputLabel>
          <Select
            labelId="select-patient-label"
            label="Select patient"
            value={selectedPatient}
            onChange={(event) => setSelectedPatient(event.target.value)}
          >
            {(patientsQuery.data || []).map((patient) => (
              <MenuItem key={patient._id} value={patient._id}>
                {patient.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <FileDropzone disabled={!selectedPatient} onFileSelected={handleUpload} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reports</h2>
        <Button
          variant="contained"
          disabled={(reportsQuery.data || []).filter((r) => r.status === "completed").length < 2}
          onClick={handleConsolidate}
        >
          View Consolidated
        </Button>
      </div>

      <ReportsList
        reports={reportsQuery.data || []}
        isLoading={reportsQuery.isLoading}
        onSelect={(report) => setActiveReport(report)}
      />

      <ReportDetail report={activeReport} onClose={() => setActiveReport(undefined)} onDelete={handleDelete} />

      <ConsolidatedView
        isOpen={consolidatedOpen}
        onClose={() => setConsolidatedOpen(false)}
        summary={consolidatedSummary}
        reports={reportsQuery.data || []}
      />
    </div>
  );
};

export default Home;
