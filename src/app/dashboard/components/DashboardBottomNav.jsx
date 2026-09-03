"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    label: "Home",
    href: "/dashboard",
    exact: true,
    icon: (
      <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    href: "/dashboard/deposit",
    icon: (
      <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5v10M8 9.5l4 4 4-4" />
        <path d="M4.5 20h15" />
      </svg>
    ),
  },
  {
    label: "Withdraw",
    href: "/dashboard/withdraw",
    icon: (
      <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 13.5v-10M8 7.5l4-4 4 4" />
        <path d="M4.5 20h15" />
      </svg>
    ),
  },
  {
    label: "Activity",
    href: "/dashboard/transactions",
    icon: (
      <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 20v-5.5" />
        <path d="M12 20V9" />
        <path d="M18.5 20V5" />
      </svg>
    ),
  },
];

const MORE_ICON = (
  <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="19" cy="12" r="1.7" />
  </svg>
);

export default function DashboardBottomNav({ onOpenMore }) {
  const pathname = usePathname();
  const isTabActive = (tab) => (tab.exact ? pathname === tab.href : pathname.startsWith(tab.href));
  const moreActive = !TABS.some(isTabActive);

  const badgeStyle = (active) => ({ background: active ? "rgba(231,185,75,0.14)" : "transparent" });
  const iconColor = (active) => ({ color: active ? "var(--gold-ink)" : "var(--ink-faint)" });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t backdrop-blur-xl lg:hidden"
      style={{ background: "var(--scrim)", borderColor: "var(--line)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((tab) => {
        const active = isTabActive(tab);
        return (
          <Link key={tab.href} href={tab.href} className="flex flex-1 flex-col items-center justify-center gap-1 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-200" style={{ ...badgeStyle(active), ...iconColor(active) }}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium transition-colors duration-200" style={iconColor(active)}>
              {tab.label}
            </span>
          </Link>
        );
      })}
      <button type="button" onClick={onOpenMore} className="flex flex-1 flex-col items-center justify-center gap-1 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-200" style={{ ...badgeStyle(moreActive), ...iconColor(moreActive) }}>
          {MORE_ICON}
        </span>
        <span className="text-[10px] font-medium transition-colors duration-200" style={iconColor(moreActive)}>
          More
        </span>
      </button>
    </nav>
  );
}
