"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { DEFAULT_RPC, type RPCFormData, RESEARCH_HISTORY, PATENT_HISTORY } from "@/lib/shoolini-data";
import { calculateRPC } from "@/lib/nirf-engine";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, Save, RefreshCw, CheckCircle, AlertTriangle, Info } from "lucide-react";

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
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

export default function RPCPage() {
  const { data, updateRPC, isLoaded } = useNIRFData();
  const [form, setForm] = useState<RPCFormData>(DEFAULT_RPC);
  const [saved, setSaved] = useState(false);
  const faculty = data?.tlr?.totalFaculty ?? 75;

  useEffect(() => {
    if (isLoaded) setForm(data.rpc);
  }, [isLoaded, data.rpc]);

  const rpcResult = calculateRPC(form, faculty);
  const totalPapers = form.scopusPapers + form.wosPapers;
  const papersPerFaculty = faculty > 0 ? (totalPapers / faculty) : 0;
  const citationsPerPaper = totalPapers > 0 ? (form.citations / totalPapers) : 0;
  const grantsPerFaculty = faculty > 0 ? (form.patentsGranted / faculty) : 0;
  const researchPerFaculty = faculty > 0 ? (form.sponsoredAmount / faculty) : 0;
  const missingPublications = totalPapers === 0;

  function set<K extends keyof RPCFormData>(key: K, val: RPCFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    updateRPC(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setForm(DEFAULT_RPC);
    updateRPC(DEFAULT_RPC);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="RPC — Research & Professional Practice" subtitle="Publications, patents, funded research & consultancy. This is worth 30 points — second highest weight." />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            {/* Critical Alert */}
            {missingPublications && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800 text-sm">Publications & Citations NOT in NIRF PDF</p>
                  <p className="text-red-700 text-xs mt-1">
                    Scopus/WoS papers and citations are submitted separately via the NIRF portal (not captured in the PDF).
                    You MUST enter these manually. They contribute ~55% of the RPC score.
                    Based on 75 faculty and your patent activity, you likely have 300-500 Scopus publications.
                    Check your Scopus institutional profile or contact your library to get the count.
                  </p>
                </div>
              </div>
            )}

            {/* Publications & Citations */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <FlaskConical size={16} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Publications & Citations</h3>
                  <p className="text-xs text-red-500 font-medium">⚠ Must enter manually — NOT in NIRF PDF</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Scopus-indexed Papers" hint="Count of papers in Scopus database (3-year total)" required>
                  <NumInput value={form.scopusPapers} onChange={(v) => set("scopusPapers", v)} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Per faculty: {faculty > 0 ? (form.scopusPapers/faculty).toFixed(1) : 0}
                    {" · "}Target: 5+ per faculty
                  </p>
                </Field>
                <Field label="Web of Science Papers" hint="WoS indexed papers (3-year total)" required>
                  <NumInput value={form.wosPapers} onChange={(v) => set("wosPapers", v)} />
                </Field>
                <Field label="Total Citations" hint="Total citations to all published papers" required>
                  <NumInput value={form.citations} onChange={(v) => set("citations", v)} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Per paper: {totalPapers > 0 ? citationsPerPaper.toFixed(1) : 0}
                    {" · "}Target: 8+ per paper
                  </p>
                </Field>
                <Field label="H-Index (Overall)" hint="Hirsch index of the institution">
                  <NumInput value={form.hIndex} onChange={(v) => set("hIndex", v)} />
                </Field>
              </div>
            </div>

            {/* Patents — Pre-filled from PDF */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <FlaskConical size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Patents (IPR)</h3>
                    <p className="text-xs text-slate-400">Pre-filled from NIRF PDF submission 2024</p>
                  </div>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">
                  Excellent Performance
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Patents Published (2024)" hint="Applications published by IPO in 2024">
                  <NumInput value={form.patentsPublished} onChange={(v) => set("patentsPublished", v)} />
                  <p className="text-[11px] text-slate-400 mt-1">2023: 75 | 2022: 69</p>
                </Field>
                <Field label="Patents Granted (2024)" hint="Patents actually granted/approved in 2024">
                  <NumInput value={form.patentsGranted} onChange={(v) => set("patentsGranted", v)} />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Per faculty: <span className="font-semibold text-green-600">{grantsPerFaculty.toFixed(2)}</span>
                    {" · "}Target: 0.4+
                    {grantsPerFaculty >= 0.4 && " ✓ Excellent!"}
                  </p>
                </Field>
              </div>
              {/* Patent History */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {PATENT_HISTORY.map((p) => (
                  <div key={p.year} className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs font-bold text-slate-600">{p.year}</p>
                    <p className="text-lg font-bold text-blue-600">{p.published}</p>
                    <p className="text-[10px] text-slate-400">published</p>
                    <p className="text-base font-bold text-green-600">{p.granted}</p>
                    <p className="text-[10px] text-slate-400">granted</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored Research — Pre-filled */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <FlaskConical size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Sponsored Research Projects</h3>
                  <p className="text-xs text-slate-400">3-year average used for scoring (2022-23 to 2024-25)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Number of Projects (Current Year)" hint="Ongoing sponsored research projects 2024-25">
                  <NumInput value={form.sponsoredProjects} onChange={(v) => set("sponsoredProjects", v)} />
                </Field>
                <Field label="3-Year Average Amount (₹)" hint="Average of 2022-23, 2023-24, 2024-25">
                  <NumInput value={form.sponsoredAmount} onChange={(v) => set("sponsoredAmount", v)} step={100000} />
                  <p className="text-[11px] text-slate-400 mt-1">₹{(form.sponsoredAmount/100000).toFixed(1)}L per year avg</p>
                </Field>
              </div>

              {/* Research History Alert */}
              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs font-bold text-red-700 mb-2">⚠ Critical Drop in Research Funding</p>
                <div className="space-y-1">
                  {RESEARCH_HISTORY.map((r) => (
                    <div key={r.year} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{r.year}</span>
                      <span className="text-slate-500">{r.projects} projects</span>
                      <span className={`font-bold ${r.amount > 5000000 ? "text-green-600" : "text-red-600"}`}>
                        ₹{(r.amount/100000).toFixed(1)}L
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-red-600 mt-2 font-medium">
                  3-year avg: ₹{(RESEARCH_HISTORY.reduce((s,r) => s+r.amount,0)/3/100000).toFixed(1)}L.
                  Need to recover 2023-24 level funding urgently.
                </p>
              </div>
            </div>

            {/* Consultancy */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-5">Consultancy Revenue</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Consultancy Projects" hint="Number of paid consultancy assignments">
                  <NumInput value={form.consultancyProjects} onChange={(v) => set("consultancyProjects", v)} />
                </Field>
                <Field label="Consultancy Revenue (₹)" hint="Total revenue from consultancy services">
                  <NumInput value={form.consultancyRevenue} onChange={(v) => set("consultancyRevenue", v)} step={100000} />
                </Field>
              </div>
              {form.consultancyRevenue === 0 && (
                <div className="mt-3 bg-amber-50 text-amber-700 text-xs p-3 rounded-lg">
                  No consultancy revenue. Even ₹10-20L in consultancy can add 0.5-1 point to RPC.
                  Explore consulting opportunities with local industries.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                {saved ? "Saved!" : "Save RPC Data"}
              </button>
              <button onClick={handleReset} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 px-5 rounded-xl flex items-center gap-2 transition-colors">
                <RefreshCw size={16} />
                Reset to PDF Data
              </button>
            </div>
          </div>

          {/* Score Panel */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-1">Live RPC Score</h3>
              <p className="text-[11px] text-slate-400 mb-4">RPC = 30 pts. Most impactful parameter.</p>

              <div className="text-center mb-5">
                <div className="text-5xl font-extrabold text-red-600">{rpcResult.score.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">out of 30 points</div>
                <Progress value={rpcResult.score} max={30} color="red" />
                {missingPublications && (
                  <p className="text-[11px] text-red-600 font-semibold mt-2">Score limited — add publications</p>
                )}
              </div>

              <div className="space-y-2">
                {[
                  { label: "Publications", val: rpcResult.breakdown.publications, max: 9, hint: `${papersPerFaculty.toFixed(1)}/faculty` },
                  { label: "Citations", val: rpcResult.breakdown.citations, max: 7.5, hint: `${citationsPerPaper.toFixed(1)}/paper` },
                  { label: "Patents", val: rpcResult.breakdown.patents, max: 6, hint: `${grantsPerFaculty.toFixed(2)} grants/faculty` },
                  { label: "Research Projects", val: rpcResult.breakdown.research, max: 4.5, hint: `₹${(researchPerFaculty/100000).toFixed(1)}L/faculty` },
                  { label: "Consultancy", val: rpcResult.breakdown.consultancy, max: 3, hint: form.consultancyRevenue > 0 ? `₹${(form.consultancyRevenue/100000).toFixed(1)}L` : "No data" },
                ].map((c) => (
                  <div key={c.label} className="p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{c.label}</span>
                      <span className="font-bold text-slate-900">{c.val.toFixed(1)} / {c.max}</span>
                    </div>
                    <Progress value={c.val} max={c.max} color="red" />
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.hint}</p>
                  </div>
                ))}
              </div>

              {missingPublications && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs font-bold text-amber-800 mb-1">Potential Score with Publications</p>
                  <p className="text-xs text-amber-700">
                    Entering 350 Scopus papers + 2800 citations would bring RPC to approximately{" "}
                    <span className="font-bold">22-24 / 30</span>, adding ~15 points to your total.
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs font-bold text-green-800 mb-1">Patent Advantage</p>
                <p className="text-xs text-green-700">
                  With {form.patentsGranted} patents granted and {form.patentsPublished} published,
                  your patent score is at maximum — rare for private universities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
