import { RadiologyReport } from "../../types";
import ReportCard from "./ReportCard";

interface ReportsListProps {
  reports: RadiologyReport[];
  isLoading: boolean;
  onSelect: (report: RadiologyReport) => void;
}

const ReportsList = ({ reports, isLoading, onSelect }: ReportsListProps) => {
  if (isLoading) {
    return <div className="rad-card p-6">Loading reports...</div>;
  }
  if (!reports.length) {
    return <div className="rad-card p-6">No reports yet. Upload to begin.</div>;
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <ReportCard key={report._id} report={report} onSelect={() => onSelect(report)} />
      ))}
    </div>
  );
};

export default ReportsList;
