import { RadiologyReport } from "../../types";
import { format } from "date-fns";
import { Chip } from "../../lib/mui";

interface ReportCardProps {
  report: RadiologyReport;
  onSelect: () => void;
}

const colorForBirads = (value?: number) => {
  if (!value) return "default";
  if (value <= 2) return "success";
  if (value === 3) return "warning";
  if (value === 4) return "warning";
  return "error";
};

const ReportCard = ({ report, onSelect }: ReportCardProps) => {
  return (
    <button
      className="rad-card p-4 text-left hover:shadow-md transition"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{report.filename}</h3>
          <p className="text-xs text-slate-500">
            {report.created_date ? format(new Date(report.created_date), "PPP") : "-"}
          </p>
        </div>
        <Chip color={colorForBirads(report.birads?.value)} size="small" variant="outlined">
          BI-RADS {report.birads?.value ?? "N/A"}
        </Chip>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
        <span>Status: {report.status}</span>
        <span>Red flags: {report.red_flags?.length ?? 0}</span>
      </div>
    </button>
  );
};

export default ReportCard;
