"use client";
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/lib/mock-data";
import { Bell, AlertTriangle, CheckCircle, Clock, Lightbulb, Filter, Check, X } from "lucide-react";

const allAlerts = [
  ...alerts,
  { id: 6,  type: "red",   title: "PhD Faculty Below Target",         message: "PhD faculty at 66.7% vs target 75%. Need to hire 25 more PhD faculty.",           time: "4 days ago",   category: "TLR" },
  { id: 7,  type: "amber", title: "OI Score Needs Improvement",        message: "International student count at 42 vs target 60.",                                   time: "5 days ago",   category: "OI"  },
  { id: 8,  type: "green", title: "NAAC A+ Reaccreditation",           message: "NAAC peer team visit scheduled. Preparation score at 87%.",                         time: "1 week ago",   category: "PR"  },
  { id: 9,  type: "blue",  title: "New Research Grant Approved",        message: "DST-SERB grant of ₹45 Lakhs approved for biotech research.",                       time: "1 week ago",   category: "RPC" },
  { id: 10, type: "red",   title: "Sponsored Projects Below Target",    message: "Only 18 sponsored projects vs target 25. Revenue gap of ₹45 Lakhs.",              time: "2 weeks ago",  category: "RPC" },
];

const ALERT_CONFIG = {
  red:   { bg: "bg-red-50",   border: "border-red-200",   icon: AlertTriangle, iconColor: "text-red-500",   label: "Critical"    },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: Clock,         iconColor: "text-amber-500", label: "Warning"     },
  green: { bg: "bg-green-50", border: "border-green-200", icon: CheckCircle,   iconColor: "text-green-500", label: "Info"        },
  blue:  { bg: "bg-blue-50",  border: "border-blue-200",  icon: Lightbulb,     iconColor: "text-blue-500",  label: "Opportunity" },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "red" | "amber" | "green" | "blue">("all");
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const visible = allAlerts.filter((a) => !dismissed.has(a.id) && (filter === "all" || a.type === filter));
  const counts = { red: allAlerts.filter((a) => a.type === "red").length, amber: allAlerts.filter((a) => a.type === "amber").length, green: allAlerts.filter((a) => a.type === "green").length, blue: allAlerts.filter((a) => a.type === "blue").length };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Alerts & Notifications" subtitle="Real-time monitoring alerts for all NIRF parameters" />
      <main className="flex-1 p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: "red",   label: "Critical",     count: counts.red,   badgeVariant: "red"   as const },
            { type: "amber", label: "Warnings",     count: counts.amber, badgeVariant: "gold"  as const },
            { type: "green", label: "Info",         count: counts.green, badgeVariant: "green" as const },
            { type: "blue",  label: "Opportunities",count: counts.blue,  badgeVariant: "blue"  as const },
          ].map((s) => {
            const c = ALERT_CONFIG[s.type as keyof typeof ALERT_CONFIG];
            const Icon = c.icon;
            return (
              <button key={s.type} onClick={() => setFilter(filter === s.type as "all" ? "all" : s.type as typeof filter)}
                className={`card p-4 text-left transition-all ${filter === s.type ? `ring-2 ring-blue-400 ${c.bg}` : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon size={18} className={c.iconColor} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{s.count}</p>
                    <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {(["all", "red", "amber", "green", "blue"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              {f === "all" ? "All Alerts" : ALERT_CONFIG[f].label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">{visible.length} alerts</span>
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="card p-12 text-center">
              <Bell size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No alerts to show</p>
            </div>
          )}
          {visible.map((alert) => {
            const c = ALERT_CONFIG[alert.type as keyof typeof ALERT_CONFIG];
            const Icon = c.icon;
            return (
              <div key={alert.id} className={`card p-4 flex items-start gap-4 ${c.bg} border ${c.border}`}>
                <div className={`w-10 h-10 rounded-xl bg-white border ${c.border} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon size={18} className={c.iconColor} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900 text-sm">{alert.title}</p>
                    <Badge variant={alert.type === "red" ? "red" : alert.type === "amber" ? "gold" : alert.type === "green" ? "green" : "blue"}>
                      {c.label}
                    </Badge>
                    <Badge variant="gray" className="text-[10px]">{alert.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-1.5">{alert.time}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-1.5 rounded-lg hover:bg-green-100 text-slate-400 hover:text-green-600 transition-colors" title="Mark resolved">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setDismissed((p) => new Set([...p, alert.id]))}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors" title="Dismiss">
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Settings */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Notification Channels</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { channel: "Email",       icon: "📧", enabled: true,  desc: "admin@university.edu"   },
              { channel: "WhatsApp",    icon: "💬", enabled: true,  desc: "+91 98765 43210"         },
              { channel: "SMS",         icon: "📱", enabled: false, desc: "Not configured"          },
              { channel: "In-App",      icon: "🔔", enabled: true,  desc: "Always active"           },
            ].map((ch) => (
              <div key={ch.channel} className="p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{ch.channel}</p>
                  <p className="text-[10px] text-slate-400">{ch.desc}</p>
                </div>
                <div className={`w-8 h-4 rounded-full transition-colors ${ch.enabled ? "bg-blue-600" : "bg-slate-200"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-all mx-0.5 ${ch.enabled ? "translate-x-4" : ""}`} style={{ transform: ch.enabled ? "translateX(16px)" : "translateX(0)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
