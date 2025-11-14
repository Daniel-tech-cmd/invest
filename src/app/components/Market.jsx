"use client";

import {
  FaStar,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import TradingViewWidget from "./TradeingViewWidget";
import Image from "next/image";
import SparklineChart from "./Chart";

const bottomAssets = [
  {
    name: "META",
    symbol: "META",
    price: 457.77,
    change: -0.35,
  },
  {
    name: "ALPHABET INC",
    symbol: "GOOG",
    price: 145.2,
    change: 0.23,
  },
  {
    name: "NETFLIX, INC.",
    symbol: "NTLX",
    price: 555.9,
    change: 12.23,
  },
  {
    name: "APPLE (AAPL)",
    symbol: "AAPL",
    price: 189.91,
    change: 0.5,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 69318,
    change: 0,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 598.296,
    change: 2.73,
  },
  {
    name: "MICROSOFT CORP",
    symbol: "MSFT",
    price: 414.05,
    change: 8.04,
  },
  {
    name: "JP MORGAN",
    symbol: "JPM",
    price: 0,
    change: 0,
  },
];

export default function MarketDashboard({
  data,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4 text-foreground md:p-8 lg:grid-cols-3">
      {/* Chart Section */}
      <div className="card-panel lg:col-span-2 rounded-3xl p-4">
        <div className="my-4 h-[300px] md:h-[400px]">
          <TradingViewWidget />
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted">
          {[
            "Core Assets",
            "Top Gainers",
            "Top Losers",
            "New",
          ].map((label, index) => (
            <button
              key={index}
              className={`${index === 0 ? "text-foreground border-b-2 border-accent" : ""} pb-1`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      <div className="flex flex-col gap-4">
        <div className="card-panel rounded-3xl p-4 text-center">
          <h3 className="mb-2 text-sm text-muted">
            Your Current Server
          </h3>
          <div className="flex flex-col items-center">
            <Image
              src="/65cd8304189691707967236.jpg"
              alt="server icon"
              width={60}
              height={60}
              className="rounded-full"
            />
            <p className="mt-2 text-lg font-semibold text-foreground">
              Server 1
            </p>
            <div className="mt-1 flex gap-1 text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <FaStar key={idx} />
                ))}
            </div>
          </div>
        </div>

        <div className="card-panel rounded-3xl p-4 text-center">
          <h3 className="mb-2 text-sm text-muted">
            {data?.balance < 5000
              ? "Unlock Next Rank"
              : "Current Rank"}
          </h3>
          <div className="flex flex-col items-center">
            <Image
              src="/64f37c4bb97731693678667.png"
              alt="silver badge"
              width={80}
              height={80}
            />
            <p className="mt-2 text-lg font-semibold text-foreground">
              ${data.balance} / $5,000.00
            </p>
            <p className="text-xs text-muted">
              Deposit $5,000.00 To Unlock Rank
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bottomAssets.map((asset, index) => {
          const isUp = asset.change > 0;
          const hasPrice = asset.price > 0;

          return (
            <div
              key={index}
              className="card-panel flex flex-col justify-between rounded-3xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    {asset.name}
                  </h4>
                  <p className="text-xs text-muted">
                    {asset.symbol}
                  </p>
                </div>
                <span className="chip text-xs">
                  24H
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-foreground">
                {hasPrice
                  ? `${asset.price} USD`
                  : "N/A"}
              </p>

              {asset.change !== 0 && (
                <div
                  className={`flex items-center text-sm gap-1 ${
                    isUp ? "text-accent" : "text-[#f97360]"
                  }`}
                >
                  {isUp ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}
                  {isUp ? "+" : "-"}
                  {Math.abs(asset.change)}%
                </div>
              )}

              <div className="mt-2">
                <SparklineChart />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
