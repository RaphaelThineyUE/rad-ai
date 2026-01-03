import { Button, Dialog, DialogContent, DialogTitle } from "../../lib/mui";
import ReactMarkdown from "react-markdown";
import { RadiologyReport } from "../../types";

interface ConsolidatedViewProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  reports: RadiologyReport[];
}

const ConsolidatedView = ({ isOpen, onClose, summary, reports }: ConsolidatedViewProps) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ summary, reports }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "radreport-consolidated.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Consolidated Analysis</DialogTitle>
      <DialogContent>
        <div className="space-y-4 pb-4">
          <div className="rad-card p-4">
            <ReactMarkdown className="text-sm text-slate-600">{summary}</ReactMarkdown>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Reports Included</h4>
            <ul className="text-sm text-slate-600 list-disc pl-4">
              {reports.map((report) => (
                <li key={report._id}>{report.filename}</li>
              ))}
            </ul>
          </div>
          <Button variant="contained" onClick={handleExport}>
            Export JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsolidatedView;
