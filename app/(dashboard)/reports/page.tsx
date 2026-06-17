"use client";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Clock, CheckCircle, Loader, BarChart3, Brain } from "lucide-react";
import { useState } from "react";

const REPORTS = [
  { id: 1, title: "NIRF Readiness Report 2024–25",         type: "PDF",  status: "ready",      updated: "June 9, 2025",  size: "2.4 MB", category: "NIRF",         desc: "Complete NIRF submission readiness assessment with all 5 parameters" },
  { id: 2, title: "Ranking Improvement Report",             type: "PDF",  status: "ready",      updated: "June 8, 2025",  size: "1.8 MB", category: "Analytics",    desc: "Year-on-year rank improvement analysis with projections" },
  { id: 3, title: "Department Performance Report",          type: "Excel",status: "ready",      updated: "June 8, 2025",  size: "1.1 MB", category: "Department",   desc: "Individual department-wise NIRF score breakdown" },
  { id: 4, title: "Benchmarking Report — Top 5 Inst.",     type: "PDF",  status: "ready",      updated: "June 7, 2025",  size: "3.2 MB", category: "Benchmark",    desc: "Detailed comparison against IIT Madras, IISc, IIT Delhi, IIT Bombay" },
  { id: 5, title: "Gap Analysis Report",                    type: "PDF",  status: "generating", updated: "Generating...", size: "—",       category: "AI",           desc: "AI-generated critical, moderate and minor gap analysis" },
  { id: 6, title: "Executive Summary — Board Presentation", type: "PPTX", status: "ready",      updated: "June 6, 2025",  size: "5.8 MB", category: "Executive",    desc: "PowerPoint presentation for Board of Governors meeting" },
  { id: 7, title: "Faculty Research Output Report",         type: "Excel",status: "ready",      updated: "June 5, 2025",  size: "0.9 MB", category: "Research",     desc: "Faculty-wise publications, citations, and project details" },
  { id: 8, title: "Accreditation Readiness Report",         type: "PDF",  status: "ready",      updated: "June 4, 2025",  size: "4.1 MB", category: "NAAC",         desc: "NAAC A+ reaccreditation preparation status and action items" },
  { id: 9, title: "Strategic 3-Year Roadmap",               type: "PDF",  status: "ready",      updated: "June 3, 2025",  size: "2.7 MB", category: "Strategic",    desc: "AI-generated 3-year NIRF improvement roadmap" },
];

const CATEGORY_COLORS: Record<string, "blue" | "red" | "gold" | "green" | "gray"> = {
  NIRF: "blue", Analytics: "blue", Department: "gold", Benchmark: "red",
  AI: "gold", Executive: "blue", Research: "green", NAAC: "green", Strategic: "gold",
};

const TYPE_COLORS: Record<string, string> = {
  PDF:  "bg-red-50 text-red-600 border-red-100",
  Excel:"bg-green-50 text-green-600 border-green-100",
  PPTX: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState<number | null>(null);

  async function generateReport(id: number) {
    setGenerating(id);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Reports & Analytics" subtitle="Generate and download comprehensive NIRF reports" />
      <main className="flex-1 p-6 space-y-6">

        {/* Quick Generate */}
        <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Brain size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">AI Report Generator</h3>
                <p className="text-xs text-slate-500">Generate any report using latest institutional data</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["NIRF Report", "Gap Analysis", "Executive Summary", "Roadmap"].map((r) => (
                <button key={r} onClick={() => generateReport(0)}
                  className="btn-primary text-xs py-2 px-3">
                  <BarChart3 size={12} /> Generate {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS.map((report) => (
            <div key={report.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className={`px-2 py-1 rounded-lg border text-xs font-bold ${TYPE_COLORS[report.type]}`}>
                  {report.type}
                </div>
                <Badge variant={CATEGORY_COLORS[report.category] || "gray"}>{report.category}</Badge>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">{report.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{report.desc}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {report.updated}
                </span>
                {report.size !== "—" && <span>{report.size}</span>}
              </div>

              <div className="flex gap-2">
                {report.status === "generating" || generating === report.id ? (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-600 font-semibold">
                    <Loader size={12} className="animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-xs text-blue-700 font-semibold transition-colors">
                      <Eye size={12} /> Preview
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 btn-primary text-xs py-2 px-2">
                      <Download size={12} /> Download
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Downloads */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Recent Downloads</h3>
          <div className="space-y-2">
            {REPORTS.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.updated} · {r.size}</p>
                </div>
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={14} className="text-blue-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
