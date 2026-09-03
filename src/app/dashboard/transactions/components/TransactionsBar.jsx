const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TransactionsBar({ user }) {
  const count = (user.deposit?.length || 0) + (user.withdraw?.length || 0) + (user.earnHistory?.length || 0);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border p-5"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total transactions</p>
        <p className="mono text-2xl font-semibold leading-none text-ink">{count}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 w-px hidden sm:block" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total deposited</p>
          <p className="mono text-base font-medium text-ink">{fmt(user.totalDeposit)}</p>
        </div>
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total withdrawn</p>
          <p className="mono text-base font-medium text-ink">{fmt(user.totalWithdraw)}</p>
        </div>
        <div className="h-8 w-px hidden sm:block" style={{ background: "var(--line)" }} />
        <div className="hidden sm:block">
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total earned</p>
          <p className="mono text-base font-medium text-grove-ink">{fmt(user.profit)}</p>
        </div>
      </div>
    </div>
  );
}
