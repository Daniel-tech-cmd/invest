import React from "react";
import { formatDate } from "../utils/formdate";

const DepositHistory = ({ data }) => {
  // Dummy data for deposits
  const deposits = [...data?.deposit].reverse();

  // Format date

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
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted">/ Dashboard</p>
          </div>
          <div className="cont-bal flex gap-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:gap-8">
            <div className="text-right">
              <p>Total Balance</p>
              <h2 className="text-xl font-semibold text-foreground">
                ${data?.balance.toFixed(2)}
              </h2>
            </div>
            <div className="text-right">
              <p>Total Deposit</p>
              <h2 className="text-xl font-semibold text-foreground">
                ${data?.totalDeposit}
              </h2>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            Deposit History
          </h2>

          {deposits.length === 0 ? (
            <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-dashed border-stroke bg-surface-muted text-sm font-semibold text-muted">
              No transactions found.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-foreground">
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Method</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit, index) => (
                    <tr
                      key={deposit.index ?? `${deposit._id}-${index}`}
                      className="border-b border-stroke last:border-none hover:bg-surface-muted/60"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">
                        ${deposit.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            deposit.status === "approved"
                              ? "bg-emerald-500/15 text-emerald-500"
                              : deposit.status === "pending"
                              ? "bg-amber-400/15 text-amber-500"
                              : "bg-rose-500/15 text-rose-500"
                          }`}
                        >
                          {deposit.status.charAt(0).toUpperCase() +
                            deposit.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">{deposit.method}</td>
                      <td className="px-6 py-4 text-muted">
                        {formatDate(deposit.date)}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {`#${deposit?._id?.slice?.(0, 8) ?? "-----"}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DepositHistory;
