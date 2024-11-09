"use client";
import Link from "next/link";
import useFetch from "../hooks/useFetch";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const Withdrawal = ({ data }) => {
  const { withdraw, error: erro, isLoading, responseData } = useFetch();
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextClick = () => {
    if (!selectedCoin) {
      setErrorMessage("Please select a coin.");
    } else if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid withdrawal amount.");
    } else if (parseFloat(amount) > data.balance) {
      setErrorMessage(
        "Withdrawal amount cannot be greater than available balance."
      );
    } else {
      setErrorMessage("");
      setShowConfirmation(true);
    }
  };

  // Coin list with account IDs
  const coins = [
    { name: "BITCOIN", id: "bitcoinAccountId", icon: "🪙", method: "BTC" },
    { name: "ETHEREUM", id: "ethereumAccountId", icon: "💠", method: "ETH" },
    { name: "LITECOIN", id: "litecoinAccountId", icon: "💳", method: "LTC" },
    { name: "USDT", id: "usdtAccountId", icon: "💵", method: "USDT" },
    { name: "DOGE", id: "dogeAccountId", icon: "🐕", method: "DOGE" },
  ];

  // Filter coins that have been set in the database
  const availableCoins = coins.filter((coin) => data[coin.id]);

  // Calculate available and pending deposits for each coin
  const getAvailableAmount = (method) => {
    return data.deposit
      .filter(
        (deposit) =>
          deposit.method.toLowerCase() === method.toLowerCase() &&
          deposit.status === "approved"
      )
      .reduce((sum, deposit) => sum + deposit.amount, 0);
  };

  const getPendingAmount = (method) =>
    data.deposit
      .filter(
        (deposit) => deposit.method === method && deposit.status === "pending"
      )
      .reduce((sum, deposit) => sum + deposit.amount, 0);

  const handleConfirmClick = async () => {
    const requestData = {
      coin: selectedCoin,
      wallet: data[selectedCoin.toLowerCase() + "AccountId"],
      amount: parseFloat(amount),
      note: comment,
    };

    try {
      console.log("Submitting withdrawal request...", requestData);
      await withdraw(requestData);
      if (!erro && responseData) {
        setShowConfirmation(false);
        setAmount("");
        setComment("");
        setSelectedCoin("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1c222c] p-4 md:p-6 w-full dash"
      style={{
        maxWidth: "calc(100vw - 260px)",
        padding: "70px 20px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1
            className="text-2xl text-white font-bold"
            style={{ fontSize: "19px" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400">/ Dashboard</p>
        </div>

        {/* Total Balance and Total Withdraw Section */}
        <div className="flex gap-6 md:gap-4 sm:justify-between sm:flex-row sm:items-center sm:text-left text-white cont-bal">
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Balance</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.balance.toFixed(2)}
            </h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Withdraw</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.totalWithdraw.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      <div
        className="bg-[#f57c00] text-white text-xl font-semibold py-4 px-6"
        style={{ marginBottom: "20px", fontSize: "16px", fontWeight: "500" }}
      >
        Ask for withdrawal
      </div>
      <div className="bg-[#232a35] text-gray-200 p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <p>Account Balance:</p>
          <p>${data?.balance.toFixed(2)}</p>
        </div>
        <div className="flex justify-between mb-6">
          <p>Pending Withdrawals:</p>
          <p>$0.00</p>
        </div>

        {/* Cryptocurrency Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200 border-collapse max-w-full">
            <thead>
              <tr className="bg-[#323a47] text-gray-300 text-sm">
                <th className="py-3 px-2">Processing</th>
                <th className="py-3 px-2">Available</th>
                <th className="py-3 px-2">Pending</th>
                <th className="py-3 px-2">Account</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((crypto) => (
                <tr key={crypto.name} className="border-b border-gray-500">
                  <td className="py-4 px-2 flex items-center gap-2">
                    {crypto.icon} {crypto.name}
                  </td>
                  <td className="py-4 px-2 text-green-400">
                    ${getAvailableAmount(crypto.name)}
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    ${getPendingAmount(crypto.method).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-blue-400">
                    {data[crypto.id] ? (
                      "Set"
                    ) : (
                      <Link href="/profile/edit">Not Set</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Withdrawal Form or Confirmation Section */}
        <div className="text-center mt-6">
          {data?.balance > 0 ? (
            showConfirmation ? (
              // Confirmation Menu with Enhanced Styling
              <div className="bg-[#2a3340] p-6 rounded-lg text-left">
                <h3 className="text-lg font-semibold text-orange-500 mb-4">
                  Withdrawal Confirmation
                </h3>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">
                    Payment System:
                  </span>{" "}
                  <span className="text-white">{selectedCoin}</span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">Account:</span>{" "}
                  <span className="text-white">
                    {data[selectedCoin.toLowerCase() + "AccountId"] ||
                      "Not Set"}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">Debit Amount:</span>{" "}
                  <span className="text-white">${amount}</span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">
                    Withdrawal Fee:
                  </span>{" "}
                  <span className="text-white">
                    We have no fee for this operation.
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">
                    Credit Amount:
                  </span>{" "}
                  <span className="text-white">${amount}</span>
                </p>
                <p className="mb-2">
                  <span className="font-bold text-gray-300">Note:</span>{" "}
                  <span className="text-white">
                    {comment || "No comment provided"}
                  </span>
                </p>
                {erro && <p className="text-red-500 mb-4">{erro}</p>}
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded mt-6"
                  onClick={handleConfirmClick}
                >
                  {isLoading ? "Submitting..." : "Confirm"}
                </button>
              </div>
            ) : (
              // Withdrawal Form with Enhanced Styling
              <div className="bg-[#2a3340] p-6 rounded-lg">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Withdrawal Amount:
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded bg-[#1c222c] text-white border border-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Comment:</label>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 rounded bg-[#1c222c] text-white border border-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder="Enter a comment"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Select Coin:
                  </label>
                  <select
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="w-full p-2 rounded bg-[#1c222c] text-white border border-gray-400 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select a coin</option>
                    {availableCoins.map((coin) => (
                      <option key={coin.name} value={coin.name}>
                        {coin.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}

                <button
                  onClick={handleNextClick}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded mt-4"
                >
                  Next
                </button>
              </div>
            )
          ) : (
            <p
              className="bg-red-500 text-white py-2 px-4 inline-block rounded"
              style={{
                borderRadius: "5px",
                fontSize: "14px",
                border: "1px solid rgb(255, 77, 77)",
              }}
            >
              YOU HAVE NO FUNDS TO WITHDRAW.
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Withdrawal;
