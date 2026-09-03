"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUnreturnedReinvestment } from "../../../lib/mockUsers";

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminActionsPanel({ user, privatePlan }) {
  const router = useRouter();
  const [promoAmount, setPromoAmount] = useState("");
  const [promoDone, setPromoDone] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSaving, setPromoSaving] = useState(false);

  const [impersonateStep, setImpersonateStep] = useState("idle"); // idle | confirm | loading
  const [impersonateError, setImpersonateError] = useState("");

  const [fixDone, setFixDone] = useState(false);

  const unreturned = getUnreturnedReinvestment(user);

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(promoAmount);
    if (!amount || amount <= 0) {
      setPromoError("Enter a valid amount.");
      return;
    }
    setPromoError("");
    setPromoSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}/promo-bonus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "Something went wrong.");
        return;
      }
      setPromoDone(true);
      setPromoAmount("");
      router.refresh();
    } catch {
      setPromoError("Something went wrong. Please try again.");
    } finally {
      setPromoSaving(false);
    }
  };

  const handleFix = () => {
    // Fix-balance endpoint isn't wired up yet.
    setFixDone(true);
  };

  const handleImpersonate = async () => {
    setImpersonateError("");
    setImpersonateStep("loading");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/impersonate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setImpersonateError(data.error || "Something went wrong.");
        setImpersonateStep("confirm");
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setImpersonateError("Something went wrong. Please try again.");
      setImpersonateStep("confirm");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Investment tier</p>
          <h2 className="text-[13px] font-semibold text-ink">Custom plan</h2>
        </div>
        {privatePlan ? (
          <>
            <div className="rounded-lg border px-3 py-2.5" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
              <p className="text-[12px] font-medium text-ink">{privatePlan.name}</p>
              <p className="mono mt-0.5 text-[11px] text-gold-ink">
                {privatePlan.rate}%/day &middot; {privatePlan.days}d &middot; min {fmt(privatePlan.min)}
              </p>
            </div>
            <p className="text-[10.5px] text-ink-faint">This replaces the standard catalog on {user.username}&rsquo;s Deposit and Reinvest pages.</p>
            <Link href={`/admin/plans/edit/${privatePlan.id}`} className="btn btn-ghost btn-sm w-full">
              Edit custom plan
            </Link>
          </>
        ) : (
          <>
            <p className="text-[11px] text-ink-faint">{user.username} sees the standard plan catalog. Give them a personalized rate instead.</p>
            <Link href={`/admin/plans/add?forUser=${user.id}`} className="btn btn-primary btn-sm w-full">
              Create custom plan
            </Link>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Bonus</p>
          <h2 className="text-[13px] font-semibold text-ink">Add promo bonus</h2>
        </div>
        <form onSubmit={handlePromoSubmit} className="flex flex-col gap-2.5">
          <input
            type="number"
            value={promoAmount}
            onChange={(e) => {
              setPromoAmount(e.target.value);
              setPromoDone(false);
              setPromoError("");
            }}
            placeholder="Amount to add"
            className="mono w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:font-sans placeholder:text-ink-faint"
            style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}
          />
          {promoError && <p className="text-[11px] font-medium" style={{ color: "var(--down)" }}>{promoError}</p>}
          {promoDone && (
            <p className="text-[11px] font-medium" style={{ color: "var(--grove-ink)" }}>
              Promo bonus added to {user.username}&rsquo;s account.
            </p>
          )}
          <button type="submit" disabled={promoSaving} className="btn btn-primary btn-sm w-full">
            {promoSaving ? "Adding…" : "Add bonus"}
          </button>
        </form>
      </div>

      {unreturned > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "rgba(231,185,75,0.35)" }}>
          <div>
            <p className="text-[11px] tracking-wide text-ink-faint">Reconciliation</p>
            <h2 className="text-[13px] font-semibold text-ink">Fix balance</h2>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-faint">
            {user.username} reinvested {fmt(unreturned)} from their balance into a plan that has since matured — that amount was never returned. This credits it back.
          </p>
          {fixDone ? (
            <p className="text-[11px] font-medium" style={{ color: "var(--grove-ink)" }}>
              Not connected to a backend yet — this would credit {fmt(unreturned)} back to {user.username}&rsquo;s balance.
            </p>
          ) : (
            <button type="button" onClick={handleFix} className="btn btn-primary btn-sm w-full">
              Fix balance ({fmt(unreturned)})
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "rgba(220,80,80,0.3)" }}>
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Support</p>
          <h2 className="text-[13px] font-semibold text-ink">Login as user</h2>
        </div>
        <p className="text-[11px] leading-relaxed text-ink-faint">Opens a session as {user.username} to troubleshoot on their behalf. Every impersonation is logged.</p>

        {impersonateError && <p className="text-[11px] font-medium" style={{ color: "var(--down)" }}>{impersonateError}</p>}

        {impersonateStep === "idle" && (
          <button type="button" onClick={() => setImpersonateStep("confirm")} className="btn btn-ghost btn-sm w-full" style={{ borderColor: "var(--down)", color: "var(--down)" }}>
            Login as {user.username}
          </button>
        )}
        {impersonateStep === "confirm" && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium text-ink">Are you sure? This signs you in as {user.username}.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setImpersonateStep("idle")} className="btn btn-ghost btn-sm flex-1">
                Cancel
              </button>
              <button type="button" onClick={handleImpersonate} className="btn btn-sm flex-1" style={{ background: "var(--down)", color: "#fff" }}>
                Confirm
              </button>
            </div>
          </div>
        )}
        {impersonateStep === "loading" && <p className="text-[11px] font-medium text-ink-faint">Signing in as {user.username}…</p>}
      </div>
    </div>
  );
}
