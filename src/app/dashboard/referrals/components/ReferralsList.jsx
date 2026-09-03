export default function ReferralsList({ user }) {
  const referrals = user.referals || [];

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4">
        <p className="text-[11px] tracking-wide text-ink-faint">History</p>
        <h2 className="text-[13px] font-semibold text-ink">Your referrals</h2>
      </div>

      {referrals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No referrals yet</p>
          <p className="mt-1 text-[11px] text-ink-faint">Share your link to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {referrals.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-gold-ink"
                  style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-ink">{r.name}</p>
                  <p className="mono truncate text-[10px] text-ink-faint">#{i + 1} &middot; ID {r.id}</p>
                </div>
              </div>

              <span
                className="shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-medium"
                style={
                  r.verified
                    ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                    : { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                }
              >
                {r.verified ? "Deposited" : "Pending deposit"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
