"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { HISTORICAL_RANKINGS, PLACEMENT_HISTORY, RESEARCH_HISTORY, INSTITUTION } from "@/lib/shoolini-data";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { scores, isLoaded } = useNIRFData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nirf = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };

  const paramTrend = [
    ...HISTORICAL_RANKINGS.map((h) => ({
      year: h.year,
      TLR: +(h.score * 0.30).toFixed(1),
      RPC: +(h.score * 0.30).toFixed(1),
      GO:  +(h.score * 0.20).toFixed(1),
      OI:  +(h.score * 0.10).toFixed(1),
      PR:  +(h.score * 0.10).toFixed(1),
    })),
    { year: "2026*", TLR: nirf.tlr, RPC: nirf.rpc, GO: nirf.go, OI: nirf.oi, PR: nirf.pr },
  ];

  const placementData = PLACEMENT_HISTORY.map((p) => ({
    year: p.year,
    "UG %": +((p.ugPlaced / p.ugGrad) * 100).toFixed(1),
    "PG %": +((p.pgPlaced / p.pgGrad) * 100).toFixed(1),
  }));

  const researchData = RESEARCH_HISTORY.map((r) => ({
    year: r.year,
    Projects: r.projects,
    "Funding (L)": +(r.amount / 100000).toFixed(1),
  }));

  if (!mounted || !isLoaded) return <div className="p-8"><div className="h-96 bg-slate-100 animate-pulse rounded-2xl" /></div>;

  const scoreChange = (nirf.total - HISTORICAL_RANKINGS[0].score).toFixed(1);
  const rankChange = HISTORICAL_RANKINGS[0].rank - nirf.estimatedRank;
  const avgPlacement = (PLACEMENT_HISTORY.reduce((s, p) => s + (p.ugPlaced + p.pgPlaced) / (p.ugGrad + p.pgGrad) * 100, 0) / PLACEMENT_HISTORY.length).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Analytics" subtitle={`Deep-dive analysis · ${INSTITUTION.shortName} · Engineering`} />

      <main className="flex-1 p-6 space-y-5">
        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Activity, label: "Score Change 2021-Now", val: `+${scoreChange}`, color: "#10B981", bg: "#ECFDF5" },
            { icon: TrendingUp, label: "Rank Improvement", val: `+${rankChange}`, color: "#2563EB", bg: "#EFF6FF" },
            { icon: TrendingUp, label: "3-Yr Placement Avg", val: `${avgPlacement}%`, color: "#F59E0B", bg: "#FFFBEB" },
          ].map(({ icon: Icon, label, val, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{val}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stacked Area Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">NIRF Score by Parameter (2021-2026)</h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">Stacked</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={paramTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
                formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : ""} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Area type="monotone" dataKey="TLR" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
              <Area type="monotone" dataKey="RPC" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="GO"  stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Area type="monotone" dataKey="OI"  stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="PR"  stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Placement + Research Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Placement Rate Trend</h3>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <TrendingUp size={13} /> Recovery
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={placementData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
                  formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : ""} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="UG %" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PG %" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Sponsored Research Funding</h3>
              <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                <TrendingDown size={13} /> Drop
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={researchData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
                  formatter={(v: unknown) => typeof v === "number" ? v.toFixed(1) : ""} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="Projects" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="Funding (L)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
