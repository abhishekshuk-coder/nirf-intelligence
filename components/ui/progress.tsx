"use client";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: "blue" | "red" | "gold" | "green";
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, max = 100, color = "blue", className, showLabel }: ProgressProps) {
  const pct = Math.min(100, (value / max) * 100);
  const colors = {
    blue:  "bg-blue-600",
    red:   "bg-red-500",
    gold:  "bg-amber-500",
    green: "bg-green-500",
  };
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn("h-2 rounded-full progress-bar transition-all duration-1000", colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{value}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
