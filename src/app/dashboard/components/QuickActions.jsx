"use client";

import { useState } from "react";
import Link from "next/link";

const ACTIONS = [
  {
    id: "deposit",
    label: "Deposit",
    href: "/dashboard/deposit",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    ),
  },
  {
    id: "withdraw",
    label: "Withdraw",
    href: "/dashboard/withdraw",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    ),
  },
  {
    id: "reinvest",
    label: "Reinvest",
    href: "/dashboard/reinvest",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
  },
];

export default function QuickActions({ walletAddress = "TXn9k2FqZ8mR4dP1vC7yB3xW6sL0uAq4kQ2" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Wallet</p>
        <h2 className="text-[13px] font-semibold text-ink">Quick actions</h2>
      </div>

      <div className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
        <span className="mono flex-1 truncate text-[10px] text-ink-faint">{walletAddress}</span>
        <button
          onClick={handleCopy}
          className={`btn btn-sm shrink-0 !py-1.5 !px-2.5 !text-[10px] ${copied ? "" : "btn-primary"}`}
          style={copied ? { background: "var(--grove-ink)", color: "#fff" } : undefined}
          aria-label="Copy wallet address"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="h-px" style={{ background: "var(--line)" }} />

      <div className="grid grid-cols-3 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl border py-3 text-ink-dim transition-colors hover:text-gold-ink"
            style={{ borderColor: "var(--line)" }}
          >
            {action.icon}
            <span className="text-[10px]">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
