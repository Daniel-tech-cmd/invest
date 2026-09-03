"use client";

import { useState } from "react";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OverviewStats({ user }) {
  const [copied, setCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);

  const referralLink = `https://goldgroveco.com/signup?r=${user.referralCode}`;

  const left = [
    { label: "Balance", value: fmt(user.balance) },
    { label: "Total withdrawn", value: fmt(user.totalWithdraw) },
    { label: "Total profit", value: fmt(user.profit) },
  ];
  const right = [
    { label: "Account ID", value: user.accountId, copy: true },
    { label: "Pending withdrawal", value: fmt(user.pendingWithdrawals) },
    { label: "Total deposited", value: fmt(user.totalDeposit) },
  ];

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const copyId = () => {
    navigator.clipboard?.writeText(user.accountId).catch(() => {});
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col divide-y sm:border-r" style={{ borderColor: "var(--line)" }}>
          {left.map((s) => (
            <div key={s.label} className="border-b px-6 py-4 last:border-b-0 sm:border-b" style={{ borderColor: "var(--line)" }}>
              <p className="mb-1 text-[11px] tracking-wide text-ink-faint">{s.label}</p>
              <p className="mono text-xl font-semibold leading-none text-ink">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--line)" }}>
          {right.map((s) => (
            <div key={s.label} className="border-b px-6 py-4 last:border-b-0 sm:border-b sm:text-right" style={{ borderColor: "var(--line)" }}>
              <p className="mb-1 text-[11px] tracking-wide text-ink-faint">{s.label}</p>
              <div className="flex items-center gap-2 sm:justify-end">
                <p className="mono text-xl font-semibold leading-none text-ink">{s.value}</p>
                {s.copy && (
                  <button
                    onClick={copyId}
                    className={`rounded p-1 transition-colors ${idCopied ? "text-grove-ink" : "text-ink-faint hover:text-ink"}`}
                    aria-label="Copy account ID"
                  >
                    {idCopied ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col border-t sm:flex-row" style={{ borderColor: "var(--line)", background: "var(--surface-raised-2)" }}>
        <div className="flex flex-1 items-center px-6 py-3">
          <span className="mono truncate text-[12px] text-ink-dim">{referralLink}</span>
        </div>
        <button
          onClick={copyLink}
          className={`shrink-0 border-t px-7 py-3 text-[12px] font-medium transition-colors sm:border-l sm:border-t-0 ${
            copied ? "text-white" : "text-[#211203]"
          }`}
          style={{ borderColor: "var(--line)", background: copied ? "var(--grove-ink)" : "var(--gold)" }}
        >
          {copied ? "Copied!" : "Copy referral link"}
        </button>
      </div>
    </div>
  );
}
