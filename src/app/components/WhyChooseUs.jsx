"use client";

import { FaHandPointer, FaLock, FaDollarSign } from "react-icons/fa";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";

const WhyChooseUs = () => {
  return (
    <div className="bg-white py-10 px-5">
      <div className="text-center mb-10">
        <h2 className="text-3xl text-black font-bold">
          Why should you choose Payyed Investors?
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Quality Execution */}
        <div className="flex flex-col items-start text-left">
          <FaHandPointer className="text-green-600 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Quality Execution
          </h3>
          <p className="text-gray-600 text-sm">
            Utmost privacy and superior execution of quality.
          </p>
        </div>

        {/* Fund Reliability */}
        <div className="flex flex-col items-start text-left">
          <AiOutlineFundProjectionScreen className="text-green-600 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Fund Reliability
          </h3>
          <p className="text-gray-600 text-sm">
            Your funds are reliably protected. Thanks to the use of Blockchain
            technologies in compliance with all existing security measures.
          </p>
        </div>

        {/* Client Discretion */}
        <div className="flex flex-col items-start text-left">
          <FaDollarSign className="text-green-600 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Client Discretion
          </h3>
          <p className="text-gray-600 text-sm">
            We don't disclose or sell any information about our clients and
            their transactions to any third parties.
          </p>
        </div>

        {/* 100% Secure */}
        <div className="flex flex-col items-start text-left">
          <FaLock className="text-green-600 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">100% Secure</h3>
          <p className="text-gray-600 text-sm">
            As a financial institution, we operate strictly within the policies
            of international financial law.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
