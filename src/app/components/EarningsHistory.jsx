import React from "react";
import { formatDate } from "../utils/formdate";

const EarningsHistory = ({ data }) => {
  // Get earnings history and reverse to show most recent first
  const earnings = data?.earnHistory ? [...data.earnHistory].reverse() : [];

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
                ${formatCurrency(data?.balance)}
              </h2>
            </div>
            <div className="text-right">
              <p>Total Profit</p>
              <h2 className="text-xl font-semibold text-foreground">
                ${formatCurrency(data?.profit)}
              </h2>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            Earnings History
          </h2>

          {earnings.length === 0 ? (
            <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-dashed border-stroke bg-surface-muted text-sm font-semibold text-muted">
              No earnings found.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-foreground">
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Amount Earned</th>
                    <th className="px-6 py-3 font-semibold">Plan</th>
                    <th className="px-6 py-3 font-semibold">Deposit Amount</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning, index) => (
                    <tr
                      key={`${earning._id}-${index}`}
                      className="border-b border-stroke last:border-none hover:bg-surface-muted/60"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">
                        <span className="inline-flex items-center gap-1 text-emerald-500">
                          +${formatCurrency(earning.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                          {earning.plan || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        ${formatCurrency(earning.depositAmount)}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {formatDate(earning.date)}
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
};

export default EarningsHistory;
