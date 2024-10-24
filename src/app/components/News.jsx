"use client";

import React, { useEffect } from "react";

const TradingViewTimelineWidget = () => {
  useEffect(() => {
    // Create a script tag for the TradingView widget
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;

    // Configure the widget parameters
    script.innerHTML = JSON.stringify({
      feedMode: "all_symbols",
      isTransparent: false,
      displayMode: "regular",
      colorTheme: "dark",
      width: "100%",
      height: "400", // Leave this as 100% to fill the parent container
      locale: "en",
    });

    // Append the script inside the widget container
    document.getElementById("tradingview-widget-container").appendChild(script);
  }, []);

  return (
    <div className="w-full min-h-[400px] bg-gray-900 rounded-lg shadow-lg p-4">
      {/* TradingView Widget Container */}
      <div
        id="tradingview-widget-container"
        className="tradingview-widget-container h-full"
      >
        <div className="tradingview-widget-container__widget h-full"></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener nofollow"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            <span>Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TradingViewTimelineWidget;
