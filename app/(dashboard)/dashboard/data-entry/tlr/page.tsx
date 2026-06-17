"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { DEFAULT_TLR, type TLRFormData, INTAKE } from "@/lib/shoolini-data";
import { calculateTLR } from "@/lib/nirf-engine";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, DollarSign, Save, RefreshCw, CheckCircle, Info } from "lucide-react";

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
      type="number" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}

export default function TLRPage() {
  const { data, updateTLR, isLoaded } = useNIRFData();
  const [form, setForm] = useState<TLRFormData>(DEFAULT_TLR);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) setForm(data.tlr);
  }, [isLoaded, data.tlr]);

  const tlrResult = calculateTLR(form);
  const totalExp = form.salaries + form.maintenance + form.libraryExpenditure + form.labExpenditure + form.seminars + form.capitalOther;
  const libPct = totalExp > 0 ? ((form.libraryExpenditure / totalExp) * 100).toFixed(1) : "0.0";
  const labPct = totalExp > 0 ? ((form.labExpenditure / totalExp) * 100).toFixed(1) : "0.0";
  const fsr = (form.ugStudents + form.pgStudents * 1.5 + form.phdStudents * 2) / Math.max(form.totalFaculty, 1);

  function set<K extends keyof TLRFormData>(key: K, val: TLRFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    updateTLR(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setForm(DEFAULT_TLR);
    updateTLR(DEFAULT_TLR);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="TLR — Teaching, Learning & Resources" subtitle="Enter faculty, student strength and financial data. Score updates live." />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* Source Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Data Source:</span> Values pre-filled from your NIRF submission.
                Financial data is for the latest academic year. Edit any value to recalculate score.
              </p>
            </div>

            {/* Faculty Details */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Faculty Details</h3>
                  <p className="text-xs text-slate-400">Regular faculty on payroll, current academic year</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Faculty (Currently Working)" hint="From NIRF PDF: 75 regular faculty">
                  <NumInput value={form.totalFaculty} onChange={(v) => set("totalFaculty", v)} min={1} max={500} />
                </Field>
                <Field label="Faculty with Ph.D" hint="From NIRF PDF: 64 currently working with Ph.D">
                  <NumInput value={form.phdFaculty} onChange={(v) => set("phdFaculty", Math.min(v, form.totalFaculty))} min={0} max={form.totalFaculty} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ph.D ratio: <span className="font-semibold text-slate-600">{form.totalFaculty > 0 ? ((form.phdFaculty / form.totalFaculty) * 100).toFixed(1) : 0}%</span>
                  </p>
                </Field>
                <Field label="Average Faculty Experience (Months)" hint="Across all regular faculty">
                  <NumInput value={form.avgExperienceMonths} onChange={(v) => set("avgExperienceMonths", v)} min={0} max={600} />
                  <p className="text-[11px] text-slate-400 mt-1">≈ {(form.avgExperienceMonths / 12).toFixed(1)} years</p>
                </Field>
              </div>
            </div>

            {/* Student Strength */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <BookOpen size={16} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Student Strength (All Years)</h3>
                  <p className="text-xs text-slate-400">Total enrolled students across all years in all programs</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="UG Students (4-Year Programs)" hint="All 4 batches combined">
                  <NumInput value={form.ugStudents} onChange={(v) => set("ugStudents", v)} min={0} max={10000} />
                  <p className="text-[11px] text-slate-400 mt-1">Sanctioned intake 2024-25: {INTAKE.ug["2024-25"]}</p>
                </Field>
                <Field label="PG Students (2-Year Programs)" hint="All batches combined">
                  <NumInput value={form.pgStudents} onChange={(v) => set("pgStudents", v)} min={0} max={2000} />
                  <p className="text-[11px] text-slate-400 mt-1">Sanctioned intake 2024-25: {INTAKE.pg["2024-25"]}</p>
                </Field>
                <Field label="PhD Students (Full-time)" hint="Currently enrolled">
                  <NumInput value={form.phdStudents} onChange={(v) => set("phdStudents", v)} min={0} max={500} />
                </Field>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-400">Total Students</p>
                    <p className="font-bold text-slate-800 text-lg">{(form.ugStudents + form.pgStudents + form.phdStudents).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Weighted FSR</p>
                    <p className={`font-bold text-lg ${fsr <= 20 ? "text-green-600" : fsr <= 25 ? "text-amber-600" : "text-red-600"}`}>
                      {fsr.toFixed(1)}:1
                    </p>
                    <p className="text-[10px] text-slate-400">Target: ≤20:1</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className={`font-semibold text-sm ${fsr <= 20 ? "text-green-600" : fsr <= 25 ? "text-amber-600" : "text-red-600"}`}>
                      {fsr <= 20 ? "Excellent" : fsr <= 25 ? "Acceptable" : "High — Hire more faculty"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Resources */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <DollarSign size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Financial Resources 2024-25</h3>
                  <p className="text-xs text-slate-400">Annual expenditure in Indian Rupees (₹)</p>
                </div>
              </div>

              <div className="mb-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                <span className="font-semibold text-slate-700">Note:</span> Library expenditure target is 5%+ of total and lab equipment 7%+ for maximum TLR score.
                Current library: <span className={`font-semibold ${parseFloat(libPct) >= 5 ? "text-green-600" : "text-red-600"}`}>{libPct}%</span>
                {" "}| Lab: <span className={`font-semibold ${parseFloat(labPct) >= 7 ? "text-green-600" : "text-amber-600"}`}>{labPct}%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Staff Salaries (₹)" hint="All regular & contractual faculty salaries">
                  <NumInput value={form.salaries} onChange={(v) => set("salaries", v)} step={100000} />
                  <p className="text-[11px] text-slate-400 mt-1">₹{(form.salaries/10000000).toFixed(2)} Cr</p>
                </Field>
                <Field label="Maintenance & Other Operational (₹)" hint="Utilities, repairs, admin">
                  <NumInput value={form.maintenance} onChange={(v) => set("maintenance", v)} step={100000} />
                  <p className="text-[11px] text-slate-400 mt-1">₹{(form.maintenance/10000000).toFixed(2)} Cr</p>
                </Field>
                <Field label="Library Expenditure (₹)" hint="Books, journals, databases, digital resources">
                  <NumInput value={form.libraryExpenditure} onChange={(v) => set("libraryExpenditure", v)} step={100000} />
                  <p className={`text-[11px] mt-1 font-semibold ${parseFloat(libPct) >= 5 ? "text-green-600" : "text-red-600"}`}>
                    {libPct}% of total — {parseFloat(libPct) >= 5 ? "✓ Good" : `⚠ Below 5% target (gap: ₹${Math.round((totalExp*0.05 - form.libraryExpenditure)/100000)}L)`}
                  </p>
                </Field>
                <Field label="Lab Equipment & Workshops (₹)" hint="New equipment, lab setup, workshop tools">
                  <NumInput value={form.labExpenditure} onChange={(v) => set("labExpenditure", v)} step={100000} />
                  <p className={`text-[11px] mt-1 font-semibold ${parseFloat(labPct) >= 7 ? "text-green-600" : "text-amber-600"}`}>
                    {labPct}% of total — {parseFloat(labPct) >= 7 ? "✓ Good" : "Consider increasing"}
                  </p>
                </Field>
                <Field label="Seminars, Conferences & Training (₹)">
                  <NumInput value={form.seminars} onChange={(v) => set("seminars", v)} step={10000} />
                </Field>
                <Field label="Other Capital Expenditure (₹)">
                  <NumInput value={form.capitalOther} onChange={(v) => set("capitalOther", v)} step={10000} />
                </Field>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">Total Annual Expenditure:</span>
                  <span className="font-bold text-slate-900 text-lg">₹{(totalExp/10000000).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Per student: ₹{form.ugStudents+form.pgStudents+form.phdStudents > 0 ? ((totalExp/(form.ugStudents+form.pgStudents+form.phdStudents))/1000).toFixed(0) : 0}K</span>
                  <span>Per faculty: ₹{form.totalFaculty > 0 ? ((totalExp/form.totalFaculty)/100000).toFixed(1) : 0}L</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? "Saved Successfully!" : "Save TLR Data"}
              </button>
              <button onClick={handleReset} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-5 rounded-xl flex items-center gap-2 transition-colors">
                <RefreshCw size={16} />
                Reset to PDF Data
              </button>
            </div>
          </div>

          {/* Live Score Panel */}
          <div className="space-y-4">
            {/* Score Card */}
            <div className="card p-5 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-1">Live TLR Score</h3>
              <p className="text-[11px] text-slate-400 mb-4">Updates as you type. Save to apply to dashboard.</p>

              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-blue-600">{tlrResult.score.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">out of 30 points</div>
                <div className="mt-2">
                  <Progress value={tlrResult.score} max={30} color="blue" />
                </div>
                <div className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                  tlrResult.score >= 24 ? "bg-green-50 text-green-700" :
                  tlrResult.score >= 18 ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {tlrResult.score >= 24 ? "Strong" : tlrResult.score >= 18 ? "Average" : "Needs Work"}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sub-component Breakdown</h4>

                <div className="space-y-2">
                  {[
                    { label: "Faculty-Student Ratio", val: tlrResult.breakdown.fsr, max: 10.5, hint: `FSR: ${fsr.toFixed(1)}:1` },
                    { label: "Faculty Qualification", val: tlrResult.breakdown.qualification, max: 9, hint: `${form.totalFaculty > 0 ? ((form.phdFaculty/form.totalFaculty)*100).toFixed(0) : 0}% PhD` },
                    { label: "Financial Resources", val: tlrResult.breakdown.financial, max: 10.5, hint: `₹${(totalExp/10000000).toFixed(1)} Cr total` },
                  ].map((c) => (
                    <div key={c.label} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{c.label}</span>
                        <span className="font-bold text-slate-900">{c.val.toFixed(1)} / {c.max}</span>
                      </div>
                      <Progress value={c.val} max={c.max} color="blue" />
                      <p className="text-[10px] text-slate-400 mt-1">{c.hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Key Gaps</h4>
                {parseFloat(libPct) < 5 && (
                  <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg">
                    📚 Library: {libPct}% of budget. Need ₹{Math.round((totalExp*0.05 - form.libraryExpenditure)/100000)}L more to reach 5% target.
                  </div>
                )}
                {fsr > 20 && (
                  <div className="bg-amber-50 text-amber-700 text-xs p-2.5 rounded-lg">
                    👥 FSR is {fsr.toFixed(1)}:1. Hire {Math.ceil((form.ugStudents+form.pgStudents*1.5+form.phdStudents*2)/20 - form.totalFaculty)} more faculty to reach 20:1.
                  </div>
                )}
                {parseFloat(libPct) >= 5 && fsr <= 20 && (
                  <div className="bg-green-50 text-green-700 text-xs p-2.5 rounded-lg">
                    ✓ All TLR sub-targets met.
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <p className="font-semibold mb-1">Sanctioned Intake (from PDF):</p>
                <p>UG: {Object.entries(INTAKE.ug).map(([y,v]) => `${y}: ${v}`).join(" | ")}</p>
                <p className="mt-1">PG: {Object.entries(INTAKE.pg).map(([y,v]) => `${y}: ${v}`).join(" | ")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
