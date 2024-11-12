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
    console.log(data);
    await reinvest(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#1c222c] p-4">
      <div className="bg-[#232a35] text-white max-w-lg w-full rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Reinvest Profit</h2>

        {/* Display Current Profit */}
        <div className="text-center">
          <p className="text-lg">Current Profit: ${dat?.profit.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Select Reinvestment Plan
            </label>
            <select
              value={selectedPlan}
              onChange={handlePlanChange}
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
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
            <label className="block text-sm font-semibold mb-1">
              Reinvestment Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
              placeholder="Enter amount to reinvest"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          {error2 && <p className="text-red-500 text-sm mb-4">{error2}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm"
            disabled={plans.length === 0} // Disable if no plans
          >
            {isLoading ? "Reinvesting..." : "Submit Reinvestment"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReinvestForm;
