"use client";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BENCHMARK_DATA, type BenchmarkEntry } from "@/lib/mock-data";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Trophy } from "lucide-react";

const MY_SCORES: BenchmarkEntry = { tlr: 22.1, rpc: 21.5, go: 16.2, oi: 7.3, pr: 7.4, total: 74.5, rank: 47 };
const MY_NAME = "Your Institution";

const allInstitutions = [
  { name: MY_NAME, ...MY_SCORES, highlight: true },
  ...Object.entries(BENCHMARK_DATA).map(([name, scores]) => ({ name, ...scores, highlight: false })),
];

const iitm = BENCHMARK_DATA["IIT Madras"];
const iisc = BENCHMARK_DATA["IISc Bengaluru"];

const radarData = [
  { subject: "TLR (30)", you: (MY_SCORES.tlr / 30) * 100, iitm: (iitm.tlr / 30) * 100, iisc: (iisc.tlr / 30) * 100 },
  { subject: "RPC (30)", you: (MY_SCORES.rpc / 30) * 100, iitm: (iitm.rpc / 30) * 100, iisc: (iisc.rpc / 30) * 100 },
  { subject: "GO (20)",  you: (MY_SCORES.go  / 20) * 100, iitm: (iitm.go  / 20) * 100, iisc: (iisc.go  / 20) * 100 },
  { subject: "OI (10)",  you: (MY_SCORES.oi  / 10) * 100, iitm: (iitm.oi  / 10) * 100, iisc: (iisc.oi  / 10) * 100 },
  { subject: "PR (10)",  you: (MY_SCORES.pr  / 10) * 100, iitm: (iitm.pr  / 10) * 100, iisc: (iisc.pr  / 10) * 100 },
];

const barData: { name: string; TLR: number; RPC: number; GO: number; OI: number; PR: number }[] = [
  ...Object.entries(BENCHMARK_DATA).map(([name, s]) => ({
    name: name === "IISc Bengaluru" ? "IISc" : name === "IIM Ahmedabad" ? "IIM-A" : name,
    TLR: s.tlr, RPC: s.rpc, GO: s.go, OI: s.oi, PR: s.pr,
  })),
  { name: "You", TLR: MY_SCORES.tlr, RPC: MY_SCORES.rpc, GO: MY_SCORES.go, OI: MY_SCORES.oi, PR: MY_SCORES.pr },
];

export default function BenchmarkingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Benchmarking Engine" subtitle="Compare your performance against top NIRF institutions" />
      <main className="flex-1 p-6 space-y-6">

        {/* Ranking Table */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Institution Benchmarking Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Rank","Institution","Total","TLR /30","RPC /30","GO /20","OI /10","PR /10","vs Top"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-slate-400 uppercase py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allInstitutions.map((inst) => {
                  const gap = BENCHMARK_DATA["IIT Madras"].total - inst.total;
                  return (
                    <tr key={inst.name} className={`border-b border-slate-50 table-row-hover ${inst.highlight ? "bg-blue-50 font-semibold" : ""}`}>
                      <td className="py-2.5 px-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${inst.rank <= 3 ? "bg-amber-100 text-amber-700" : inst.highlight ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                          {inst.rank}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`${inst.highlight ? "text-blue-700 font-bold" : "text-slate-900"}`}>{inst.name}</span>
                        {inst.highlight && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{inst.total}</td>
                      {[inst.tlr, inst.rpc, inst.go, inst.oi, inst.pr].map((v, i) => (
                        <td key={i} className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">{v}</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-1.5 rounded-full" style={{ width: `${(v / [30,30,20,10,10][i]) * 100}%`, background: inst.highlight ? "#2563EB" : "#94A3B8" }} />
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="py-2.5 px-3">
                        <span className={`text-xs font-bold ${gap > 0 ? "text-red-600" : "text-green-600"}`}>
                          {gap > 0 ? `-${gap.toFixed(1)}` : "+0"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Radar Comparison (Normalised %)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748B" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="You"         dataKey="you"  stroke="#2563EB" fill="#2563EB" fillOpacity={0.2}  strokeWidth={2.5} />
                <Radar name="IIT Madras"  dataKey="iitm" stroke="#DC2626" fill="#DC2626" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="5 3" />
                <Radar name="IISc"        dataKey="iisc" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.06} strokeWidth={1.5} strokeDasharray="5 3" />
                <Legend iconType="line" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Parameter-wise Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="TLR" fill="#2563EB" radius={[3,3,0,0]} />
                <Bar dataKey="RPC" fill="#DC2626" radius={[3,3,0,0]} />
                <Bar dataKey="GO"  fill="#F59E0B" radius={[3,3,0,0]} />
                <Bar dataKey="OI"  fill="#7C3AED" radius={[3,3,0,0]} />
                <Bar dataKey="PR"  fill="#16A34A" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gap Cards */}
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-4">Gap Analysis vs Each Benchmark</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(BENCHMARK_DATA).map(([name, bench]) => {
              const totalGap  = bench.total - MY_SCORES.total;
              return (
                <div key={name} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
                      <p className="text-[10px] text-slate-400">Rank #{bench.rank}</p>
                    </div>
                    <Badge variant="red">-{totalGap.toFixed(1)} pts</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {([["TLR",MY_SCORES.tlr,bench.tlr,30],["RPC",MY_SCORES.rpc,bench.rpc,30],["GO",MY_SCORES.go,bench.go,20],["OI",MY_SCORES.oi,bench.oi,10],["PR",MY_SCORES.pr,bench.pr,10]] as [string,number,number,number][]).map(([p,me,ref,max]) => (
                      <div key={p} className="flex items-center gap-2 text-[10px]">
                        <span className="w-6 font-bold text-slate-500">{p}</span>
                        <div className="flex-1 relative h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="absolute h-2 bg-blue-200 rounded-full" style={{ width: `${(ref/max)*100}%` }} />
                          <div className="absolute h-2 bg-blue-600 rounded-full" style={{ width: `${(me/max)*100}%` }} />
                        </div>
                        <span className="text-red-600 font-semibold">{(me - ref).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
