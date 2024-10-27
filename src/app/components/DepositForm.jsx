"use client";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";

const DepositForm = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [plans] = useState([
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
  ]);

  const cryptoWallets = {
    USDT: "0xUSDTwalletAddress1234",
    BTC: "1BTCwalletAddressabcd1234",
    ETH: "0xETHwalletAddress5678",
    LTC: "LTCwalletAddressxyz5678",
    DOGE: "DOGEwalletAddressdoge9876",
  };

  const getAmountRange = (plan) => {
    const [min, max] = plan.amountRange.replace(/[^\d.-]/g, "").split("-");
    return {
      min: parseFloat(min),
      max: max ? parseFloat(max) : Infinity,
    };
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    setError("");
  };

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value);
    setCopied(false); // Reset copy status when crypto selection changes
    setError("");
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError("");
  };

  const handleCopyToClipboard = () => {
    const address = cryptoWallets[selectedCrypto];
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copy state after 2 seconds
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError("Please select a plan.");
      return;
    }
    if (!selectedCrypto) {
      setError("Please select a cryptocurrency.");
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const selectedPlanData = plans.find(
      (plan) => plan.planName === selectedPlan
    );
    const { min, max } = getAmountRange(selectedPlanData);

    if (parseFloat(amount) < min) {
      setError(
        `The minimum deposit for the ${selectedPlan} is $${min.toFixed(2)}.`
      );
      return;
    }

    if (parseFloat(amount) > max) {
      setError(
        `The maximum deposit for the ${selectedPlan} is $${max.toFixed(2)}.`
      );
      return;
    }

    console.log("Deposit submitted:", {
      plan: selectedPlan,
      crypto: selectedCrypto,
      amount: parseFloat(amount),
      wallet: cryptoWallets[selectedCrypto],
    });

    setSelectedPlan("");
    setSelectedCrypto("");
    setAmount("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#1c222c] p-4">
      <div className="bg-[#232a35] text-white max-w-lg w-full rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Make a Deposit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Select a Plan
            </label>
            <select
              value={selectedPlan}
              onChange={handlePlanChange}
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
            >
              <option value="" disabled>
                -- Choose a Plan --
              </option>
              {plans.map((plan, index) => (
                <option
                  key={index}
                  value={plan.planName}
                  className="bg-[#323a47] text-white border-b border-gray-600 hover:bg-[#2b3240] text-sm p-2"
                >
                  {plan.planName} ({plan.amountRange}, Daily Profit:{" "}
                  {plan.dailyProfit})
                </option>
              ))}
            </select>
          </div>

          {/* Cryptocurrency Selection */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Select Cryptocurrency
            </label>
            <select
              value={selectedCrypto}
              onChange={handleCryptoChange}
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
            >
              <option value="" disabled>
                -- Choose Cryptocurrency --
              </option>
              {Object.keys(cryptoWallets).map((crypto, index) => (
                <option
                  key={index}
                  value={crypto}
                  className="bg-[#323a47] text-white border-b border-gray-600 hover:bg-[#2b3240] text-sm p-2"
                >
                  {crypto}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Deposit Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
              placeholder="Enter amount in USD"
            />
          </div>

          {/* Display Selected Crypto Wallet Address */}
          {selectedCrypto && (
            <div className="p-4 bg-[#f57c00] text-center rounded-lg flex items-center justify-between">
              <p className="font-semibold break-all text-sm">
                {cryptoWallets[selectedCrypto]}
              </p>
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="ml-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full p-2"
              >
                <FaCopy className="text-lg" />
              </button>
            </div>
          )}
          {copied && (
            <p className="text-green-400 text-center text-sm">
              Address copied to clipboard!
            </p>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm"
          >
            Submit Deposit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositForm;
