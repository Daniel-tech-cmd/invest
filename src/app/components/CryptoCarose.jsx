"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CryptocurrencyCarousel = () => {
  const [cryptos, setCryptos] = useState([]);

  // Fetch data from CoinGecko (or your preferred API)
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: "ethereum,tether,binancecoin",
            sparkline: true, // Include the sparkline data (small graph line)
          },
        }
      );

      const formattedData = data.map((item) => ({
        symbol: `${item.symbol.toUpperCase()}/USD`,
        price: `$${item.current_price.toFixed(2)}`,
        change: `${item.price_change_percentage_24h.toFixed(2)}%`,
        icon: item.image,
        sparkline: item.sparkline_in_7d.price.map(
          (price) => price * (1 + Math.random() * 0.05 - 0.025)
        ), // Randomly adjust prices for dynamic visual effect
      }));
      setCryptos(formattedData);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Slider settings for the carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Adjust for tablets and smaller laptops
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Mobile phones and very small devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className="relative bg-cover bg-center py-12 px-6 text-white"
      style={{ backgroundImage: "url('/image-1.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          Real Time Cryptocurrency Market Chart
        </h2>

        <Slider {...settings} className="max-w-6xl mx-auto">
          {cryptos.map((crypto, index) => (
            <div key={index} className="p-2 sm:p-4">
              <div className="flex flex-col items-center bg-transparent border border-gray-700 rounded-lg p-3 sm:p-4 shadow-lg">
                {/* Icon and symbol */}
                <div className="text-xs sm:text-sm flex items-center mb-2 sm:mb-4">
                  <img
                    src={crypto.icon}
                    alt={crypto.symbol}
                    className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
                  />
                  <span className="font-semibold">{crypto.symbol}</span>{" "}
                  {/* Reduced text size */}
                </div>
                {/* Price */}
                <div className="text-lg sm:text-xl font-bold mb-2">
                  {crypto.price}
                </div>{" "}
                {/* Reduced price text size */}
                {/* Price Change */}
                <div
                  className={`text-sm sm:text-lg ${
                    crypto.change.includes("-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {crypto.change}
                </div>
                {/* Graph Line (Sparkline) */}
                <div className="w-full h-10 sm:h-12 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crypto.sparkline}>
                      <Line
                        type="monotone"
                        dataKey={(entry) => entry}
                        stroke="#00d2ff" // Color of the line
                        dot={false}
                        strokeWidth={2} // Thicker line
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 text-xs sm:text-sm text-gray-400">
          Powered by CoinGecko{" "}
          {/* Replace with Cryptohopper if using their API */}
        </div>
      </div>
    </div>
  );
};

export default CryptocurrencyCarousel;
