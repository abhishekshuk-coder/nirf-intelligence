"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { BENCHMARKS } from "@/lib/shoolini-data";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Trophy } from "lucide-react";

export default function BenchmarkingPage() {
  const { scores, institution, isLoaded } = useNIRFData();
  const [selected, setSelected] = useState(BENCHMARKS[3].name);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nirf = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };
  const bench = BENCHMARKS.find((b) => b.name === selected) ?? BENCHMARKS[3];

  const radarData = [
    { param: "TLR", Yours: +(nirf.tlr / 30 * 100).toFixed(1), [bench.name]: +(bench.tlr / 30 * 100).toFixed(1) },
    { param: "RPC", Yours: +(nirf.rpc / 30 * 100).toFixed(1), [bench.name]: +(bench.rpc / 30 * 100).toFixed(1) },
    { param: "GO",  Yours: +(nirf.go / 20 * 100).toFixed(1),  [bench.name]: +(bench.go / 20 * 100).toFixed(1) },
    { param: "OI",  Yours: +(nirf.oi / 10 * 100).toFixed(1),  [bench.name]: +(bench.oi / 10 * 100).toFixed(1) },
    { param: "PR",  Yours: +(nirf.pr / 10 * 100).toFixed(1),  [bench.name]: +(bench.pr / 10 * 100).toFixed(1) },
  ];

  const allData = [
    { name: institution.shortName, rank: nirf.estimatedRank, tlr: +nirf.tlr.toFixed(1), rpc: +nirf.rpc.toFixed(1), go: +nirf.go.toFixed(1), oi: +nirf.oi.toFixed(1), pr: +nirf.pr.toFixed(1), total: +nirf.total.toFixed(1), isUs: true },
    ...BENCHMARKS.map((b) => ({ ...b, isUs: false })),
  ].sort((a, b) => a.rank - b.rank);

  if (!mounted || !isLoaded) return <div className="flex-1 p-6"><div className="h-96 bg-slate-100 animate-pulse rounded-xl" /></div>;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Benchmarking" subtitle="Compare your institution vs peers" />

      <main className="flex-1 p-6 space-y-5">
        {/* Institution Selector */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-500 mb-2.5">Compare against:</p>
          <div className="flex flex-wrap gap-2">
            {BENCHMARKS.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelected(b.name)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selected === b.name
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {b.name} (#{b.rank})
              </button>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Radar Comparison (% of max)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="param" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar name="Yours" dataKey="Yours" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} strokeWidth={2} />
              <Radar name={bench.name} dataKey={bench.name} stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : ""} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">All Institutions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Rank</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium text-xs">Institution</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">Total</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">TLR</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">RPC</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">GO</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">OI</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium text-xs">PR</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((row) => (
                  <tr key={row.name} className={`border-b border-slate-50 ${row.isUs ? "bg-blue-50/60" : ""}`}>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {row.rank <= 10 && <Trophy size={12} className="text-yellow-500" />}
                        <span className={row.isUs ? "text-blue-600 font-bold" : "text-slate-600"}>#{row.rank}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={row.isUs ? "text-blue-700 font-bold" : "text-slate-700"}>{row.name}</span>
                      {row.isUs && <Badge variant="blue" size="sm" className="ml-1.5">You</Badge>}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.total}</td>
                    <td className="py-2.5 px-3 text-center">{row.tlr}</td>
                    <td className="py-2.5 px-3 text-center">{row.rpc}</td>
                    <td className="py-2.5 px-3 text-center">{row.go}</td>
                    <td className="py-2.5 px-3 text-center">{row.oi}</td>
                    <td className="py-2.5 px-3 text-center">{row.pr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
