import Link from "next/link";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function EditUserHeader({ user, referrer }) {
  const isAdmin = user.role === "admin" || user.role === "master admin";

  return (
    <div
      className="flex flex-col items-center gap-5 rounded-2xl border p-6 text-center sm:flex-row sm:text-left"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 text-2xl font-semibold text-gold-ink"
        style={{ background: "rgba(231,185,75,0.12)", borderColor: "var(--gold)" }}
      >
        {user.username[0].toUpperCase()}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h2 className="text-[15px] font-semibold text-ink">{user.username}</h2>
          <span
            className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
            style={
              isAdmin
                ? { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                : { background: "var(--surface-raised-2)", borderColor: "var(--line-strong)", color: "var(--ink-faint)" }
            }
          >
            {isAdmin ? user.role : "Investor"}
          </span>
          {user.suspended && (
            <span className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
              Suspended
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-ink-faint">{user.email}</p>
        <p className="mt-1.5 text-[11px] text-ink-faint">
          {user.referredby ? (
            <>
              Referred by{" "}
              {referrer ? (
                <Link href={`/admin/edit?query=${referrer.id}`} className="font-medium text-gold-ink hover:underline">
                  {user.referredby}
                </Link>
              ) : (
                <span className="font-medium text-ink-dim">{user.referredby}</span>
              )}
            </>
          ) : (
            <span>Joined directly — no referrer</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center sm:grid-cols-4 sm:text-right">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Balance</p>
          <p className="mono mt-0.5 text-[12px] font-medium text-ink">{fmt(user.balance)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Deposited</p>
          <p className="mono mt-0.5 text-[12px] font-medium text-ink">{fmt(user.totalDeposit)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Withdrawn</p>
          <p className="mono mt-0.5 text-[12px] font-medium text-ink">{fmt(user.totalWithdraw)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Joined</p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{fmtDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
