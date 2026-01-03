import { differenceInDays, format } from "date-fns";
import { Patient, TreatmentRecord } from "../../types";

interface PatientTimelineProps {
  patient: Patient;
  treatments: TreatmentRecord[];
}

const PatientTimeline = ({ patient, treatments }: PatientTimelineProps) => {
  const diagnosisDate = new Date(patient.diagnosis_date);
  const events = [
    {
      title: "Diagnosis",
      date: diagnosisDate,
      description: `${patient.cancer_type} • ${patient.cancer_stage}`
    },
    ...treatments.map((treatment) => ({
      title: treatment.treatment_type,
      date: new Date(treatment.treatment_start_date),
      description: treatment.treatment_outcome || "Ongoing"
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={`${event.title}-${index}`} className="flex gap-4">
          <div className="h-3 w-3 rounded-full bg-rose-500 mt-2" />
          <div>
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="text-xs text-slate-500">
              {format(event.date, "PPP")} • {differenceInDays(new Date(), event.date)} days ago
            </p>
            <p className="text-xs text-slate-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientTimeline;
