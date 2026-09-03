"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AmountPad from "../../components/AmountPad";
import PayoutWallets from "./PayoutWallets";

const COINS = [
  { name: "BTC", accountKey: "bitcoinAccountId", networkKey: "bitcoinNetwork", label: "Bitcoin" },
  { name: "ETH", accountKey: "ethereumAccountId", networkKey: "ethereumNetwork", label: "Ethereum" },
  { name: "LTC", accountKey: "litecoinAccountId", networkKey: "litecoinNetwork", label: "Litecoin" },
  { name: "USDT", accountKey: "usdtAccountId", networkKey: "usdtNetwork", label: "Tether USDT" },
  { name: "DOGE", accountKey: "dogeAccountId", networkKey: "dogeNetwork", label: "Dogecoin" },
];

const MODES = {
  standard: { label: "Standard withdrawal", accent: "var(--gold)", accentBg: "rgba(231,185,75,0.1)", accentColor: "var(--gold-ink)" },
  promo: { label: "Promo withdrawal", accent: "var(--violet)", accentBg: "rgba(139,120,221,0.1)", accentColor: "var(--violet)" },
  referral: { label: "Referral bonus", accent: "var(--cyan)", accentBg: "rgba(72,140,255,0.1)", accentColor: "var(--cyan)" },
};

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const selectClass = "w-full cursor-pointer rounded-xl border px-3 py-2.5 text-[13px] font-medium text-ink outline-none";
const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };

export default function WithdrawWorkspace({ user }) {
  const router = useRouter();
  const eligiblePlans = (user.activeDeposit || []).filter((d) => d.stopped && !d.withdrawn && d.amount + (d.profit || 0) > 0);

  const [mode, setMode] = useState("standard");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("");
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableModes = ["standard", ...(user.promoBonus > 0 ? ["promo"] : []), ...(user.referralBonus > 0 ? ["referral"] : [])];

  const selectedPlan = eligiblePlans.find((d) => d.id === selectedPlanId);
  const planBalance = selectedPlan ? selectedPlan.amount + (selectedPlan.profit || 0) : 0;
  const coinInfo = COINS.find((c) => c.name === selectedCoin);
  const walletAddress = coinInfo ? user[coinInfo.accountKey] : null;
  const walletNetwork = coinInfo ? user[coinInfo.networkKey] : null;

  const sourceBalance = mode === "promo" ? user.promoBonus : mode === "referral" ? user.referralBonus : user.balance;
  const hasSource = mode === "promo" ? user.promoBonus > 0 : mode === "referral" ? user.referralBonus > 0 : eligiblePlans.length > 0;
  const maxAmount = mode === "promo" ? user.promoBonus : mode === "referral" ? user.referralBonus : selectedPlan ? planBalance : undefined;

  const switchMode = (next) => {
    setMode(next);
    setStep("form");
    setError("");
    setSelectedPlanId("");
  };

  const handleNext = () => {
    const numericAmount = parseFloat(amount) || 0;
    if (!selectedCoin) return setError("Please select a coin.");
    if (!walletAddress) return setError(`Set a ${coinInfo.label} payout wallet on your profile first.`);
    if (mode === "standard" && !selectedPlanId) return setError("Please select a plan.");
    if (numericAmount <= 0) return setError("Please enter a valid withdrawal amount.");
    if (mode === "promo" && numericAmount > user.promoBonus) return setError(`Insufficient promo balance. Available: ${fmt(user.promoBonus)}`);
    if (mode === "referral" && numericAmount > user.referralBonus) return setError(`Insufficient referral bonus. Available: ${fmt(user.referralBonus)}`);
    if (mode === "standard" && numericAmount > planBalance) return setError(`Amount exceeds plan balance. Available: ${fmt(planBalance)}`);

    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) || 0,
          method: selectedCoin,
          wallet: walletAddress,
          note: comment,
          source: mode,
          planId: mode === "standard" ? selectedPlanId : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStep("form");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("form");
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep("form");
    setSubmitted(false);
    setAmount("");
    setComment("");
    setSelectedCoin("");
    setSelectedPlanId("");
    setError("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <AmountPad
        amount={amount}
        onChange={setAmount}
        max={hasSource ? maxAmount : undefined}
        quickAdd={[25, 50, 100, 250]}
        label={`${MODES[mode].label} amount`}
      />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
          <div>
            <p className="text-[11px] tracking-wide text-ink-faint">Cash out</p>
            <h2 className="text-[13px] font-semibold text-ink">Ask for a withdrawal</h2>
          </div>

          {availableModes.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {availableModes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className="flex-1 rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-colors"
                  style={
                    mode === m
                      ? { borderColor: MODES[m].accent, background: MODES[m].accentBg, color: MODES[m].accentColor }
                      : { borderColor: "var(--line)", color: "var(--ink-faint)" }
                  }
                >
                  {MODES[m].label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-faint">{mode === "promo" ? "Promo balance" : mode === "referral" ? "Referral bonus" : "Account balance"}</span>
            <span className="mono font-medium text-ink">{fmt(sourceBalance)}</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-faint">Pending withdrawals</span>
            <span className="mono font-medium text-ink">{fmt(user.pendingWithdrawals)}</span>
          </div>

          <div className="h-px" style={{ background: "var(--line)" }} />

          {!hasSource ? (
            <p
              className="rounded-lg border px-3.5 py-3 text-[12px] font-semibold"
              style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}
            >
              {mode === "promo"
                ? "You have no promo balance to withdraw."
                : mode === "referral"
                  ? "You have no referral bonus to withdraw."
                  : "You have no completed plans to withdraw from."}
            </p>
          ) : step === "confirm" ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-[13px] font-semibold text-ink">Withdrawal confirmation</h3>
              <div className="space-y-2 text-[12px]">
                {[
                  ["Payment system", selectedCoin],
                  ["Account", walletNetwork ? `${walletAddress} (${walletNetwork})` : walletAddress],
                  ["Debit amount", fmt(parseFloat(amount) || 0)],
                  ["Withdrawal fee", "No fee for this operation"],
                  ["Credit amount", fmt(parseFloat(amount) || 0)],
                  ["Note", comment || "No comment provided"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-ink-faint">{label}</span>
                    <span className="break-all text-right font-medium text-ink-dim">{value}</span>
                  </div>
                ))}
              </div>

              {submitted ? (
                <>
                  <div
                    className="rounded-lg border px-3 py-2.5 text-[11px] font-medium"
                    style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}
                  >
                    Withdrawal submitted — it&rsquo;s now pending review by an admin.
                  </div>
                  <button type="button" onClick={reset} className="btn btn-ghost btn-sm w-full">
                    Submit another
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep("form")} disabled={isSubmitting} className="btn btn-ghost btn-sm flex-1">
                    Back
                  </button>
                  <button type="button" onClick={handleConfirm} disabled={isSubmitting} className="btn btn-primary btn-sm flex-1">
                    {isSubmitting ? "Submitting..." : "Confirm"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {mode === "promo" && (
                <div
                  className="rounded-lg border px-3 py-2.5 text-[11px]"
                  style={{ background: "rgba(139,120,221,0.08)", borderColor: "rgba(139,120,221,0.25)", color: "var(--violet)" }}
                >
                  Promo balance available now &middot; no waiting period set.
                </div>
              )}
              {mode === "referral" && (
                <div
                  className="rounded-lg border px-3 py-2.5 text-[11px]"
                  style={{ background: "rgba(72,140,255,0.08)", borderColor: "rgba(72,140,255,0.25)", color: "var(--cyan)" }}
                >
                  Referral commissions can only be withdrawn — they can&rsquo;t be reinvested into a plan.
                </div>
              )}
              {mode === "standard" && (
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="withdraw-plan">
                    Select plan
                  </label>
                  <div
                    className="mb-2 rounded-lg border px-3 py-2 text-[10.5px]"
                    style={{ background: "rgba(72,140,255,0.08)", borderColor: "rgba(72,140,255,0.25)", color: "var(--cyan)" }}
                  >
                    Only completed plans that haven&rsquo;t been withdrawn are shown. The amount includes your deposit + accumulated profit.
                  </div>
                  <select
                    id="withdraw-plan"
                    value={selectedPlanId}
                    onChange={(e) => {
                      setSelectedPlanId(e.target.value);
                      setError("");
                    }}
                    className={selectClass}
                    style={fieldStyle}
                  >
                    <option value="">Select a plan</option>
                    {eligiblePlans.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.plan} — {fmt(d.amount + (d.profit || 0))} (deposit {fmt(d.amount)} + profit {fmt(d.profit || 0)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="withdraw-comment">
                  Comment
                </label>
                <input
                  id="withdraw-comment"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optional note"
                  className={inputClass}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="withdraw-coin">
                  Select coin
                </label>
                <select
                  id="withdraw-coin"
                  value={selectedCoin}
                  onChange={(e) => {
                    setSelectedCoin(e.target.value);
                    setError("");
                  }}
                  className={selectClass}
                  style={fieldStyle}
                >
                  <option value="">Select a coin</option>
                  {COINS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.label} ({c.name})
                    </option>
                  ))}
                </select>
                {coinInfo && (
                  <p className="mt-1.5 text-[10.5px]">
                    {walletAddress ? (
                      <span className="text-grove-ink">
                        Payout wallet set{walletNetwork ? ` (${walletNetwork})` : ""} — {walletAddress}
                      </span>
                    ) : (
                      <span className="text-ink-faint">
                        No payout wallet set for {coinInfo.name}.{" "}
                        <Link href="/dashboard/profile" className="font-medium text-gold-ink hover:underline">
                          Set it in your profile
                        </Link>
                        .
                      </span>
                    )}
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="rounded-lg border px-3 py-2.5 text-[11px] font-medium"
                  style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}
                >
                  {error}
                </div>
              )}

              <button type="button" onClick={handleNext} className="btn btn-primary w-full">
                Next
              </button>
              <p className="text-center text-[10.5px] text-ink-faint">No fees charged &middot; reviewed by an admin before payout.</p>
            </div>
          )}
        </div>

        <PayoutWallets user={user} />
      </div>
    </div>
  );
}
