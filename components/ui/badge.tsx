"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "red" | "gold" | "green" | "gray";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "blue", size = "md", className }: BadgeProps) {
  const styles = {
    blue:  "bg-blue-50 text-blue-700 border border-blue-200",
    red:   "bg-red-50 text-red-700 border border-red-200",
    gold:  "bg-amber-50 text-amber-700 border border-amber-200",
    green: "bg-green-50 text-green-700 border border-green-200",
    gray:  "bg-slate-50 text-slate-700 border border-slate-200",
  };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-semibold",
      size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
      styles[variant], className,
    )}>
      {children}
    </span>
  );
}
