"use client";

const Footer = () => {
  return (
    <footer className="overflow-x-hidden">
      {/* Sign Up Section with Background Image */}
      <div className="bg-[url('/image-6.jpg')] bg-cover bg-center bg-no-repeat h-64 flex flex-col justify-center items-center text-center px-4 md:h-72 relative">
        {/* Overlay Background Gradient with Reduced Opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>{" "}
        {/* Changed bg-opacity-50 to bg-opacity-20 */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            Sign up today and get your first transaction fee free!
          </h2>
          <button className="text-white border border-white py-2 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition">
            Sign up Now
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Who We Are */}
          <div>
            <h3 className="text-white text-lg mb-4">WHO WE ARE</h3>
            <ul>
              <li className="mb-2 hover:text-white transition">Our Purpose</li>
              <li className="hover:text-white transition">Our Culture</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg mb-4">SERVICES</h3>
            <ul>
              <li className="mb-2 hover:text-white transition">
                Unit Trust Fund
              </li>
              <li className="mb-2 hover:text-white transition">
                Offshore Investment
              </li>
              <li className="mb-2 hover:text-white transition">
                Tax Free Investment
              </li>
              <li className="hover:text-white transition">How to Invest</li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-white text-lg mb-4">HELP CENTER</h3>
            <ul>
              <li className="mb-2 hover:text-white transition">Contact Us</li>
              <li className="hover:text-white transition">Support</li>
            </ul>
          </div>

          {/* Keep in Touch */}
          <div>
            <h3 className="text-white text-lg mb-4">KEEP IN TOUCH</h3>
            <ul>
              <li className="mb-2">📞 +44 0203 0990123</li>
              <li className="mb-2">✉️ support@Goldgroveco.com</li>
              <li>📍 20 Audley St. London, W1K 6WE, United Kingdom</li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-white text-lg mb-4">SUBSCRIBE</h3>
            <p className="mb-4">
              Subscribe to receive the latest news and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email Address"
                className="px-4 py-2 rounded-l-lg bg-gray-800 text-gray-400 border-none focus:outline-none w-full"
              />
              <button className="px-4 py-2 bg-blue-600 rounded-r-lg hover:bg-blue-500 transition">
                🚀
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
          <p>
            Copyright © 2018 - 2022 Goldgroveco-Investors. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
