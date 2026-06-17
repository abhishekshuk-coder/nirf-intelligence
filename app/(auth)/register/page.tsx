"use client";
import Link from "next/link";
import { useState } from "react";
import { Trophy, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900">NIRF Intelligence</p>
            <p className="text-slate-400 text-xs">Register Your Institution</p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create Account</h1>
        <p className="text-slate-500 text-sm mb-7">Start monitoring your NIRF ranking today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">First Name</label>
              <input type="text" placeholder="Rajesh" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Last Name</label>
              <input type="text" placeholder="Kumar" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Institution Name</label>
            <input type="text" placeholder="Your University Name" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Official Email</label>
            <input type="email" placeholder="admin@university.edu" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Your Role</label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50 text-slate-700">
              <option>Vice Chancellor</option>
              <option>Director / Principal</option>
              <option>IQAC Head</option>
              <option>Registrar</option>
              <option>Dean Academics</option>
              <option>Dean Research</option>
              <option>Department Head</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
            <input type="password" placeholder="Min 8 characters" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" required />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-sm font-bold">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
