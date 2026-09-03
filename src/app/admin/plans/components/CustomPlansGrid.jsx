"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPlansGrid({ plans: initialPlans }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const confirmDelete = async (id) => {
    setError("");
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setPlans((p) => p.filter((plan) => plan.id !== id));
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
          <p className="text-[11px] tracking-wide text-ink-faint">Beyond the standard catalog</p>
          <h2 className="text-[13px] font-semibold text-ink">Custom plans</h2>
        </div>
        <Link href="/admin/plans/add" className="btn btn-primary btn-sm">
          Add plan
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </p>
      )}

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12" style={{ borderColor: "var(--line-strong)" }}>
          <p className="text-[13px] font-medium text-ink">No custom plans yet</p>
          <p className="mt-1 text-[11px] text-ink-faint">Give a specific investor their own rate, or publish one to everyone.</p>
          <Link href="/admin/plans/add" className="btn btn-primary btn-sm mt-4">
            Add plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((p) => {
            return (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border p-4" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{p.name}</p>
                    <p className="mono mt-0.5 text-[11px] text-gold-ink">{p.rate}%/day &middot; {p.days}d &middot; min ${p.min.toLocaleString()}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-medium"
                    style={
                      p.visibility === "public"
                        ? { background: "rgba(34,192,138,0.1)", borderColor: "rgba(34,192,138,0.3)", color: "var(--grove-ink)" }
                        : { background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)", color: "var(--gold-ink)" }
                    }
                  >
                    {p.visibility === "public" ? "Public" : "Private"}
                  </span>
                </div>

                <div className="rounded-lg border px-3 py-2 text-[11px]" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
                  {p.visibility === "public" ? (
                    <span className="text-ink-dim">Visible to every investor</span>
                  ) : p.assignedUsername ? (
                    <>
                      <span className="text-ink-faint">Assigned to </span>
                      <Link href={`/admin/edit?query=${p.userId}`} className="font-medium text-gold-ink hover:underline">
                        {p.assignedUsername}
                      </Link>
                    </>
                  ) : (
                    <span className="text-ink-faint">No user assigned</span>
                  )}
                </div>

                {confirmId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-medium text-ink">Delete the {p.name} plan?</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setConfirmId(null)} className="btn btn-ghost btn-sm flex-1">
                        Cancel
                      </button>
                      <button type="button" onClick={() => confirmDelete(p.id)} disabled={deleting === p.id} className="btn btn-sm flex-1" style={{ background: "var(--down)", color: "#fff" }}>
                        {deleting === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href={`/admin/plans/edit/${p.id}`} className="btn btn-ghost btn-sm flex-1">
                      Edit
                    </Link>
                    <button type="button" onClick={() => setConfirmId(p.id)} className="btn btn-sm flex-1" style={{ borderColor: "var(--down)", color: "var(--down)", background: "transparent" }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
