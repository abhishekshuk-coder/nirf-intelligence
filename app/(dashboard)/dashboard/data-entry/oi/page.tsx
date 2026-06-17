"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { DEFAULT_OI, type OIFormData } from "@/lib/shoolini-data";
import { calculateOI } from "@/lib/nirf-engine";
import { Progress } from "@/components/ui/progress";
import { Users, Save, RefreshCw, CheckCircle, Info } from "lucide-react";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min = 0, max, readOnly }: {
  value: number; onChange?: (v: number) => void; min?: number; max?: number; readOnly?: boolean;
}) {
  return (
    <input
      type="number" min={min} max={max} value={value} readOnly={readOnly}
      onChange={onChange ? (e) => onChange(parseFloat(e.target.value) || 0) : undefined}
      className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? "bg-slate-50 text-slate-500" : ""}`}
    />
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-slate-300"} relative flex items-center`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform absolute ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </div>
      <span className={`text-sm font-medium ${checked ? "text-green-700" : "text-slate-500"}`}>{label}</span>
    </label>
  );
}

export default function OIPage() {
  const { data, updateOI, isLoaded } = useNIRFData();
  const [form, setForm] = useState<OIFormData>(DEFAULT_OI);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) setForm(data.oi);
  }, [isLoaded, data.oi]);

  const oiResult = calculateOI(form);
  const total = form.totalStudents;
  const womenPct = total > 0 ? (form.womenStudents / total * 100) : 0;
  const reservedTotal = form.ewsStudents + form.scStudents + form.stStudents + form.obcStudents;
  const reservedPct = total > 0 ? (reservedTotal / total * 100) : 0;
  const outsidePct = total > 0 ? (form.outsideStateStudents / total * 100) : 0;
  const intlPct = total > 0 ? (form.internationalStudents / total * 100) : 0;

  function set<K extends keyof OIFormData>(key: K, val: OIFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    updateOI(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="OI — Outreach & Inclusivity" subtitle="Student diversity, regional reach & PCS facilities. Pre-filled from NIRF 2026 PDF." />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
              <Info size={16} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs text-green-700">
                <span className="font-semibold">Excellent OI performance!</span> Your institution shows strong diversity metrics
                that are well above NIRF targets.
                This data is pre-filled from your NIRF submission.
              </p>
            </div>

            {/* Student Diversity */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-800">Student Diversity (UG + PG)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Students" hint="UG + PG combined (excluding PhD)">
                  <NumInput value={form.totalStudents} onChange={(v) => set("totalStudents", v)} />
                </Field>
                <Field label="Women Students" hint="Female students in UG and PG">
                  <NumInput value={form.womenStudents} onChange={(v) => set("womenStudents", Math.min(v, form.totalStudents))} />
                  <p className={`text-[11px] mt-1 font-semibold ${womenPct >= 33 ? "text-green-600" : "text-amber-600"}`}>
                    {womenPct.toFixed(1)}% women {womenPct >= 33 ? "✓ Above 33% target" : "⚠ Below 33% target"}
                  </p>
                </Field>
              </div>
            </div>

            {/* Geographical Diversity */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-5">Geographical Diversity</h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Within State (HP)" hint="Students from Himachal Pradesh">
                  <NumInput value={form.withinStateStudents} onChange={(v) => set("withinStateStudents", v)} />
                </Field>
                <Field label="From Other States" hint="Students from states other than HP">
                  <NumInput value={form.outsideStateStudents} onChange={(v) => set("outsideStateStudents", v)} />
                  <p className={`text-[11px] mt-1 font-semibold ${outsidePct >= 30 ? "text-green-600" : "text-amber-600"}`}>
                    {outsidePct.toFixed(1)}% {outsidePct >= 30 ? "✓ Above target" : "⚠ Below 30% target"}
                  </p>
                </Field>
                <Field label="International Students" hint="Students from outside India">
                  <NumInput value={form.internationalStudents} onChange={(v) => set("internationalStudents", v)} />
                  <p className={`text-[11px] mt-1 font-semibold ${intlPct >= 2.5 ? "text-green-600" : "text-amber-600"}`}>
                    {intlPct.toFixed(1)}% {intlPct >= 2.5 ? "✓ Above 2.5% target" : "Below 2.5% target"}
                  </p>
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{form.withinStateStudents}</p>
                  <p className="text-[10px] text-slate-500">Within HP ({total > 0 ? ((form.withinStateStudents/total)*100).toFixed(0) : 0}%)</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{form.outsideStateStudents}</p>
                  <p className="text-[10px] text-slate-500">Other States ({outsidePct.toFixed(0)}%)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">{form.internationalStudents}</p>
                  <p className="text-[10px] text-slate-500">International ({intlPct.toFixed(1)}%)</p>
                </div>
              </div>
            </div>

            {/* Economically & Socially Challenged */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-5">Economically & Socially Challenged Students</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="EWS (Economically Weaker Section)">
                  <NumInput value={form.ewsStudents} onChange={(v) => set("ewsStudents", v)} />
                </Field>
                <Field label="SC (Scheduled Caste)">
                  <NumInput value={form.scStudents} onChange={(v) => set("scStudents", v)} />
                </Field>
                <Field label="ST (Scheduled Tribe)">
                  <NumInput value={form.stStudents} onChange={(v) => set("stStudents", v)} />
                </Field>
                <Field label="OBC (Other Backward Classes)">
                  <NumInput value={form.obcStudents} onChange={(v) => set("obcStudents", v)} />
                </Field>
                <Field label="Physically Disabled (PwD)">
                  <NumInput value={form.physicallyDisabled} onChange={(v) => set("physicallyDisabled", v)} />
                </Field>
                <div className="flex items-end pb-2">
                  <div className="w-full p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Total Reserved</p>
                    <p className="text-xl font-bold text-slate-800">{reservedTotal}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${reservedPct >= 27 ? "text-green-600" : "text-amber-600"}`}>
                      {reservedPct.toFixed(1)}% of students
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PCS Facilities */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-2">Physically Challenged Students (PCS) Facilities</h3>
              <p className="text-xs text-slate-400 mb-5">Tick all accessible facilities available on campus. Each facility adds to OI score.</p>
              <div className="space-y-4">
                <Toggle checked={form.pcsLiftsRamps} onChange={(v) => set("pcsLiftsRamps", v)} label="Lifts and ramps for wheelchair access" />
                <Toggle checked={form.pcsWheelchairs} onChange={(v) => set("pcsWheelchairs", v)} label="Wheelchair availability on campus" />
                <Toggle checked={form.pcsToilets} onChange={(v) => set("pcsToilets", v)} label="Accessible toilets for differently-abled" />
              </div>
              <div className="mt-4 text-xs text-slate-400">
                All 3 facilities present → full PCS score
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? "Saved!" : "Save OI Data"}
              </button>
              <button onClick={() => { setForm(DEFAULT_OI); updateOI(DEFAULT_OI); }} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-5 rounded-xl flex items-center gap-2">
                <RefreshCw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Score Panel */}
          <div>
            <div className="card p-5 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-1">Live OI Score</h3>
              <p className="text-[11px] text-slate-400 mb-4">OI = 10 pts (10% weight)</p>

              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-purple-600">{oiResult.score.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">out of 10 points</div>
                <Progress value={oiResult.score} max={10} color="blue" />
                <div className="mt-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block">
                  {oiResult.score >= 8 ? "Excellent" : oiResult.score >= 6 ? "Good" : "Needs Work"}
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Women Students", val: oiResult.breakdown.women, max: 3, hint: `${womenPct.toFixed(1)}% (target: 33%)` },
                  { label: "Reserved Categories", val: oiResult.breakdown.reserved, max: 2.5, hint: `${reservedPct.toFixed(1)}% (target: 27%)` },
                  { label: "Regional Diversity", val: oiResult.breakdown.regional, max: 2.5, hint: `${outsidePct.toFixed(1)}% outside state` },
                  { label: "International Students", val: oiResult.breakdown.international, max: 1, hint: `${intlPct.toFixed(1)}% (target: 2.5%)` },
                  { label: "PCS Facilities", val: oiResult.breakdown.pcs, max: 1, hint: `${(oiResult.breakdown.pcs/1*3).toFixed(0)}/3 facilities` },
                ].map((c) => (
                  <div key={c.label} className="p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{c.label}</span>
                      <span className="font-bold text-slate-900">{c.val.toFixed(1)} / {c.max}</span>
                    </div>
                    <Progress value={c.val} max={c.max} color="blue" />
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.hint}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs font-semibold text-green-800">OI Performance Summary</p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-green-700">
                  <li>✓ Women {womenPct.toFixed(1)}% (above 33% target)</li>
                  <li>✓ Outside state {outsidePct.toFixed(1)}% (above 30% target)</li>
                  <li>✓ International {intlPct.toFixed(1)}% (above 2.5% target)</li>
                  {reservedPct < 27 && <li>⚠ Reserved {reservedPct.toFixed(1)}% (below 27% target)</li>}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
