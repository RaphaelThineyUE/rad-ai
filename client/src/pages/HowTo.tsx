import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel } from "../lib/mui";

const steps = [
  "Create or select a patient profile",
  "Upload a PDF radiology report",
  "Review AI-extracted findings",
  "Compare treatments and review analytics",
  "Export consolidated insights"
];

const sections = [
  {
    title: "Uploading and analyzing reports",
    content:
      "Select a patient before uploading. The AI will parse BI-RADS, findings, and recommendations. Always review red flags and evidence quotes."
  },
  {
    title: "Consolidated insights",
    content:
      "When two or more completed reports exist, use the consolidated view to spot trends and progression over time."
  },
  {
    title: "Treatment comparisons",
    content:
      "Enter up to five treatment options to compare outcomes and side effects. Use the results as decision support, not medical advice."
  },
  {
    title: "Analytics dashboard",
    content:
      "Explore stage distributions, treatment outcomes, and diagnostic mix to inform operational decisions."
  }
];

const HowTo = () => {
  return (
    <div className="space-y-6">
      <div className="rad-card p-6">
        <h2 className="text-xl font-semibold">Getting Started Checklist</h2>
        <div className="mt-4 grid gap-2">
          {steps.map((step) => (
            <FormControlLabel key={step} control={<Checkbox />} label={step} />
          ))}
        </div>
      </div>

      <div className="rad-card p-6">
        <h3 className="text-lg font-semibold mb-3">Feature Guides & Pro Tips</h3>
        {sections.map((section) => (
          <Accordion key={section.title}>
            <AccordionSummary>
              <h4 className="text-sm font-semibold">{section.title}</h4>
            </AccordionSummary>
            <AccordionDetails>
              <p className="text-sm text-slate-600">{section.content}</p>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      <div className="rad-card p-6 border border-rose-200 bg-rose-50">
        <h4 className="text-sm font-semibold">Medical Disclaimer</h4>
        <p className="text-sm text-slate-600 mt-2">
          RadReport AI provides decision support and is not a substitute for professional medical advice,
          diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
};

export default HowTo;
