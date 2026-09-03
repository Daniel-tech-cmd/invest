"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
  " · " +
  new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const TABS = [
  { id: "deposit", label: "Deposits" },
  { id: "withdrawal", label: "Withdrawals" },
];

export default function FundingRequestsWorkspace({ notifications }) {
  const router = useRouter();
  const [tab, setTab] = useState("deposit");
  const [query, setQuery] = useState("");
  const [resolved, setResolved] = useState({});
  const [pending, setPending] = useState({});
  const [errors, setErrors] = useState({});
  const [receiptModal, setReceiptModal] = useState(null);

  const counts = useMemo(
    () => ({
      deposit: notifications.filter((n) => n.type === "deposit").length,
      withdrawal: notifications.filter((n) => n.type === "withdrawal").length,
    }),
    [notifications]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notifications.filter((n) => {
      if (n.type !== tab) return false;
      if (!q) return true;
      return n.username.toLowerCase().includes(q) || n.email.toLowerCase().includes(q);
    });
  }, [notifications, tab, query]);

  const act = (n, outcome) => async () => {
    setErrors((e) => ({ ...e, [n.id]: "" }));
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
        setErrors((e) => ({ ...e, [n.id]: data.error || "Something went wrong." }));
        return;
      }
      setResolved((r) => ({ ...r, [n.id]: outcome }));
      router.refresh();
    } catch {
      setErrors((e) => ({ ...e, [n.id]: "Something went wrong. Please try again." }));
    } finally {
      setPending((p) => ({ ...p, [n.id]: false }));
    }
  };

  const viewReceipt = (n) => () => {
    setReceiptModal(n);
  };

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Review requests</p>
          <h2 className="text-[13px] font-semibold text-ink">Funding requests</h2>
        </div>

        <div className="relative w-full max-w-xs">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username or email"
            className="w-full rounded-xl border py-2 pl-9 pr-3 text-[12px] text-ink outline-none placeholder:text-ink-faint"
            style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
          />
        </div>
      </div>

      <div className="mb-4 flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors"
            style={
              tab === t.id
                ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            {t.label}
            <span
              className="rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold"
              style={{ background: tab === t.id ? "rgba(231,185,75,0.2)" : "var(--surface-raised-2)" }}
            >
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">Nothing here</p>
          <p className="mt-1 text-[11px] text-ink-faint">No {tab === "deposit" ? "deposit" : "withdrawal"} requests match your search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => {
            const outcome = resolved[n.id];
            const status = outcome || "pending";
            return (
              <div key={n.id} className="flex flex-col gap-3 rounded-xl border p-4" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold text-gold-ink"
                      style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                    >
                      {n.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-ink">{n.username}</p>
                      <p className="text-[11px] text-ink-faint">{n.email}</p>
                    </div>
                  </div>
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10.5px] font-medium capitalize"
                    style={
                      status === "approved"
                        ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                        : status === "declined"
                          ? { background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }
                          : { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                    }
                  >
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 sm:grid-cols-4" style={{ borderColor: "var(--line)" }}>
                  <div>
                    <p className="text-[10px] text-ink-faint">Amount</p>
                    <p className="mono mt-0.5 text-[12.5px] font-semibold text-ink">{fmt(n.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Method</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink-dim">{n.method}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">{n.type === "deposit" ? "Plan" : "Wallet"}</p>
                    <p className="mono mt-0.5 truncate text-[12px] font-medium text-ink-dim">{n.type === "deposit" ? n.plan : n.wallet}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Requested</p>
                    <p className="mt-0.5 text-[12px] font-medium text-ink-dim">{fmtDate(n.date)}</p>
                  </div>
                </div>

                {n.note && (
                  <p className="rounded-lg border px-3 py-2 text-[11px] text-ink-dim" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
                    <span className="text-ink-faint">Note:</span> {n.note}
                  </p>
                )}

                {errors[n.id] && (
                  <p className="rounded-lg border px-3 py-2 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
                    {errors[n.id]}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {n.hasReceipt ? (
                    <button type="button" onClick={viewReceipt(n)} className="flex items-center gap-1.5 text-[11px] font-medium text-gold-ink hover:opacity-70">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View proof of payment
                    </button>
                  ) : (
                    <span />
                  )}

                  {outcome ? (
                    <span className="text-[11px] font-medium" style={{ color: "var(--grove-ink)" }}>
                      {outcome === "approved" ? "Approved." : "Declined."}
                    </span>
                  ) : (
                    <div className="flex gap-1.5">
                      <button onClick={act(n, "declined")} disabled={pending[n.id]} className="btn btn-ghost btn-sm !py-1.5 !px-3 !text-[10.5px]">
                        Decline
                      </button>
                      <button onClick={act(n, "approved")} disabled={pending[n.id]} className="btn btn-primary btn-sm !py-1.5 !px-3 !text-[10.5px]">
                        {pending[n.id] ? "Saving…" : "Approve"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {receiptModal && <ReceiptModal request={receiptModal} onClose={() => setReceiptModal(null)} />}
    </div>
  );
}

function ReceiptModal({ request, onClose }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-3 rounded-2xl border p-5"
        style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-wide text-ink-faint">Proof of payment</p>
            <h2 className="text-[13px] font-semibold text-ink">
              {request.username} &middot; {fmt(request.amount)}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm !px-2.5 !py-1.5" aria-label="Close">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={request.receiptUrl} alt="Deposit receipt" className="w-full object-contain" onError={() => setImgFailed(true)} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <p className="text-[12px] text-ink-faint">This receipt can&rsquo;t be previewed inline (likely a PDF).</p>
              <a href={request.receiptUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                Open receipt
              </a>
            </div>
          )}
        </div>

        <a href={request.receiptUrl} target="_blank" rel="noreferrer" className="text-center text-[11px] font-medium text-gold-ink hover:opacity-70">
          Open in a new tab
        </a>
      </div>
    </div>
  );
}
