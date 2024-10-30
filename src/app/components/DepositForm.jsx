"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import useFetch from "../hooks/useFetch";

const DepositForm = ({ wallet }) => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { invest, error: error2, isLoading } = useFetch();

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

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setReceipt(file);
      setError("");
    } else {
      setReceipt(null);
      setError("Only PDF or image files are allowed.");
    }
  };

  const handleCopyToClipboard = () => {
    const address = wallet.find((w) => w.name === selectedCrypto)?.address;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copy state after 2 seconds
  };

  const handleSubmit = async (e) => {
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
    if (!receipt) {
      setError("Please upload a receipt of payment.");
      return;
    }

    const data = {
      plan: selectedPlan,
      crypto: selectedCrypto,
      amount: parseFloat(amount),
      wallet: wallet.find((w) => w.name === selectedCrypto)?.address,
      receipt,
    };

    await invest(data);
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
                <option key={index} value={plan.planName}>
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
              {wallet.map((crypto, index) => (
                <option key={index} value={crypto.name}>
                  {crypto.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Display Selected Crypto Wallet ICO */}
          {selectedCrypto && (
            <div className="flex items-center space-x-4 mt-4">
              <Image
                src={wallet.find((w) => w.name === selectedCrypto)?.ico?.url}
                alt={`${selectedCrypto} icon`}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="text-sm">{selectedCrypto.toUpperCase()}</p>
            </div>
          )}

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

          {/* Upload Receipt */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Upload Receipt of Payment
            </label>
            <input
              type="file"
              onChange={handleReceiptUpload}
              accept="application/pdf,image/*"
              className="w-full p-3 bg-[#323a47] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#f57c00] text-sm"
            />
          </div>

          {/* Display Selected Crypto Wallet Address */}
          {selectedCrypto && (
            <div className="p-4 bg-[#f57c00] text-center rounded-lg flex items-center justify-between">
              <p className="font-semibold break-all text-sm">
                {wallet.find((w) => w.name === selectedCrypto)?.address}
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
          {error2 && <p className="text-red-500 text-sm mb-4">{error2}</p>}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm"
          >
            {isLoading ? "Submitting..." : "Submit Deposit"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DepositForm;
