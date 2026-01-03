import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

interface TreatmentComparisonChartsProps {
  outcomeData: { name: string; value: number }[];
  stageData: { name: string; value: number }[];
}

const colors = ["#f472b6", "#fb7185", "#f97316", "#60a5fa", "#4ade80"];

const TreatmentComparisonCharts = ({ outcomeData, stageData }: TreatmentComparisonChartsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rad-card p-4 h-72">
        <h4 className="text-sm font-semibold mb-4">Outcomes by Treatment</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={outcomeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#fb7185" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rad-card p-4 h-72">
        <h4 className="text-sm font-semibold mb-4">Stage Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={stageData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
              {stageData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreatmentComparisonCharts;
