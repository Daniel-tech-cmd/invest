"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AmountPad from "../../components/AmountPad";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReinvestWorkspace({ user, catalog }) {
  const router = useRouter();
  const [mode, setMode] = useState("profit"); // "profit" | "promo"
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPrivatePlan = Object.values(catalog).some((p) => p.visibility === "private");

  // Referral commissions can only be withdrawn, never reinvested — excluded
  // from the reinvestable balance on purpose. Principal still locked inside
  // an active (unmatured) deposit is excluded too — it's still earning
  // inside that plan, so it isn't free to fund a second one at the same time.
  const lockedInActiveDeposits = (user.activeDeposit || []).filter((d) => !d.stopped).reduce((sum, d) => sum + (d.amount || 0), 0);
  const profitBalance = Math.max(0, (user.balance || 0) - (user.referralBonus || 0) - lockedInActiveDeposits);
  const principal = Math.max(0, profitBalance - (user.profit || 0));
  const promoBalance = user.promoBonus || 0;
  const source = mode === "profit" ? profitBalance : promoBalance;

  const numericAmount = parseFloat(amount) || 0;
  const planInfo = catalog[plan];
  const belowMin = planInfo && numericAmount > 0 && numericAmount < planInfo.min;
  const hasSource = mode === "profit" ? profitBalance > 0 : promoBalance > 0;

  const switchMode = (next) => {
    setMode(next);
    setPlan("");
    setAmount("");
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!plan) return setError("Please select a plan.");
    if (numericAmount <= 0) return setError("Please enter a valid amount.");
    if (belowMin) return setError(`Minimum for ${plan} is $${planInfo.min.toLocaleString()}.`);
    if (numericAmount > source) {
      return setError(mode === "profit" ? `Insufficient balance. Available: ${fmt(profitBalance)}` : `Insufficient promo balance. Available: ${fmt(promoBalance)}`);
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reinvest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount, plan, source: mode }),
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
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <AmountPad
        amount={amount}
        onChange={(v) => {
          setAmount(v);
          setSubmitted(false);
        }}
        min={planInfo?.min}
        max={hasSource ? source : undefined}
        quickAdd={[250, 500, 1000, 2500]}
        label="Reinvest amount"
      />

      <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Grow an existing plan</p>
          <h2 className="text-[13px] font-semibold text-ink">Reinvest</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => switchMode("profit")}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              mode === "profit"
                ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            Reinvest profit
          </button>
          <button
            type="button"
            onClick={() => switchMode("promo")}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              mode === "promo"
                ? { borderColor: "var(--violet)", background: "rgba(139,120,221,0.1)", color: "var(--violet)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            Reinvest promo
          </button>
        </div>

        {mode === "profit" ? (
          <div className="space-y-2 rounded-xl border p-3.5 text-[12px]" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
            <div className="flex justify-between">
              <span className="text-ink-faint">Principal</span>
              <span className="mono font-medium text-ink-dim">{fmt(principal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-faint">Profit</span>
              <span className="mono font-medium text-ink-dim">{fmt(user.profit)}</span>
            </div>
            <div className="h-px" style={{ background: "var(--line)" }} />
            <div className="flex justify-between">
              <span className="font-semibold text-ink">Available to reinvest</span>
              <span className="mono font-semibold text-gold-ink">{fmt(profitBalance)}</span>
            </div>
            {user.referralBonus > 0 && (
              <div className="mt-1 flex items-center justify-between rounded-lg border px-2.5 py-2" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
                <span className="text-[11px] text-ink-faint">
                  Referral bonus <span className="mono font-medium text-ink-dim">{fmt(user.referralBonus)}</span> — not reinvestable
                </span>
                <Link href="/dashboard/withdraw" className="text-[11px] font-medium text-gold-ink hover:underline">
                  Withdraw
                </Link>
              </div>
            )}
            {lockedInActiveDeposits > 0 && (
              <div className="mt-1 rounded-lg border px-2.5 py-2" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
                <span className="text-[11px] text-ink-faint">
                  <span className="mono font-medium text-ink-dim">{fmt(lockedInActiveDeposits)}</span> is still locked in an active plan — not reinvestable until it matures
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border p-3.5 text-[12px]" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
            <span className="text-ink-faint">Promo balance</span>
            <span className="mono font-semibold text-gold-ink">{fmt(promoBalance)}</span>
          </div>
        )}

        {!hasSource ? (
          <p
            className="rounded-lg border px-3.5 py-3 text-[12px] font-semibold"
            style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}
          >
            {mode === "promo" ? "You have no promo balance to reinvest." : "You have no balance available to reinvest."}
          </p>
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="reinvest-plan">
                Select a plan
              </label>
              {hasPrivatePlan && (
                <p className="mb-1.5 flex items-center gap-1.5 text-[10.5px] text-gold-ink">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2l8 4v6c0 4.97-3.4 8.94-8 10-4.6-1.06-8-5.03-8-10V6l8-4z" />
                  </svg>
                  Your account manager has set up a custom plan for you.
                </p>
              )}
              <select
                id="reinvest-plan"
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setError("");
                }}
                className="w-full cursor-pointer rounded-xl border px-3 py-2.5 text-[13px] font-medium text-ink outline-none"
                style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
              >
                <option value="" disabled>
                  Choose a plan
                </option>
                {Object.entries(catalog).map(([name, p]) => (
                  <option key={name} value={name}>
                    {name} · min ${p.min.toLocaleString()} · {p.rate}%/day
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Order summary</p>
              {[
                ["Amount", numericAmount > 0 ? fmt(numericAmount) : "—"],
                ["Plan", plan || "—"],
                ["Source", mode === "profit" ? "Account balance" : "Promo bonus"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-ink-faint">{label}</span>
                  <span className="text-[12px] font-medium text-ink-dim">{value}</span>
                </div>
              ))}
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
                Reinvestment successful — your plan is now active.
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? "Submitting..." : mode === "promo" ? "Reinvest promo bonus" : "Submit reinvestment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
