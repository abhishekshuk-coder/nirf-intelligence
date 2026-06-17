"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { HISTORICAL_RANKINGS } from "@/lib/shoolini-data";
import { estimateRank, projectScenarios } from "@/lib/nirf-engine";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp, Target, Trophy } from "lucide-react";

export default function PredictionPage() {
  const { scores, isLoaded } = useNIRFData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nirf = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };

  const years = HISTORICAL_RANKINGS.length;
  const avgGain = (HISTORICAL_RANKINGS[years - 1].score - HISTORICAL_RANKINGS[0].score) / (years - 1);
  const lastScore = nirf.total > 0 ? nirf.total : HISTORICAL_RANKINGS[years - 1].score;

  const historical = HISTORICAL_RANKINGS.map((h) => ({
    year: h.year, score: h.score, predictedScore: null as number | null,
  }));

  const predicted = ["2026*", "2027", "2028"].map((year, i) => ({
    year,
    score: null as number | null,
    predictedScore: +(lastScore + avgGain * i).toFixed(1),
  }));

  const chartData = [...historical, ...predicted];
  const scenarios = projectScenarios(nirf.total);

  const withPubs = Math.min(30, nirf.rpc + 12);
  const bestCaseScore = withPubs + nirf.tlr + nirf.go + nirf.oi + nirf.pr;
  const bestCaseRank = estimateRank(bestCaseScore);

  if (!mounted || !isLoaded) return <div className="flex-1 p-6"><div className="h-96 bg-slate-100 animate-pulse rounded-xl" /></div>;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Rank Prediction" subtitle="Score trajectory and scenario analysis for NIRF 2026-2028" />

      <main className="flex-1 p-6 space-y-5">
        {/* 3 KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Target, label: "Current Score", val: nirf.total.toFixed(1), sub: `Rank #${nirf.estimatedRank}`, color: "#2563EB", bg: "#EFF6FF" },
            { icon: TrendingUp, label: "Predicted (trend)", val: (lastScore + avgGain).toFixed(1), sub: `Rank #${estimateRank(lastScore + avgGain)}`, color: "#16A34A", bg: "#F0FDF4" },
            { icon: Trophy, label: "Best Case", val: bestCaseScore.toFixed(1), sub: `Rank #${bestCaseRank}`, color: "#7C3AED", bg: "#F5F3FF" },
          ].map(({ icon: Icon, label, val, sub, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{val}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="text-[10px] font-semibold" style={{ color }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Score Trajectory (Historical + Predicted)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="histG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 90]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : "N/A"} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x="2026*" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "Now", fontSize: 11, fill: "#94a3b8" }} />
              <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} fill="url(#histG)" dot={{ r: 4, fill: "#2563EB" }} name="Historical" connectNulls={false} />
              <Area type="monotone" dataKey="predictedScore" stroke="#16A34A" strokeWidth={2} fill="url(#predG)" dot={{ r: 4, fill: "#16A34A" }} strokeDasharray="6 4" name="Predicted" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((s, i) => {
            const colors = ["#64748B", "#2563EB", "#16A34A", "#7C3AED"];
            const bgs = ["#F8FAFC", "#EFF6FF", "#F0FDF4", "#F5F3FF"];
            const borders = ["#E2E8F0", "#BFDBFE", "#BBF7D0", "#DDD6FE"];
            return (
              <div key={s.label} className="rounded-xl p-4 border" style={{ background: bgs[i], borderColor: borders[i] }}>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: colors[i] }}>{s.label}</p>
                <p className="text-2xl font-extrabold text-slate-800">{s.newScore.toFixed(1)}</p>
                <p className="text-sm font-bold mt-1" style={{ color: colors[i] }}>Rank #{s.newRank}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {s.newRank < nirf.estimatedRank ? `+${nirf.estimatedRank - s.newRank} positions` : "No change"}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
