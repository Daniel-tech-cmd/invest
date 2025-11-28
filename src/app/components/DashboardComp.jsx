"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { formatDate } from "../utils/formdate";
import MarketDashboard from "./Market";

const Dashboard = ({ data }) => {
  useEffect(() => {
    const script =
      document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;

    const widgetConfig = {
      interval: "5m",
      width:
        window.innerWidth <= 768 ? "100%" : 425, // Adjust width based on screen size
      isTransparent: true,
      height: 450,
      symbol: "NASDAQ:AAPL",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: "dark",
    };

    script.innerHTML =
      JSON.stringify(widgetConfig);
    const container = document.getElementById(
      "tradingview-widget-container"
    );
    if (!container) {
      return () => {};
    }

    container.innerHTML = "";
    container.appendChild(script);

    const handleResize = () => {
      const updatedWidth =
        window.innerWidth <= 768 ? "100%" : 425;
      widgetConfig.width = updatedWidth;
      script.innerHTML =
        JSON.stringify(widgetConfig);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
      if (container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);
  const safeNumber = (value) => {
    if (value === null || value === undefined)
      return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (value) =>
    safeNumber(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const sumPendingDeposits = (records) => {
    const pendingTotal = records
      ?.filter(
        (record) => record?.status === "pending"
      )
      ?.reduce(
        (sum, record) =>
          sum + safeNumber(record?.amount),
        0
      );

    return formatCurrency(pendingTotal);
  };

  const totalActiveDepositAmount =
    data?.activeDeposit
      ?.filter(
        (deposit) => deposit?.stopped === false
      )
      ?.reduce(
        (sum, deposit) =>
          sum + safeNumber(deposit?.amount),
        0
      );

  const formattedBalance = formatCurrency(
    data?.balance
  );
  const formattedTotalDeposit = formatCurrency(
    data?.totalDeposit
  );
  const formattedActiveDeposit = formatCurrency(
    totalActiveDepositAmount
  );
  const formattedTotalWithdraw = formatCurrency(
    data?.totalWithdraw
  );
  const formattedProfit = formatCurrency(
    data?.profit
  );
  const formattedTradeInterest = formatCurrency(
    data?.tradeInterest
  );

  const BTC_CONVERSION_RATE = 65000; // Approximate spot rate for visual context
  const btcEquivalent =
    safeNumber(data?.balance) /
    BTC_CONVERSION_RATE;
  const formattedBtcEquivalent = btcEquivalent
    ? `${btcEquivalent.toFixed(6)} BTC`
    : "0.000000 BTC";

  return (
    <div
      className="min-h-screen w-full dash px-4 sm:px-6 lg:px-10 py-6 sm:py-10 bg-canvas"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "56px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="flex flex-col gap-8 text-foreground">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-muted uppercase">
                Welcome Back
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Dashboard Overview
              </h1>
            </div>
            <p className="mt-4 text-sm text-muted md:mt-0">
              / Dashboard
            </p>
          </div>

          <div className="rounded-3xl card-panel p-6 sm:p-8 backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted">
                  Total Balance
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-medium sm:text-[2.5rem]">
                    ${formattedBalance}
                  </span>
                  <span className="text-xs font-medium text-accent sm:text-sm">
                    USD
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {formattedBtcEquivalent}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/withdraw" className="btn-accent rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg">
                  Withdraw
                </Link>
                <Link href="/deposit" className="btn-ghost rounded-full px-6 py-2.5 text-sm font-semibold">
                  Deposit
                </Link>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total Deposit",
                  value: `$${formattedTotalDeposit}`,
                  dot: "#8b5cf6",
                },
                {
                  label: "Interest Balances",
                  value: `$${formattedProfit}`,
                  dot: "#38bdf8",
                },
                {
                  label: "Total Withdrawal",
                  value: `$${formattedTotalWithdraw}`,
                  dot: "#f97360",
                },
                {
                  label: "Trade Interest",
                  value: `$${formattedTradeInterest}`,
                  dot: "#22d3ee",
                },
              ].map(({ label, value, dot }) => (
                <div
                  key={label}
                  className="card-muted flex items-center justify-between rounded-2xl px-4 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground sm:text-xl">
                      {value}
                    </p>
                  </div>
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundImage:
                        "url('https://www.atlaswealthmanagement.org/circle-blue.svg')",
                      backgroundSize: "cover",
                      backgroundPosition:
                        "center",
                    }}
                  ></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl card-panel p-6">
            <h2 className="text-lg font-semibold">
              Portfolio Snapshot
            </h2>
            <p className="mt-1 text-sm text-muted">
              Quick view of your earning channels
            </p>

            <div className="mt-6 space-y-5">
              <div className="card-muted rounded-2xl px-4 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Total Deposit
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">
                  ${formattedTotalDeposit}
                </p>
              </div>

              <div className="card-muted rounded-2xl px-4 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Active Deposit
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">
                  ${formattedActiveDeposit}
                </p>
              </div>

              <div className="card-muted rounded-2xl px-4 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Total Withdraw
                </p>
                <p className="mt-3 text-xl font-semibold text-foreground">
                  ${formattedTotalWithdraw}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl card-panel p-6 xl:col-span-2">
            <h2 className="text-lg font-semibold">
              Your Account
            </h2>
            <p className="mt-1 text-sm text-muted">
              Personal information and quick
              actions
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    User
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {data?.username ?? "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Registration Date
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    {formatDate(
                      data?.createdAt
                    ) ?? "---"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Account Balance
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    ${formattedBalance}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Referral Link
                  </p>
                  <a
                    href={`https://goldgroveco.com/signup?r=${data?.username}`}
                    className="mt-1 block break-all text-sm font-medium text-accent transition hover:opacity-80"
                  >
                    https://goldgroveco.com/signup?r=
                    {data?.username}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Pending Deposit
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    $
                    {sumPendingDeposits(
                      data?.deposit
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Pending Withdrawal
                  </p>
                  <p className="mt-1 text-base font-medium text-foreground">
                    $
                    {sumPendingDeposits(
                      data?.withdraw
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl card-panel p-4 sm:p-6">
          <h2 className="text-lg font-semibold">
            Market Overview
          </h2>
          <p className="mt-1 text-sm text-muted">
            Track live markets and asset
            performance in real time
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-stroke bg-surface-muted/70">
            <MarketDashboard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
