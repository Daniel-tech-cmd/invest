"use client";
import Link from "next/link";
import useFetch from "../hooks/useFetch";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

const Withdrawal = ({ data }) => {
  const {
    withdraw,
    error: erro,
    isLoading,
    responseData,
  } = useFetch();
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [selectedCoin, setSelectedCoin] =
    useState("");
  const [selectedPlan, setSelectedPlan] =
    useState("");
  const [showConfirmation, setShowConfirmation] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const handleNextClick = () => {
    if (!selectedCoin) {
      setErrorMessage("Please select a coin.");
    } else if (!selectedPlan) {
      setErrorMessage("Please select a plan.");
    } else if (
      !amount ||
      parseFloat(amount) <= 0
    ) {
      setErrorMessage(
        "Please enter a valid withdrawal amount."
      );
    } else if (
      parseFloat(amount) > data.balance
    ) {
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
    {
      name: "BITCOIN",
      id: "bitcoinAccountId",
      icon: "🪙",
      method: "BTC",
    },
    {
      name: "ETHEREUM",
      id: "ethereumAccountId",
      icon: "💠",
      method: "ETH",
    },
    {
      name: "LITECOIN",
      id: "litecoinAccountId",
      icon: "💳",
      method: "LTC",
    },
    {
      name: "USDT",
      id: "usdtAccountId",
      icon: "💵",
      method: "USDT",
    },
    {
      name: "DOGE",
      id: "dogeAccountId",
      icon: "🐕",
      method: "DOGE",
    },
  ];

  // Filter coins that have been set in the database
  const availableCoins = coins.filter(
    (coin) => data[coin.id]
  );

  // Calculate available and pending deposits for each coin
  const getAvailableAmount = (method) => {
    const totalDeposits = data.deposit
      .filter(
        (deposit) =>
          deposit.method.toLowerCase() ===
            method.toLowerCase() &&
          deposit.status === "approved"
      )
      .reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      );

    const totalWithdrawals = data.withdraw
      .filter(
        (withdrawal) =>
          withdrawal.method.toLowerCase() ===
            method.toLowerCase() &&
          withdrawal.status === "approved"
      )
      .reduce(
        (sum, withdrawal) =>
          sum + withdrawal.amount,
        0
      );

    return totalDeposits - totalWithdrawals;
  };

  const getPendingAmount = (method) =>
    data.deposit
      .filter(
        (deposit) =>
          deposit.method === method &&
          deposit.status === "pending"
      )
      .reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      );

  const handleConfirmClick = async () => {
    const requestData = {
      coin: selectedCoin,
      wallet:
        data[
          selectedCoin.toLowerCase() + "AccountId"
        ],
      amount: parseFloat(amount),
      note: comment,
      planIndex: parseInt(selectedPlan),
    };

    try {
      console.log(
        "Submitting withdrawal request...",
        requestData
      );
      await withdraw(requestData);
      if (!erro && responseData) {
        setShowConfirmation(false);
        setAmount("");
        setComment("");
        setSelectedCoin("");
        setSelectedPlan("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="dash min-h-screen w-full bg-canvas px-4 py-6 sm:px-6 sm:py-10 lg:px-10"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "96px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="flex flex-col gap-8 text-foreground">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted">
              / Dashboard
            </p>
          </div>
          <div className="cont-bal flex gap-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:gap-8">
            <div className="text-right">
              <p>Total Balance</p>
              <h2 className="text-xl font-semibold text-foreground">
                ${data?.balance.toFixed(2)}
              </h2>
            </div>
            <div className="text-right">
              <p>Total Withdraw</p>
              <h2 className="text-xl font-semibold text-foreground">
                ${data?.totalWithdraw.toFixed(2)}
              </h2>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-stroke bg-accent/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                Ask for withdrawal
              </h2>
            </div>

            <div className="grid gap-6 rounded-2xl border border-stroke bg-surface p-6">
              <div className="flex justify-between text-sm text-muted">
                <p>Account Balance:</p>
                <p className="font-medium text-foreground">
                  ${data?.balance.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <p>Pending Withdrawals:</p>
                <p className="font-medium text-foreground">
                  $0.00
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm text-foreground">
                  <thead className="bg-surface-muted text-muted">
                    <tr>
                      <th className="py-3 px-2 font-semibold">
                        Processing
                      </th>
                      <th className="py-3 px-2 font-semibold">
                        Available
                      </th>
                      <th className="py-3 px-2 font-semibold">
                        Pending
                      </th>
                      <th className="py-3 px-2 font-semibold">
                        Account
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((crypto) => (
                      <tr
                        key={crypto.name}
                        className="border-b border-stroke last:border-none"
                      >
                        <td className="py-4 px-2 flex items-center gap-2 text-foreground">
                          {crypto.icon}{" "}
                          {crypto.name}
                        </td>
                        <td className="py-4 px-2 text-sm text-emerald-500">
                          $
                          {getAvailableAmount(
                            crypto.name
                          )}
                        </td>
                        <td className="py-4 px-2 text-sm text-rose-500">
                          $
                          {getPendingAmount(
                            crypto.method
                          ).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-sm text-accent">
                          {data[crypto.id] ? (
                            "Set"
                          ) : (
                            <Link
                              href="/profile/edit"
                              className="underline"
                            >
                              Not Set
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                {data?.balance > 0 ? (
                  showConfirmation ? (
                    <div className="rounded-2xl border border-stroke bg-surface-muted px-6 py-6 text-left text-foreground">
                      <h3 className="text-lg font-semibold text-foreground">
                        Withdrawal Confirmation
                      </h3>
                      <div className="mt-4 space-y-2 text-sm text-muted">
                        <p>
                          <span className="font-semibold text-foreground">
                            Payment System:
                          </span>{" "}
                          {selectedCoin}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Account:
                          </span>{" "}
                          {data[
                            selectedCoin.toLowerCase() +
                              "AccountId"
                          ] || "Not Set"}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Debit Amount:
                          </span>{" "}
                          ${amount}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Withdrawal Fee:
                          </span>{" "}
                          We have no fee for this
                          operation.
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Credit Amount:
                          </span>{" "}
                          ${amount}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">
                            Note:
                          </span>{" "}
                          {comment ||
                            "No comment provided"}
                        </p>
                      </div>
                      {erro && (
                        <p className="mt-4 text-sm text-red-500">
                          {erro}
                        </p>
                      )}
                      <button
                        className="btn-accent mt-6 w-full rounded-xl py-3 text-sm font-semibold"
                        onClick={
                          handleConfirmClick
                        }
                      >
                        {isLoading
                          ? "Submitting..."
                          : "Confirm"}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-stroke bg-surface-muted px-6 py-6 text-left text-foreground">
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-muted">
                          Select Plan
                        </label>
                        <select
                          value={selectedPlan}
                          onChange={(e) =>
                            setSelectedPlan(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
                        >
                          <option value="">
                            Select a plan
                          </option>
                          {data?.activeDeposit
                            ?.filter(
                              (deposit) =>
                                deposit.amount > 0
                            )
                            .map(
                              (
                                deposit,
                                index
                              ) => (
                                <option
                                  key={index}
                                  value={data.activeDeposit.indexOf(
                                    deposit
                                  )}
                                >
                                  {deposit.plan} -
                                  $
                                  {deposit.amount}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-muted">
                          Withdrawal Amount
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setAmount(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-muted">
                          Comment
                        </label>
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) =>
                            setComment(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none"
                          placeholder="Enter a comment"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-muted">
                          Select Coin
                        </label>
                        <select
                          value={selectedCoin}
                          onChange={(e) =>
                            setSelectedCoin(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
                        >
                          <option value="">
                            Select a coin
                          </option>
                          {availableCoins.map(
                            (coin) => (
                              <option
                                key={coin.name}
                                value={coin.name}
                              >
                                {coin.name}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      {errorMessage && (
                        <p className="text-sm text-red-500">
                          {errorMessage}
                        </p>
                      )}

                      <button
                        onClick={handleNextClick}
                        className="btn-accent mt-4 w-full rounded-xl py-3 text-sm font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  )
                ) : (
                  <p className="inline-block rounded-xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
                    YOU HAVE NO FUNDS TO WITHDRAW.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Withdrawal;
