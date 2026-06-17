"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PolarRadiusAxis,
} from "recharts";
import { useNIRFData } from "@/hooks/useNIRFData";
import { Header } from "@/components/dashboard/header";
import { HISTORICAL_RANKINGS, BENCHMARKS, PLACEMENT_HISTORY, PATENT_HISTORY } from "@/lib/shoolini-data";
import { ArrowRight, AlertTriangle, TrendingUp, Trophy, Target, Users, FlaskConical } from "lucide-react";

export default function DashboardPage() {
  const { scores, data, institution, isLoaded } = useNIRFData();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const s = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };
  const hasPub = (data?.rpc?.scopusPapers ?? 0) > 0 || (data?.rpc?.wosPapers ?? 0) > 0;

  const trendData = [
    ...HISTORICAL_RANKINGS.map((h) => ({ year: h.year, score: h.score })),
    { year: "2026*", score: s.total },
  ];

  const radarData = [
    { p: "TLR", val: (s.tlr / 30) * 100, bench: (BENCHMARKS[3].tlr / 30) * 100 },
    { p: "RPC", val: (s.rpc / 30) * 100, bench: (BENCHMARKS[3].rpc / 30) * 100 },
    { p: "GO",  val: (s.go / 20) * 100,  bench: (BENCHMARKS[3].go / 20) * 100 },
    { p: "OI",  val: (s.oi / 10) * 100,  bench: (BENCHMARKS[3].oi / 10) * 100 },
    { p: "PR",  val: (s.pr / 10) * 100,  bench: (BENCHMARKS[3].pr / 10) * 100 },
  ];

  if (!mounted || !isLoaded) {
    return <div className="p-8"><div className="h-[600px] rounded-2xl" style={{ background: "#E2E8F0" }} /></div>;
  }

  const placementRate = data.go.ugGraduating > 0 ? Math.round((data.go.ugPlaced / data.go.ugGraduating) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Executive Dashboard" subtitle={`${institution.shortName} · ${institution.category} [${institution.code}]`} />

      <main className="flex-1 p-6 space-y-5">

        {/* ── ROW 1: Score Strip ── */}
        <div className="flex items-stretch gap-4">

          {/* Score Card */}
          <div className="rounded-2xl p-6 text-white flex items-center gap-8 shrink-0" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)", minWidth: 320 }}>
            <div className="text-center">
              <p className="text-[11px] font-bold text-blue-300 uppercase tracking-widest mb-1">NIRF Score</p>
              <p className="text-5xl font-black leading-none">{s.total.toFixed(1)}</p>
              <p className="text-blue-400 text-xs mt-1">/ 100</p>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.15)" }} />
            <div className="text-center">
              <p className="text-[11px] font-bold text-blue-300 uppercase tracking-widest mb-1">Est. Rank</p>
              <p className="text-4xl font-black leading-none" style={{ color: "#FBBF24" }}>#{s.estimatedRank}</p>
              <p className="text-blue-400 text-xs mt-1">Engineering</p>
            </div>
          </div>

          {/* 4 KPIs */}
          <div className="flex-1 grid grid-cols-4 gap-3">
            {[
              { label: "Faculty",    value: String(data.tlr.totalFaculty), sub: `${data.tlr.phdFaculty} PhD`, icon: Users,        color: "#1E40AF" },
              { label: "Placement",  value: `${placementRate}%`,           sub: `${data.go.ugPlaced}/${data.go.ugGraduating}`, icon: TrendingUp, color: "#10B981" },
              { label: "Patents",    value: String(data.rpc.patentsGranted), sub: "Granted 2024",         icon: FlaskConical, color: "#F59E0B" },
              { label: "Completion", value: `${s.completeness}%`,           sub: hasPub ? "All entered" : "RPC missing", icon: Target, color: s.completeness > 70 ? "#10B981" : "#EF4444" },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 leading-tight">{value}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Alert (only if publications missing) ── */}
        {!hasPub && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-red-100" style={{ borderLeft: "4px solid #EF4444" }}>
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-xs text-slate-600 flex-1"><strong className="text-red-700">Publication data missing</strong> — entering Scopus/WoS papers can add +12 pts and move rank to #60–80.</p>
            <Link href="/dashboard/data-entry/rpc" className="shrink-0 text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-1" style={{ background: "#EF4444" }}>
              Enter RPC <ArrowRight size={11} />
            </Link>
          </div>
        )}

        {/* ── ROW 2: Parameters + Score Trend (main content) ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* Parameters — compact list */}
          <div className="col-span-4 bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Parameters</p>
            <div className="space-y-4">
              {[
                { code: "TLR", label: "Teaching & Resources",  val: s.tlr, max: 30, color: "#1E40AF" },
                { code: "RPC", label: "Research & Practice",    val: s.rpc, max: 30, color: "#EF4444" },
                { code: "GO",  label: "Graduation Outcomes",    val: s.go,  max: 20, color: "#F59E0B" },
                { code: "OI",  label: "Outreach & Inclusivity", val: s.oi,  max: 10, color: "#7C3AED" },
                { code: "PR",  label: "Peer Perception",        val: s.pr,  max: 10, color: "#10B981" },
              ].map(({ code, label, val, max, color }) => {
                const pct = (val / max) * 100;
                return (
                  <div key={code}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{ background: color }}>{code}</span>
                        <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">{val.toFixed(1)}<span className="text-slate-400 font-normal">/{max}</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Total</span>
                <span className="text-lg font-extrabold text-slate-900">{s.total.toFixed(1)} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
              </div>
            </div>
          </div>

          {/* Score Trend Chart — dominant */}
          <div className="col-span-8 bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Score Trend</p>
                <p className="text-[11px] text-slate-400">Historical + current · 2021–2026</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "#EFF6FF", color: "#1E40AF" }}>Live</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 90]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                  formatter={(v: unknown) => [typeof v === "number" ? v.toFixed(1) : "", "Score"]} />
                <Area type="monotone" dataKey="score" stroke="#1E40AF" strokeWidth={3} fill="url(#sg2)"
                  dot={{ r: 5, fill: "#1E40AF", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7, stroke: "#DBEAFE", strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── ROW 3: Radar + Placement + Patent ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* Radar */}
          <div className="col-span-4 bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-1">Benchmark</p>
            <p className="text-[11px] text-slate-400 mb-4">vs Manipal IT (#45) · % of max</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="p" tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Yours" dataKey="val" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#1E40AF" }} />
                <Radar name="Manipal" dataKey="bench" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 4" />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Placement */}
          <div className="col-span-4 bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-1">Placement Rate</p>
            <p className="text-[11px] text-slate-400 mb-4">3-year UG & PG trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={PLACEMENT_HISTORY.map((p) => ({
                year: p.year,
                "UG %": +((p.ugPlaced / p.ugGrad) * 100).toFixed(1),
                "PG %": +((p.pgPlaced / p.pgGrad) * 100).toFixed(1),
              }))} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 11 }} />
                <Bar dataKey="UG %" fill="#1E40AF" radius={[4,4,0,0]} />
                <Bar dataKey="PG %" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Patents */}
          <div className="col-span-4 bg-white rounded-xl border border-slate-100 p-5">
            <p className="text-sm font-extrabold text-slate-900 mb-1">Patent Activity</p>
            <p className="text-[11px] text-slate-400 mb-4">Published vs Granted</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={PATENT_HISTORY.map((p) => ({
                year: p.year, Pub: p.published, Grant: p.granted,
              }))} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 11 }} />
                <Bar dataKey="Pub" fill="#1E40AF" radius={[4,4,0,0]} name="Published" />
                <Bar dataKey="Grant" fill="#10B981" radius={[4,4,0,0]} name="Granted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
