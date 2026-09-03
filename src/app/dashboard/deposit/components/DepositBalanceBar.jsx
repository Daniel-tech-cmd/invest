const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DepositBalanceBar({ user }) {
  const pendingDeposits = (user.deposit || [])
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border p-5"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Available balance</p>
        <p className="mono text-2xl font-semibold leading-none text-ink">{fmt(user.balance)}</p>
      </div>

      <div className="hidden items-center gap-6 sm:flex">
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total deposited</p>
          <p className="mono text-base font-medium text-ink">{fmt(user.totalDeposit)}</p>
        </div>
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Pending deposits</p>
          <p className="mono text-base font-medium text-gold-ink">{fmt(pendingDeposits)}</p>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium"
        style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
        Reviewed after confirmation
      </div>
    </div>
  );
}
