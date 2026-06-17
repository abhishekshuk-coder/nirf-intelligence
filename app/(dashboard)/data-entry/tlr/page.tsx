"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Save, RefreshCw, Info } from "lucide-react";

interface TLRData {
  totalFaculty: number; phdFaculty: number; totalStudents: number;
  avgExperience: number; financialResources: number; libraryExp: number; labExp: number;
}

function calcTLRScore(d: TLRData): number {
  const fsRatio  = d.totalStudents / Math.max(d.totalFaculty, 1);
  const fsScore  = Math.max(0, Math.min(100, 100 - (fsRatio - 15) * 3));
  const qualScore = (d.phdFaculty / Math.max(d.totalFaculty, 1)) * 100;
  const expScore  = Math.min(100, (d.avgExperience / 20) * 100);
  const finScore  = Math.min(100, d.financialResources / 50000);
  const libScore  = Math.min(100, (d.libraryExp / d.financialResources) * 500);
  const labScore  = Math.min(100, (d.labExp / d.financialResources) * 500);
  return Math.min(30, ((fsScore * 0.25 + qualScore * 0.3 + expScore * 0.1 + finScore * 0.2 + libScore * 0.075 + labScore * 0.075) / 100) * 30);
}

function InputField({ label, name, value, unit, onChange, hint }: {
  label: string; name: string; value: number; unit?: string; hint?: string;
  onChange: (n: string, v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        {hint && (
          <div className="relative group">
            <Info size={12} className="text-slate-400 cursor-help" />
            <div className="absolute right-0 top-5 z-10 hidden group-hover:block w-48 text-[10px] bg-slate-800 text-white p-2 rounded-lg shadow-xl">{hint}</div>
          </div>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-slate-50 pr-12"
        />
        {unit && <span className="absolute right-3 text-xs text-slate-400 font-medium">{unit}</span>}
      </div>
    </div>
  );
}

export default function TLRPage() {
  const [data, setData] = useState<TLRData>({
    totalFaculty: 297, phdFaculty: 198, totalStudents: 3560,
    avgExperience: 12, financialResources: 180000000,
    libraryExp: 8500000, labExp: 12000000,
  });
  const [saved, setSaved] = useState(false);

  function update(name: string, value: number) {
    setData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  const score = calcTLRScore(data);
  const pct   = (score / 30) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="TLR — Teaching, Learning & Resources" subtitle="Weightage: 30% of total NIRF score" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">

          {/* Form */}
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Faculty & Resources Data</h2>
                <p className="text-xs text-slate-400">Enter data for current academic year 2024–25</p>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Faculty Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Total Faculty" name="totalFaculty" value={data.totalFaculty} onChange={update} hint="All regular and contractual faculty members" />
                <InputField label="PhD Qualified Faculty" name="phdFaculty" value={data.phdFaculty} onChange={update} hint="Faculty with PhD degree from recognized universities" />
              </div>
              <InputField label="Average Teaching Experience (Years)" name="avgExperience" value={data.avgExperience} unit="years" onChange={update} />

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Student Strength</h3>
              <InputField label="Total Student Strength" name="totalStudents" value={data.totalStudents} onChange={update} hint="All enrolled UG + PG + PhD students" />

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Financial Resources (₹)</h3>
              <div className="grid grid-cols-1 gap-4">
                <InputField label="Total Annual Financial Resources" name="financialResources" value={data.financialResources} unit="₹" onChange={update} hint="Total expenditure from all sources" />
                <InputField label="Library Expenditure" name="libraryExp" value={data.libraryExp} unit="₹" onChange={update} />
                <InputField label="Laboratory Expenditure" name="labExp" value={data.labExp} unit="₹" onChange={update} />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setSaved(true)} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                {saved ? <><RefreshCw size={15} /> Saved!</> : <><Save size={15} /> Save TLR Data</>}
              </button>
              <button onClick={() => setData({ totalFaculty: 0, phdFaculty: 0, totalStudents: 0, avgExperience: 0, financialResources: 0, libraryExp: 0, labExp: 0 })}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Reset
              </button>
            </div>
          </div>

          {/* Score Panel */}
          <div className="space-y-4">
            <div className="card p-5 border-t-4 border-t-blue-600">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">TLR Score Preview</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-extrabold text-blue-600">{score.toFixed(2)}</span>
                <span className="text-lg text-slate-400 ml-1">/ 30</span>
              </div>
              <Progress value={score} max={30} color={pct >= 75 ? "green" : pct >= 55 ? "gold" : "red"} />
              <p className="text-center text-xs text-slate-500 mt-2">{pct.toFixed(1)}% of maximum</p>
            </div>

            <div className="card p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Sub-indicators</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Student-Faculty Ratio", value: (data.totalStudents / Math.max(data.totalFaculty, 1)).toFixed(1), suffix: ":1", target: "≤15:1" },
                  { label: "PhD Faculty %", value: ((data.phdFaculty / Math.max(data.totalFaculty, 1)) * 100).toFixed(1), suffix: "%", target: ">75%" },
                  { label: "Lib/Total Exp %", value: ((data.libraryExp / Math.max(data.financialResources, 1)) * 100).toFixed(1), suffix: "%", target: ">5%" },
                  { label: "Lab/Total Exp %", value: ((data.labExp / Math.max(data.financialResources, 1)) * 100).toFixed(1), suffix: "%", target: ">7%" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate">{s.label}</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{s.value}{s.suffix}</span>
                      <span className="text-slate-400 ml-1">{s.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 bg-blue-50 border-blue-100">
              <h4 className="text-xs font-bold text-blue-700 mb-2">Improvement Tips</h4>
              <ul className="space-y-1.5 text-[11px] text-blue-600">
                {data.phdFaculty / Math.max(data.totalFaculty, 1) < 0.75 && <li>• Recruit {Math.ceil(data.totalFaculty * 0.75 - data.phdFaculty)} more PhD faculty</li>}
                {data.totalStudents / data.totalFaculty > 20 && <li>• Hire {Math.ceil(data.totalStudents / 15 - data.totalFaculty)} more faculty to improve ratio</li>}
                {data.libraryExp / data.financialResources < 0.05 && <li>• Increase library budget to ≥5% of total expenditure</li>}
                <li>• Document all expenditure with proper audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
