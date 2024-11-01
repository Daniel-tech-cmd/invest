"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const InvestmentPlans = () => {
  const [openPlan, setOpenPlan] = useState(null);

  const togglePlan = (plan) => {
    setOpenPlan(openPlan === plan ? null : plan);
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(/image-6.jpg)" }} // Replace with your image path
      ></div>

      {/* Dark Overlay to enhance text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto py-16 px-6 text-white">
        {/* Left section - Investment Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Our Cryptocurrency Investment Plans
            </h2>

            {/* Standard Plan */}
            <div
              className={`border p-4 mb-4 bg-white text-black rounded cursor-pointer transition-all ${
                openPlan === "standard" ? "shadow-lg" : ""
              }`}
              onClick={() => togglePlan("standard")}
            >
              <div className="flex justify-between items-center">
                <span>Standard Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "standard" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "standard" && (
                <div className="mt-2">
                  <p>Details about the Standard Plan...</p>
                </div>
              )}
            </div>

            {/* Premium Plan */}
            <div
              className={`border p-4 mb-4 bg-white text-black rounded cursor-pointer transition-all ${
                openPlan === "premium" ? "shadow-lg" : ""
              }`}
              onClick={() => togglePlan("premium")}
            >
              <div className="flex justify-between items-center">
                <span>Premium Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "premium" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "premium" && (
                <div className="mt-2">
                  <p>Details about the Premium Plan...</p>
                </div>
              )}
            </div>

            {/* Corporate Plan */}
            <div
              className={`border p-4 mb-4 bg-white text-black rounded cursor-pointer transition-all ${
                openPlan === "corporate" ? "shadow-lg" : ""
              }`}
              onClick={() => togglePlan("corporate")}
            >
              <div className="flex justify-between items-center">
                <span>Corporate Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "corporate" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "corporate" && (
                <div className="mt-2">
                  <p>Details about the Corporate Plan...</p>
                </div>
              )}
            </div>

            {/* Ultimate Plan */}
            <div
              className={`border p-4 mb-4 bg-white text-black rounded cursor-pointer transition-all ${
                openPlan === "ultimate" ? "shadow-lg" : ""
              }`}
              onClick={() => togglePlan("ultimate")}
            >
              <div className="flex justify-between items-center">
                <span>Ultimate Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "ultimate" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "ultimate" && (
                <div className="mt-2">
                  <p>Details about the Ultimate Plan...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Text Content */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              We Protect Your Investment Needs
            </h2>
            <p className="text-base mb-4">
              One of the most compelling aspects of investing with Goldgroveco
              is our commitment to protecting our investors from market losses.
              Unlike other investment companies, Goldgroveco does not share the
              burden of market downturns with our investors.
            </p>
            <p className="text-base mb-4">
              We guarantee the promised percentage return regardless of market
              fluctuations. This ensures that you receive consistent and
              reliable returns on your investment, providing you with peace of
              mind and financial stability.
            </p>
            <p className="text-base">
              Invest with Goldgroveco, where your success is our priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlans;
