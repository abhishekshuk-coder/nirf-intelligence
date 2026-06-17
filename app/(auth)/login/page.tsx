"use client";
import Link from "next/link";
import { useState } from "react";
import { Trophy, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const DEMOS = [
  { role: "Vice Chancellor", email: "vc@shoolini.edu", password: "demo123" },
  { role: "IQAC Head", email: "iqac@shoolini.edu", password: "demo123" },
  { role: "Dean Research", email: "dean@shoolini.edu", password: "demo123" },
  { role: "Department Admin", email: "dept@shoolini.edu", password: "demo123" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    window.location.href = "/dashboard";
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Panel - hidden on mobile via CSS media query inline isn't possible, so we use a class */}
      <div
        className="hidden lg:flex"
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E40AF)",
          width: "45%", padding: "3rem", flexDirection: "column", justifyContent: "center", color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={20} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>NIRF Intelligence</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>Ranking Analytics Platform</p>
          </div>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: "1.5rem" }}>
          Predict. Benchmark.<br />Improve Rankings.
        </h2>
        {["Real-time NIRF score tracking", "AI-powered gap analysis", "Predictive ranking engine"].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.85, marginBottom: 10 }}>
            <span style={{ width: 20, height: 20, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>&#10003;</span>
            {t}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>Sign in to your NIRF Intelligence account</p>

          <form onSubmit={handleLogin}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" required
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, marginBottom: 16, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" /> Remember me
            </label>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "12px 0", background: loading ? "#3b82f6" : "linear-gradient(135deg, #1e40af, #3b82f6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? (<><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Signing in...</>) : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 24, paddingTop: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={12} /> Demo Access
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DEMOS.map((u) => (
                <button key={u.email} onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  style={{ textAlign: "left", padding: "10px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontSize: 12 }}>
                  <p style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>{u.role}</p>
                  <p style={{ color: "#94a3b8", fontSize: 10, margin: "2px 0 0" }}>{u.email}</p>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 }}>
            New institution? <Link href="/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
