"use client";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { gapAnalysisData, BENCHMARK_DATA } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { AlertTriangle, Target, TrendingUp, Zap } from "lucide-react";

const SEVERITY_CONFIG = {
  Critical: { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-700",   badge: "red"  as const, bar: "#DC2626", icon: AlertTriangle },
  Moderate: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "gold" as const, bar: "#F59E0B", icon: Target },
  Minor:    { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "green"as const, bar: "#16A34A", icon: TrendingUp },
};

const matrixData = [
  { param: "TLR", current: 73.7, target: 90.0, benchmark: 95.0, gap: 16.3 },
  { param: "RPC", current: 71.7, target: 86.7, benchmark: 96.0, gap: 24.3 },
  { param: "GO",  current: 81.0, target: 92.5, benchmark: 96.0, gap: 15.0 },
  { param: "OI",  current: 73.0, target: 85.0, benchmark: 81.0, gap: 12.0 },
  { param: "PR",  current: 74.0, target: 88.0, benchmark: 99.0, gap: 25.0 },
];

const radarData = [
  { subject: "TLR", current: 73.7, target: 90.0, benchmark: 95.0 },
  { subject: "RPC", current: 71.7, target: 86.7, benchmark: 96.0 },
  { subject: "GO",  current: 81.0, target: 92.5, benchmark: 96.0 },
  { subject: "OI",  current: 73.0, target: 85.0, benchmark: 81.0 },
  { subject: "PR",  current: 74.0, target: 88.0, benchmark: 99.0 },
];

const actions: Record<string, { priority: string; action: string; impact: string }[]> = {
  TLR: [
    { priority: "High",   action: "Hire 15 PhD-qualified faculty within 6 months",    impact: "+2.1 points" },
    { priority: "Medium", action: "Increase library budget from 4.7% to 6% of total", impact: "+0.8 points" },
    { priority: "Medium", action: "Upgrade laboratory infrastructure",                 impact: "+0.9 points" },
  ],
  RPC: [
    { priority: "Critical", action: "Push 80+ papers for Scopus indexing immediately",    impact: "+2.8 points" },
    { priority: "Critical", action: "File 6 patent applications in Q1",                   impact: "+1.2 points" },
    { priority: "High",     action: "Increase sponsored research to ₹2 Cr+",             impact: "+1.5 points" },
  ],
  GO: [
    { priority: "High",   action: "Launch targeted campus recruitment drives",       impact: "+1.1 points" },
    { priority: "Medium", action: "Partner with 15 new top-100 companies",           impact: "+0.9 points" },
  ],
  OI: [
    { priority: "High",   action: "Increase international student quota to 80",      impact: "+0.8 points" },
    { priority: "Medium", action: "Strengthen EWS scholarship programme",            impact: "+0.6 points" },
  ],
  PR: [
    { priority: "High",   action: "Host 3 national-level academic conferences",      impact: "+1.4 points" },
    { priority: "Medium", action: "Launch alumni engagement programme",              impact: "+0.7 points" },
  ],
};

export default function GapAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Gap Analysis Engine" subtitle="Automated gap identification across all NIRF parameters" />
      <main className="flex-1 p-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Critical Gaps", count: 1, desc: "Require immediate action", variant: "Critical" as const },
            { label: "Moderate Gaps", count: 2, desc: "Action required this quarter", variant: "Moderate" as const },
            { label: "Minor Gaps",    count: 2, desc: "On track — continue efforts", variant: "Minor" as const },
          ].map((s) => {
            const c = SEVERITY_CONFIG[s.variant];
            const Icon = c.icon;
            return (
              <div key={s.label} className={`card p-4 ${c.bg} border ${c.border}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                    <Icon size={20} className={c.text} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{s.count}</p>
                    <p className={`text-xs font-bold ${c.text}`}>{s.label}</p>
                    <p className="text-[10px] text-slate-500">{s.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gap Matrix */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Gap Matrix — Current vs Target vs Benchmark</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={matrixData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="param" tick={{ fontSize: 12, fontWeight: 700, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="current"   name="Current"   fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target"    name="Target"    fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="Benchmark" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Radar: Current vs Target vs Benchmark</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600, fill: "#475569" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Current"   dataKey="current"   stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Target"    dataKey="target"    stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.08} strokeWidth={2} strokeDasharray="4 3" />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#DC2626" fill="#DC2626" fillOpacity={0.05} strokeWidth={2} strokeDasharray="6 4" />
                <Legend iconType="line" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Impact Matrix */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Priority Impact Matrix</h3>
            <div className="space-y-3">
              {gapAnalysisData.map((g) => {
                const c = SEVERITY_CONFIG[g.severity as keyof typeof SEVERITY_CONFIG];
                const pct = (g.current / g.benchmark) * 100;
                return (
                  <div key={g.parameter} className={`p-3 rounded-xl border ${c.bg} ${c.border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-800">{g.parameter}</span>
                        <Badge variant={c.badge}>{g.severity}</Badge>
                      </div>
                      <span className={`text-sm font-bold ${c.text}`}>Gap: -{g.gap} pts</span>
                    </div>
                    <Progress value={g.current} max={g.benchmark} color={g.severity === "Critical" ? "red" : g.severity === "Moderate" ? "gold" : "green"} />
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                      <span>Current: {g.current}</span>
                      <span>Target: {g.target}</span>
                      <span>Benchmark: {g.benchmark}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">AI-Generated Action Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(actions).map(([param, items]) => (
              <div key={param} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-blue-700 text-base">{param}</span>
                  <Badge variant={param === "RPC" ? "red" : param === "TLR" ? "gold" : "blue"}>
                    {param === "RPC" ? "Critical" : param === "TLR" ? "Moderate" : "Minor"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className={`p-2 rounded-lg text-xs ${item.priority === "Critical" ? "bg-red-50 border border-red-100" : item.priority === "High" ? "bg-amber-50 border border-amber-100" : "bg-blue-50 border border-blue-100"}`}>
                      <div className="flex justify-between items-start gap-2">
                        <p className={`font-medium leading-snug flex-1 ${item.priority === "Critical" ? "text-red-700" : item.priority === "High" ? "text-amber-700" : "text-blue-700"}`}>{item.action}</p>
                        <span className="text-[10px] text-green-600 font-bold whitespace-nowrap">{item.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
