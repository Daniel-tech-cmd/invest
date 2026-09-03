"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COINS = [
  { name: "Bitcoin (BTC)", accountKey: "bitcoinAccountId", networkKey: "bitcoinNetwork", placeholder: "Bitcoin wallet address", networkPlaceholder: "Network (e.g. Bitcoin)" },
  { name: "Ethereum (ETH)", accountKey: "ethereumAccountId", networkKey: "ethereumNetwork", placeholder: "Ethereum wallet address", networkPlaceholder: "Network (e.g. ERC-20)" },
  { name: "Litecoin (LTC)", accountKey: "litecoinAccountId", networkKey: "litecoinNetwork", placeholder: "Litecoin wallet address", networkPlaceholder: "Network (e.g. Litecoin)" },
  { name: "Dogecoin (DOGE)", accountKey: "dogeAccountId", networkKey: "dogeNetwork", placeholder: "Dogecoin wallet address", networkPlaceholder: "Network (e.g. Dogecoin)" },
  { name: "Tether (USDT)", accountKey: "usdtAccountId", networkKey: "usdtNetwork", placeholder: "USDT wallet address", networkPlaceholder: "Network (e.g. TRC-20)" },
];

const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };
const labelClass = "mb-1.5 block text-[11px] font-medium text-ink-faint";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    const initial = { fullName: user.fullName || "", username: user.username || "", email: user.email || "" };
    for (const c of COINS) {
      initial[c.accountKey] = user[c.accountKey] || "";
      initial[c.networkKey] = user[c.networkKey] || "";
    }
    return initial;
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border p-5 sm:p-6" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Account settings</p>
        <h2 className="text-[13px] font-semibold text-ink">Edit your profile</h2>
      </div>

      <div>
        <h3 className="mb-3 text-[12px] font-semibold text-ink">Basic information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="profile-fullname">Full name</label>
            <input id="profile-fullname" type="text" value={form.fullName} onChange={set("fullName")} placeholder="Enter your full name" className={inputClass} style={fieldStyle} />
          </div>
          <div>
            <label className={labelClass} htmlFor="profile-username">Username</label>
            <input id="profile-username" type="text" value={form.username} onChange={set("username")} placeholder="Enter your username" className={inputClass} style={fieldStyle} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="profile-email">Email address</label>
            <input id="profile-email" type="email" value={form.email} onChange={set("email")} placeholder="Enter your email" className={inputClass} style={fieldStyle} />
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: "var(--line)" }} />

      <div>
        <h3 className="mb-1 text-[12px] font-semibold text-ink">Payout wallets</h3>
        <p className="mb-3 text-[11px] text-ink-faint">These are the addresses your withdrawals get sent to — set one per coin you plan to cash out with.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COINS.map((c) => (
            <div key={c.accountKey} className="rounded-xl border p-3.5" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
              <p className="mb-2 text-[11.5px] font-medium text-ink">{c.name}</p>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={form[c.accountKey]}
                  onChange={set(c.accountKey)}
                  placeholder={c.placeholder}
                  className="mono w-full rounded-lg border px-3 py-2 text-[11.5px] text-ink outline-none placeholder:text-ink-faint placeholder:font-sans"
                  style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
                />
                <input
                  type="text"
                  value={form[c.networkKey]}
                  onChange={set(c.networkKey)}
                  placeholder={c.networkPlaceholder}
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
          style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}
        >
          {error}
        </div>
      )}

      {submitted && (
        <div
          className="rounded-lg border px-3 py-2.5 text-[11px] font-medium"
          style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}
        >
          Profile updated.
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
