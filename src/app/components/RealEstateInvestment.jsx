"use client";

import { FaHandPointer } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";

const RealEstateInvestment = () => {
  return (
    <div className="relative">
      {/* Background Image with reduced opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(/house.webp)" }} // Replace with your image path
      ></div>

      {/* Dark Overlay to increase text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content Section */}
      <div className="relative max-w-6xl mx-auto py-16 px-6 text-center text-white">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-4">
          Unlock the Potential of Real Estate Investment
        </h2>
        {/* Subtitle */}
        <p className="text-lg mb-12">
          Real estate investment involves buying, owning, and managing
          properties to earn returns through rental income, property
          appreciation, and potential tax benefits. Success in real estate
          relies on effective management and strategic property selection.
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buy a Home */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-700 mb-4">
              <FaHandPointer className="text-2xl text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Buy a home</h3>
            <p className="text-base">
              With over 1 million+ homes for sale available on the website,
              Trulia can match you with a house you will want to call home.
            </p>
          </div>

          {/* Rent a Home */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-700 mb-4">
              <AiOutlineHome className="text-2xl text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Rent a home</h3>
            <p className="text-base">
              With 35+ filters and custom keyword search, Trulia can help you
              easily find a home or apartment for rent that you'll love.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateInvestment;
