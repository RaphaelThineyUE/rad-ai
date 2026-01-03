import { RadiologyReport } from "../../types";
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, FileText, Trash2, X } from "lucide-react";

interface ReportDetailProps {
  report?: RadiologyReport;
  onClose: () => void;
  onDelete: (report: RadiologyReport) => void;
}

const ReportDetail = ({ report, onClose, onDelete }: ReportDetailProps) => {
  return (
    <AnimatePresence>
      {report && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl bg-white h-full overflow-y-auto p-6"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Report Detail</h2>
              <Button isIconOnly variant="light" onClick={onClose}>
                <X size={18} />
              </Button>
            </div>

            {report.red_flags?.length ? (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex gap-2">
                <AlertTriangle size={18} />
                <div>
                  <strong>Red Flags</strong>
                  <ul className="list-disc pl-4">
                    {report.red_flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-100">
              <p className="text-xs uppercase text-slate-500">BI-RADS Assessment</p>
              <h3 className="text-2xl font-semibold text-rose-600">
                {report.birads?.value ?? "N/A"}
              </h3>
              <p className="text-sm text-slate-600">Confidence: {report.birads?.confidence}</p>
            </div>

            <section className="mt-6">
              <h4 className="font-semibold text-slate-800">Summary</h4>
              <p className="text-sm text-slate-600 mt-2">{report.summary || "No summary yet."}</p>
            </section>

            <section className="mt-6">
              <h4 className="font-semibold text-slate-800">Exam</h4>
              <p className="text-sm text-slate-600 mt-2">
                {report.exam?.type} • {report.exam?.laterality}
              </p>
            </section>

            <section className="mt-6">
              <h4 className="font-semibold text-slate-800">Findings</h4>
              <div className="mt-2 space-y-3">
                {report.findings?.length ? (
                  report.findings.map((finding, index) => (
                    <div key={index} className="p-3 rounded-xl border border-pink-100">
                      <p className="text-sm font-medium">
                        {finding.laterality} {finding.location}
                      </p>
                      <p className="text-xs text-slate-600">{finding.description}</p>
                      <p className="text-xs text-slate-500">Assessment: {finding.assessment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No findings captured.</p>
                )}
              </div>
            </section>

            <section className="mt-6">
              <h4 className="font-semibold text-slate-800">Recommendations</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {report.recommendations?.length ? (
                  report.recommendations.map((rec, index) => (
                    <li key={index}>
                      {rec.action} ({rec.timeframe})
                    </li>
                  ))
                ) : (
                  <li>No recommendations yet.</li>
                )}
              </ul>
            </section>

            <div className="mt-8 flex gap-3">
              <Button
                variant="bordered"
                startContent={<FileText size={16} />}
                onClick={() => report.file_url && window.open(report.file_url, "_blank")}
              >
                View PDF
              </Button>
              <Button color="danger" startContent={<Trash2 size={16} />} onClick={() => onDelete(report)}>
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportDetail;
