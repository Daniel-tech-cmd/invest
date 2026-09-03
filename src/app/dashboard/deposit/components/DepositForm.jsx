"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function DepositForm({ amount, plan, onPlanChange, catalog, wallets }) {
  const router = useRouter();
  const [crypto, setCrypto] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const planInfo = catalog[plan];
  const wallet = wallets.find((w) => w.assetId === crypto);
  const belowMin = planInfo && numericAmount > 0 && numericAmount < planInfo.min;
  const hasPrivatePlan = Object.values(catalog).some((p) => p.visibility === "private");

  const handleReceipt = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setReceipt(file);
      setError("");
    } else {
      setReceipt(null);
      setError("Only PDF or image files are allowed.");
    }
  };

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard?.writeText(wallet.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan) return setError("Please select a plan.");
    if (!crypto) return setError("Please select a cryptocurrency.");
    if (!numericAmount || numericAmount <= 0) return setError("Please enter a valid amount.");
    if (belowMin) return setError(`Minimum for ${plan} is $${planInfo.min.toLocaleString()}.`);
    if (!receipt) return setError("Please upload a receipt of payment.");

    setError("");
    setIsSubmitting(true);

    try {
      const receiptDataUrl = await fileToDataUrl(receipt);
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          plan,
          method: crypto,
          walletAddress: wallet?.address,
          receipt: receiptDataUrl,
        }),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">New investment</p>
        <h2 className="text-[13px] font-semibold text-ink">Deposit details</h2>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="deposit-plan">
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
          id="deposit-plan"
          value={plan}
          onChange={(e) => {
            onPlanChange(e.target.value);
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
              {name} · from ${p.min.toLocaleString()} · {p.rate}%/day
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="deposit-crypto">
          Select cryptocurrency
        </label>
        <select
          id="deposit-crypto"
          value={crypto}
          onChange={(e) => {
            setCrypto(e.target.value);
            setCopied(false);
            setError("");
          }}
          className="w-full cursor-pointer rounded-xl border px-3 py-2.5 text-[13px] font-medium text-ink outline-none"
          style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
        >
          <option value="" disabled>
            Choose cryptocurrency
          </option>
          {wallets.map((w) => (
            <option key={w.assetId} value={w.assetId}>
              {w.label} ({w.assetId})
            </option>
          ))}
        </select>
      </div>

      {wallet && (
        <div className="rounded-xl border p-3.5" style={{ background: "rgba(231,185,75,0.08)", borderColor: "rgba(231,185,75,0.25)" }}>
          <div className="flex items-center justify-between gap-2">
            <span className="mono truncate text-[11px] text-gold-ink">{wallet.address}</span>
            <button
              type="button"
              onClick={handleCopy}
              className={`btn btn-sm shrink-0 !py-1.5 !px-2.5 !text-[10px] ${copied ? "" : "btn-primary"}`}
              style={copied ? { background: "var(--grove-ink)", color: "#fff" } : undefined}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-ink-faint">Network: {wallet.network} · send exactly this address</p>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[11px] font-medium text-ink-faint" htmlFor="deposit-receipt">
          Upload receipt of payment
        </label>
        <input
          id="deposit-receipt"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleReceipt}
          className="w-full cursor-pointer rounded-xl border px-3 py-2.5 text-[12px] text-ink-dim outline-none file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:px-2.5 file:py-1.5 file:text-[11px] file:font-medium"
          style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
        />
        {receipt && <p className="mt-1.5 truncate text-[10px] text-grove-ink">{receipt.name}</p>}
      </div>

      <div className="h-px" style={{ background: "var(--line)" }} />

      <div className="space-y-2">
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">Order summary</p>
        {[
          ["Amount", numericAmount > 0 ? fmt(numericAmount) : "—"],
          ["Plan", plan || "—"],
          ["Payment method", wallet ? `${wallet.label} (${wallet.assetId})` : "—"],
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
          Deposit submitted — it&rsquo;s now pending review by an admin.
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? "Submitting..." : "Submit deposit"}
      </button>
    </form>
  );
}
