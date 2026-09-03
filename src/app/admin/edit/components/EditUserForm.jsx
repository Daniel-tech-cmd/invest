"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS } from "../../../lib/plans";

const COINS = [
  { name: "Bitcoin (BTC)", accountKey: "bitcoinAccountId", networkKey: "bitcoinNetwork" },
  { name: "Ethereum (ETH)", accountKey: "ethereumAccountId", networkKey: "ethereumNetwork" },
  { name: "Litecoin (LTC)", accountKey: "litecoinAccountId", networkKey: "litecoinNetwork" },
  { name: "Dogecoin (DOGE)", accountKey: "dogeAccountId", networkKey: "dogeNetwork" },
  { name: "Tether (USDT)", accountKey: "usdtAccountId", networkKey: "usdtNetwork" },
];

const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };
const labelClass = "mb-1.5 block text-[11px] font-medium text-ink-faint";

function Toggle({ on, onClick, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-3.5 py-2.5" style={fieldStyle}>
      <span className="text-[12px] font-medium text-ink-dim">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300"
        style={{ background: on ? "var(--gold)" : "var(--line-strong)" }}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${on ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function EditUserForm({ user }) {
  const [form, setForm] = useState(() => {
    const initial = {
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
      number: user.number || "",
      country: user.country || "",
      balance: String(user.balance ?? 0),
      minimumWithdrawal: String(user.minimumWithdrawal ?? 0),
      verified: !!user.verified,
      suspended: !!user.suspended,
      restrictionMessage: user.restrictionMessage || "",
      plan: "",
    };
    for (const c of COINS) {
      initial[c.accountKey] = user[c.accountKey] || "";
      initial[c.networkKey] = user[c.networkKey] || "";
    }
    return initial;
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSubmitted(false);
    setError("");
  };
  const toggle = (key) => () => {
    setForm((f) => ({ ...f, [key]: !f[key] }));
    setSubmitted(false);
    setError("");
  };

  const balanceChanged = String(user.balance ?? 0) !== form.balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setSaving(true);

    const payload = {
      username: form.username,
      email: form.email,
      role: form.role,
      number: form.number,
      country: form.country,
      balance: Number(form.balance),
      minimumWithdrawal: Number(form.minimumWithdrawal),
      verified: form.verified,
      suspended: form.suspended,
      restrictionMessage: form.restrictionMessage,
    };
    if (balanceChanged && form.plan) payload.plan = form.plan;
    for (const c of COINS) {
      payload[c.accountKey] = form[c.accountKey];
      payload[c.networkKey] = form[c.networkKey];
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border p-5 sm:p-6" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Manage account</p>
        <h2 className="text-[13px] font-semibold text-ink">Edit user</h2>
      </div>

      <div>
        <h3 className="mb-3 text-[12px] font-semibold text-ink">Account details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="edit-username">Username</label>
            <input id="edit-username" type="text" value={form.username} onChange={set("username")} className={inputClass} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-email">Email</label>
            <input id="edit-email" type="email" value={form.email} onChange={set("email")} className={inputClass} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-role">Role</label>
            <select id="edit-role" value={form.role} onChange={set("role")} className={`${inputClass} cursor-pointer`} style={fieldStyle}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="master admin">Master admin</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-phone">Phone number</label>
            <input id="edit-phone" type="text" value={form.number} onChange={set("number")} placeholder="Not set" className={inputClass} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-country">Country</label>
            <input id="edit-country" type="text" value={form.country} onChange={set("country")} placeholder="Not set" className={inputClass} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-promo">Promo bonus</label>
            <input id="edit-promo" type="text" readOnly value={`$${(user.promoBonus || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} className={`${inputClass} cursor-not-allowed opacity-70`} style={fieldStyle} />
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--line)" }} />

      <div>
        <h3 className="mb-3 text-[12px] font-semibold text-ink">Balance &amp; status</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="edit-balance">Account balance</label>
            <input id="edit-balance" type="number" value={form.balance} onChange={set("balance")} className={`${inputClass} mono`} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="edit-min-withdrawal">Minimum withdrawal</label>
            <input id="edit-min-withdrawal" type="number" value={form.minimumWithdrawal} onChange={set("minimumWithdrawal")} className={`${inputClass} mono`} style={fieldStyle} />
          </div>

          {balanceChanged && (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="edit-plan">Credit this balance change to</label>
              <select id="edit-plan" value={form.plan} onChange={set("plan")} className={`${inputClass} cursor-pointer`} style={fieldStyle}>
                <option value="">No plan — adjust balance only</option>
                {Object.entries(PLANS).map(([name, p]) => (
                  <option key={name} value={name}>
                    {name} · min ${p.min.toLocaleString()} · {p.rate}%/day
                  </option>
                ))}
              </select>
            </div>
          )}

          <Toggle on={form.verified} onClick={toggle("verified")} label="Verified" />
          <Toggle on={form.suspended} onClick={toggle("suspended")} label="Suspended" />

          {form.suspended && (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="edit-restriction">Restriction message (shown to the user)</label>
              <input
                id="edit-restriction"
                type="text"
                value={form.restrictionMessage}
                onChange={set("restrictionMessage")}
                placeholder="Reason the account is suspended"
                className={inputClass}
                style={fieldStyle}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--line)" }} />

      <div>
        <h3 className="mb-1 text-[12px] font-semibold text-ink">Payout wallets</h3>
        <p className="mb-3 text-[11px] text-ink-faint">The addresses this user&rsquo;s withdrawals get sent to.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COINS.map((c) => (
            <div key={c.accountKey} className="rounded-xl border p-3.5" style={fieldStyle}>
              <p className="mb-2 text-[11.5px] font-medium text-ink">{c.name}</p>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={form[c.accountKey]}
                  onChange={set(c.accountKey)}
                  placeholder="Wallet address"
                  className="mono w-full rounded-lg border px-3 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-faint placeholder:font-sans"
                  style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
                />
                <input
                  type="text"
                  value={form[c.networkKey]}
                  onChange={set(c.networkKey)}
                  placeholder="Network"
                  className="w-full rounded-lg border px-3 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-faint"
                  style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="rounded-lg border px-3 py-2.5 text-[11px] font-medium"
          style={{ background: "rgba(220,38,38,0.08)", borderColor: "rgba(220,38,38,0.25)", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      {submitted && !error && (
        <div
          className="rounded-lg border px-3 py-2.5 text-[11px] font-medium"
          style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}
        >
          Changes saved.
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
