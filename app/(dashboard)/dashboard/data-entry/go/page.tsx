"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { DEFAULT_GO, type GOFormData, PLACEMENT_HISTORY } from "@/lib/shoolini-data";
import { calculateGO } from "@/lib/nirf-engine";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Save, RefreshCw, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min = 0, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <input
      type="number" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default function GOPage() {
  const { data, updateGO, isLoaded } = useNIRFData();
  const [form, setForm] = useState<GOFormData>(DEFAULT_GO);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) setForm(data.go);
  }, [isLoaded, data.go]);

  const goResult = calculateGO(form);
  const totalGrad = form.ugGraduating + form.pgGraduating;
  const totalPlaced = form.ugPlaced + form.pgPlaced;
  const totalHigher = form.ugHigherStudies + form.pgHigherStudies;
  const totalOutcomes = totalPlaced + totalHigher + form.ugSelfEmployed;
  const outcomeRate = totalGrad > 0 ? (totalOutcomes / totalGrad) * 100 : 0;
  const ugPlacementRate = form.ugGraduating > 0 ? (form.ugPlaced / form.ugGraduating) * 100 : 0;
  const pgPlacementRate = form.pgGraduating > 0 ? (form.pgPlaced / form.pgGraduating) * 100 : 0;

  function set<K extends keyof GOFormData>(key: K, val: GOFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    updateGO(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="GO — Graduation Outcomes" subtitle="Placement rate, median salary and PhD output. Pre-filled from NIRF 2026 PDF." />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Data from NIRF PDF:</span> Placement data for 2022-23, 2023-24, and 2024-25 batches.
                Current form shows 2024-25 data (latest). NIRF uses the most recent 3-year average for scoring.
              </p>
            </div>

            {/* UG Placements */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <GraduationCap size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">UG Placement & Outcomes (2024-25)</h3>
                    <p className="text-xs text-slate-400">4-year program graduates, batch of 2024-25</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${ugPlacementRate >= 60 ? "text-green-600" : "text-amber-600"}`}>
                  {ugPlacementRate >= 60 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {ugPlacementRate.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total UG Graduates" hint="Students who graduated this batch">
                  <NumInput value={form.ugGraduating} onChange={(v) => set("ugGraduating", v)} />
                </Field>
                <Field label="Placed in Suitable Employment" hint="Placed in relevant jobs (not any job)">
                  <NumInput value={form.ugPlaced} onChange={(v) => set("ugPlaced", Math.min(v, form.ugGraduating))} />
                  <p className={`text-[11px] mt-1 font-semibold ${ugPlacementRate >= 60 ? "text-green-600" : "text-amber-600"}`}>
                    Placement rate: {ugPlacementRate.toFixed(1)}%
                  </p>
                </Field>
                <Field label="Pursuing Higher Studies" hint="Enrolled in M.Tech/MBA/abroad">
                  <NumInput value={form.ugHigherStudies} onChange={(v) => set("ugHigherStudies", v)} />
                </Field>
                <Field label="Self-Employed / Entrepreneurship">
                  <NumInput value={form.ugSelfEmployed} onChange={(v) => set("ugSelfEmployed", v)} />
                </Field>
                <Field label="Median Annual Salary (₹)" hint="Median salary of placed students">
                  <NumInput value={form.ugMedianSalary} onChange={(v) => set("ugMedianSalary", v)} step={50000} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    ₹{(form.ugMedianSalary/100000).toFixed(2)}L per annum
                    {" · "}Target: ₹7L
                    {form.ugMedianSalary >= 700000 ? " ✓" : ` (gap: ₹${((700000-form.ugMedianSalary)/100000).toFixed(1)}L)`}
                  </p>
                </Field>
              </div>
            </div>

            {/* PG Placements */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GraduationCap size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">PG Placement & Outcomes (2024-25)</h3>
                    <p className="text-xs text-slate-400">2-year program graduates, batch of 2024-25</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${pgPlacementRate >= 60 ? "text-green-600" : "text-amber-600"}`}>
                  {pgPlacementRate >= 60 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {pgPlacementRate.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total PG Graduates">
                  <NumInput value={form.pgGraduating} onChange={(v) => set("pgGraduating", v)} />
                </Field>
                <Field label="Placed in Suitable Employment">
                  <NumInput value={form.pgPlaced} onChange={(v) => set("pgPlaced", Math.min(v, form.pgGraduating))} />
                  <p className={`text-[11px] mt-1 font-semibold ${pgPlacementRate >= 60 ? "text-green-600" : "text-amber-600"}`}>
                    PG placement rate: {pgPlacementRate.toFixed(1)}%
                  </p>
                </Field>
                <Field label="Pursuing Higher Studies (PhD/abroad)">
                  <NumInput value={form.pgHigherStudies} onChange={(v) => set("pgHigherStudies", v)} />
                </Field>
                <Field label="Median Annual Salary (₹)" hint="Median salary of placed PG students">
                  <NumInput value={form.pgMedianSalary} onChange={(v) => set("pgMedianSalary", v)} step={50000} />
                  <p className="text-[11px] text-slate-400 mt-1">₹{(form.pgMedianSalary/100000).toFixed(2)}L per annum</p>
                </Field>
              </div>
            </div>

            {/* PhD */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-5">PhD Graduates (2024-25)</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full-time PhD Graduated" hint="Awarded PhD in academic year 2024-25">
                  <NumInput value={form.phdGraduated} onChange={(v) => set("phdGraduated", v)} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    PhD rate: {totalGrad > 0 ? ((form.phdGraduated/totalGrad)*100).toFixed(1) : 0}% of total graduates
                    {" · "}Target: 15%+
                  </p>
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ year: "2022-23", val: 18 }, { year: "2023-24", val: 21 }, { year: "2024-25", val: 34 }].map((p) => (
                  <div key={p.year} className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs font-bold text-slate-600">{p.year}</p>
                    <p className="text-2xl font-bold text-purple-600">{p.val}</p>
                    <p className="text-[10px] text-slate-400">PhDs awarded</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement History */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">3-Year Placement History (from PDF)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 text-slate-500">Year</th>
                      <th className="text-right py-2 text-slate-500">Graduates</th>
                      <th className="text-right py-2 text-slate-500">Placed</th>
                      <th className="text-right py-2 text-slate-500">Rate</th>
                      <th className="text-right py-2 text-slate-500">Higher Studies</th>
                      <th className="text-right py-2 text-slate-500">Median Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLACEMENT_HISTORY.map((p) => (
                      <tr key={p.year} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2 font-semibold text-slate-700">{p.year}</td>
                        <td className="py-2 text-right">{p.ugGrad + p.pgGrad}</td>
                        <td className="py-2 text-right font-semibold text-green-700">{p.ugPlaced + p.pgPlaced}</td>
                        <td className="py-2 text-right">
                          <span className={`font-bold ${((p.ugPlaced+p.pgPlaced)/(p.ugGrad+p.pgGrad)*100) >= 60 ? "text-green-600" : "text-amber-600"}`}>
                            {(((p.ugPlaced+p.pgPlaced)/(p.ugGrad+p.pgGrad))*100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2 text-right text-blue-600">{p.ugHigher + p.pgHigher}</td>
                        <td className="py-2 text-right font-semibold">₹{(p.ugSalary/100000).toFixed(1)}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? "Saved!" : "Save GO Data"}
              </button>
              <button onClick={() => { setForm(DEFAULT_GO); updateGO(DEFAULT_GO); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-5 rounded-xl flex items-center gap-2">
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Score Panel */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-1">Live GO Score</h3>
              <p className="text-[11px] text-slate-400 mb-4">GO = 20 pts (20% weight)</p>

              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-yellow-600">{goResult.score.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">out of 20 points</div>
                <Progress value={goResult.score} max={20} color="gold" />
              </div>

              <div className="space-y-2">
                {[
                  { label: "Outcome Rate", val: goResult.breakdown.outcomes, max: 12, hint: `${outcomeRate.toFixed(1)}% graduated with outcome` },
                  { label: "Median Salary", val: goResult.breakdown.salary, max: 6, hint: `₹${(form.ugMedianSalary/100000).toFixed(1)}L / ₹7L target` },
                  { label: "PhD Production", val: goResult.breakdown.phd, max: 2, hint: `${form.phdGraduated} PhDs, ${totalGrad > 0 ? ((form.phdGraduated/totalGrad)*100).toFixed(0) : 0}% rate` },
                ].map((c) => (
                  <div key={c.label} className="p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{c.label}</span>
                      <span className="font-bold text-slate-900">{c.val.toFixed(1)} / {c.max}</span>
                    </div>
                    <Progress value={c.val} max={c.max} color="gold" />
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.hint}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-700 mb-2">Outcome Summary</p>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between"><span>Total graduates:</span><span className="font-semibold">{totalGrad}</span></div>
                    <div className="flex justify-between"><span>Placed:</span><span className="font-semibold text-green-600">{totalPlaced}</span></div>
                    <div className="flex justify-between"><span>Higher studies:</span><span className="font-semibold text-blue-600">{totalHigher}</span></div>
                    <div className="flex justify-between"><span>PhD graduates:</span><span className="font-semibold text-purple-600">{form.phdGraduated}</span></div>
                    <div className="flex justify-between border-t pt-1 mt-1 font-bold"><span>Outcome rate:</span><span className={outcomeRate >= 75 ? "text-green-600" : "text-amber-600"}>{outcomeRate.toFixed(1)}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
