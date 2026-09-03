"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WalletsGrid({ wallets: initialWallets }) {
  const router = useRouter();
  const [wallets, setWallets] = useState(initialWallets);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const confirmDelete = async (id) => {
    setError("");
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/wallets/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setWallets((w) => w.filter((wallet) => wallet.id !== id));
      setConfirmId(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Deposit destinations</p>
          <h2 className="text-[13px] font-semibold text-ink">Platform wallets</h2>
        </div>
        <Link href="/admin/add-wallet" className="btn btn-primary btn-sm">
          Add wallet
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </p>
      )}

      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No wallets configured</p>
          <p className="mt-1 text-[11px] text-ink-faint">Investors won&rsquo;t be able to deposit until you add at least one.</p>
          <Link href="/admin/add-wallet" className="btn btn-primary btn-sm mt-4">
            Add wallet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {wallets.map((w) => (
            <div key={w.id} className="flex flex-col gap-3 rounded-xl border p-4" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[11px] font-semibold text-gold-ink"
                  style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
                >
                  {w.name}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{w.label}</p>
                  <p className="text-[10px] text-ink-faint">ID: {w.assetId}</p>
                </div>
              </div>

              <div className="rounded-lg border px-3 py-2" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
                <p className="mono truncate text-[11px] text-ink-dim">{w.address}</p>
                <p className="mt-1 text-[10px] text-ink-faint">Network: {w.network || "—"}</p>
              </div>

              {confirmId === w.id ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-medium text-ink">Delete the {w.label} wallet?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setConfirmId(null)} className="btn btn-ghost btn-sm flex-1">
                      Cancel
                    </button>
                    <button type="button" onClick={() => confirmDelete(w.id)} disabled={deleting === w.id} className="btn btn-sm flex-1" style={{ background: "var(--down)", color: "#fff" }}>
                      {deleting === w.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href={`/admin/wallets/edit/${w.id}`} className="btn btn-ghost btn-sm flex-1">
                    Edit
                  </Link>
                  <button type="button" onClick={() => setConfirmId(w.id)} className="btn btn-sm flex-1" style={{ borderColor: "var(--down)", color: "var(--down)", background: "transparent" }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
