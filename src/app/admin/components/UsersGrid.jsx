"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function UsersGrid({ users }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Directory</p>
          <h2 className="text-[13px] font-semibold text-ink">All users</h2>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No users found</p>
          <p className="mt-1 text-[11px] text-ink-faint">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((u) => {
            const isAdmin = u.role === "admin" || u.role === "master admin";
            const activePlans = (u.activeDeposit || []).filter((d) => !d.stopped).length;
            return (
              <Link
                key={u.id}
                href={`/admin/edit?query=${u.id}`}
                className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:border-gold"
                style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[12px] font-semibold text-gold-ink"
                      style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                    >
                      {u.username[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-ink">{u.username}</p>
                      <p className="truncate text-[10px] text-ink-faint">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
                      style={
                        isAdmin
                          ? { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                          : { background: "var(--surface-raised)", borderColor: "var(--line-strong)", color: "var(--ink-faint)" }
                      }
                    >
                      {isAdmin ? "Admin" : "Investor"}
                    </span>
                    {u.suspended && (
                      <span
                        className="rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
                        style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}
                      >
                        Suspended
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3" style={{ borderColor: "var(--line)" }}>
                  <div>
                    <p className="text-[10px] text-ink-faint">Balance</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink">{fmt(u.balance)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Active plans</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink">{activePlans}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Total deposited</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink-dim">{fmt(u.totalDeposit)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Total withdrawn</p>
                    <p className="mono mt-0.5 text-[12px] font-medium text-ink-dim">{fmt(u.totalWithdraw)}</p>
                  </div>
                </div>

                <p className="text-[10px] text-ink-faint">Joined {fmtDate(u.createdAt)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
