"use client";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 py-12">
      {/* Top Section with Background Image */}
      <div className="bg-[url('/about.jpg')] bg-cover bg-center h-64 flex items-center justify-center relative">
        {/* Overlay Background for text clarity */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <h1 className="relative z-10 text-white text-4xl font-bold">
          About Us
        </h1>
      </div>

      {/* About Us Text Section */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Left Text Content */}
        <div>
          <p className="text-gray-800 text-lg leading-relaxed">
            At our agricultural investment platform, we believe in empowering
            individuals and institutions to contribute to the future of
            sustainable farming. Our platform provides a direct link between
            investors and thriving agricultural projects, ensuring that capital
            flows where it's needed the most.
          </p>
          <p className="mt-4 text-gray-800 text-lg leading-relaxed">
            We focus on innovation, sustainability, and ethical farming
            practices. By connecting investors with projects ranging from
            organic farms to high-tech agribusiness ventures, we aim to drive
            growth in agriculture while delivering strong returns for our
            investors.
          </p>
          <p className="mt-4 text-gray-800 text-lg leading-relaxed">
            Our vision is to create a world where agriculture thrives through
            responsible investments, paving the way for global food security and
            environmental sustainability.
          </p>
        </div>

        {/* Right Image or Additional Content */}
        <div className="relative">
          <img
            src="/image-6.jpg"
            alt="Agricultural Investment"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
