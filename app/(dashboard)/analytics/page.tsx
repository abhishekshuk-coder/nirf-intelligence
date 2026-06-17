"use client";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import { historicalScores, monthlyPublications, departmentData, parameterTargets } from "@/lib/mock-data";
import { BarChart3, TrendingUp } from "lucide-react";

const yoyGrowth = historicalScores.slice(1).map((h, i) => ({
  year: h.year,
  growth: +(h.total - historicalScores[i].total).toFixed(2),
  rankImprovement: historicalScores[i].rank - h.rank,
}));

const depScatter = departmentData.map((d) => ({
  x: d.faculty, y: d.rpc, z: d.total * 3, name: d.name,
}));

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Analytics" subtitle="Deep-dive analytics across all NIRF parameters" />
      <main className="flex-1 p-6 space-y-6">

        {/* Score Component Breakdown Over Years */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Parameter Score Trend (Stacked — 2019–2024)</h3>
              <p className="text-xs text-slate-400">How each parameter contributed to overall score improvement</p>
            </div>
            <Badge variant="blue">6-Year Analysis</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={historicalScores}>
              <defs>
                {[["tlrGrad","#2563EB"],["rpcGrad","#DC2626"],["goGrad","#F59E0B"],["oiGrad","#7C3AED"],["prGrad","#16A34A"]].map(([id,color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" stackId="1" dataKey="tlr" stroke="#2563EB" fill="url(#tlrGrad)" name="TLR" />
              <Area type="monotone" stackId="1" dataKey="rpc" stroke="#DC2626" fill="url(#rpcGrad)" name="RPC" />
              <Area type="monotone" stackId="1" dataKey="go"  stroke="#F59E0B" fill="url(#goGrad)"  name="GO" />
              <Area type="monotone" stackId="1" dataKey="oi"  stroke="#7C3AED" fill="url(#oiGrad)"  name="OI" />
              <Area type="monotone" stackId="1" dataKey="pr"  stroke="#16A34A" fill="url(#prGrad)"  name="PR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* YoY Growth */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Year-on-Year Score Growth</h3>
            <p className="text-xs text-slate-400 mb-4">Points gained each year</p>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={yoyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="score" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rank" orientation="right" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="score" dataKey="growth" name="Score Growth" fill="#2563EB" radius={[4,4,0,0]} />
                <Line yAxisId="rank" dataKey="rankImprovement" name="Rank Improvement" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Research Output Monthly */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Research Output 2024</h3>
            <p className="text-xs text-slate-400 mb-4">Monthly publications and citation trend</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyPublications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
                <Legend iconType="line" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="publications" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: "#2563EB", r: 3 }} name="Publications" />
                <Line type="monotone" dataKey="citations" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} strokeDasharray="4 3" name="Citations (÷10)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Heatmap */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Department Performance Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Department","TLR /30","RPC /30","GO /20","OI /10","PR /10","Total /100","Faculty","Students"].map((h) => (
                    <th key={h} className="text-xs font-bold text-slate-400 uppercase text-left py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentData.sort((a, b) => b.total - a.total).map((d) => {
                  function cellBg(v: number, max: number) {
                    const pct = v / max;
                    if (pct >= 0.85) return "bg-green-100 text-green-800";
                    if (pct >= 0.70) return "bg-amber-50 text-amber-800";
                    return "bg-red-50 text-red-700";
                  }
                  return (
                    <tr key={d.name} className="border-b border-slate-50 table-row-hover">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{d.name}</td>
                      <td className={`py-2 px-3 text-xs font-bold rounded-lg text-center ${cellBg(d.tlr, 30)}`}>{d.tlr}</td>
                      <td className={`py-2 px-3 text-xs font-bold rounded-lg text-center ${cellBg(d.rpc, 30)}`}>{d.rpc}</td>
                      <td className={`py-2 px-3 text-xs font-bold rounded-lg text-center ${cellBg(d.go,  20)}`}>{d.go}</td>
                      <td className={`py-2 px-3 text-xs font-bold rounded-lg text-center ${cellBg(d.oi,  10)}`}>{d.oi}</td>
                      <td className={`py-2 px-3 text-xs font-bold rounded-lg text-center ${cellBg(d.pr,  10)}`}>{d.pr}</td>
                      <td className={`py-2 px-3 text-base font-extrabold ${d.total >= 80 ? "text-green-700" : d.total >= 70 ? "text-amber-700" : "text-red-600"}`}>{d.total}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-500">{d.faculty}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-500">{d.students}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px]">
            <span className="text-slate-400">Legend:</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">≥85% — Strong</span>
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">70–85% — Moderate</span>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-semibold">&lt;70% — Needs Work</span>
          </div>
        </div>

        {/* Scatter: Faculty vs Research */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Faculty Size vs Research Performance</h3>
          <p className="text-xs text-slate-400 mb-4">Bubble size = overall NIRF score</p>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="x" name="Faculty Count" type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} label={{ value: "Faculty Count", position: "bottom", fontSize: 11, fill: "#94A3B8" }} />
              <YAxis dataKey="y" name="RPC Score" type="number"     tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} label={{ value: "RPC Score", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94A3B8" }} />
              <ZAxis dataKey="z" range={[80, 800]} name="NIRF Score" />
              <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }}
                formatter={(val, name) => [val, name]} />
              <Scatter data={depScatter} fill="#2563EB" fillOpacity={0.7} name="Departments" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}
