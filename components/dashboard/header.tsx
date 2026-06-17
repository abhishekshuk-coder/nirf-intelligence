"use client";
import { Bell, Search, Download, RefreshCw, Sparkles, Calendar } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100/80"
      style={{ height: "var(--header-height)", minHeight: "var(--header-height)" }}>
      <div className="h-full flex items-center justify-between px-8">
        {/* Left — Page Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Center — Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty, publications, patents, rankings..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all" title="AI Assistant">
            <Sparkles size={17} />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all" title="Refresh data">
            <RefreshCw size={17} />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all" title="Export">
            <Download size={17} />
          </button>
          <button className="relative p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all" title="Notifications">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
          <div className="w-px h-8 bg-slate-100 mx-1" />
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">NIRF Cycle 2025–26</span>
          </div>
        </div>
      </div>
    </header>
  );
}
