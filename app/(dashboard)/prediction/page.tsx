"use client";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { predictionData, historicalScores } from "@/lib/mock-data";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp, Brain, Target, Zap, ChevronRight } from "lucide-react";

const combinedData = [
  ...historicalScores.map((h) => ({ year: h.year, actual: h.total, rank: h.rank, type: "historical" })),
  ...predictionData.map((p) => ({ year: p.year, predicted: p.predicted, rank: p.rank, confidence: p.confidence, type: "predicted" })),
];

type ChartPoint = { year: string; rank: number; type: "historical" | "predicted"; actual?: number; predicted?: number; confidence?: number };

const chartData: ChartPoint[] = [
  { year: "2019", actual: 56.8,  rank: 112, type: "historical" },
  { year: "2020", actual: 61.7,  rank: 89,  type: "historical" },
  { year: "2021", actual: 66.6,  rank: 72,  type: "historical" },
  { year: "2022", actual: 70.8,  rank: 61,  type: "historical" },
  { year: "2023", actual: 72.1,  rank: 52,  type: "historical" },
  { year: "2024", actual: 74.5,  rank: 47,  type: "historical" },
  { year: "2025", predicted: 78.2, rank: 38, confidence: 88, type: "predicted" },
  { year: "2026", predicted: 81.5, rank: 29, confidence: 74, type: "predicted" },
  { year: "2027", predicted: 84.1, rank: 22, confidence: 61, type: "predicted" },
  { year: "2028", predicted: 86.3, rank: 17, confidence: 48, type: "predicted" },
];

const models = [
  { name: "Random Forest",    accuracy: 92.4, prediction25: 78.5, prediction26: 81.8, status: "Primary"   },
  { name: "XGBoost",         accuracy: 91.8, prediction25: 78.1, prediction26: 81.2, status: "Secondary" },
  { name: "LightGBM",        accuracy: 90.5, prediction25: 77.9, prediction26: 81.0, status: "Ensemble"  },
  { name: "Linear Trend",    accuracy: 85.2, prediction25: 77.1, prediction26: 80.1, status: "Baseline"  },
];

const scenarios = [
  { name: "Conservative", desc: "Current trajectory, no major changes",     score25: 76.8, rank25: 44, color: "bg-slate-100 border-slate-200 text-slate-700" },
  { name: "Base Case",    desc: "Moderate improvements across parameters",   score25: 78.2, rank25: 38, color: "bg-blue-50 border-blue-200 text-blue-700"    },
  { name: "Optimistic",   desc: "All recommended actions implemented",       score25: 81.0, rank25: 29, color: "bg-green-50 border-green-200 text-green-700" },
  { name: "Best Case",    desc: "Breakthrough in RPC + top faculty hiring",  score25: 83.5, rank25: 22, color: "bg-amber-50 border-amber-200 text-amber-700" },
];

export default function PredictionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Rank Prediction Engine" subtitle="AI + ML powered ranking forecasts with confidence intervals" />
      <main className="flex-1 p-6 space-y-6">

        {/* Prediction KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "2025 Predicted Rank", value: "#38",  subval: "Score: 78.2", color: "border-t-blue-600",  conf: "88% confidence", badge: "blue"  as const },
            { label: "2026 Predicted Rank", value: "#29",  subval: "Score: 81.5", color: "border-t-green-500", conf: "74% confidence", badge: "green" as const },
            { label: "2027 Predicted Rank", value: "#22",  subval: "Score: 84.1", color: "border-t-amber-500", conf: "61% confidence", badge: "gold"  as const },
            { label: "5-Year Target Rank",  value: "#15",  subval: "Score: 87.5", color: "border-t-red-500",   conf: "Strategic target",badge: "red"   as const },
          ].map((k) => (
            <div key={k.label} className={`card p-4 border-t-4 ${k.color}`}>
              <p className="text-xs text-slate-500 font-medium mb-1">{k.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{k.value}</p>
              <p className="text-xs text-slate-500 mt-1">{k.subval}</p>
              <Badge variant={k.badge} className="mt-2 text-[10px]">{k.conf}</Badge>
            </div>
          ))}
        </div>

        {/* Main Prediction Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">NIRF Score Prediction (2019–2028)</h3>
              <p className="text-xs text-slate-400">Historical (solid) + AI Predictions (dashed) with confidence bands</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="blue">Historical</Badge>
              <Badge variant="gold">Predicted</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 95]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <ReferenceLine x="2024" stroke="#94A3B8" strokeDasharray="4 3" label={{ value: "Now", position: "top", fontSize: 10, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }}
                formatter={(val, name) => [val ? `${val}` : "—", name]}
              />
              <Area type="monotone" dataKey="actual"    stroke="#2563EB" strokeWidth={2.5} fill="url(#actualGrad)"  name="Actual Score"    connectNulls />
              <Area type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2.5} fill="url(#predictGrad)" strokeDasharray="6 3"  name="Predicted Score" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scenarios & Models */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scenarios */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">2025 Scenario Analysis</h3>
            </div>
            <div className="space-y-3">
              {scenarios.map((s) => (
                <div key={s.name} className={`p-3 rounded-xl border ${s.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{s.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold">Score: {s.score25}</span>
                      <span className="text-sm font-extrabold">Rank #{s.rank25}</span>
                    </div>
                  </div>
                  <p className="text-[11px] opacity-70">{s.desc}</p>
                  <Progress value={s.score25} max={100} color={s.rank25 <= 25 ? "green" : s.rank25 <= 40 ? "gold" : "blue"} className="mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* ML Models */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={16} className="text-purple-500" />
              <h3 className="font-bold text-slate-900 text-sm">ML Model Predictions</h3>
            </div>
            <div className="space-y-3">
              {models.map((m) => (
                <div key={m.name} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                      <Badge variant={m.status === "Primary" ? "blue" : m.status === "Secondary" ? "gold" : "gray"} className="ml-2 text-[10px]">{m.status}</Badge>
                    </div>
                    <span className="text-xs font-semibold text-green-600">{m.accuracy}% accuracy</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>2025: <b className="text-blue-700">{m.prediction25}</b></span>
                    <span>2026: <b className="text-amber-700">{m.prediction26}</b></span>
                  </div>
                  <Progress value={m.accuracy} max={100} color="blue" className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rank Journey */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Predicted Rank Journey</h3>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {chartData.map((d, i) => (
              <div key={d.year} className="flex items-center gap-2 flex-shrink-0">
                <div className={`text-center p-3 rounded-xl min-w-[70px] ${d.type === "predicted" ? "bg-amber-50 border border-amber-100" : i === chartData.length - 7 ? "bg-blue-600 text-white" : "bg-slate-50 border border-slate-100"}`}>
                  <p className={`text-xs font-medium ${d.type === "predicted" ? "text-amber-600" : i === chartData.length - 7 ? "text-blue-100" : "text-slate-400"}`}>{d.year}</p>
                  <p className={`text-xl font-extrabold ${d.type === "predicted" ? "text-amber-700" : i === chartData.length - 7 ? "text-white" : "text-slate-700"}`}>
                    #{d.rank}
                  </p>
                  <p className={`text-[10px] font-medium ${d.type === "predicted" ? "text-amber-500" : "text-slate-400"}`}>
                    {d.actual || d.predicted}
                  </p>
                </div>
                {i < chartData.length - 1 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
