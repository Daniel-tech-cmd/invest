"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import useThemeToggle from "../../hooks/useThemeToggle";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    href: "/dashboard/deposit",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    ),
  },
  {
    label: "Withdraw",
    href: "/dashboard/withdraw",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  {
    label: "Reinvest",
    href: "/dashboard/reinvest",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "Referrals",
    href: "/dashboard/referrals",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

const ADMIN_ITEMS = [
  {
    label: "Admin",
    href: "/admin",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 4.97-3.4 8.94-8 10-4.6-1.06-8-5.03-8-10V6l8-4z" />
      </svg>
    ),
    exact: true,
  },
  {
    label: "Funding requests",
    href: "/admin/management",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    label: "Custom plans",
    href: "/admin/plans",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10M18 20V4M6 20v-4" />
      </svg>
    ),
  },
  {
    label: "Wallets",
    href: "/admin/wallets",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <circle cx="17" cy="15" r="1" />
      </svg>
    ),
  },
  {
    label: "Add wallet",
    href: "/admin/add-wallet",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
];

const ACCOUNT_ITEMS = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function BrandMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="" width={26} height={26} className="shrink-0" />;
}

export default function DashboardSidebar({ mobileOpen, onClose, user }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useThemeToggle();
  const isAdmin = user.role === "admin" || user.role === "master admin";

  const isItemActive = (item) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));

  const linkClass = (isActive) =>
    `flex items-center gap-3 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors ${
      isActive ? "border-transparent" : "border-transparent text-ink-dim hover:bg-surface-raised-2 hover:text-ink"
    }`;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
      >
        <div className="flex items-center gap-2.5 border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
          <BrandMark />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-bold leading-none tracking-tight text-ink">GoldGroveco</span>
            <span className="mono mt-0.5 text-[10px] tracking-wide text-gold-ink">{isAdmin ? "Admin panel" : "Dashboard"}</span>
          </div>
          <button onClick={onClose} className="ml-auto p-1 text-ink-faint hover:text-ink lg:hidden" aria-label="Close sidebar">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-ink-faint">Main menu</p>
          {(isAdmin ? ADMIN_ITEMS : NAV_ITEMS).map((item) => {
            const isActive = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={linkClass(isActive)}
                style={
                  isActive
                    ? { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.3)", color: "var(--gold-ink)" }
                    : undefined
                }
              >
                <span className={isActive ? "text-gold-ink" : "opacity-70"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <div className="mx-3 my-3 h-px" style={{ background: "var(--line)" }} />

          <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-ink-faint">Account</p>
          {ACCOUNT_ITEMS.map((item) => {
            const isActive = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={linkClass(isActive)}
                style={
                  isActive
                    ? { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.3)", color: "var(--gold-ink)" }
                    : undefined
                }
              >
                <span className={isActive ? "text-gold-ink" : "opacity-70"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left text-[13px] font-medium text-down/70 transition-colors hover:bg-down/5 hover:text-down"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </nav>

        <div className="mx-3 mb-2 flex items-center gap-3 rounded-xl border px-3 py-3" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border" style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}>
            <svg className="h-4 w-4 text-gold-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-[12px] font-semibold leading-none text-ink">{user.fullName}</p>
            <p className="mt-1 truncate text-[10px] text-ink-faint">{user.email}</p>
          </div>
        </div>

        <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
            <span className="text-[11px] font-medium text-ink-dim">{isDark ? "Dark mode" : "Light mode"}</span>
            <button
              onClick={toggleTheme}
              className="relative h-5 w-9 rounded-full transition-colors duration-300"
              style={{ background: isDark ? "var(--gold)" : "var(--line-strong)" }}
              aria-label="Toggle theme"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  isDark ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
