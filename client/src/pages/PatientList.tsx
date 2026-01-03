import { useMemo, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "../lib/mui";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../lib/api";
import { Patient } from "../types";
import AddPatientDialog from "../components/patient/AddPatientDialog";

const stages = ["Stage 0", "Stage I", "Stage II", "Stage III", "Stage IV", "Unknown"];

const PatientList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [type, setType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data } = await api.get("/api/patients");
      return data.patients as Patient[];
    }
  });

  const filtered = useMemo(() => {
    return (patientsQuery.data || []).filter((patient) => {
      const matchesStage = stage ? patient.cancer_stage === stage : true;
      const matchesType = type ? patient.cancer_type.toLowerCase().includes(type.toLowerCase()) : true;
      const matchesSearch = search
        ? patient.full_name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStage && matchesType && matchesSearch;
    });
  }, [patientsQuery.data, stage, type, search]);

  const handleAdd = async (values: Record<string, string>) => {
    try {
      await api.post("/api/patients", values);
      toast.success("Patient created.");
      setDialogOpen(false);
      patientsQuery.refetch();
    } catch (error) {
      toast.error("Unable to create patient.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-xs" />
        <FormControl className="min-w-[180px]">
          <InputLabel id="stage-filter-label">Stage</InputLabel>
          <Select
            labelId="stage-filter-label"
            label="Stage"
            value={stage}
            onChange={(event) => setStage(event.target.value)}
          >
            {stages.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Cancer type" value={type} onChange={(event) => setType(event.target.value)} className="max-w-xs" />
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Add Patient
        </Button>
      </div>

      <div className="rad-card p-4">
        <TableContainer>
          <Table aria-label="Patients">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Diagnosis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length ? (
                filtered.map((patient) => (
                  <TableRow
                    key={patient._id}
                    hover
                    className="cursor-pointer"
                    onClick={() => navigate(`/patients/${patient._id}`)}
                  >
                    <TableCell>{patient.full_name}</TableCell>
                    <TableCell>{patient.cancer_stage}</TableCell>
                    <TableCell>{patient.cancer_type}</TableCell>
                    <TableCell>{new Date(patient.diagnosis_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    {patientsQuery.isLoading ? "Loading..." : "No patients found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <AddPatientDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleAdd} />
    </div>
  );
};

export default PatientList;
