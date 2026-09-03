import Link from "next/link";

const COINS = [
  { name: "BTC", accountKey: "bitcoinAccountId", networkKey: "bitcoinNetwork", label: "Bitcoin" },
  { name: "ETH", accountKey: "ethereumAccountId", networkKey: "ethereumNetwork", label: "Ethereum" },
  { name: "LTC", accountKey: "litecoinAccountId", networkKey: "litecoinNetwork", label: "Litecoin" },
  { name: "USDT", accountKey: "usdtAccountId", networkKey: "usdtNetwork", label: "Tether USDT" },
  { name: "DOGE", accountKey: "dogeAccountId", networkKey: "dogeNetwork", label: "Dogecoin" },
];

export default function PayoutWallets({ user }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Payout destinations</p>
        <h2 className="text-[13px] font-semibold text-ink">Your wallets</h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {COINS.map((c) => {
          const address = user[c.accountKey];
          const network = user[c.networkKey];
          return (
            <div key={c.name} className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-ink">{c.label}</p>
                {address ? (
                  <p className="mono truncate text-[10px] text-ink-faint">
                    {address}
                    {network ? ` · ${network}` : ""}
                  </p>
                ) : (
                  <p className="text-[10px] text-ink-faint">No address saved</p>
                )}
              </div>
              <span
                className="shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
                style={
                  address
                    ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                    : { background: "var(--surface-raised)", borderColor: "var(--line-strong)", color: "var(--ink-faint)" }
                }
              >
                {address ? "Set" : "Not set"}
              </span>
            </div>
          );
        })}
      </div>

      <Link href="/dashboard/profile" className="btn btn-ghost btn-sm w-full">
        Manage payout wallets
      </Link>
    </div>
  );
}
