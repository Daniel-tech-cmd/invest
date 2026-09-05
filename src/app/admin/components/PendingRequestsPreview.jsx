"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const KIND_ICON = {
  deposit: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
  withdrawal: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
};

export default function PendingRequestsPreview({ notifications }) {
  const router = useRouter();
  const [resolved, setResolved] = useState({});
  const [pending, setPending] = useState({});
  const [errors, setErrors] = useState({});

  const act = (n, outcome) => async (e) => {
    e.preventDefault();
    setErrors((err) => ({ ...err, [n.id]: "" }));
    setPending((p) => ({ ...p, [n.id]: true }));

    const kind = n.type === "deposit" ? "deposits" : "withdrawals";
    const action = outcome === "approved" ? "approve" : "decline";

    try {
      const res = await fetch(`/api/admin/${kind}/${n.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: n.userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((err) => ({ ...err, [n.id]: data.error || "Something went wrong." }));
        return;
      }
      setResolved((r) => ({ ...r, [n.id]: outcome }));
      router.refresh();
    } catch {
      setErrors((err) => ({ ...err, [n.id]: "Something went wrong. Please try again." }));
    } finally {
      setPending((p) => ({ ...p, [n.id]: false }));
    }
  };

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Needs review</p>
          <h2 className="text-[13px] font-semibold text-ink">Pending requests</h2>
        </div>
        <Link href="/admin/management" className="flex items-center gap-1 text-[11px] font-medium text-gold-ink hover:opacity-70">
          View all requests
          <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">All caught up</p>
          <p className="mt-1 text-[11px] text-ink-faint">No pending requests right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const outcome = resolved[n.id];
            const isPending = pending[n.id];
            const error = errors[n.id];
            return (
              <div
                key={n.id}
                className="flex flex-col gap-2 rounded-xl border px-4 py-3"
                style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-gold-ink"
                      style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                    >
                      {KIND_ICON[n.type]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-ink">
                        {n.username} &middot; {n.type === "deposit" ? "Deposit" : "Withdrawal"}
                      </p>
                      <p className="mono truncate text-[10px] text-ink-faint">
                        {n.method} {n.type === "deposit" ? `· ${n.plan}` : `· ${n.wallet}`} &middot; {fmtDate(n.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="mono text-[13px] font-semibold text-ink">{fmt(n.amount)}</span>
                    {outcome ? (
                      <span
                        className="rounded-full border px-2.5 py-1 text-[10.5px] font-medium capitalize"
                        style={
                          outcome === "approved"
                            ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                            : { background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }
                        }
                      >
                        {outcome}
                      </span>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={act(n, "declined")}
                          disabled={isPending}
                          className="btn btn-ghost btn-sm !py-1.5 !px-3 !text-[10.5px]"
                        >
                          {isPending ? "…" : "Decline"}
                        </button>
                        <button
                          onClick={act(n, "approved")}
                          disabled={isPending}
                          className="btn btn-primary btn-sm !py-1.5 !px-3 !text-[10.5px]"
                        >
                          {isPending ? "…" : "Approve"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {error && <p className="text-[10.5px] font-medium text-down">{error}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
