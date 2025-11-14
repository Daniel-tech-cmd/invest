"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useFetch from "../hooks/useFetch";

const ReinvestForm = ({ data: dat }) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { reinvest, error: error2, isLoading } = useFetch();

  // Filter plans based on the plans user is currently on
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const activePlans = [
      {
        planName: "Basic Plan",
        planDescription: "Plan 1",
        amountRange: "$100.00 - $499.00",
        dailyProfit: "4.60%",
        hasDeposit: false,
      },
      {
        planName: "Standard Plan",
        planDescription: "Plan 2",
        amountRange: "$500.00 - $4999.00",
        dailyProfit: "6.80%",
        hasDeposit: false,
      },
      {
        planName: "Advanced Plan",
        planDescription: "Plan 3",
        amountRange: "$5000.00 - $9999.00",
        dailyProfit: "7.70%",
        hasDeposit: false,
      },
      {
        planName: "Silver Plan",
        planDescription: "Plan 4",
        amountRange: "$10000.00 - $19999.00",
        dailyProfit: "8.40%",
        hasDeposit: false,
      },
      {
        planName: "Gold Plan",
        planDescription: "Plan 5",
        amountRange: "$20000.00 - ∞",
        dailyProfit: "9.20%",
        hasDeposit: false,
      },
    ];

    // Filter only active deposits that are stopped
    const userPlans = activePlans.filter((plan) =>
      dat.activeDeposit.some(
        (deposit) => deposit.plan === plan.planName && deposit.stopped === true
      )
    );

    setPlans(userPlans);
  }, [dat.activeDeposit]);

  const handlePlanChange = (e) => {
    const selectedPlanName = e.target.value;
    setSelectedPlan(selectedPlanName);
    setError("");

    // Find the active deposit with matching plan and stopped = true
    const deposit = dat.activeDeposit.find(
      (deposit) => deposit.plan === selectedPlanName && deposit.stopped === true
    );

    // Set the found deposit as the selectedDeposit for the request
    setSelectedDeposit(deposit || null);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      setError("Please select a reinvestment plan.");
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid reinvestment amount.");
      return;
    }

    if (!selectedDeposit) {
      setError("No valid deposit found for reinvestment.");
      return;
    }

    const data = {
      ...selectedDeposit,
      amount,
    };
    await reinvest(data);
  };

  return (
    <div
      className="dash min-h-screen w-full bg-canvas px-4 sm:px-6 lg:px-10 py-6 sm:py-10"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "96px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
        <h2 className="text-center text-2xl font-semibold text-foreground">
          Reinvest Profit
        </h2>

        {/* Display Current Profit */}
        <div className="text-center text-foreground">
          <p className="text-lg">
            Current Balance: ${dat?.balance.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Plan Selection */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">
              Select Reinvestment Plan
            </label>
            <select
              value={selectedPlan}
              onChange={handlePlanChange}
              className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
              disabled={plans.length === 0} // Disable if no plans
            >
              <option value="" disabled>
                {plans.length === 0
                  ? "No plan to reinvest now"
                  : "-- Choose a Plan --"}
              </option>
              {plans.map((plan, index) => (
                <option key={index} value={plan.planName}>
                  {plan.planName} ({plan.amountRange}, Daily Profit:{" "}
                  {plan.dailyProfit})
                </option>
              ))}
            </select>
          </div>

          {/* Reinvestment Amount Input */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">
              Reinvestment Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full rounded-xl border border-stroke bg-surface-muted px-3 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="Enter amount to reinvest"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center text-sm text-red-500">{error}</div>
          )}
          {error2 && <p className="text-red-500 text-sm mb-4">{error2}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-accent w-full rounded-xl py-3 text-sm font-semibold"
            disabled={plans.length === 0} // Disable if no plans
          >
            {isLoading ? "Reinvesting..." : "Submit Reinvestment"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ReinvestForm;
