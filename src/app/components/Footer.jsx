"use client";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 overflow-x-hidden">
      {/* Sign Up Section */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center md:flex-row md:justify-between md:text-left w-full">
        <h2 className="text-white text-2xl mb-4 md:mb-0">
          Sign up today and get your first transaction fee free!
        </h2>
        <button className="text-white border border-white py-2 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition">
          Sign up Now
        </button>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-5 gap-8 w-full">
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
            <li className="mb-2">✉️ support@payyed-investors.com</li>
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
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm w-full">
        <p>Copyright © 2018 - 2022 Payyed-Investors. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
