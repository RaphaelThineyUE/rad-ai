import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

const stages = ["Stage 0", "Stage I", "Stage II", "Stage III", "Stage IV", "Unknown"];

const AddPatientDialog = ({ isOpen, onClose, onSubmit }: AddPatientDialogProps) => {
  const { register, handleSubmit, reset } = useForm();

  const handleSave = handleSubmit((values) => {
    onSubmit(values as Record<string, string>);
    reset();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Add Patient</ModalHeader>
        <ModalBody className="gap-4">
          <Input label="Full name" {...register("full_name", { required: true })} />
          <Input type="date" label="Date of birth" {...register("date_of_birth", { required: true })} />
          <Select label="Gender" {...register("gender", { required: true })}>
            {[
              { key: "Female", label: "Female" },
              { key: "Male", label: "Male" },
              { key: "Other", label: "Other" }
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
          <Input type="date" label="Diagnosis date" {...register("diagnosis_date", { required: true })} />
          <Input label="Cancer type" {...register("cancer_type", { required: true })} />
          <Select label="Cancer stage" {...register("cancer_stage", { required: true })}>
            {stages.map((stage) => (
              <SelectItem key={stage}>{stage}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSave}>
            Save Patient
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPatientDialog;
