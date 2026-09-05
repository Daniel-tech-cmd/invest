"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useThemeToggle from "../../hooks/useThemeToggle";
import NotificationBell from "./NotificationBell";

const TITLES = {
  "/dashboard": "Account Overview",
  "/dashboard/deposit": "Deposit",
  "/dashboard/withdraw": "Withdraw",
  "/dashboard/reinvest": "Reinvest",
  "/dashboard/transactions": "Transactions",
  "/dashboard/referrals": "Referrals",
  "/dashboard/profile": "Profile",
  "/admin": "User Management",
  "/admin/management": "Funding Requests",
  "/admin/edit": "Edit User",
  "/admin/wallets": "Wallets",
  "/admin/add-wallet": "Add Wallet",
  "/admin/broadcast": "Broadcast Email",
  "/dashboard/notifications": "Notifications",
};

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/wallets/edit")) return "Edit Wallet";
  if (pathname.startsWith("/admin")) return "Admin";
  return "Account Dashboard";
}

export default function DashboardHeader({ onOpenMobileSidebar, user, initialUnreadCount = 0 }) {
  const { isDark, toggleTheme } = useThemeToggle();
  const pathname = usePathname();
  const isAdmin = user.role === "admin" || user.role === "master admin";
  const title = resolveTitle(pathname);

  const btnClass =
    "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:text-ink";

  return (
    <header
      className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b px-4 backdrop-blur-xl lg:left-64 lg:px-8"
      style={{ background: "var(--scrim)", borderColor: "var(--line)" }}
    >
      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-lg border p-2 text-ink-dim transition-colors hover:text-ink lg:hidden"
            style={{ borderColor: "var(--line-strong)" }}
            aria-label="Open menu"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}
        <div className="flex flex-col">
          <span className="text-[11px] font-normal tracking-wide text-ink-faint">GoldGroveco</span>
          <h1 className="text-sm font-semibold leading-none text-ink">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium text-ink-dim sm:flex"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--grove-ink)" }} />
          Live
        </div>

        <button onClick={toggleTheme} className={btnClass + " hidden text-ink-dim lg:flex"} style={{ borderColor: "var(--line-strong)" }} aria-label="Toggle theme">
          {isDark ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          {isDark ? "Light" : "Dark"}
        </button>

        <NotificationBell initialUnreadCount={initialUnreadCount} />

        <div className="hidden h-5 w-px lg:block" style={{ background: "var(--line-strong)" }} />

        <Link
          href={isAdmin ? "/admin" : "/dashboard/profile"}
          className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors hover:bg-surface-raised-2"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border" style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}>
            <svg className="h-3 w-3 text-gold-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-[12px] font-medium leading-none text-ink">{user.fullName}</span>
            <span className="mt-0.5 text-[10px] text-ink-faint">{isAdmin ? "Admin account" : "Investor account"}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
