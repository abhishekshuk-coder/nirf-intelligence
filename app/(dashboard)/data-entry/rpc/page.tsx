"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, Save, Plus, Trash2 } from "lucide-react";

interface Publication { title: string; journal: string; indexed: "scopus" | "wos" | "both" | "other"; year: string; citations: number; }

interface RPCData {
  scopusPapers: number; wosPapers: number; totalCitations: number; hIndex: number;
  patents: number; consultancyRevenue: number; sponsoredProjects: number; sponsoredAmount: number;
}

function calcRPCScore(d: RPCData, faculty: number = 297): number {
  const pubPerFaculty = (d.scopusPapers + d.wosPapers) / Math.max(faculty, 1);
  const pubScore  = Math.min(100, pubPerFaculty * 10);
  const citScore  = Math.min(100, (d.totalCitations / Math.max(d.scopusPapers + d.wosPapers, 1)) * 5);
  const hScore    = Math.min(100, d.hIndex * 2);
  const patScore  = Math.min(100, d.patents * 3);
  const conScore  = Math.min(100, d.consultancyRevenue / 50000);
  const projScore = Math.min(100, d.sponsoredProjects * 5);
  return Math.min(30, ((pubScore * 0.3 + citScore * 0.25 + hScore * 0.1 + patScore * 0.15 + conScore * 0.1 + projScore * 0.1) / 100) * 30);
}

export default function RPCPage() {
  const [data, setData] = useState<RPCData>({
    scopusPapers: 892, wosPapers: 634, totalCitations: 8942, hIndex: 42,
    patents: 34, consultancyRevenue: 4200000, sponsoredProjects: 18, sponsoredAmount: 85000000,
  });
  const [saved, setSaved] = useState(false);

  function update(name: string, value: number) { setData((p) => ({ ...p, [name]: value })); setSaved(false); }

  const score = calcRPCScore(data);
  const pct   = (score / 30) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="RPC — Research & Professional Practice" subtitle="Weightage: 30% of total NIRF score" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <FlaskConical size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Research Output Data</h2>
                <p className="text-xs text-slate-400">Publications, patents, consultancy, and projects</p>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Publications</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Scopus Indexed Papers", name: "scopusPapers", hint: "Papers published in Scopus-indexed journals" },
                  { label: "Web of Science Papers", name: "wosPapers",    hint: "Papers published in WoS-indexed journals" },
                  { label: "Total Citations",        name: "totalCitations" },
                  { label: "H-Index",                name: "hIndex", hint: "Hirsch index of the institution" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <input type="number" value={(data as unknown as Record<string, number>)[f.name] || ""}
                      onChange={(e) => update(f.name, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Patents & IPR</h3>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Patents Filed / Granted</label>
                <input type="number" value={data.patents || ""}
                  onChange={(e) => update("patents", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50"
                />
              </div>

              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 pt-2">Consultancy & Projects</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Consultancy Revenue (₹)", name: "consultancyRevenue" },
                  { label: "Sponsored Projects (count)", name: "sponsoredProjects" },
                  { label: "Sponsored Amount (₹)", name: "sponsoredAmount" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">{f.label}</label>
                    <input type="number" value={(data as unknown as Record<string, number>)[f.name] || ""}
                      onChange={(e) => update(f.name, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSaved(true)} className="btn-primary mt-6 w-full justify-center py-2.5 text-sm">
              <Save size={15} /> {saved ? "Saved!" : "Save RPC Data"}
            </button>
          </div>

          {/* Score Panel */}
          <div className="space-y-4">
            <div className="card p-5 border-t-4 border-t-red-500">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">RPC Score Preview</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-extrabold text-red-500">{score.toFixed(2)}</span>
                <span className="text-lg text-slate-400 ml-1">/ 30</span>
              </div>
              <Progress value={score} max={30} color={pct >= 75 ? "green" : pct >= 55 ? "gold" : "red"} />
              <p className="text-center text-xs text-slate-500 mt-2">{pct.toFixed(1)}% of maximum</p>
            </div>

            <div className="card p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Key Metrics</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Papers / Faculty", value: ((data.scopusPapers + data.wosPapers) / 297).toFixed(1), target: ">6" },
                  { label: "Avg Citations/Paper", value: (data.totalCitations / Math.max(data.scopusPapers + data.wosPapers, 1)).toFixed(1), target: ">8" },
                  { label: "H-Index", value: data.hIndex.toString(), target: ">50" },
                  { label: "Patents", value: data.patents.toString(), target: ">40" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{s.label}</span>
                    <span className="font-bold text-slate-800">{s.value} <span className="text-slate-400 font-normal">{s.target}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 bg-red-50 border-red-100">
              <h4 className="text-xs font-bold text-red-700 mb-2">Critical Gaps</h4>
              <ul className="space-y-1.5 text-[11px] text-red-600">
                {data.hIndex < 50 && <li>• Increase H-Index from {data.hIndex} to 50+</li>}
                {data.patents < 40 && <li>• File {40 - data.patents} more patents to reach target</li>}
                {(data.scopusPapers + data.wosPapers) / 297 < 6 && <li>• Need {Math.ceil(297 * 6 - data.scopusPapers - data.wosPapers)} more publications</li>}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
