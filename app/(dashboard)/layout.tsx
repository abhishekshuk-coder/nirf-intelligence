import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: "var(--sidebar-width)" }}>
        {children}
      </div>
    </div>
  );
}
