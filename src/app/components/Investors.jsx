"use client";
import React, { useEffect } from "react";
import Script from "next/script";

const GoldgrovecoInvestors = () => {
  useEffect(() => {
    // Dynamically load the TradingView widget
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [["AAPL|1D"]],
      chartOnly: false,
      width: "100%",
      height: "300",
      locale: "en",
      colorTheme: "light",
      gridLineColor: "#F0F3FA",
      trendLineColor: "#2196F3",
      fontColor: "#787B86",
      underLineColor: "#E3F2FD",
      isTransparent: false,
      autosize: true,
      largeChartUrl: "",
    });
    document.getElementById("tradingview").appendChild(script);
  }, []);

  return (
    <div className="bg-white flex justify-center items-center py-10 px-5">
      <div className="max-w-6xl bg-white p-8 rounded-md shadow-lg flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="md:w-1/2 w-full md:pr-8 mb-8 md:mb-0">
          <h1 className="text-2xl text-black font-bold mb-4">
            Goldgroveco Investors
          </h1>
          <p className="text-gray-700 mb-4">
            is a highly selective independent firm specializing in advisory,
            private placement and investor relations for leading alternative
            asset management firms around the globe and has a wide range of CFD
            products on offer, including forex, cryptocurrencies, commodities,
            indices, stocks and more.
          </p>
          <p className="text-gray-700">
            Goldgroveco Investors has over 350 financial derivatives accessible
            over 3 types of trading terminals in 11 different languages. When
            combined with the range of analytical and charting tools and
            flexible account types, Goldgroveco Investors emerges as a powerful
            contender in the online and investment company.
          </p>
        </div>

        {/* TradingView Section */}
        <div className="md:w-1/2 w-full" style={{ overflow: "hidden" }}>
          <div id="tradingview" className="w-full h-64">
            {/* TradingView Widget will be embedded here */}
          </div>
        </div>

        <Script src="https://s3.tradingview.com/tv.js" />
      </div>
    </div>
  );
};

export default GoldgrovecoInvestors;
