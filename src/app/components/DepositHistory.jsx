import React from "react";
import { formatDate } from "../utils/formdate";

const DepositHistory = ({ data }) => {
  // Dummy data for deposits
  const deposits = [...data?.deposit].reverse();

  // Format date

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
            <p className="text-gray-400 text-sm md:text-base">Total Deposit</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.totalDeposit}
            </h2>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Deposit History
      </h2>
      {deposits.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg font-semibold">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="min-w-full bg-[#232a35] rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-[#323a47] text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {deposits.map((deposit, index) => (
                <tr
                  key={deposit.index}
                  className="border-b border-gray-600 hover:bg-[#2b3240]"
                >
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">
                    ${deposit.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md font-semibold ${
                        deposit.status === "approved"
                          ? "bg-green-600 text-green-100"
                          : deposit.status === "pending"
                          ? "bg-yellow-500 text-yellow-100"
                          : "bg-red-600 text-red-100"
                      }`}
                    >
                      {deposit.status.charAt(0).toUpperCase() +
                        deposit.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{deposit.method}</td>
                  <td className="px-6 py-4 text-sm">
                    {formatDate(deposit.date)}
                  </td>
                  <td className="px-6 py-4 text-sm">{`#${deposit?._id[3]}${deposit?._id[5]}${deposit?._id[6]}${deposit?._id[10]}${deposit?._id[9]}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
