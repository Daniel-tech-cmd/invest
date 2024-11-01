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
                <span>Basic Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "standard" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "standard" && (
                <div className="mt-2">
                  <p>
                    Designed for new investors, the Basic Plan offers a solid
                    entry into investment growth with a manageable initial
                    deposit
                  </p>
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
                <span>Standard Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "premium" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "premium" && (
                <div className="mt-2">
                  <p>
                    The Standard Plan provides a higher daily return, suitable
                    for those ready to commit a bit more for increased
                    profitability.
                  </p>
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
                <span>Advanced Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "corporate" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "corporate" && (
                <div className="mt-2">
                  <p>
                    Ideal for seasoned investors, the Advanced Plan combines
                    substantial returns with a moderate entry amount, making it
                    a balanced choice for committed growth..
                  </p>
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
                <span>Silver Plan</span>
                <FaChevronDown
                  className={`transition-transform ${
                    openPlan === "ultimate" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openPlan === "ultimate" && (
                <div className="mt-2">
                  <p>
                    With significant daily profits, the Silver Plan caters to
                    serious investors aiming to maximize returns within a
                    well-defined investment range..
                  </p>
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
