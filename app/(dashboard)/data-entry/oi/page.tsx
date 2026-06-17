"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { Users, Save } from "lucide-react";

interface OIData {
  totalStudents: number; women: number; ewsStudents: number;
  scStudents: number; stStudents: number; obcStudents: number;
  physicallyDisabled: number; international: number;
  statesRepresented: number;
}

function calcOIScore(d: OIData): number {
  const total = Math.max(d.totalStudents, 1);
  const womenPct = (d.women / total) * 100;
  const ewsPct   = ((d.ewsStudents + d.scStudents + d.stStudents + d.obcStudents) / total) * 100;
  const disPct   = (d.physicallyDisabled / total) * 100;
  const intPct   = (d.international / total) * 100;
  const regScore = Math.min(100, d.statesRepresented * 3.33);
  return Math.min(10,
    ((Math.min(100, womenPct * 1.5) * 0.3 + Math.min(100, ewsPct * 2) * 0.3 + regScore * 0.2 +
      Math.min(100, disPct * 20) * 0.1 + Math.min(100, intPct * 20) * 0.1) / 100) * 10
  );
}

export default function OIPage() {
  const [data, setData] = useState<OIData>({
    totalStudents: 3560, women: 1420, ewsStudents: 284, scStudents: 392,
    stStudents: 107, obcStudents: 534, physicallyDisabled: 18, international: 42, statesRepresented: 22,
  });
  const [saved, setSaved] = useState(false);
  function update(name: string, value: number) { setData((p) => ({ ...p, [name]: value })); setSaved(false); }
  const score = calcOIScore(data);
  const pct   = (score / 10) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="OI — Outreach & Inclusivity" subtitle="Weightage: 10% of total NIRF score" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-purple-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Outreach & Inclusivity Data</h2>
                <p className="text-xs text-slate-400">Diversity, equity and inclusion metrics</p>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Student Demographics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Students", name: "totalStudents" },
                  { label: "Women Students", name: "women" },
                  { label: "EWS Students", name: "ewsStudents" },
                  { label: "SC Students", name: "scStudents" },
                  { label: "ST Students", name: "stStudents" },
                  { label: "OBC Students", name: "obcStudents" },
                  { label: "Physically Disabled Students", name: "physicallyDisabled" },
                  { label: "International Students", name: "international" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <input type="number" value={(data as unknown as Record<string, number>)[f.name] || ""} onChange={(e) => update(f.name, +e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
                  </div>
                ))}
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Regional Diversity</h3>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Number of States Represented</label>
                <input type="number" value={data.statesRepresented || ""} onChange={(e) => update("statesRepresented", +e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" />
              </div>
            </div>
            <button onClick={() => setSaved(true)} className="btn-primary mt-6 w-full justify-center py-2.5 text-sm">
              <Save size={15} /> {saved ? "Saved!" : "Save OI Data"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="card p-5 border-t-4 border-t-purple-500">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">OI Score Preview</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-extrabold text-purple-500">{score.toFixed(2)}</span>
                <span className="text-lg text-slate-400 ml-1">/ 10</span>
              </div>
              <Progress value={score} max={10} color={pct >= 75 ? "green" : pct >= 55 ? "gold" : "red"} />
            </div>
            <div className="card p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Diversity Metrics</h4>
              <div className="space-y-2">
                {[
                  { label: "Women %",       value: (data.women / Math.max(data.totalStudents, 1) * 100).toFixed(1) + "%" },
                  { label: "Reserved Cat.", value: ((data.ewsStudents + data.scStudents + data.stStudents + data.obcStudents) / Math.max(data.totalStudents, 1) * 100).toFixed(1) + "%" },
                  { label: "International", value: data.international + " students" },
                  { label: "States",        value: data.statesRepresented + " states" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-xs">
                    <span className="text-slate-500">{s.label}</span>
                    <span className="font-bold text-slate-800">{s.value}</span>
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
