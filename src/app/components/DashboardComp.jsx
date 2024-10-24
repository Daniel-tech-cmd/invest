"use client";
import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "5m",
      width: 425,
      isTransparent: true,
      height: 450,
      symbol: "NASDAQ:AAPL",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark",
    });
    document.getElementById("tradingview-widget-container").appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#1c222c] p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">Dashboard</h1>
          <p className="text-gray-400">/ Dashboard</p>
        </div>
        <div className="flex gap-6 md:gap-4 text-right text-white">
          <div>
            <p>Total Balance</p>
            <h2 className="text-lg font-bold">$0</h2>
          </div>
          <div>
            <p>Total Withdraw</p>
            <h2 className="text-lg font-bold">$0.00</h2>
          </div>
        </div>
      </div>

      {/* Overview and Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overview Section */}
        <div className="bg-[#232a35] p-6 rounded-lg">
          <h2 className="text-lg text-white font-semibold mb-4">Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Active Deposit</p>
              <p className="text-2xl font-bold text-blue-400">$0.00</p>
            </div>
            <div>
              <p className="text-gray-400">Total Deposit</p>
              <p className="text-2xl font-bold text-green-400">$0.00</p>
            </div>
            <div>
              <p className="text-gray-400">Total Withdraw</p>
              <p className="text-2xl font-bold text-red-400">$0.00</p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#232a35] p-6 rounded-lg md:col-span-2">
          <h2 className="text-lg text-white font-semibold mb-4">
            Your Account
          </h2>
          <table className="text-gray-400 w-full">
            <tbody>
              <tr>
                <td>User:</td>
                <td className="text-white">isabella2</td>
              </tr>
              <tr>
                <td>Referral Link:</td>
                <td className="text-white">
                  <a
                    href="http://horizoncapitaltrade.com?ref=isabella2"
                    className="text-blue-400"
                  >
                    http://horizoncapitaltrade.com?ref=isabella2
                  </a>
                </td>
              </tr>
              <tr>
                <td>Registration Date:</td>
                <td className="text-white">Oct-19-2024</td>
              </tr>
              <tr>
                <td>Last Access:</td>
                <td className="text-white">Oct-24-2024 08:54:32 PM</td>
              </tr>
              <tr>
                <td>Account Balance:</td>
                <td className="text-white">$0</td>
              </tr>
              <tr>
                <td>Earned Total:</td>
                <td className="text-white">$0.00</td>
              </tr>
              <tr>
                <td>Pending Withdrawal:</td>
                <td className="text-white">$0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TradingView Widget Section */}
      <div className="mt-10">
        <h2 className="text-lg text-white font-semibold mb-4">
          Market Analysis
        </h2>
        <div
          id="tradingview-widget-container"
          className="tradingview-widget-container"
        >
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright">
            <a
              href="https://www.tradingview.com/"
              rel="noopener nofollow"
              target="_blank"
            >
              <span className="text-blue-400">
                Track all markets on TradingView
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
