"use client";
import { useState, useRef } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle, X, ArrowRight } from "lucide-react";

/* ── NIRF Template Definition ── */
const TEMPLATE_ROWS = [
  ["SECTION", "FIELD", "DESCRIPTION", "UNIT", "EXAMPLE VALUE"],
  ["", "", "", "", ""],
  ["INST", "institution_name", "Full institution name", "Text", "Your University Name"],
  ["INST", "short_name", "Short display name", "Text", "Your University"],
  ["INST", "nirf_code", "NIRF Institution Code", "Text", "IR-X-U-0000"],
  ["INST", "category", "NIRF Category", "Text", "Engineering"],
  ["INST", "location", "City, State", "Text", "City, State"],
  ["", "", "", "", ""],
  ["TLR", "total_faculty", "Total regular + contractual faculty", "Count", "75"],
  ["TLR", "phd_faculty", "Faculty with PhD qualification", "Count", "64"],
  ["TLR", "avg_experience_months", "Average teaching experience", "Months", "150"],
  ["TLR", "ug_students", "Undergraduate students enrolled", "Count", "1299"],
  ["TLR", "pg_students", "Postgraduate students enrolled", "Count", "53"],
  ["TLR", "phd_students", "PhD students enrolled", "Count", "103"],
  ["TLR", "library_expenditure", "Annual library budget", "INR", "4260000"],
  ["TLR", "lab_expenditure", "Annual laboratory budget", "INR", "27255000"],
  ["TLR", "salaries", "Faculty salaries expenditure", "INR", "92559000"],
  ["TLR", "maintenance", "Infrastructure maintenance", "INR", "72639000"],
  ["TLR", "seminars", "Seminars and workshops budget", "INR", "1132000"],
  ["TLR", "capital_other", "Other capital expenditure", "INR", "385000"],
  ["", "", "", "", ""],
  ["RPC", "scopus_papers", "Scopus-indexed journal papers (3yr)", "Count", "350"],
  ["RPC", "wos_papers", "Web of Science papers (3yr)", "Count", "280"],
  ["RPC", "citations", "Total citations received (3yr)", "Count", "2800"],
  ["RPC", "h_index", "Institutional h-index", "Score", "28"],
  ["RPC", "patents_published", "Patents published/filed", "Count", "81"],
  ["RPC", "patents_granted", "Patents granted", "Count", "43"],
  ["RPC", "sponsored_projects", "Active sponsored research projects", "Count", "9"],
  ["RPC", "sponsored_amount", "Sponsored research amount (3yr avg)", "INR", "22620378"],
  ["RPC", "consultancy_projects", "Consultancy projects", "Count", "0"],
  ["RPC", "consultancy_revenue", "Consultancy revenue", "INR", "0"],
  ["", "", "", "", ""],
  ["GO", "ug_graduating", "UG graduates in batch", "Count", "178"],
  ["GO", "ug_placed", "UG students placed", "Count", "127"],
  ["GO", "ug_higher_studies", "UG pursuing higher studies", "Count", "27"],
  ["GO", "ug_self_employed", "UG self-employed/entrepreneurship", "Count", "0"],
  ["GO", "ug_median_salary", "UG median salary (annual)", "INR", "500000"],
  ["GO", "pg_graduating", "PG graduates in batch", "Count", "35"],
  ["GO", "pg_placed", "PG students placed", "Count", "30"],
  ["GO", "pg_higher_studies", "PG pursuing further studies", "Count", "1"],
  ["GO", "pg_median_salary", "PG median salary (annual)", "INR", "500000"],
  ["GO", "phd_graduated", "PhD graduates (full-time)", "Count", "34"],
  ["", "", "", "", ""],
  ["OI", "total_students", "Total student enrollment", "Count", "1352"],
  ["OI", "women_students", "Women students", "Count", "587"],
  ["OI", "within_state", "Students from within state", "Count", "583"],
  ["OI", "outside_state", "Students from outside state", "Count", "735"],
  ["OI", "international_students", "International students", "Count", "34"],
  ["OI", "ews_students", "EWS category students", "Count", "46"],
  ["OI", "sc_students", "SC category students", "Count", "140"],
  ["OI", "st_students", "ST category students", "Count", "50"],
  ["OI", "obc_students", "OBC category students", "Count", "101"],
  ["OI", "physically_disabled", "Students with disabilities", "Count", "5"],
  ["OI", "pcs_lifts_ramps", "Lifts/ramps available", "Yes/No", "Yes"],
  ["OI", "pcs_wheelchairs", "Wheelchairs available", "Yes/No", "Yes"],
  ["OI", "pcs_toilets", "Accessible toilets available", "Yes/No", "Yes"],
  ["", "", "", "", ""],
  ["PR", "academic_reputation", "Academic peer reputation", "0-100", "62"],
  ["PR", "employer_reputation", "Employer reputation score", "0-100", "58"],
  ["PR", "alumni_engagement", "Alumni engagement score", "0-100", "52"],
  ["PR", "media_visibility", "Media/public visibility", "0-100", "48"],
];

function generateCSV(): string {
  return TEMPLATE_ROWS.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
}

function downloadTemplate() {
  const csv = generateCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "NIRF_Data_Template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type ParsedData = {
  inst: Record<string, string>;
  tlr: Record<string, string>;
  rpc: Record<string, string>;
  go: Record<string, string>;
  oi: Record<string, string>;
  pr: Record<string, string>;
};

function parseCSV(text: string): ParsedData {
  const result: ParsedData = { inst: {}, tlr: {}, rpc: {}, go: {}, oi: {}, pr: {} };
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const cols = line.split(",").map((c) => c.replace(/"/g, "").trim());
    if (cols.length < 5) continue;
    const section = cols[0].toUpperCase();
    const field = cols[1];
    const value = cols[4];
    if (!field || !value || section === "SECTION") continue;
    if (section === "INST") result.inst[field] = value;
    else if (section === "TLR") result.tlr[field] = value;
    else if (section === "RPC") result.rpc[field] = value;
    else if (section === "GO") result.go[field] = value;
    else if (section === "OI") result.oi[field] = value;
    else if (section === "PR") result.pr[field] = value;
  }
  return result;
}

function num(v: string | undefined, fallback = 0): number {
  if (!v) return fallback;
  const n = parseFloat(v.replace(/[₹,\s]/g, ""));
  return isNaN(n) ? fallback : n;
}

function yn(v: string | undefined): boolean {
  return (v ?? "").toLowerCase().startsWith("y");
}

export default function DataUploadPage() {
  const { data, updateInstitution, updateTLR, updateRPC, updateGO, updateOI, updatePR } = useNIRFData();
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [fileName, setFileName] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError("");
    setApplied(false);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseCSV(text);
        const fieldCount = Object.values(result).reduce((sum, obj) => sum + Object.keys(obj).length, 0);
        if (fieldCount < 3) {
          setError("Could not parse any fields. Make sure the CSV follows the template format.");
          setParsed(null);
          return;
        }
        setParsed(result);
      } catch {
        setError("Failed to read file. Please upload a valid CSV.");
        setParsed(null);
      }
    };
    reader.readAsText(file);
  }

  function applyData() {
    if (!parsed) return;
    const inst = parsed.inst;
    if (inst.institution_name || inst.short_name || inst.nirf_code) {
      updateInstitution({
        name: inst.institution_name || data.institution.name,
        shortName: inst.short_name || inst.institution_name || data.institution.shortName,
        code: inst.nirf_code || data.institution.code,
        category: inst.category || data.institution.category,
        cycle: "NIRF 2026",
        location: inst.location || data.institution.location,
      });
    }
    const t = parsed.tlr;
    updateTLR({
      totalFaculty: num(t.total_faculty, data.tlr.totalFaculty),
      phdFaculty: num(t.phd_faculty, data.tlr.phdFaculty),
      avgExperienceMonths: num(t.avg_experience_months, data.tlr.avgExperienceMonths),
      ugStudents: num(t.ug_students, data.tlr.ugStudents),
      pgStudents: num(t.pg_students, data.tlr.pgStudents),
      phdStudents: num(t.phd_students, data.tlr.phdStudents),
      libraryExpenditure: num(t.library_expenditure, data.tlr.libraryExpenditure),
      labExpenditure: num(t.lab_expenditure, data.tlr.labExpenditure),
      salaries: num(t.salaries, data.tlr.salaries),
      maintenance: num(t.maintenance, data.tlr.maintenance),
      seminars: num(t.seminars, data.tlr.seminars),
      capitalOther: num(t.capital_other, data.tlr.capitalOther),
    });
    const r = parsed.rpc;
    updateRPC({
      scopusPapers: num(r.scopus_papers, data.rpc.scopusPapers),
      wosPapers: num(r.wos_papers, data.rpc.wosPapers),
      citations: num(r.citations, data.rpc.citations),
      hIndex: num(r.h_index, data.rpc.hIndex),
      patentsPublished: num(r.patents_published, data.rpc.patentsPublished),
      patentsGranted: num(r.patents_granted, data.rpc.patentsGranted),
      sponsoredProjects: num(r.sponsored_projects, data.rpc.sponsoredProjects),
      sponsoredAmount: num(r.sponsored_amount, data.rpc.sponsoredAmount),
      consultancyProjects: num(r.consultancy_projects, data.rpc.consultancyProjects),
      consultancyRevenue: num(r.consultancy_revenue, data.rpc.consultancyRevenue),
    });
    const g = parsed.go;
    updateGO({
      ugGraduating: num(g.ug_graduating, data.go.ugGraduating),
      ugPlaced: num(g.ug_placed, data.go.ugPlaced),
      ugHigherStudies: num(g.ug_higher_studies, data.go.ugHigherStudies),
      ugSelfEmployed: num(g.ug_self_employed, data.go.ugSelfEmployed),
      ugMedianSalary: num(g.ug_median_salary, data.go.ugMedianSalary),
      pgGraduating: num(g.pg_graduating, data.go.pgGraduating),
      pgPlaced: num(g.pg_placed, data.go.pgPlaced),
      pgHigherStudies: num(g.pg_higher_studies, data.go.pgHigherStudies),
      pgMedianSalary: num(g.pg_median_salary, data.go.pgMedianSalary),
      phdGraduated: num(g.phd_graduated, data.go.phdGraduated),
    });
    const o = parsed.oi;
    updateOI({
      totalStudents: num(o.total_students, data.oi.totalStudents),
      womenStudents: num(o.women_students, data.oi.womenStudents),
      withinStateStudents: num(o.within_state, data.oi.withinStateStudents),
      outsideStateStudents: num(o.outside_state, data.oi.outsideStateStudents),
      internationalStudents: num(o.international_students, data.oi.internationalStudents),
      ewsStudents: num(o.ews_students, data.oi.ewsStudents),
      scStudents: num(o.sc_students, data.oi.scStudents),
      stStudents: num(o.st_students, data.oi.stStudents),
      obcStudents: num(o.obc_students, data.oi.obcStudents),
      physicallyDisabled: num(o.physically_disabled, data.oi.physicallyDisabled),
      pcsLiftsRamps: o.pcs_lifts_ramps ? yn(o.pcs_lifts_ramps) : data.oi.pcsLiftsRamps,
      pcsWheelchairs: o.pcs_wheelchairs ? yn(o.pcs_wheelchairs) : data.oi.pcsWheelchairs,
      pcsToilets: o.pcs_toilets ? yn(o.pcs_toilets) : data.oi.pcsToilets,
    });
    const p = parsed.pr;
    updatePR({
      academicReputation: num(p.academic_reputation, data.pr.academicReputation),
      employerReputation: num(p.employer_reputation, data.pr.employerReputation),
      alumniEngagement: num(p.alumni_engagement, data.pr.alumniEngagement),
      mediaVisibility: num(p.media_visibility, data.pr.mediaVisibility),
    });
    setApplied(true);
  }

  const fieldCount = parsed ? Object.values(parsed).reduce((sum, obj) => sum + Object.keys(obj).length, 0) : 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Upload NIRF Data" subtitle="Import data via CSV template matching NIRF submission format" />

      <main className="flex-1 p-6 space-y-5">

        {/* Step 1: Download Template */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EFF6FF" }}>
              <FileSpreadsheet size={20} style={{ color: "#1E40AF" }} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">Step 1: Download NIRF Template</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                CSV template with all 5 NIRF parameters (TLR, RPC, GO, OI, PR) — 49 data fields matching the official NIRF submission format.
                Fill in the "EXAMPLE VALUE" column with your institution's data.
              </p>
              <button onClick={downloadTemplate}
                className="text-sm font-bold text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
                style={{ background: "#1E40AF" }}>
                <Download size={15} /> Download Template (CSV)
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Upload */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F0FDF4" }}>
              <Upload size={20} style={{ color: "#10B981" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Step 2: Upload Filled Template</h3>
              <p className="text-xs text-slate-500 mt-1">Upload your completed CSV. Data will be previewed before applying.</p>
            </div>
          </div>

          <input ref={inputRef} type="file" accept=".csv,.txt" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
          >
            <Upload size={28} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-600">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-400 mt-1">CSV files only</p>
            {fileName && <p className="text-xs font-bold text-blue-600 mt-3">{fileName}</p>}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-xs font-semibold bg-red-50 p-3 rounded-lg">
              <AlertTriangle size={14} /> {error}
            </div>
          )}
        </div>

        {/* Step 3: Preview & Apply */}
        {parsed && !applied && (
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                  <FileSpreadsheet size={20} style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 3: Review & Apply</h3>
                  <p className="text-xs text-slate-500">{fieldCount} fields parsed from {fileName}</p>
                </div>
              </div>
              <button onClick={() => { setParsed(null); setFileName(""); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Preview grid */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {(["tlr", "rpc", "go", "oi", "pr"] as const).map((section) => {
                const fields = parsed[section];
                const count = Object.keys(fields).length;
                const colors: Record<string, string> = { tlr: "#1E40AF", rpc: "#EF4444", go: "#F59E0B", oi: "#7C3AED", pr: "#10B981" };
                return (
                  <div key={section} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{ background: colors[section] }}>
                        {section.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{count} fields</span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(fields).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 truncate flex-1">{key}</span>
                          <span className="font-bold text-slate-700 ml-2">{val}</span>
                        </div>
                      ))}
                      {count === 0 && <p className="text-[10px] text-slate-300 italic">No data</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={applyData}
              className="text-sm font-bold text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
              style={{ background: "#10B981" }}>
              <CheckCircle size={16} /> Apply Data to Dashboard
            </button>
          </div>
        )}

        {/* Success */}
        {applied && (
          <div className="bg-white rounded-xl border border-emerald-200 p-6 flex items-center gap-4" style={{ background: "#F0FDF4" }}>
            <CheckCircle size={24} style={{ color: "#10B981" }} />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-800">Data applied successfully</p>
              <p className="text-xs text-emerald-600 mt-0.5">{fieldCount} fields updated across all 5 NIRF parameters. Scores recalculated automatically.</p>
            </div>
            <a href="/dashboard" className="text-sm font-bold text-white px-5 py-2.5 rounded-lg flex items-center gap-2" style={{ background: "#1E40AF" }}>
              View Dashboard <ArrowRight size={14} />
            </a>
          </div>
        )}

        {/* Template Format Info */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Template Format</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Section", "Field", "Description", "Unit", "Your Value"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["TLR", "total_faculty", "Total faculty", "Count", "—"],
                  ["TLR", "phd_faculty", "PhD faculty", "Count", "—"],
                  ["RPC", "scopus_papers", "Scopus papers (3yr)", "Count", "—"],
                  ["RPC", "patents_granted", "Patents granted", "Count", "—"],
                  ["GO", "ug_placed", "UG students placed", "Count", "—"],
                  ["GO", "ug_median_salary", "UG median salary", "INR", "—"],
                  ["OI", "women_students", "Women students", "Count", "—"],
                  ["PR", "academic_reputation", "Academic reputation", "0-100", "—"],
                ].map(([section, field, desc, unit, val], i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold" style={{ color: { TLR: "#1E40AF", RPC: "#EF4444", GO: "#F59E0B", OI: "#7C3AED", PR: "#10B981" }[section] }}>{section}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{field}</td>
                    <td className="py-2 px-3 text-slate-500">{desc}</td>
                    <td className="py-2 px-3 text-slate-400">{unit}</td>
                    <td className="py-2 px-3 text-slate-300">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Full template has 49 fields across 5 parameters. Download for complete list.</p>
        </div>

      </main>
    </div>
  );
}
