"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { roadmapItems } from "@/lib/mock-data";
import { Map, CheckCircle2, Clock, AlertTriangle, Download, ChevronRight } from "lucide-react";

type TimeHorizon = "30-Day" | "90-Day" | "6-Month" | "1-Year";

const HORIZONS: TimeHorizon[] = ["30-Day", "90-Day", "6-Month", "1-Year"];

const HORIZON_CONFIG: Record<TimeHorizon, { color: string; bg: string; border: string; desc: string }> = {
  "30-Day":   { color: "text-red-700",   bg: "bg-red-50",   border: "border-red-200",   desc: "Immediate actions — highest impact on NIRF 2025" },
  "90-Day":   { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", desc: "Short-term improvements before NIRF submission" },
  "6-Month":  { color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200",  desc: "Medium-term strategic initiatives" },
  "1-Year":   { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", desc: "Annual goals aligned with NIRF 2026 target" },
};

const PRIORITY_CONFIG: Record<string, { badge: "red" | "gold" | "blue" | "green"; icon: typeof AlertTriangle }> = {
  Critical: { badge: "red"  as const, icon: AlertTriangle },
  High:     { badge: "gold" as const, icon: Clock         },
  Medium:   { badge: "blue" as const, icon: Clock         },
  Strategic:{ badge: "green"as const, icon: CheckCircle2  },
};

export default function RoadmapPage() {
  const [activeHorizon, setActiveHorizon] = useState<TimeHorizon>("30-Day");
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  function toggleComplete(key: string) {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const items = roadmapItems[activeHorizon];
  const completedCount = items.filter((_, i) => completedItems.has(`${activeHorizon}-${i}`)).length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Strategic Roadmap Generator" subtitle="AI-generated action plans aligned with NIRF targets" />
      <main className="flex-1 p-6 space-y-6">

        {/* Timeline Tabs */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Map size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Select Planning Horizon</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HORIZONS.map((h) => {
              const c = HORIZON_CONFIG[h];
              const isActive = activeHorizon === h;
              return (
                <button key={h} onClick={() => setActiveHorizon(h)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${isActive ? `${c.bg} ${c.border} ring-2 ring-offset-1 ring-blue-300` : "bg-white border-slate-100 hover:bg-slate-50"}`}
                >
                  <p className={`font-extrabold text-lg ${isActive ? c.color : "text-slate-700"}`}>{h}</p>
                  <p className={`text-xs mt-1 ${isActive ? c.color : "text-slate-400"} opacity-80`}>{c.desc}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{roadmapItems[h].length} actions</span>
                    {isActive && <ChevronRight size={14} className={c.color} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Roadmap Header */}
        <div className={`card p-4 ${HORIZON_CONFIG[activeHorizon].bg} border ${HORIZON_CONFIG[activeHorizon].border}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-extrabold text-xl ${HORIZON_CONFIG[activeHorizon].color}`}>{activeHorizon} Action Plan</h2>
              <p className="text-sm text-slate-600 mt-0.5">{HORIZON_CONFIG[activeHorizon].desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-slate-900">{completedCount}/{items.length}</p>
                <p className="text-xs text-slate-500">Tasks completed</p>
              </div>
              <button className="btn-primary text-xs py-2 px-3">
                <Download size={13} /> Export Plan
              </button>
            </div>
          </div>
          {/* Progress */}
          <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-current transition-all duration-700" style={{ width: `${(completedCount / items.length) * 100}%`, color: HORIZON_CONFIG[activeHorizon].color }} />
          </div>
          <p className="text-xs mt-1 text-slate-500">{Math.round((completedCount / items.length) * 100)}% complete</p>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          {items.map((item, i) => {
            const key = `${activeHorizon}-${i}`;
            const isCompleted = completedItems.has(key);
            const pc = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG["Medium"];
            const Icon = pc.icon;
            return (
              <div key={i} className={`card p-4 border-l-4 transition-all duration-200 ${
                isCompleted ? "border-l-green-400 opacity-60" :
                item.priority === "Critical" || item.priority === "Strategic" ? "border-l-red-500" :
                item.priority === "High" ? "border-l-amber-400" : "border-l-blue-400"
              }`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleComplete(key)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-green-400"}`}
                  >
                    {isCompleted && <CheckCircle2 size={12} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`font-semibold text-slate-900 leading-snug ${isCompleted ? "line-through text-slate-400" : ""}`}>{item.action}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{item.impact}</span>
                        <Badge variant={pc.badge}>{item.priority}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Icon size={12} />
                        <span>{item.priority === "Critical" ? "Immediate" : item.priority === "High" ? "ASAP" : "Planned"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Owner: <b className="text-slate-600">{item.owner}</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Year Strategic Plan */}
        <div className="card p-5 bg-gradient-to-br from-blue-50 to-slate-50">
          <h3 className="font-bold text-slate-900 text-sm mb-4">3-Year Strategic Vision</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { year: "2025", rank: "#38", score: "78.2", focus: "Research Output & Patent Push", color: "blue" },
              { year: "2026", rank: "#29", score: "81.5", focus: "Faculty Quality & TLR Boost",  color: "gold" },
              { year: "2027", rank: "#22", score: "84.1", focus: "Perception & Brand Building",  color: "green"},
            ].map((yr) => (
              <div key={yr.year} className={`p-4 rounded-xl border-2 ${yr.color === "blue" ? "bg-blue-50 border-blue-200" : yr.color === "gold" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-extrabold text-slate-900 text-xl">{yr.year}</span>
                  <span className={`text-2xl font-extrabold ${yr.color === "blue" ? "text-blue-700" : yr.color === "gold" ? "text-amber-700" : "text-green-700"}`}>{yr.rank}</span>
                </div>
                <p className="text-xs font-semibold text-slate-600">NIRF Score: {yr.score}</p>
                <p className={`text-xs mt-2 font-medium ${yr.color === "blue" ? "text-blue-600" : yr.color === "gold" ? "text-amber-600" : "text-green-600"}`}>{yr.focus}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
