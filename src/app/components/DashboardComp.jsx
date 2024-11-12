"use client";
import React, { useEffect } from "react";
import Hamburg from "./Hamburger";
import { formatDate } from "../utils/formdate";

const Dashboard = ({ data }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;

    const widgetConfig = {
      interval: "5m",
      width: window.innerWidth <= 768 ? "100%" : 425, // Adjust width based on screen size
      isTransparent: true,
      height: 450,
      symbol: "NASDAQ:AAPL",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark",
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    document.getElementById("tradingview-widget-container").appendChild(script);

    const handleResize = () => {
      const updatedWidth = window.innerWidth <= 768 ? "100%" : 425;
      widgetConfig.width = updatedWidth;
      script.innerHTML = JSON.stringify(widgetConfig);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const sumPendingDeposits = (deposits) => {
    // Filter the deposits to only include those with "pending" status
    const pendingDeposits = deposits.filter(
      (deposit) => deposit.status === "pending"
    );

    // Sum the amounts of the pending deposits
    const totalPendingAmount = pendingDeposits.reduce(
      (sum, deposit) => sum + deposit.amount,
      0
    );

    return totalPendingAmount;
  };
  const totalActiveDeposit = data?.activeDeposit
    ?.filter((deposit) => deposit.stopped === false)
    .reduce((sum, deposit) => sum + deposit.amount, 0)
    .toFixed(2);
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
              $0.00
            </h2>
          </div>
        </div>
      </div>
      {/* Overview and Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overview Section */}
        <div className="bg-[#232a35] p-6 md:p-6 p-4 rounded-lg">
          <h2 className="text-lg text-white font-semibold mb-4">Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Deposit</p>
              <p className="text-2xl font-bold text-green-400">
                ${data?.totalDeposit?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Active Deposit</p>
              <p className="text-2xl font-bold text-blue-400">
                ${totalActiveDeposit}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Withdraw</p>
              <p className="text-2xl font-bold text-red-400">
                ${data?.totalWithdraw?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#232a35] p-6 md:p-6 p-4 rounded-lg md:col-span-2">
          <h2 className="text-lg text-white font-semibold mb-4">
            Your Account
          </h2>
          <table className="text-gray-400 w-full">
            <tbody>
              <tr>
                <td>User:</td>
                <td className="text-white">{data?.username}</td>
              </tr>
              <tr>
                <td>Referral Link:</td>
                <td className="text-white">
                  <a
                    href={`https://goldgroveco.com/ref?r=${data?.username}`}
                    className="text-blue-400 text-sm md:text-base"
                  >
                    https://goldgroveco.com/ref?r={data?.username}
                  </a>
                </td>
              </tr>
              <tr>
                <td>Registration Date:</td>
                <td className="text-white">{formatDate(data?.createdAt)}</td>
              </tr>

              <tr>
                <td>Account Balance:</td>
                <td className="text-white">${data?.balance.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Earned Total:</td>
                <td className="text-white">${data?.profit.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Pending Deposit:</td>
                <td className="text-white">
                  ${sumPendingDeposits(data?.deposit)}
                </td>
              </tr>
              <tr>
                <td>Pending Withdrawal:</td>
                <td className="text-white">
                  ${sumPendingDeposits(data?.withdraw) || 0.0}
                </td>
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
          style={{ margin: "auto", width: "100%" }}
        >
          <div className="tradingview-widget-container__widget"></div>
          <div
            className="tradingview-widget-copyright"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
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
