"use client";

const AgriculturalProducts = () => {
  return (
    <div className="bg-white">
      <div className="relative max-w-6xl mx-auto py-16 px-6">
        {/* Title */}
        <h1 className="text-4xl text-black font-bold text-center mb-10">
          Trade Our Agricultural Stock Products
        </h1>

        {/* Agricultural Stock Products Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wheat Stock Investment */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-4">
              Wheat Stock Investment: A Reliable Source of Agricultural Growth
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Investing in wheat stocks offers a dependable and profitable way
              to diversify your portfolio. Wheat stocks represent shares in
              companies engaged in the cultivation, processing, and distribution
              of wheat. Unlike raw agricultural produce, wheat stocks can
              provide the benefits of both agricultural market investments and
              stock market performance.
            </p>
            <img
              src="/weat.jpg" // Replace with your image path
              alt="Wheat Stock"
              className="w-full h-auto rounded"
            />
          </div>

          {/* Corn Stock Investment */}
          <div>
            <h2 className="text-2xl text-black font-bold mb-4">
              Corn Stock Investment: Pioneering Technology for Sustainable
              Agriculture
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Investing in corn stocks provides a dynamic and sustainable
              opportunity for diversifying your investment portfolio. Corn
              stocks represent shares in companies engaged in the cultivation,
              research, and production of corn. When combined with advanced
              farming technologies, investing in corn stocks can enhance
              profitability and sustainability.
            </p>
            <img
              src="/corn.jpg" // Replace with your image path
              alt="Corn Stock"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalProducts;
