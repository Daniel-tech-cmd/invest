"use client";

import { useMemo, useState } from "react";

const TABS = [
  { id: "all", label: "All" },
  { id: "deposit", label: "Deposits" },
  { id: "withdraw", label: "Withdrawals" },
  { id: "earning", label: "Earnings" },
];

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
  " · " +
  new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function shortId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i) | 0;
  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8).toUpperCase();
}

const STATUS_STYLE = {
  approved: { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" },
  pending: { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" },
  declined: { background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" },
};

const KIND_ICON = {
  deposit: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
  withdraw: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  earning: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  ),
};

export default function TransactionsTable({ user }) {
  const [tab, setTab] = useState("all");

  const rows = useMemo(() => {
    const deposits = (user.deposit || []).map((d) => ({
      kind: "deposit",
      key: `dep-${d.id}`,
      amount: d.amount,
      sign: "+",
      status: d.status,
      date: d.date,
      title: `Deposit · ${d.plan}`,
      subtitle: `${d.method} · #${shortId(d.id)}`,
    }));
    const withdrawals = (user.withdraw || []).map((w) => ({
      kind: "withdraw",
      key: `wd-${w.id}`,
      amount: w.amount,
      sign: "−",
      status: w.status,
      date: w.date,
      title: `Withdrawal · ${w.method}`,
      subtitle: `${w.wallet} · #${shortId(w.id)}`,
    }));
    const earnings = (user.earnHistory || []).map((e) => ({
      kind: "earning",
      key: `earn-${e.id}`,
      amount: e.amount,
      sign: "+",
      status: "approved",
      date: e.date,
      title: `Profit credit · ${e.plan}`,
      subtitle: `On ${fmt(e.depositAmount)} deposit · #${shortId(e.id)}`,
    }));

    return [...deposits, ...withdrawals, ...earnings].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [user]);

  const filtered = tab === "all" ? rows : rows.filter((r) => r.kind === tab);

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Ledger</p>
          <h2 className="text-[13px] font-semibold text-ink">All activity</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors"
              style={
                tab === t.id
                  ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                  : { borderColor: "var(--line)", color: "var(--ink-faint)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No transactions yet</p>
          <p className="mt-1 text-[11px] text-ink-faint">Activity in this category will show up here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((r) => (
            <div
              key={r.key}
              className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-gold-ink"
                  style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                >
                  {KIND_ICON[r.kind]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-ink">{r.title}</p>
                  <p className="mono truncate text-[10px] text-ink-faint">{r.subtitle}</p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className={`mono text-[13px] font-semibold ${r.sign === "+" ? "text-grove-ink" : "text-ink"}`}>
                  {r.sign}
                  {fmt(r.amount)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="hidden text-[10px] text-ink-faint sm:inline">{fmtDate(r.date)}</span>
                  <span className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium capitalize" style={STATUS_STYLE[r.status] || STATUS_STYLE.approved}>
                    {r.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
