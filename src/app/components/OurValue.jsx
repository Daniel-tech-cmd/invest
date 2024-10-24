"use client";
import Image from "next/image";
import { useState } from "react";

const OurValuesSection = () => {
  return (
    <div className="bg-white py-12 px-6 sm:px-12 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Our Values
      </h2>

      <div className="flex flex-col md:flex-row">
        {/* Left side with text */}
        <div className="md:w-1/2 pr-4">
          <h3 className="text-xl font-semibold text-black mb-4">Our Skills</h3>
          <p className="text-gray-700 mb-4">
            We have experts in the Cryptocurrency Market who have at least 7
            years of market experience working here in the company. And we have
            at least a 96.7% Success Rate over the years on our Trading Profits.
          </p>

          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-900">Trading 95.7%</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "95.7%" }}
                ></div>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Investment 92%</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-900">Commercial 85%</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-8 text-black mb-4">
            Our Mission
          </h3>
          <p className="text-gray-700">
            With hundreds of cryptocurrencies already out on the global market
            and many more created each month continuously, we feel that it is
            really challenging to decide which Altcoin to hold and invest
            besides Bitcoin in order to help our investors eradicate the rate of
            poverty and make them financially stable with the aid of our Trading
            Experts.
          </p>
        </div>

        {/* Right side with images */}
        <div className="md:w-1/2 mt-8 md:mt-0 grid grid-cols-2 gap-4">
          <div className="relative group">
            <Image
              src="/auto.jpg" // Replace with your image path
              alt="Automated Trades"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-center text-sm font-medium">
              Automated Trades
            </div>
          </div>
          <div className="relative group">
            <Image
              src="/support.jpg" // Replace with your image path
              alt="Best Support"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-center text-sm font-medium">
              Best Support
            </div>
          </div>
          <div className="relative group">
            <Image
              src="/creative.jpg" // Replace with your image path
              alt="Creative Idea"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-center text-sm font-medium">
              Creative Idea
            </div>
          </div>
          <div className="relative group">
            <Image
              src="/withdraw.jpg" // Replace with your image path
              alt="Withdrawal"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-white text-center text-sm font-medium">
              Withdrawal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurValuesSection;
