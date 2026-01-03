import { useMemo, useState } from "react";
import { Button, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
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
        <Input label="Search" value={search} onValueChange={setSearch} className="max-w-xs" />
        <Select label="Stage" selectedKeys={stage ? [stage] : []} onSelectionChange={(keys) => setStage(Array.from(keys)[0] as string)}>
          {stages.map((item) => (
            <SelectItem key={item}>{item}</SelectItem>
          ))}
        </Select>
        <Input label="Cancer type" value={type} onValueChange={setType} className="max-w-xs" />
        <Button color="primary" onClick={() => setDialogOpen(true)}>
          Add Patient
        </Button>
      </div>

      <div className="rad-card p-4">
        <Table aria-label="Patients">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Stage</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Diagnosis</TableColumn>
          </TableHeader>
          <TableBody
            items={filtered}
            emptyContent={patientsQuery.isLoading ? "Loading..." : "No patients found"}
          >
            {(patient) => (
              <TableRow key={patient._id} onClick={() => navigate(`/patients/${patient._id}`)}>
                <TableCell>{patient.full_name}</TableCell>
                <TableCell>{patient.cancer_stage}</TableCell>
                <TableCell>{patient.cancer_type}</TableCell>
                <TableCell>{new Date(patient.diagnosis_date).toLocaleDateString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddPatientDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleAdd} />
    </div>
  );
};

export default PatientList;
