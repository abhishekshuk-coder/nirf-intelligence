"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BarChart3, TrendingUp, GitCompare, Target,
  Map, MessageSquareText, FileText, Bell, BookOpen,
  FlaskConical, GraduationCap, Users, Star, LogOut,
  Trophy, ChevronRight, Sparkles, Shield, Upload,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard",           icon: LayoutDashboard, label: "Executive Dashboard" },
      { href: "/dashboard/analytics", icon: BarChart3,       label: "Analytics" },
    ],
  },
  {
    label: "NIRF Data Entry",
    items: [
      { href: "/dashboard/data-upload",    icon: Upload,        label: "Upload Data (CSV)" },
      { href: "/dashboard/data-entry/tlr", icon: BookOpen,      label: "TLR – Teaching & Resources" },
      { href: "/dashboard/data-entry/rpc", icon: FlaskConical,  label: "RPC – Research" },
      { href: "/dashboard/data-entry/go",  icon: GraduationCap, label: "GO – Graduation Outcomes" },
      { href: "/dashboard/data-entry/oi",  icon: Users,         label: "OI – Outreach & Inclusivity" },
      { href: "/dashboard/data-entry/pr",  icon: Star,          label: "PR – Perception" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/dashboard/gap-analysis", icon: GitCompare,  label: "Gap Analysis" },
      { href: "/dashboard/benchmarking", icon: Trophy,       label: "Benchmarking" },
      { href: "/dashboard/prediction",   icon: TrendingUp,   label: "Rank Prediction" },
      { href: "/dashboard/roadmap",      icon: Map,          label: "Strategic Roadmap" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/dashboard/ai-copilot", icon: Sparkles,          label: "AI Copilot" },
      { href: "/dashboard/reports",    icon: FileText,           label: "Report Generator" },
      { href: "/dashboard/alerts",     icon: Bell,               label: "Smart Alerts", badge: 3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40"
      style={{ width: "var(--sidebar-width)", background: "var(--sidebar-bg)" }}>

      {/* ── Logo ── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center shadow-lg">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm leading-tight tracking-tight">NIRF Intelligence</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Ranking Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* ── University Card ── */}
      <div className="mx-4 mb-4 p-3.5 rounded-xl" style={{ background: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Shield size={12} className="text-blue-400" />
          <p className="text-[11px] font-bold text-blue-300 truncate">Shoolini University</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Rank</span>
          <span className="text-base font-black text-white">#47</span>
          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">↑14</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={cn("sidebar-item group", isActive && "active")}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                      isActive
                        ? "bg-blue-500/15"
                        : "bg-transparent group-hover:bg-white/5"
                    )}>
                      <Icon size={16} className={cn(
                        "transition-colors",
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                      )} />
                    </div>
                    <span className="flex-1 truncate">{item.label}</span>
                    {"badge" in item && item.badge ? (
                      <span className="text-[9px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>
                    ) : isActive ? (
                      <ChevronRight size={13} className="text-blue-400 opacity-60" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md">VC</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-300 truncate">Vice Chancellor</p>
            <p className="text-[10px] text-slate-600">Super Admin</p>
          </div>
          <LogOut size={15} className="text-slate-600 hover:text-red-400 cursor-pointer transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
