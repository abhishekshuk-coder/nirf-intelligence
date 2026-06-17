"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Progress } from "@/components/ui/progress";
import { Star, Save } from "lucide-react";

interface PRData { academicReputation: number; employerReputation: number; alumniScore: number; mediaVisibility: number; }

function calcPRScore(d: PRData): number {
  return Math.min(10, ((d.academicReputation * 0.4 + d.employerReputation * 0.35 + d.alumniScore * 0.15 + d.mediaVisibility * 0.1) / 100) * 10);
}

export default function PRPage() {
  const [data, setData] = useState<PRData>({ academicReputation: 68, employerReputation: 72, alumniScore: 65, mediaVisibility: 55 });
  const [saved, setSaved] = useState(false);
  function update(name: string, value: number) { setData((p) => ({ ...p, [name]: value })); setSaved(false); }
  const score = calcPRScore(data);
  const pct   = (score / 10) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="PR — Perception" subtitle="Weightage: 10% of total NIRF score" />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Star size={20} className="text-green-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Perception & Reputation Data</h2>
                <p className="text-xs text-slate-400">Survey-based reputation scores (0–100)</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { name: "academicReputation",  label: "Academic Peer Reputation",  desc: "Score from academic peer surveys conducted by NIRF", weight: 40 },
                { name: "employerReputation",  label: "Employer Reputation",        desc: "Score from employer surveys about graduate quality", weight: 35 },
                { name: "alumniScore",         label: "Alumni Engagement Score",    desc: "Alumni feedback and engagement index",                weight: 15 },
                { name: "mediaVisibility",     label: "Media & Public Visibility",  desc: "News mentions, rankings publications, public image",  weight: 10 },
              ].map((f) => {
                const val = (data as unknown as Record<string, number>)[f.name] as number;
                return (
                  <div key={f.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-slate-900">{f.label}</label>
                        <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-green-600">{val}</span>
                        <span className="text-slate-400 text-sm">/100</span>
                        <p className="text-[10px] text-slate-400">Weight: {f.weight}%</p>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" value={val}
                      onChange={(e) => update(f.name, +e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-green-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 — Poor</span><span>50 — Average</span><span>100 — Excellent</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setSaved(true)} className="btn-primary mt-6 w-full justify-center py-2.5 text-sm">
              <Save size={15} /> {saved ? "Saved!" : "Save PR Data"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="card p-5 border-t-4 border-t-green-500">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">PR Score Preview</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-extrabold text-green-500">{score.toFixed(2)}</span>
                <span className="text-lg text-slate-400 ml-1">/ 10</span>
              </div>
              <Progress value={score} max={10} color={pct >= 75 ? "green" : pct >= 55 ? "gold" : "red"} />
            </div>
            <div className="card p-4 bg-green-50 border-green-100">
              <h4 className="text-xs font-bold text-green-700 mb-2">Improvement Tips</h4>
              <ul className="space-y-1.5 text-[11px] text-green-600">
                <li>• Host national-level conferences and seminars</li>
                <li>• Publish research in high-impact journals</li>
                <li>• Build active alumni network and alumni portal</li>
                <li>• Engage media with research success stories</li>
                <li>• Partner with industry leaders for credibility</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
