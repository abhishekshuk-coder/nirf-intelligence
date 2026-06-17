"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { useNIRFData } from "@/hooks/useNIRFData";
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface Alert { id: string; type: "critical" | "warning" | "info" | "success"; title: string; desc: string }

export default function AlertsPage() {
  const { scores, data } = useNIRFData();
  const nirf = scores ?? { rpc: 0, tlr: 0, go: 0, oi: 0, pr: 0, total: 0, estimatedRank: 999, completeness: 0 };

  const hasPublications = (data?.rpc?.scopusPapers ?? 0) > 0;

  const autoAlerts: Alert[] = [
    !hasPublications && { id: "a1", type: "critical" as const, title: "Publications Data Missing from RPC", desc: "Scopus/WoS paper count not entered. Go to RPC Data Entry to add publication data." },
    ((data?.rpc?.sponsoredAmount ?? 0) < 5000000) && { id: "a2", type: "critical" as const, title: "Sponsored Research Funding Very Low", desc: "Research funding is far below competitive levels. Apply for DST/SERB grants." },
    (data?.rpc?.consultancyRevenue === 0) && { id: "a4", type: "warning" as const, title: "Zero Consultancy Revenue", desc: "No consultancy income recorded. Even 10-20L can improve RPC score." },
    { id: "a5", type: "success" as const, title: "Patent Performance Outstanding", desc: "81 patents published, 43 granted in 2024. Maximum patent score achieved." },
    { id: "a6", type: "success" as const, title: "OI Score Near Maximum", desc: "43.4% women, 56.9% outside state. Inclusivity is excellent." },
    nirf.go >= 14 && { id: "a7", type: "info" as const, title: "Placement Rate Recovery Strong", desc: "UG placement improved from 34.8% to 71.3%. Good recovery trend." },
  ].filter(Boolean) as Alert[];

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = autoAlerts.filter((a) => !dismissed.has(a.id));

  const ICONS = {
    critical: <AlertTriangle size={18} className="text-red-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    info: <Info size={18} className="text-blue-500" />,
    success: <CheckCircle size={18} className="text-green-500" />,
  };

  const BG: Record<string, string> = {
    critical: "border-red-200 background: #FEF2F2",
    warning: "border-amber-200",
    info: "border-blue-200",
    success: "border-green-200",
  };

  const BGS: Record<string, string> = {
    critical: "#FEF2F2",
    warning: "#FFFBEB",
    info: "#EFF6FF",
    success: "#F0FDF4",
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1F5F9" }}>
      <Header title="Alerts" subtitle={`${visible.length} active alerts for NIRF 2026`} />

      <main className="flex-1 p-6 space-y-3">
        {visible.map((alert) => (
          <div
            key={alert.id}
            className="rounded-xl border p-4 flex items-start gap-3"
            style={{ background: BGS[alert.type], borderColor: alert.type === "critical" ? "#FECACA" : alert.type === "warning" ? "#FDE68A" : alert.type === "info" ? "#BFDBFE" : "#BBF7D0" }}
          >
            <div className="shrink-0 mt-0.5">{ICONS[alert.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{alert.title}</p>
              <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
              className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">All clear</p>
            <p className="text-sm text-slate-400 mt-1">No active alerts. Reload to check again.</p>
          </div>
        )}
      </main>
    </div>
  );
}
