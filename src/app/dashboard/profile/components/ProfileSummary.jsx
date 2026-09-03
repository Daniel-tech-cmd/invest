const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function ProfileSummary({ user }) {
  return (
    <div
      className="flex flex-col items-center gap-5 rounded-2xl border p-6 text-center sm:flex-row sm:text-left"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 text-2xl font-semibold text-gold-ink"
        style={{ background: "rgba(231,185,75,0.12)", borderColor: "var(--gold)" }}
      >
        {user.fullName?.[0] || user.username?.[0] || "U"}
      </div>

      <div className="flex-1">
        <h2 className="text-[15px] font-semibold text-ink">{user.fullName || user.username}</h2>
        <p className="mt-0.5 text-[12px] text-ink-faint">{user.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-center sm:text-right">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Account name</p>
          <p className="mono mt-0.5 text-[12px] font-medium text-ink">{user.username}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Account ID</p>
          <p className="mono mt-0.5 text-[12px] font-medium text-ink">{user.accountId}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink-faint">Member since</p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{fmtDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
