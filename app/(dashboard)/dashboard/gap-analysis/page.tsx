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

const TARGETS = { tlr: 27, rpc: 25, go: 18, oi: 9.5, pr: 8 };

export default function GapAnalysisPage() {
  const { scores, isLoaded } = useNIRFData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nirf = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };

  const params = [
    { code: "TLR", current: nirf.tlr, target: TARGETS.tlr, max: 30, color: "#2563EB" },
    { code: "RPC", current: nirf.rpc, target: TARGETS.rpc, max: 30, color: "#DC2626" },
    { code: "GO",  current: nirf.go,  target: TARGETS.go,  max: 20, color: "#F59E0B" },
    { code: "OI",  current: nirf.oi,  target: TARGETS.oi,  max: 10, color: "#7C3AED" },
    { code: "PR",  current: nirf.pr,  target: TARGETS.pr,  max: 10, color: "#16A34A" },
  ];

  const radarData = params.map((p) => ({
    param: p.code,
    Current: +(p.current / p.max * 100).toFixed(1),
    Target: +(p.target / p.max * 100).toFixed(1),
  }));

  if (!mounted || !isLoaded) return <div className="flex-1 p-6"><div className="h-96 bg-slate-100 animate-pulse rounded-xl" /></div>;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Gap Analysis" subtitle="Current vs Target — identify where to focus for maximum improvement" />

      <main className="flex-1 p-6 space-y-5">
        {/* Gap Table */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Parameter Gap Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2.5 px-3 text-slate-500 font-medium text-xs">Parameter</th>
                  <th className="text-center py-2.5 px-3 text-slate-500 font-medium text-xs">Current</th>
                  <th className="text-center py-2.5 px-3 text-slate-500 font-medium text-xs">Target</th>
                  <th className="text-center py-2.5 px-3 text-slate-500 font-medium text-xs">Gap</th>
                  <th className="py-2.5 px-3 text-slate-500 font-medium text-xs w-40">Progress</th>
                  <th className="text-center py-2.5 px-3 text-slate-500 font-medium text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p) => {
                  const gap = p.target - p.current;
                  const pct = (p.current / p.max) * 100;
                  const status = pct >= 85 ? "on-track" : pct >= 65 ? "attention" : "critical";
                  return (
                    <tr key={p.code} className="border-b border-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-bold text-sm" style={{ color: p.color }}>{p.code}</span>
                        <span className="text-slate-400 text-xs ml-1.5">/ {p.max}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{p.current.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center text-green-700 font-semibold">{p.target}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${gap > 3 ? "text-red-600" : gap > 0 ? "text-amber-600" : "text-green-600"}`}>
                          {gap > 0 ? `-${gap.toFixed(1)}` : "Met"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-500 w-9 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={status === "on-track" ? "green" : status === "attention" ? "gold" : "red"} size="sm">
                          {status === "on-track" ? "On Track" : status === "attention" ? "Attention" : "Critical"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Current vs Target (% of Max)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="param" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar name="Current" dataKey="Current" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Target" dataKey="Target" stroke="#16A34A" fill="#16A34A" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : ""} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
