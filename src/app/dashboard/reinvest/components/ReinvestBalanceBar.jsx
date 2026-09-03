const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReinvestBalanceBar({ user }) {
  // Referral commissions are withdraw-only, never reinvestable.
  const reinvestable = Math.max(0, (user.balance || 0) - (user.referralBonus || 0));

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border p-5"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Reinvestable balance</p>
        <p className="mono text-2xl font-semibold leading-none text-ink">{fmt(reinvestable)}</p>
      </div>

      <div className="hidden items-center gap-6 sm:flex">
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total profit</p>
          <p className="mono text-base font-medium text-ink">{fmt(user.profit)}</p>
        </div>
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Promo balance</p>
          <p className="mono text-base font-medium text-gold-ink">{fmt(user.promoBonus)}</p>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium"
        style={{ background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
        </svg>
        No fees &middot; instant activation
      </div>
    </div>
  );
}
