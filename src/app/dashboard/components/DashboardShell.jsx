"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardBottomNav from "./DashboardBottomNav";
import ImpersonationBanner from "./ImpersonationBanner";
import { mockUser } from "../../lib/mockUser";

export default function DashboardShell({ children, user = mockUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user.role === "admin" || user.role === "master admin";

  return (
    <div className="relative min-h-screen" style={{ background: "var(--surface)" }}>
      <DashboardSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} user={user} />

      <div className="flex min-h-screen flex-col lg:ml-64">
        <DashboardHeader onOpenMobileSidebar={() => setMobileOpen(true)} user={user} />
        <main className={`flex-1 space-y-5 px-4 pt-20 lg:px-8 lg:pb-10 ${isAdmin ? "pb-10" : "pb-24"}`}>
          {user.impersonatedBy && <ImpersonationBanner username={user.username} adminUsername={user.impersonatedBy.username} />}
          {children}
        </main>
        {!isAdmin && <DashboardBottomNav onOpenMore={() => setMobileOpen(true)} />}
      </div>
    </div>
  );
}
