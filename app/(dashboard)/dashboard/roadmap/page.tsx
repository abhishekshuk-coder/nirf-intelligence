"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

const ROADMAP: Record<string, Array<{ id: string; title: string; impact: string; param: string }>> = {
  "30-Day": [
    { id: "r1", title: "Enter Scopus publication count in RPC form", impact: "+12 pts", param: "RPC" },
    { id: "r2", title: "Verify all patent records in NIRF portal", impact: "Verify", param: "RPC" },
    { id: "r3", title: "Update PR survey estimates", impact: "+0.5 pts", param: "PR" },
    { id: "r4", title: "Run NIRF data completeness check", impact: "Accuracy", param: "All" },
  ],
  "90-Day": [
    { id: "r5", title: "Apply for DST/SERB research grants", impact: "+3 pts", param: "RPC" },
    { id: "r6", title: "Prepare library budget increase proposal", impact: "+1.5 pts", param: "TLR" },
    { id: "r7", title: "Engage 30+ employer survey contacts", impact: "+0.5 pts", param: "PR" },
    { id: "r8", title: "Identify 5 industry consultancy opportunities", impact: "+0.5 pts", param: "RPC" },
  ],
  "6-Month": [
    { id: "r9", title: "Execute library budget increase plan", impact: "+1.5 pts", param: "TLR" },
    { id: "r10", title: "Convert grants into active projects (target 1 Cr)", impact: "+2 pts", param: "RPC" },
    { id: "r11", title: "Target 6L+ median salary placements", impact: "+1 pt", param: "GO" },
    { id: "r12", title: "Recruit 50+ international students", impact: "+0.3 pts", param: "OI" },
  ],
  "1-Year": [
    { id: "r13", title: "Achieve NIRF Engineering Top 50", impact: "Rank +20", param: "All" },
    { id: "r14", title: "Establish industry partnership program (20+ cos)", impact: "+2 pts", param: "GO" },
    { id: "r15", title: "Faculty publication targets (300+ Scopus/yr)", impact: "+3 pts", param: "RPC" },
    { id: "r16", title: "Achieve 7L+ median salary", impact: "+1.8 pts", param: "GO" },
  ],
};

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("30-Day");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const items = ROADMAP[activeTab];
  const completedCount = items.filter((i) => completed.has(i.id)).length;
  const pct = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Strategic Roadmap" subtitle="Prioritized action plan to improve NIRF ranking" />

      <main className="flex-1 p-6 space-y-5">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex justify-between mb-2">
            <p className="font-semibold text-slate-700 text-sm">{activeTab} Progress</p>
            <p className="text-sm font-bold text-blue-600">{completedCount}/{items.length}</p>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Click any task to toggle completion</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-100 w-fit">
          {Object.keys(ROADMAP).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Checklist */}
        <div className="space-y-2.5">
          {items.map((item) => {
            const done = completed.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  done ? "opacity-50 border-green-200" : "border-slate-100 hover:shadow-sm"
                }`}
              >
                <div className="shrink-0">
                  {done ? <CheckCircle size={20} className="text-green-500" /> : <Circle size={20} className="text-slate-300" />}
                </div>
                <p className={`flex-1 font-medium text-sm ${done ? "line-through text-slate-400" : "text-slate-800"}`}>
                  {item.title}
                </p>
                <Badge variant="blue" size="sm">{item.param}</Badge>
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full shrink-0">{item.impact}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
