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
  const [isPromoWithdraw, setIsPromoWithdraw] =
    useState(false);

  const handleNextClick = () => {
    if (!selectedCoin) {
      setErrorMessage("Please select a coin.");
    } else if (!isPromoWithdraw && !selectedPlan) {
      setErrorMessage("Please select a plan.");
    } else if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage(
        "Please enter a valid withdrawal amount.",
      );
    } else if (isPromoWithdraw) {
      // Promo specific validation
      if (parseFloat(amount) > data.promoBonus) {
        setErrorMessage(
          `Insufficient promo balance. Available: $${(data.promoBonus || 0).toFixed(2)}`,
        );
      } else if (
        data.promoWithdrawDate &&
        new Date() < new Date(data.promoWithdrawDate)
      ) {
        setErrorMessage(
          `Promo withdrawal is not allowed until ${new Date(data.promoWithdrawDate).toLocaleDateString()}`,
        );
      } else if (
        data.promoWithdrawAmount > 0 &&
        parseFloat(amount) > data.promoWithdrawAmount
      ) {
        setErrorMessage(
          `Your maximum allowed promo withdrawal is currently $${data.promoWithdrawAmount.toFixed(2)}`,
        );
      } else {
        setErrorMessage("");
        setShowConfirmation(true);
      }
    } else if (parseFloat(amount) > data.balance) {
      setErrorMessage(
        "Withdrawal amount cannot be greater than available balance.",
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
    (coin) => data[coin.id],
  );

  // Coins used in previous approved deposits (ignoring wallet set status for now)
  const potentialPromoCoins = coins.filter((coin) =>
    data.deposit?.some(
      (d) =>
        d.status === "approved" &&
        (d.method?.toUpperCase() ===
          coin.method.toUpperCase() ||
          d.method?.toUpperCase() ===
            coin.name.toUpperCase() ||
          d.method
            ?.toUpperCase()
            .includes(coin.method.toUpperCase()) ||
          coin.name
            .toUpperCase()
            .includes(d.method?.toUpperCase())),
    ),
  );

  // Coins used in deposits that ALSO have a wallet address set
  const depositedCoins = potentialPromoCoins.filter(
    (coin) => data[coin.id],
  );

  // Calculate available amount from stopped activeDeposits that haven't been withdrawn
  const getAvailableAmount = (method) => {
    // Get total from stopped deposits (amount + profit) that haven't been withdrawn
    // Filter by cryptocurrency method
    const availableFromDeposits = (
      data.activeDeposit || []
    )
      .filter(
        (deposit) =>
          deposit.stopped === true &&
          deposit.withdrawn !== true &&
          deposit.method?.toUpperCase() ===
            method.toUpperCase(),
      )
      .reduce(
        (sum, deposit) =>
          sum +
          (deposit.amount || 0) +
          (deposit.profit || 0),
        0,
      );

    return availableFromDeposits;
  };

  const getPendingAmount = (method) =>
    data.deposit
      .filter(
        (deposit) =>
          deposit.method === method &&
          deposit.status === "pending",
      )
      .reduce(
        (sum, deposit) => sum + deposit.amount,
        0,
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
      planIndex: isPromoWithdraw
        ? "promo"
        : parseInt(selectedPlan),
    };

    try {
      console.log(
        "Submitting withdrawal request...",
        requestData,
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

            {data?.promoBonus > 0 && (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsPromoWithdraw(false);
                    setShowConfirmation(false);
                    setErrorMessage("");
                  }}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    !isPromoWithdraw
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-stroke bg-surface text-muted hover:border-accent/50"
                  }`}
                >
                  Standard Withdrawal
                </button>
                <button
                  onClick={() => {
                    setIsPromoWithdraw(true);
                    setShowConfirmation(false);
                    setErrorMessage("");
                    setSelectedPlan("");
                  }}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isPromoWithdraw
                      ? "border-purple-500 bg-purple-500/10 text-purple-500"
                      : "border-stroke bg-surface text-muted hover:border-purple-500/50"
                  }`}
                >
                  Promo Withdrawal
                </button>
              </div>
            )}

            <div className="grid gap-6 rounded-2xl border border-stroke bg-surface p-6">
              <div className="flex justify-between text-sm text-muted">
                <p>
                  {isPromoWithdraw
                    ? "Promo Balance:"
                    : "Account Balance:"}
                </p>
                <p className="font-medium text-foreground">
                  $
                  {isPromoWithdraw
                    ? (data?.promoBonus || 0).toFixed(2)
                    : data?.balance.toFixed(2)}
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
                            crypto.name,
                          )}
                        </td>
                        <td className="py-4 px-2 text-sm text-rose-500">
                          $
                          {getPendingAmount(
                            crypto.method,
                          ).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-sm text-accent">
                          {data[crypto.id] ? (
                            <span>
                              Set{" "}
                              {data[crypto.id.replace("AccountId", "Network")] &&
                                `(${data[crypto.id.replace("AccountId", "Network")]})`}
                            </span>
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
                          {data[
                            selectedCoin.toLowerCase() +
                              "Network"
                          ] &&
                            ` (${
                              data[
                                selectedCoin.toLowerCase() +
                                  "Network"
                              ]
                            })`}
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
                      {isPromoWithdraw ? (
                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-muted">
                            Promo Withdrawal Date
                          </label>
                          <div className="rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground">
                            {data.promoWithdrawDate
                              ? new Date(
                                  data.promoWithdrawDate,
                                ).toLocaleDateString()
                              : "No date set (Available now)"}
                          </div>
                          {depositedCoins.length >
                            0 && (
                            <div className="mt-2 rounded-lg bg-purple-500/10 border border-purple-500/30 px-3 py-2 text-xs text-purple-600">
                              ℹ️ You can only withdraw
                              using coins you have
                              previously deposited
                              with.
                            </div>
                          )}
                          {potentialPromoCoins.length >
                            0 &&
                            depositedCoins.length ===
                              0 && (
                              <div className="mt-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-600">
                                ⚠️ You have deposited
                                with{" "}
                                {potentialPromoCoins
                                  .map(
                                    (c) => c.name,
                                  )
                                  .join(", ")}{" "}
                                but you haven't set
                                their wallet addresses
                                in your profile yet.
                                Please{" "}
                                <Link
                                  href="/profile/edit"
                                  className="underline font-bold"
                                >
                                  set your wallet
                                  addresses
                                </Link>{" "}
                                to withdraw.
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-muted">
                            Select Plan
                          </label>
                          <div className="mb-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-xs text-blue-600">
                            ℹ️ Only completed plans
                            (stopped) that haven't
                            been withdrawn are
                            available. The amount
                            shown includes your
                            initial deposit +
                            accumulated profit.
                          </div>
                          <select
                            value={selectedPlan}
                            onChange={(e) =>
                              setSelectedPlan(
                                e.target.value,
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
                                  deposit.stopped ===
                                    true &&
                                  deposit.withdrawn !==
                                    true &&
                                  deposit.amount +
                                    (deposit.profit ||
                                      0) >
                                    0,
                              )
                              .map(
                                (
                                  deposit,
                                  index,
                                ) => {
                                  const totalAvailable =
                                    deposit.amount +
                                    (deposit.profit ||
                                      0);
                                  const actualIndex =
                                    data.activeDeposit.indexOf(
                                      deposit,
                                    );
                                  return (
                                    <option
                                      key={
                                        actualIndex
                                      }
                                      value={
                                        actualIndex
                                      }
                                    >
                                      {deposit.plan}{" "}
                                      - $
                                      {totalAvailable.toFixed(
                                        2,
                                      )}{" "}
                                      (Deposit: $
                                      {deposit.amount.toFixed(
                                        2,
                                      )}{" "}
                                      + Profit: $
                                      {(
                                        deposit.profit ||
                                        0
                                      ).toFixed(2)}
                                      )
                                    </option>
                                  );
                                },
                              )}
                          </select>
                        </div>
                      )}
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-muted">
                          Withdrawal Amount
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setAmount(
                              e.target.value,
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
                              e.target.value,
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
                              e.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-stroke bg-surface px-3 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none"
                        >
                          <option value="">
                            Select a coin
                          </option>
                          {(isPromoWithdraw
                            ? depositedCoins
                            : availableCoins
                          ).map((coin) => (
                            <option
                              key={coin.name}
                              value={coin.name}
                            >
                              {coin.name}
                            </option>
                          ))}
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
                ) : isPromoWithdraw &&
                  data?.promoBonus > 0 ? (
                  <p className="inline-block rounded-xl border border-purple-500 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-500">
                    USE THE FORM ABOVE TO WITHDRAW
                    YOUR PROMO BONUS.
                  </p>
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
