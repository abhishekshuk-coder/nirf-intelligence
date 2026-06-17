"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { DEFAULT_PR, type PRFormData } from "@/lib/shoolini-data";
import { calculatePR } from "@/lib/nirf-engine";
import { Progress } from "@/components/ui/progress";
import { Star, Save, RefreshCw, CheckCircle, Info } from "lucide-react";

function ScoreSlider({ label, value, onChange, hint }: {
  label: string; value: number; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className={`text-lg font-extrabold ${value >= 70 ? "text-green-600" : value >= 50 ? "text-amber-600" : "text-red-600"}`}>
          {value}
        </span>
      </div>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0 — Unknown</span>
        <span>50 — Average</span>
        <span>100 — Top Ranked</span>
      </div>
    </div>
  );
}

export default function PRPage() {
  const { data, updatePR, isLoaded } = useNIRFData();
  const [form, setForm] = useState<PRFormData>(DEFAULT_PR);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) setForm(data.pr);
  }, [isLoaded, data.pr]);

  const prResult = calculatePR(form);

  function set<K extends keyof PRFormData>(key: K, val: PRFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    updatePR(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="PR — Peer Perception" subtitle="Reputation scores from academic community, employers and alumni. Survey-based data." />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
              <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Survey-Based Metric</p>
                <p className="text-xs text-amber-700 mt-1">
                  PR scores come from NIRF's perception surveys of academic peers, employers, and alumni.
                  The scores below are your estimates for planning. The actual score is determined by survey respondents,
                  not by the university. Use this to understand your likely PR range and what to improve.
                  Current values are estimated based on your institution's national profile.
                </p>
              </div>
            </div>

            <div className="card p-6 space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Star size={16} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Reputation Scores (0–100)</h3>
                  <p className="text-xs text-slate-400">Adjust sliders to reflect your estimated survey score</p>
                </div>
              </div>

              <ScoreSlider
                label="Academic Reputation"
                value={form.academicReputation}
                onChange={(v) => set("academicReputation", v)}
                hint="Weight: 45% of PR score. How academic peers rate your institution nationally. Improve by publishing more research, increasing PhD output, faculty awards."
              />

              <ScoreSlider
                label="Employer Reputation"
                value={form.employerReputation}
                onChange={(v) => set("employerReputation", v)}
                hint="Weight: 35% of PR score. How recruiters and employers rate your graduates. Improve by boosting placement rates, salary packages, and industry connections."
              />

              <ScoreSlider
                label="Alumni Engagement Score"
                value={form.alumniEngagement}
                onChange={(v) => set("alumniEngagement", v)}
                hint="Weight: 20% of PR score. How engaged and satisfied alumni are. Improve by conducting alumni surveys, building alumni network, organizing events."
              />

              <ScoreSlider
                label="Media & Online Visibility"
                value={form.mediaVisibility}
                onChange={(v) => set("mediaVisibility", v)}
                hint="Informal metric — not directly scored by NIRF but correlates with awareness. Track press coverage, social media reach, rankings publications."
              />
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">How to Improve PR Score</h3>
              <div className="space-y-3">
                {[
                  { title: "Increase Research Output", desc: "More Scopus/WoS publications directly improve academic reputation. Target 5+ papers per faculty annually.", impact: "High", color: "blue" },
                  { title: "Improve Placement Packages", desc: "Higher median salaries and placements in top companies dramatically improve employer perception.", impact: "High", color: "blue" },
                  { title: "Faculty Awards & Recognition", desc: "National awards, fellowships, and keynote invitations increase academic visibility.", impact: "Medium", color: "amber" },
                  { title: "Alumni Surveys & Network", desc: "Regular alumni engagement surveys improve the alumni score. Build a strong LinkedIn alumni group.", impact: "Medium", color: "amber" },
                  { title: "Media Coverage & Rankings", desc: "Participate in QS, THE, and Outlook rankings. Get featured in education media for patents and research.", impact: "Low", color: "green" },
                ].map((t) => (
                  <div key={t.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
                      t.color === "blue" ? "bg-blue-100 text-blue-700" :
                      t.color === "amber" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>{t.impact}</span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2">
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? "Saved!" : "Save PR Estimates"}
              </button>
              <button onClick={() => { setForm(DEFAULT_PR); updatePR(DEFAULT_PR); }} className="bg-slate-100 text-slate-600 font-medium py-3 px-5 rounded-xl flex items-center gap-2">
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Score Panel */}
          <div>
            <div className="card p-5 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-1">Estimated PR Score</h3>
              <p className="text-[11px] text-slate-400 mb-4">PR = 10 pts (10% weight)</p>

              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-green-600">{prResult.score.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">out of 10 points</div>
                <Progress value={prResult.score} max={10} color="green" />
              </div>

              <div className="space-y-3">
                {[
                  { label: "Academic Reputation", val: form.academicReputation, weight: "45%", color: "blue" },
                  { label: "Employer Reputation", val: form.employerReputation, weight: "35%", color: "amber" },
                  { label: "Alumni Engagement", val: form.alumniEngagement, weight: "20%", color: "green" },
                ].map((c) => (
                  <div key={c.label} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium text-slate-700">{c.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{c.weight}</span>
                        <span className="font-bold text-slate-900">{c.val}/100</span>
                      </div>
                    </div>
                    <Progress value={c.val} max={100} color={c.color as "blue" | "gold" | "green"} />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-800 mb-1">Weighted Calculation</p>
                <div className="text-[11px] text-blue-700 space-y-1">
                  <div>Academic: {form.academicReputation} × 0.45 = {(form.academicReputation*0.45).toFixed(1)}</div>
                  <div>Employer: {form.employerReputation} × 0.35 = {(form.employerReputation*0.35).toFixed(1)}</div>
                  <div>Alumni: {form.alumniEngagement} × 0.20 = {(form.alumniEngagement*0.20).toFixed(1)}</div>
                  <div className="border-t border-blue-200 pt-1 font-bold">
                    PR Score = {((form.academicReputation*0.45 + form.employerReputation*0.35 + form.alumniEngagement*0.20)/10).toFixed(2)} / 10
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs font-semibold text-amber-800">Industry Benchmark</p>
                <p className="text-xs text-amber-700 mt-1">
                  Top 50 Engineering colleges typically score 7-9/10 in PR.
                  Current estimate: {prResult.score.toFixed(1)}/10 places you in the
                  {prResult.score >= 7 ? " competitive range" : " below-average range"}.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
