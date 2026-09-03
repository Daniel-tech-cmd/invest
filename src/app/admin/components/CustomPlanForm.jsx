"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };
const labelClass = "mb-1.5 block text-[11px] font-medium text-ink-faint";

export default function CustomPlanForm({ mode, initial, users = [] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    rate: initial?.rate != null ? String(initial.rate) : "",
    days: initial?.days != null ? String(initial.days) : "",
    min: initial?.min != null ? String(initial.min) : "",
    visibility: initial?.visibility || "private",
    userId: initial?.userId || "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rate || !form.days || !form.min) {
      setError("Fill in name, rate, term, and minimum.");
      return;
    }
    if (form.visibility === "private" && !form.userId) {
      setError("Pick which user this private plan is for.");
      return;
    }
    setError("");
    setSaving(true);

    try {
      const res = await fetch(mode === "add" ? "/api/admin/plans" : `/api/admin/plans/${initial.id}`, {
        method: mode === "add" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubmitted(true);
      router.push("/admin/plans");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-2xl border p-5 sm:p-6" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">{mode === "add" ? "New custom plan" : "Edit custom plan"}</p>
        <h2 className="text-[13px] font-semibold text-ink">{mode === "add" ? "Add custom plan" : "Edit custom plan"}</h2>
      </div>

      <div>
        <label className={labelClass} htmlFor="plan-name">Plan name</label>
        <input id="plan-name" type="text" value={form.name} onChange={set("name")} placeholder="e.g. Elite Plan" className={inputClass} style={fieldStyle} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="plan-rate">Daily rate (%)</label>
          <input id="plan-rate" type="number" step="0.1" value={form.rate} onChange={set("rate")} placeholder="5.5" className={`${inputClass} mono`} style={fieldStyle} />
        </div>
        <div>
          <label className={labelClass} htmlFor="plan-days">Term (days)</label>
          <input id="plan-days" type="number" value={form.days} onChange={set("days")} placeholder="60" className={`${inputClass} mono`} style={fieldStyle} />
        </div>
        <div>
          <label className={labelClass} htmlFor="plan-min">Minimum ($)</label>
          <input id="plan-min" type="number" value={form.min} onChange={set("min")} placeholder="2000" className={`${inputClass} mono`} style={fieldStyle} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Visibility</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, visibility: "private" }))}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              form.visibility === "private"
                ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            Private — one user
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, visibility: "public" }))}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              form.visibility === "public"
                ? { borderColor: "var(--grove)", background: "rgba(34,192,138,0.1)", color: "var(--grove-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            Public — everyone
          </button>
        </div>
        {form.visibility === "private" ? (
          <p className="mt-2 text-[10.5px] text-ink-faint">This replaces the standard plan catalog for the chosen user only.</p>
        ) : (
          <p className="mt-2 text-[10.5px] text-ink-faint">This is added to the standard plan catalog for every investor.</p>
        )}
      </div>

      {form.visibility === "private" && (
        <div>
          <label className={labelClass} htmlFor="plan-user">Assign to user</label>
          <select id="plan-user" value={form.userId} onChange={set("userId")} className={`${inputClass} cursor-pointer`} style={fieldStyle}>
            <option value="">Choose a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </div>
      )}

      {submitted && (
        <div className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}>
          {mode === "add" ? "Plan added." : "Changes saved."}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={() => router.push("/admin/plans")} className="btn btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
          {saving ? "Saving…" : mode === "add" ? "Add plan" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
