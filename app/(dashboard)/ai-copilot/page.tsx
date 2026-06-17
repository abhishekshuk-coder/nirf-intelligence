"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: number; role: "user" | "assistant"; content: string; timestamp: Date;
  sources?: string[];
}

const SUGGESTED_QUESTIONS = [
  "Why did our ranking drop from #52 to #47 last year?",
  "How many publications are needed to reach Top 30?",
  "Which department contributes least to our NIRF score?",
  "What should we improve first — TLR or RPC?",
  "Generate a 90-day action plan to improve our ranking by 10 positions.",
  "Compare our research output with IIT Madras.",
  "What is our accreditation readiness score?",
  "How can we improve our employer reputation score?",
];

const AI_RESPONSES: Record<string, { content: string; sources: string[] }> = {
  default: {
    content: "Based on your institution's NIRF data, I've analyzed your current performance. Your overall NIRF score is **74.5/100**, placing you at **Rank #47**.\n\n**Key Observations:**\n- 🔴 **RPC is your critical gap** — 7.3 points below target (21.5 vs 28.8 benchmark)\n- 🟡 **TLR needs attention** — Faculty qualification at 66.7% vs 75% target\n- 🟢 **GO is performing well** — 88.4% placement rate is above average\n\n**Top 3 Immediate Actions:**\n1. Push 80+ papers for Scopus indexing this quarter\n2. File 6 new patent applications before March 2025\n3. Recruit 15 PhD-qualified faculty this semester\n\nWould you like me to elaborate on any specific parameter or generate a detailed action plan?",
    sources: ["NIRF Data 2024", "Benchmark Analysis", "Gap Analysis Engine"],
  },
  "ranking drop": {
    content: "Analyzing your ranking history from 2023 to 2024...\n\n**Actually, your ranking IMPROVED from #52 to #47** — a gain of 5 positions! 🎉\n\n**What drove the improvement:**\n- RPC score improved by +1.3 (publications increased 18%)\n- GO score improved by +0.4 (placement rate up 2.1%)\n- OI score improved by +0.1 (more women students)\n\n**However, if you're asking about the 2022→2023 slowdown:**\n- TLR dipped by -0.7 due to faculty attrition\n- PR score lagged because of fewer industry collaborations\n\nThe recovery in 2024 was driven mainly by **research output surge**. Want a year-by-year breakdown?",
    sources: ["Historical Score Data 2019-2024", "Parameter Analysis"],
  },
  "publications": {
    content: "To reach **Top 30 in NIRF**, you need an estimated **NIRF Score of ~82+**.\n\n**Current RPC Score: 21.5 / 30**\n**Target RPC Score: ~26.0 / 30**\n\n**Publications Gap Analysis:**\n| Metric | Current | Top-30 Target | Gap |\n|--------|---------|---------------|-----|\n| Scopus Papers | 892 | 1,200+ | +308 |\n| Citations | 8,942 | 15,000+ | +6,058 |\n| H-Index | 42 | 60+ | +18 |\n| Patents | 34 | 55+ | +21 |\n\n**Strategy to close the gap:**\n1. Each faculty member should target **4+ publications/year** (current: 3.0)\n2. Focus on **high-impact journals** (IF > 3.0) for better citations\n3. Launch **collaborative research** with IITs and IIMs\n4. Set up a **Research Incentive Fund** of ₹5 Lakh/paper\n\n*Estimated time to Top 30: **2.5–3 years** with full implementation*",
    sources: ["RPC Analysis", "Top-30 Benchmark Data", "Research Gap Engine"],
  },
  "department": {
    content: "**Department NIRF Contribution Analysis:**\n\n| Department | Score | Status |\n|------------|-------|--------|\n| Sciences | 81.1 | 🟢 Strong |\n| Engineering | 80.4 | 🟢 Strong |\n| Biotechnology | 77.9 | 🟡 Good |\n| Pharmacy | 76.0 | 🟡 Good |\n| Management | 72.5 | 🟡 Moderate |\n| **Law** | **61.4** | **🔴 Weakest** |\n\n**Law Department is your biggest drag** on the overall score.\n\n**Law Department Issues:**\n- RPC score very low (13.2/30) — only 28 publications\n- No patents filed\n- Consultancy revenue minimal\n\n**Recommended Actions for Law:**\n1. Hire 3 research-active law faculty\n2. Push for law journal publications (SSRN, SCC Online)\n3. Launch legal consultancy cell for industry clients\n4. Partner with High Courts for research projects\n\nAddressing Law can add **+0.8 to your overall NIRF score**.",
    sources: ["Department Analytics", "Faculty Data", "Research Output Reports"],
  },
};

function getResponse(question: string): { content: string; sources: string[] } {
  const q = question.toLowerCase();
  if (q.includes("drop") || q.includes("decrease") || q.includes("decline"))   return AI_RESPONSES["ranking drop"];
  if (q.includes("publication") || q.includes("top 30") || q.includes("research")) return AI_RESPONSES["publications"];
  if (q.includes("department") || q.includes("least") || q.includes("contribut")) return AI_RESPONSES["department"];
  return AI_RESPONSES["default"];
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (!part.trim()) return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <p key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</p>;
        }
        if (part.startsWith("| ")) {
          return <code key={i} className="block text-xs bg-slate-50 p-2 rounded font-mono">{part}</code>;
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code class='bg-slate-100 px-1 rounded text-xs'>$1</code>") }} />;
      })}
    </div>
  );
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 0, role: "assistant", timestamp: new Date(),
    content: "Hello! I'm your NIRF AI Copilot, trained on your institution's data and NIRF framework benchmarks.\n\nI can help you:\n- **Analyze** your current NIRF performance\n- **Identify** critical gaps and opportunities\n- **Generate** strategic action plans\n- **Predict** future ranking scenarios\n- **Compare** with top-ranked institutions\n\nWhat would you like to explore today?",
    sources: ["NIRF Framework 2024", "Institutional Data"],
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  async function sendMessage(text?: string) {
    const q = text || input.trim();
    if (!q) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", content: q, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const { content, sources } = getResponse(q);
    setIsTyping(false);
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content, sources, timestamp: new Date() }]);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="AI Copilot" subtitle="Intelligent NIRF assistant powered by institutional data" />
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-100 p-4 flex-shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-purple-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Suggested Questions</span>
          </div>
          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="w-full text-left p-2.5 text-xs text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-transparent hover:border-blue-100 transition-all leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs font-bold text-blue-700 mb-2">Data Sources Active</p>
            {["NIRF 2024 Data", "Benchmark Database", "Historical Records", "Department Analytics", "Prediction Engine"].map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-[10px] text-blue-600 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {s}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-2xl ${msg.role === "user" ? "order-first" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white ml-8"
                      : "bg-white border border-slate-100 shadow-sm"
                  }`}>
                    {msg.role === "user"
                      ? <p className="text-sm text-white">{msg.content}</p>
                      : <MessageContent content={msg.content} />
                    }
                  </div>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-3 mt-1.5 px-1">
                      <span className="text-[10px] text-slate-400">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {msg.sources && msg.sources.map((s) => <Badge key={s} variant="gray" className="text-[9px]">{s}</Badge>)}
                      <div className="ml-auto flex gap-1">
                        <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-green-600 transition-colors"><ThumbsUp size={11} /></button>
                        <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><ThumbsDown size={11} /></button>
                        <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Copy size={11} /></button>
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold">
                    VC
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-100 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ask anything about your NIRF data... (Press Enter to send)"
                    rows={1}
                    className="w-full px-4 py-3 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all bg-slate-50 leading-relaxed"
                    style={{ minHeight: "46px", maxHeight: "120px" }}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto";
                      t.style.height = Math.min(t.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
                  className="btn-primary py-3 px-4 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isTyping ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                AI responses are based on your institutional data. Always verify with official NIRF portal before submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
