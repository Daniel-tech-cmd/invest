const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TILE_ICON = {
  users: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  balance: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5S13.7 12 12 12s-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5" />
    </svg>
  ),
  deposit: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
  withdraw: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
};

export default function AdminStats({ users, pendingRequests }) {
  const totalUsers = users.length;
  const platformBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
  const pendingDeposits = pendingRequests.filter((n) => n.type === "deposit").length;
  const pendingWithdrawals = pendingRequests.filter((n) => n.type === "withdrawal").length;

  const tiles = [
    { key: "users", label: "Total users", value: totalUsers },
    { key: "balance", label: "Platform balance", value: fmt(platformBalance) },
    { key: "deposit", label: "Pending deposits", value: pendingDeposits, accent: pendingDeposits > 0 },
    { key: "withdraw", label: "Pending withdrawals", value: pendingWithdrawals, accent: pendingWithdrawals > 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.key} className="rounded-2xl border p-4" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] tracking-wide text-ink-faint">{t.label}</p>
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-gold-ink"
              style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
            >
              {TILE_ICON[t.key]}
            </div>
          </div>
          <p className={`mono text-2xl font-semibold leading-none ${t.accent ? "text-gold-ink" : "text-ink"}`}>{t.value}</p>
        </div>
      ))}
    </div>
  );
}
