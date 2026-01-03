import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "../../lib/mui";
import { useForm } from "react-hook-form";

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

const stages = ["Stage 0", "Stage I", "Stage II", "Stage III", "Stage IV", "Unknown"];

const AddPatientDialog = ({ isOpen, onClose, onSubmit }: AddPatientDialogProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      gender: "",
      diagnosis_date: "",
      cancer_type: "",
      cancer_stage: ""
    }
  });

  const handleSave = handleSubmit((values) => {
    onSubmit(values as Record<string, string>);
    reset();
  });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Patient</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <TextField label="Full name" {...register("full_name", { required: true })} />
        <TextField
          type="date"
          label="Date of birth"
          InputLabelProps={{ shrink: true }}
          {...register("date_of_birth", { required: true })}
        />
        <TextField label="Gender" select {...register("gender", { required: true })}>
          {[
            { key: "Female", label: "Female" },
            { key: "Male", label: "Male" },
            { key: "Other", label: "Other" }
          ].map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="Diagnosis date"
          InputLabelProps={{ shrink: true }}
          {...register("diagnosis_date", { required: true })}
        />
        <TextField label="Cancer type" {...register("cancer_type", { required: true })} />
        <TextField label="Cancer stage" select {...register("cancer_stage", { required: true })}>
          {stages.map((stage) => (
            <MenuItem key={stage} value={stage}>
              {stage}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPatientDialog;
