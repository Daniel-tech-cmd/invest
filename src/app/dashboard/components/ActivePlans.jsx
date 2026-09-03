"use client";

import Link from "next/link";
import { planProgress } from "../../lib/plans";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ActivePlans({ deposits = [], customPlans = [] }) {
  const visible = deposits.filter((d) => !d.withdrawn);

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Portfolio</p>
          <h2 className="text-[13px] font-semibold text-ink">Active investment plans</h2>
        </div>
        <Link href="/#plans" className="flex items-center gap-1 text-[11px] font-medium text-gold-ink hover:opacity-70">
          Explore plans
          <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {visible.map((d) => {
            const { pct, daysElapsed, daysTotal, matured } = planProgress(d, customPlans);
            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border p-4" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-gold-ink"
                      style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-none text-ink">{d.plan}</p>
                      <p className="mt-0.5 text-[10px] text-ink-faint">{d.method}</p>
                    </div>
                  </div>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={
                      matured
                        ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                        : { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                    }
                  >
                    {matured ? "Completed" : "Active"}
                  </span>
                </div>

                <div>
                  <p className="mono text-2xl font-semibold leading-none text-grove-ink">+{fmt(d.profitToday)}</p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">Profit today</p>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-ink-faint">{matured ? "Term complete" : "Progress"}</span>
                    <span className="mono text-[11px] font-medium text-gold-ink">
                      {daysElapsed}/{daysTotal}d
                    </span>
                  </div>
                  <div className="h-[3px] overflow-hidden rounded-full" style={{ background: "var(--line-strong)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: matured ? "var(--grove-ink)" : "linear-gradient(90deg, var(--gold), var(--grove))" }}
                    />
                  </div>
                </div>

                <div className="h-px" style={{ background: "var(--line)" }} />

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-[10px] text-ink-faint">Invested</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink-dim">{fmt(d.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Total profit</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink-dim">{fmt(d.profit)}</p>
                  </div>
                </div>

                {matured && (
                  <Link href="/dashboard/withdraw" className="btn btn-primary btn-sm w-full">
                    Withdraw
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No active plans yet</p>
          <p className="mt-1 text-[11px] text-ink-faint">Start investing to see your portfolio here.</p>
          <Link href="/dashboard/deposit" className="btn btn-primary btn-sm mt-4">
            Get started
          </Link>
        </div>
      )}
    </div>
  );
}
