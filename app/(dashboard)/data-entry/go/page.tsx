"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Save } from "lucide-react";

interface GOData {
  totalGraduates: number; placed: number; higherStudies: number;
  selfEmployed: number; medianSalary: number; phdGraduates: number;
}

function calcGOScore(d: GOData): number {
  const total = Math.max(d.totalGraduates, 1);
  const placedPct = ((d.placed + d.higherStudies + d.selfEmployed) / total) * 100;
  const salScore  = Math.min(100, d.medianSalary / 700);
  const phdScore  = Math.min(100, (d.phdGraduates / total) * 500);
  return Math.min(20, ((placedPct * 0.6 + salScore * 0.3 + phdScore * 0.1) / 100) * 20);
}

export default function GOPage() {
  const [data, setData] = useState<GOData>({
    totalGraduates: 820, placed: 512, higherStudies: 185,
    selfEmployed: 28, medianSalary: 680000, phdGraduates: 38,
  });
  const [saved, setSaved] = useState(false);
  function update(name: string, value: number) { setData((p) => ({ ...p, [name]: value })); setSaved(false); }
  const score   = calcGOScore(data);
  const pct     = (score / 20) * 100;
  const outRate = ((data.placed + data.higherStudies + data.selfEmployed) / Math.max(data.totalGraduates, 1) * 100).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="GO — Graduation Outcomes" subtitle="Weightage: 20% of total NIRF score" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <GraduationCap size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Graduation Outcomes Data</h2>
                <p className="text-xs text-slate-400">Placements, higher studies, salary, and PhD outcomes</p>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Batch Statistics</h3>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Total Graduates (Batch)</label>
                <input type="number" value={data.totalGraduates || ""} onChange={(e) => update("totalGraduates", +e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
              </div>

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Placement Outcomes</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Placed in Industry", name: "placed" },
                  { label: "Higher Studies", name: "higherStudies" },
                  { label: "Self Employed / Entrepreneurship", name: "selfEmployed" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <input type="number" value={(data as unknown as Record<string, number>)[f.name] || ""} onChange={(e) => update(f.name, +e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <strong>Overall Outcome Rate:</strong> {outRate}% ({(+data.placed + +data.higherStudies + +data.selfEmployed).toLocaleString()} of {data.totalGraduates.toLocaleString()} graduates)
              </div>

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Salary & Research</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Median Annual Salary (₹)</label>
                  <input type="number" value={data.medianSalary || ""} onChange={(e) => update("medianSalary", +e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">PhD Graduates (count)</label>
                  <input type="number" value={data.phdGraduates || ""} onChange={(e) => update("phdGraduates", +e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
                </div>
              </div>
            </div>
            <button onClick={() => setSaved(true)} className="btn-primary mt-6 w-full justify-center py-2.5 text-sm">
              <Save size={15} /> {saved ? "Saved!" : "Save GO Data"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="card p-5 border-t-4 border-t-amber-500">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">GO Score Preview</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-extrabold text-amber-500">{score.toFixed(2)}</span>
                <span className="text-lg text-slate-400 ml-1">/ 20</span>
              </div>
              <Progress value={score} max={20} color={pct >= 75 ? "green" : pct >= 55 ? "gold" : "red"} />
              <p className="text-center text-xs text-slate-500 mt-2">{pct.toFixed(1)}% of maximum</p>
            </div>
            <div className="card p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Outcome Breakdown</h4>
              <div className="space-y-2">
                {[
                  { label: "Industry Placement", value: data.placed, total: data.totalGraduates, color: "blue" as const },
                  { label: "Higher Studies",      value: data.higherStudies, total: data.totalGraduates, color: "gold" as const },
                  { label: "Self Employment",     value: data.selfEmployed, total: data.totalGraduates, color: "green" as const },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="font-semibold text-slate-700">{((s.value / Math.max(s.total, 1)) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={s.value} max={s.total} color={s.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
