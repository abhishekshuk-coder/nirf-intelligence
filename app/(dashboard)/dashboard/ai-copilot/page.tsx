"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { INSTITUTION } from "@/lib/shoolini-data";
import { Send, Bot, User } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; time: string }

const SUGGESTED = [
  "What is my biggest weakness?",
  "How to improve RPC score?",
  "What rank can I expect?",
  "Explain my TLR breakdown",
];

function getAIResponse(query: string, scores: { tlr: number; rpc: number; go: number; oi: number; pr: number; total: number; estimatedRank: number } | null): string {
  const n = scores ?? { tlr: 0, rpc: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999 };
  const q = query.toLowerCase();

  if (q.includes("biggest weakness") || q.includes("weak")) {
    const params = [
      { code: "TLR", score: n.tlr, max: 30, pct: n.tlr / 30 * 100 },
      { code: "RPC", score: n.rpc, max: 30, pct: n.rpc / 30 * 100 },
      { code: "GO",  score: n.go,  max: 20, pct: n.go / 20 * 100 },
      { code: "OI",  score: n.oi,  max: 10, pct: n.oi / 10 * 100 },
      { code: "PR",  score: n.pr,  max: 10, pct: n.pr / 10 * 100 },
    ].sort((a, b) => a.pct - b.pct);
    const w = params[0];
    return `Your biggest weakness is **${w.code}** (${w.score.toFixed(1)}/${w.max}, ${w.pct.toFixed(0)}% of max).\n\n**Immediate action:** Enter Scopus publication data in RPC form. This alone can add 10-12 points.`;
  }

  if (q.includes("rpc") || q.includes("research") || q.includes("publication")) {
    return `**RPC Score: ${n.rpc.toFixed(1)}/30**\n\n1. Enter Scopus publications data (+10-12 pts)\n2. Recover research funding to 3 Cr/yr\n3. Start consultancy revenue\n4. Patents already excellent (81 published, 43 granted)`;
  }

  if (q.includes("tlr") || q.includes("library") || q.includes("faculty")) {
    return `**TLR Score: ${n.tlr.toFixed(1)}/30**\n\nFaculty quality is good (85.3% PhD). Key gap: library is only 2.15% of budget (target 5%). Increase by ~56.5L/yr for +1.5 pts.`;
  }

  if (q.includes("rank") || q.includes("predict")) {
    return `**Current: #${n.estimatedRank}** (${n.total.toFixed(1)}/100)\n\nWith publications: #${Math.max(20, n.estimatedRank - 20)} to #${Math.max(30, n.estimatedRank - 15)}\nWith all improvements (1yr): #45-60`;
  }

  if (q.includes("placement") || q.includes("go")) {
    return `**GO Score: ${n.go.toFixed(1)}/20**\n\nUG placement: 71.3% (recovery from 34.8%). Target: 80%+ and 7L median salary for +1.8 pts.`;
  }

  return `Your score: **${n.total.toFixed(1)}/100** | Rank: **#${n.estimatedRank}**\n\nKey: RPC needs publications data (critical), TLR library budget low, OI is excellent.\n\nTry: "What is my biggest weakness?" or "How to improve RPC?"`;
}

export default function AICopilotPage() {
  const { scores } = useNIRFData();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your NIRF Copilot for **${INSTITUTION.shortName}**. Ask me about your scores, gaps, or how to improve your ranking.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function send(query: string) {
    if (!query.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { role: "user", content: query, time }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = getAIResponse(query, scores);
      setMessages((prev) => [...prev, { role: "assistant", content: response, time }]);
      setTyping(false);
    }, 800);
  }

  function formatContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="AI Copilot" subtitle={`NIRF Analytics Assistant · ${INSTITUTION.shortName}`} />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white rounded-xl border border-slate-100 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-blue-600" : "bg-slate-200"}`}>
                  {m.role === "assistant" ? <Bot size={14} className="text-white" /> : <User size={14} className="text-slate-600" />}
                </div>
                <div className={`max-w-[70%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "assistant"
                      ? "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                      : "bg-blue-600 text-white rounded-tr-none"
                  }`} dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                  <p className="text-[10px] text-slate-400 px-1">{m.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Chips + Input */}
          <div className="border-t border-slate-100 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about your NIRF score..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
