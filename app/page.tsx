"use client";
import Link from "next/link";
import {
  ArrowRight, BarChart3, Brain, GitCompare, FileText,
  FlaskConical, Trophy, TrendingUp, BookOpen, GraduationCap,
  Users, Star, Zap, CheckCircle, Target, Sparkles, Shield,
  MessageSquare, Send, Award,
} from "lucide-react";

const PARAMS = [
  { code: "TLR", name: "Teaching, Learning & Resources",  weight: 30, score: 25.7, max: 30, color: "#1E40AF" },
  { code: "RPC", name: "Research & Professional Practice", weight: 30, score: 6.9,  max: 30, color: "#EF4444" },
  { code: "GO",  name: "Graduation Outcomes",              weight: 20, score: 16.7, max: 20, color: "#F59E0B" },
  { code: "OI",  name: "Outreach & Inclusivity",           weight: 10, score: 9.8,  max: 10, color: "#7C3AED" },
  { code: "PR",  name: "Perception",                       weight: 10, score: 5.9,  max: 10, color: "#10B981" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100" style={{ height: 64 }}>
        <div className="h-full flex items-center justify-between mx-auto" style={{ maxWidth: 1200, padding: "0 32px" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1E40AF" }}>
              <Trophy size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">NIRF Intelligence</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-500">
            <a href="#framework" className="hover:text-slate-900 transition-colors">Framework</a>
            <a href="#features"  className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#copilot"   className="hover:text-slate-900 transition-colors">AI Copilot</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 px-3 py-2">Log In</Link>
            <Link href="/dashboard" className="text-[13px] font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "#1E40AF" }}>
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)" }}>
        <div className="mx-auto flex flex-col lg:flex-row items-center gap-12" style={{ maxWidth: 1200, padding: "72px 32px 80px" }}>
          <div className="flex-1 max-w-lg">
            <p className="text-blue-300 text-[13px] font-semibold mb-4">NIRF 2026 · AI-Powered Platform</p>
            <h1 className="text-[42px] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
              Predict, Benchmark &<br />Improve Your Ranking
            </h1>
            <p className="text-[15px] text-slate-400 mb-8 leading-relaxed" style={{ maxWidth: 400 }}>
              One platform for NIRF data entry, scoring, gap analysis, benchmarking, and AI-powered rank prediction.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="bg-white text-slate-900 font-semibold text-sm px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                Launch Dashboard <ArrowRight size={14} />
              </Link>
              <Link href="/login" className="text-white/80 font-medium text-sm px-6 py-3 rounded-lg transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                Book Demo
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="flex-1 w-full max-w-md">
            <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-[11px] font-semibold text-white/70">Shoolini University · Dashboard</span>
                <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Live
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2.5">
                {[
                  { label: "NIRF Score",     value: "65.0",  sub: "/ 100",         color: "#60A5FA" },
                  { label: "Estimated Rank", value: "#140",  sub: "Engineering",    color: "#FBBF24" },
                  { label: "Predicted Rank", value: "#60",   sub: "+80 positions",  color: "#34D399" },
                  { label: "Completion",      value: "42%",   sub: "RPC missing",   color: "#F87171" },
                ].map((k) => (
                  <div key={k.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-wider">{k.label}</p>
                    <p className="text-lg font-bold text-white mt-0.5">{k.value}</p>
                    <p className="text-[9px] font-medium mt-0.5" style={{ color: k.color }}>{k.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE METRICS ── */}
      <section style={{ background: "#fff" }}>
        <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-px" style={{ maxWidth: 1200, padding: "0 32px" }}>
          {[
            { label: "Current Rank",       value: "#140",   trend: "↑ 14 from last year" },
            { label: "Predicted Rank",     value: "#60",    trend: "87% confidence" },
            { label: "NIRF Score",         value: "65.0",   trend: "+7.2% year-over-year" },
            { label: "Improvement Potential", value: "+20 pts", trend: "With publication data" },
          ].map(({ label, value, trend }) => (
            <div key={label} className="py-8 px-6 border-b border-slate-100 text-center">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
              <p className="text-[11px] text-emerald-600 mt-1">{trend}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NIRF FRAMEWORK ── */}
      <section id="framework" style={{ background: "#FAFBFC" }}>
        <div className="mx-auto" style={{ maxWidth: 1200, padding: "64px 32px" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">NIRF Framework — All 5 Parameters</h2>
            <Link href="/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Open Dashboard <ArrowRight size={11} />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {PARAMS.map((p, i) => {
              const pct = (p.score / p.max) * 100;
              const gap = p.max - p.score;
              return (
                <div key={p.code} className="flex items-center gap-5 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                  style={i < PARAMS.length - 1 ? { borderBottom: "1px solid #F1F5F9" } : {}}>
                  <span className="text-[10px] font-bold text-white w-9 h-7 rounded flex items-center justify-center shrink-0" style={{ background: p.color }}>{p.code}</span>
                  <span className="text-sm font-medium text-slate-700 flex-1">{p.name}</span>
                  <span className="text-[11px] text-slate-400 w-16 text-right shrink-0">{p.weight}%</span>
                  <div className="w-40 shrink-0">
                    <div className="h-[6px] bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 w-20 text-right shrink-0">{p.score.toFixed(1)} / {p.max}</span>
                  <span className={`text-[10px] font-semibold w-16 text-center rounded py-0.5 shrink-0 ${
                    gap <= 1 ? "bg-emerald-50 text-emerald-700" : gap <= 5 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
                  }`}>{gap <= 1 ? "On Track" : `−${gap.toFixed(1)}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES (6 clean white cards) ── */}
      <section id="features" style={{ background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: 1200, padding: "64px 32px" }}>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Platform Features</h2>
          <p className="text-sm text-slate-400 mb-8">Everything you need to improve your NIRF ranking</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain,       title: "AI Rank Prediction",     desc: "Scenario-based forecasts with confidence scoring and what-if analysis." },
              { icon: Trophy,      title: "Peer Benchmarking",      desc: "Compare against IIT, NIT, and 200+ institutions across all parameters." },
              { icon: GitCompare,  title: "Gap Analysis",           desc: "Identify critical gaps with color-coded priority and action recommendations." },
              { icon: FlaskConical,title: "Research Intelligence",   desc: "Track publications, citations, patents, and sponsored research funding." },
              { icon: BarChart3,   title: "Data Collection",        desc: "NIRF-format forms pre-filled from PDF. CSV upload with downloadable template." },
              { icon: FileText,    title: "Executive Reports",      desc: "One-click PDF/Excel reports ready for NIRF submission review." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center mb-3">
                  <Icon size={17} className="text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ── */}
      <section style={{ background: "#FAFBFC" }}>
        <div className="mx-auto" style={{ maxWidth: 1200, padding: "64px 32px" }}>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Analytics at a Glance</h2>
          <p className="text-sm text-slate-400 mb-8">Real-time metrics from your NIRF data</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Score Trend",     val: "65.0",  trend: "+7.2%",  data: [48,52,55,58,62,65], color: "#1E40AF" },
              { title: "Rank Progress",   val: "#140",  trend: "↑ 14",   data: [30,45,50,55,60,70], color: "#10B981" },
              { title: "Patents Granted",  val: "43",    trend: "+29%",   data: [28,35,30,41,43],    color: "#7C3AED" },
              { title: "Placement Rate",   val: "71.3%", trend: "+105%",  data: [47,35,71],          color: "#06B6D4" },
            ].map(({ title, val, trend, data, color }) => (
              <div key={title} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2 mt-1 mb-4">
                  <span className="text-2xl font-bold text-slate-900">{val}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">{trend}</span>
                </div>
                <div className="flex items-end gap-1 h-10">
                  {data.map((v, i) => {
                    const max = Math.max(...data);
                    return <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.max((v/max)*100, 8)}%`, background: i === data.length - 1 ? color : "#E2E8F0" }} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI COPILOT ── */}
      <section id="copilot" style={{ background: "#fff" }}>
        <div className="mx-auto flex flex-col lg:flex-row items-center gap-12" style={{ maxWidth: 1200, padding: "64px 32px" }}>
          <div className="flex-1">
            <p className="text-xs font-semibold text-purple-600 mb-2">AI-POWERED</p>
            <h2 className="text-lg font-bold text-slate-900 mb-2">AI Copilot for NIRF</h2>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed" style={{ maxWidth: 360 }}>
              Ask questions in plain English. Get instant strategic insights backed by your real data.
            </p>
            <div className="space-y-1.5">
              {["How can I improve my rank?", "What is my biggest weakness?", "Which parameter needs attention?"].map((q) => (
                <div key={q} className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer flex items-center gap-2">
                  <MessageSquare size={12} className="opacity-40 shrink-0" /> {q}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
                <Sparkles size={14} className="text-white" />
                <span className="text-xs font-bold text-white">NIRF AI Copilot</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white text-[11px] rounded-xl rounded-br-sm px-3 py-2 max-w-[200px]">
                    What is my biggest weakness?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#7C3AED" }}>
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <div className="bg-slate-50 text-[11px] text-slate-600 rounded-xl rounded-bl-sm px-3 py-2 leading-relaxed">
                    <strong className="text-slate-900">RPC is your critical gap</strong> — 6.9/30 (23%). Enter publication data to add +12 points.
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 px-3 py-2 flex gap-2">
                <input type="text" placeholder="Ask about your data..." className="flex-1 text-[11px] bg-slate-50 rounded-lg px-3 py-2 border border-slate-100" readOnly />
                <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7C3AED" }}>
                  <Send size={12} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 1200, padding: "80px 32px" }}>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Ready to improve your NIRF ranking?</h2>
          <p className="text-sm text-slate-400 mb-8">Start with your data. The platform handles everything else.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard" className="bg-white text-slate-900 font-semibold text-sm px-7 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              Launch Platform <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="text-white/70 font-medium text-sm px-7 py-3 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              Book Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950">
        <div className="flex items-center justify-between mx-auto" style={{ maxWidth: 1200, padding: "24px 32px" }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#1E40AF" }}>
              <Trophy size={11} className="text-white" />
            </div>
            <span className="text-xs text-slate-500">NIRF Intelligence Platform</span>
          </div>
          <span className="text-[10px] text-slate-600">Shoolini University · IR-E-U-0190 · Solan, HP</span>
          <div className="flex gap-5 text-[11px] text-slate-600">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-400">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
