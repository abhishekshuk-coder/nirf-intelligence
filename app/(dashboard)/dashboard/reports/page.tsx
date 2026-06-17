"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { FileText, Download, Eye } from "lucide-react";

const REPORTS = [
  { id: "r1", title: "NIRF 2026 Score Summary", desc: "All 5 parameters with scores, targets, and gaps.", type: "PDF" },
  { id: "r2", title: "TLR Detailed Report", desc: "Faculty, students, financial resources analysis.", type: "Excel" },
  { id: "r3", title: "RPC Research Portfolio", desc: "Publications, patents, sponsored research summary.", type: "PDF" },
  { id: "r4", title: "Placement Analysis", desc: "3-year placement data and salary trends.", type: "PDF" },
  { id: "r5", title: "Gap Analysis & Action Plan", desc: "Gaps vs targets with prioritized recommendations.", type: "PDF" },
  { id: "r6", title: "Executive Summary", desc: "One-page key metrics and top 3 recommendations.", type: "PDF" },
];

export default function ReportsPage() {
  const { scores, data, institution } = useNIRFData();
  const [generated, setGenerated] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState<string | null>(null);
  const nirf = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };

  function generate(id: string) {
    setGenerating(id);
    setTimeout(() => {
      setGenerated((prev) => new Set([...prev, id]));
      setGenerating(null);
    }, 2000);
  }

  function downloadReport(id: string, title: string) {
    const content = `NIRF ANALYTICS REPORT\n=======================\n${institution.name}\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal Score: ${nirf.total.toFixed(1)}/100 | Rank #${nirf.estimatedRank}\nTLR: ${nirf.tlr.toFixed(1)}/30 | RPC: ${nirf.rpc.toFixed(1)}/30 | GO: ${nirf.go.toFixed(1)}/20 | OI: ${nirf.oi.toFixed(1)}/10 | PR: ${nirf.pr.toFixed(1)}/10\n\nReport: ${title}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NIRF_${id}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Reports" subtitle={`Generate NIRF reports for ${institution.shortName}`} />

      <main className="flex-1 p-6 space-y-5">
        {/* Header Card */}
        <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}>
          <div>
            <p className="text-blue-200 text-xs">{institution.code}</p>
            <p className="font-bold text-lg text-white">{institution.shortName}</p>
            <p className="text-blue-200 text-sm mt-1">
              Score: <span className="text-white font-bold">{nirf.total.toFixed(1)}/100</span> · Rank: <span className="text-yellow-300 font-bold">#{nirf.estimatedRank}</span>
            </p>
          </div>
          <FileText size={36} className="text-white/20" />
        </div>

        {/* Report Grid — 6 reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS.map((r) => {
            const isDone = generated.has(r.id);
            const isGen = generating === r.id;
            return (
              <div key={r.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${r.type === "PDF" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {r.type}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{r.desc}</p>
                <div className="flex gap-2">
                  {!isDone ? (
                    <button
                      onClick={() => generate(r.id)}
                      disabled={isGen}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isGen ? (
                        <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                      ) : (
                        <><FileText size={12} />Generate</>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => downloadReport(r.id, r.title)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Download size={12} />Download
                      </button>
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-2 px-3 rounded-lg flex items-center gap-1">
                        <Eye size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
