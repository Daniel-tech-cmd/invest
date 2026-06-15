"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useFetch from "../hooks/useFetch";

const ALL_PLANS = [
  { planName: "Basic Plan",    amountRange: "$100 - $499",       dailyProfit: "4.60%", minimum: 100   },
  { planName: "Standard Plan", amountRange: "$500 - $4,999",     dailyProfit: "6.80%", minimum: 500   },
  { planName: "Advanced Plan", amountRange: "$5,000 - $9,999",   dailyProfit: "7.70%", minimum: 5000  },
  { planName: "Silver Plan",   amountRange: "$10,000 - $19,999", dailyProfit: "8.40%", minimum: 10000 },
  { planName: "Gold Plan",     amountRange: "$20,000+",          dailyProfit: "9.20%", minimum: 20000 },
];

const ReinvestForm = ({ data: dat }) => {
  const [mode, setMode] = useState("profit"); // "profit" | "promo"

  // Profit reinvest state
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState("");

  // Promo reinvest state
  const [promoPlan, setPromoPlan] = useState("");
  const [promoAmount, setPromoAmount] = useState("");

  const [error, setError] = useState("");
  const { reinvest, error: error2, isLoading } = useFetch();

  const profitBalance = dat?.balance || 0;
  const promoBalance = dat?.promoBonus || 0;

  useEffect(() => {
    setError("");
    setSelectedPlan("");
    setAmount("");
    setPromoPlan("");
    setPromoAmount("");
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "profit") {
      if (!selectedPlan) { setError("Please select a plan."); return; }
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) { setError("Please enter a valid amount."); return; }

      const plan = ALL_PLANS.find((p) => p.planName === selectedPlan);
      if (parseFloat(amount) < plan.minimum) {
        setError(`Minimum for ${selectedPlan} is $${plan.minimum.toLocaleString()}`);
        return;
      }
      if (parseFloat(amount) > profitBalance) {
        setError(`Insufficient balance. Available: $${profitBalance.toFixed(2)} (total account balance)`);
        return;
      }

      await reinvest({ planName: selectedPlan, amount: parseFloat(amount) });
      return;
    }

    // Promo mode
    if (!promoPlan) { setError("Please select a plan."); return; }
    if (!promoAmount || isNaN(promoAmount) || parseFloat(promoAmount) <= 0) { setError("Please enter a valid amount."); return; }

    const plan = ALL_PLANS.find((p) => p.planName === promoPlan);
    if (parseFloat(promoAmount) < plan.minimum) {
      setError(`Minimum for ${promoPlan} is $${plan.minimum.toLocaleString()}`);
      return;
    }
    if (parseFloat(promoAmount) > promoBalance) {
      setError(`Insufficient promo balance. Available: $${promoBalance.toFixed(2)}`);
      return;
    }

    await reinvest({ planName: promoPlan, amount: parseFloat(promoAmount), source: "promo" });
  };

  return (
    <div
      className="dash min-h-screen w-full bg-canvas px-4 sm:px-6 lg:px-10 py-6 sm:py-10"
      style={{ maxWidth: "calc(100vw - 260px)", paddingTop: "96px", boxSizing: "border-box", overflowX: "hidden" }}
    >
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
        <h2 className="text-center text-2xl font-semibold text-foreground mb-4">
          Reinvest
        </h2>

        {/* Mode toggle */}
        <div className="flex rounded-xl border border-stroke overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setMode("profit")}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              mode === "profit"
                ? "bg-accent text-white"
                : "bg-surface-muted text-muted"
            }`}
          >
            Reinvest Profit
          </button>
          <button
            type="button"
            onClick={() => setMode("promo")}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              mode === "promo"
                ? "bg-accent text-white"
                : "bg-surface-muted text-muted"
            }`}
          >
            Reinvest Promo
          </button>
        </div>

        {mode === "profit" ? (
          <>
            <div className="mb-4 rounded-xl border border-stroke bg-surface-muted px-4 py-3 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="text-muted">Principal</span>
                <span className="font-semibold">
                  ${Math.max(0, (dat?.balance || 0) - (dat?.profit || 0) - (dat?.referralBonus || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted">Profit</span>
                <span className="font-semibold">${(dat?.profit || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted">Referral Bonus</span>
                <span className="font-semibold">${(dat?.referralBonus || 0).toFixed(2)}</span>
              </div>
              <div className="mt-2 border-t border-stroke pt-2 flex justify-between font-bold">
                <span>Available to Reinvest</span>
                <span className="text-accent">${profitBalance.toFixed(2)}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-muted">
                  Select Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => { setSelectedPlan(e.target.value); setError(""); }}
                  className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
                >
                  <option value="" disabled>-- Choose a Plan --</option>
                  {ALL_PLANS.map((plan, i) => (
                    <option key={i} value={plan.planName}>
                      {plan.planName} — min ${plan.minimum.toLocaleString()} ({plan.dailyProfit}/day)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-muted">
                  Amount
                  {selectedPlan && (
                    <span className="ml-1 text-xs font-normal text-muted">
                      (min ${ALL_PLANS.find((p) => p.planName === selectedPlan)?.minimum.toLocaleString()})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
                  placeholder="Enter amount to reinvest"
                  max={profitBalance}
                />
              </div>
              {(error || error2) && (
                <p className="text-center text-sm text-red-500">{error || error2}</p>
              )}
              <button
                type="submit"
                disabled={profitBalance <= 0 || isLoading}
                className="btn-accent w-full rounded-xl py-3 text-sm font-semibold"
              >
                {isLoading ? "Reinvesting..." : "Submit Reinvestment"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center text-foreground mb-4">
              <p className="text-lg">
                Promo Balance:{" "}
                <span className="font-bold text-accent">${promoBalance.toFixed(2)}</span>
              </p>
            </div>
            {promoBalance <= 0 ? (
              <p className="text-center text-sm text-muted py-4">
                You have no promo balance to reinvest.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-muted">
                    Select Plan
                  </label>
                  <select
                    value={promoPlan}
                    onChange={(e) => { setPromoPlan(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
                  >
                    <option value="" disabled>-- Choose a Plan --</option>
                    {ALL_PLANS.map((plan, i) => (
                      <option key={i} value={plan.planName}>
                        {plan.planName} — min ${plan.minimum.toLocaleString()} ({plan.dailyProfit}/day)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-muted">
                    Amount
                    {promoPlan && (
                      <span className="ml-1 text-xs text-muted font-normal">
                        (min ${ALL_PLANS.find((p) => p.planName === promoPlan)?.minimum.toLocaleString()})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={promoAmount}
                    onChange={(e) => { setPromoAmount(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
                    placeholder="Enter amount"
                    max={promoBalance}
                  />
                </div>
                {(error || error2) && (
                  <p className="text-center text-sm text-red-500">{error || error2}</p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-accent w-full rounded-xl py-3 text-sm font-semibold"
                >
                  {isLoading ? "Processing..." : "Reinvest Promo Bonus"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReinvestForm;
