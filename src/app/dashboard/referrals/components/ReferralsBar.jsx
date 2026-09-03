const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReferralsBar({ user }) {
  const referrals = user.referals || [];
  const verified = referrals.filter((r) => r.verified).length;

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border p-5"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Total referrals</p>
        <p className="mono text-2xl font-semibold leading-none text-ink">{referrals.length}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Active (deposited)</p>
          <p className="mono text-base font-medium text-grove-ink">{verified}</p>
        </div>
        <div className="h-8 w-px" style={{ background: "var(--line)" }} />
        <div>
          <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Commission earned</p>
          <p className="mono text-base font-medium text-ink">{fmt(user.referralBonus)}</p>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium"
        style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        10% on deposits &amp; reinvestments
      </div>
    </div>
  );
}
