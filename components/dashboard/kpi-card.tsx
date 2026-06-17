"use client";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  variant?: "blue" | "red" | "gold" | "green";
  icon?: React.ReactNode;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function KPICard({
  title, value, subtitle, change, changeLabel, variant = "blue", icon, className, suffix, prefix,
}: KPICardProps) {
  const borderColors = { blue: "border-t-blue-600", red: "border-t-red-500", gold: "border-t-amber-500", green: "border-t-green-500" };
  const iconBg       = { blue: "bg-blue-50 text-blue-600", red: "bg-red-50 text-red-500", gold: "bg-amber-50 text-amber-500", green: "bg-green-50 text-green-500" };

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={cn("card kpi-blue bg-white rounded-xl p-5 border-t-4 group cursor-default", borderColors[variant], className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500 leading-tight">{title}</p>
        {icon && (
          <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", iconBg[variant])}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-1">
        {prefix && <span className="text-sm text-slate-400 mb-1">{prefix}</span>}
        <span className="text-2xl font-bold text-slate-900 animate-count-up">{value}</span>
        {suffix && <span className="text-sm text-slate-400 mb-1">{suffix}</span>}
      </div>
      {(change !== undefined || subtitle) && (
        <div className="mt-2 flex items-center gap-1.5">
          {change !== undefined && (
            <span className={cn("flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
              isPositive ? "text-green-700 bg-green-50" :
              isNegative ? "text-red-600 bg-red-50" :
              "text-slate-500 bg-slate-50"
            )}>
              {isPositive ? <TrendingUp size={11} /> : isNegative ? <TrendingDown size={11} /> : <Minus size={11} />}
              {isPositive ? "+" : ""}{change}{change && "%"}
            </span>
          )}
          {changeLabel && <span className="text-xs text-slate-400">{changeLabel}</span>}
          {!changeLabel && subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
