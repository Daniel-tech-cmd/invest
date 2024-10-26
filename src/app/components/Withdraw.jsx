"use client";
import Link from "next/link";
import React from "react";

const Withdrawal = () => {
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
              $0
            </h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Withdraw</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              $0.00
            </h2>
          </div>
        </div>
      </div>
      <div
        className="bg-[#f57c00] text-white text-xl font-semibold py-4 px-6 "
        style={{ marginBottom: "20px", fontSize: "16px", fontWeight: "500" }}
      >
        Ask for withdrawal
      </div>
      <div className="bg-[#232a35] text-gray-200 p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <p>Account Balance:</p>
          <p>$0.00</p>
        </div>
        <div className="flex justify-between mb-6">
          <p>Pending Withdrawals:</p>
          <p>$</p>
        </div>
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
              {[
                { name: "BITCOIN", icon: "🪙" },
                { name: "ETHEREUM", icon: "💠" },
                { name: "LITECOIN", icon: "💳" },
                { name: "USDT", icon: "💵" },
                { name: "DOGE", icon: "🐕" },
              ].map((crypto) => (
                <tr key={crypto.name} className="border-b border-gray-500">
                  <td className="py-4 px-2 flex items-center gap-2">
                    {crypto.icon} {crypto.name}
                  </td>
                  <td className="py-4 px-2 text-green-400">$0.00</td>
                  <td className="py-4 px-2 text-red-400">$0.00</td>
                  <td className="py-4 px-2 text-blue-400 cursor-pointer">
                    <Link href={"/profile"}>not set</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <p
            className="bg-red-500 text-white py-2 px-4  inline-block"
            style={{
              background: "transparent",
              color: "rgb(255, 77, 77)",
              borderRadius: "5px",
              fontSize: "14px !important",
              border: "1px solid rgb(255, 77, 77)",
            }}
          >
            YOU HAVE NO FUNDS TO WITHDRAW.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
