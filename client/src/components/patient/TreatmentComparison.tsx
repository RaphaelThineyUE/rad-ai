import { Button, Card, Input } from "@nextui-org/react";
import { useState } from "react";
import api from "../../lib/api";
import { Patient } from "../../types";
import { toast } from "sonner";

interface TreatmentComparisonProps {
  patient: Patient;
}

interface ComparisonOption {
  name: string;
  score: number;
  efficacy_rate: string;
  benefits: string[];
  side_effects: string[];
  duration: string;
  considerations: string[];
}

const TreatmentComparison = ({ patient }: TreatmentComparisonProps) => {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [result, setResult] = useState<{ recommendation?: string; options?: ComparisonOption[] } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string, index: number) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleAdd = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const handleCompare = async () => {
    const cleaned = options.map((option) => option.trim()).filter(Boolean);
    if (!cleaned.length) {
      toast.error("Add at least one treatment option.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/ai/compare-treatments", {
        patient,
        options: cleaned
      });
      setResult(data.result);
      toast.success("Comparison generated.");
    } catch (error) {
      toast.error("Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {options.map((option, index) => (
          <Input
            key={`option-${index}`}
            label={`Option ${index + 1}`}
            value={option}
            onValueChange={(value) => handleChange(value, index)}
          />
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="bordered" onClick={handleAdd} isDisabled={options.length >= 5}>
          Add Option
        </Button>
        <Button color="primary" onClick={handleCompare} isLoading={loading}>
          Compare Treatments
        </Button>
      </div>

      {result?.options?.length ? (
        <div className="grid gap-4">
          {result.options.map((option) => (
            <Card key={option.name} className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{option.name}</h4>
                <span className="text-sm text-rose-600 font-semibold">Score {option.score}/10</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Efficacy: {option.efficacy_rate}</p>
              <p className="text-xs text-slate-600 mt-2">Benefits: {option.benefits.join(", ")}</p>
              <p className="text-xs text-slate-600 mt-1">
                Side effects: {option.side_effects.join(", ")}
              </p>
              <p className="text-xs text-slate-600 mt-1">Duration: {option.duration}</p>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TreatmentComparison;
