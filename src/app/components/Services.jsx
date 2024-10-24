import Image from "next/image";

const Services = () => {
  return (
    <section className="bg-gray-50 py-12">
      {/* Top Section with Background Image */}
      <div className="bg-[url('/service.jpg')] bg-cover bg-center h-64 flex items-center justify-center relative">
        {/* Overlay Background for text clarity */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <h1 className="relative z-10 text-white text-4xl font-bold">
          Our Services
        </h1>
      </div>

      {/* Services Text Section */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Service 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/farm.jpg"
              alt="Sustainable Farms"
              width={500} // Set the width explicitly
              height={300} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            Investment in Sustainable Farms
          </h2>
          <p className="mt-4 text-gray-600">
            We provide investors with opportunities to fund sustainable
            agricultural projects that focus on organic farming, eco-friendly
            practices, and long-term food security.
          </p>
        </div>

        {/* Service 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/farmtech.jpg"
              alt="High-Tech Agribusiness Ventures"
              width={500} // Set the width explicitly
              height={300} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            High-Tech Agribusiness Ventures
          </h2>
          <p className="mt-4 text-gray-600">
            Invest in the future of agriculture by supporting high-tech ventures
            such as precision farming, AI-driven agriculture, and smart farming
            technologies aimed at maximizing yields.
          </p>
        </div>

        {/* Service 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/impact.jpg"
              alt="Impact Investment Funds"
              width={500} // Set the width explicitly
              height={200} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            Impact Investment Funds
          </h2>
          <p className="mt-4 text-gray-600">
            Our impact investment funds are geared towards creating sustainable
            value by supporting agricultural projects that prioritize
            environmental protection, social responsibility, and financial
            growth.
          </p>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Service 4 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/agro.jpg"
              alt="Agro-Financial Consulting"
              width={500} // Set the width explicitly
              height={300} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            Agro-Financial Consulting
          </h2>
          <p className="mt-4 text-gray-600">
            We offer specialized financial consulting services for investors
            looking to diversify into agriculture. Our experts guide you through
            the best investment strategies in the agricultural space.
          </p>
        </div>

        {/* Service 5 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/market.jpg"
              alt="Global Market Access"
              width={500} // Set the width explicitly
              height={300} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            Global Market Access
          </h2>
          <p className="mt-4 text-gray-600">
            Gain access to global agricultural markets through our platform,
            connecting investors with projects across the globe to enhance
            profitability and diversify portfolios.
          </p>
        </div>

        {/* Service 6 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          {/* Service Image */}
          <div className="relative w-full h-48">
            <Image
              src="/farm_tool.jpg"
              alt="Farm Monitoring Tools"
              width={500} // Set the width explicitly
              height={300} // Set the height explicitly
              className="rounded-t-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mt-4">
            Farm Monitoring Tools
          </h2>
          <p className="mt-4 text-gray-600">
            Utilize our cutting-edge farm monitoring tools that provide
            real-time data on crop yields, soil conditions, and overall farm
            performance to help investors make informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
