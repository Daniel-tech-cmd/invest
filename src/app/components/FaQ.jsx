"use client";

import { useState } from "react";

const faqData = [
  {
    question: "How do I build an investment strategy?",
    answer:
      "Building an investment strategy requires understanding your financial goals, risk tolerance, and time horizon. You should diversify your portfolio and review it regularly.",
  },
  {
    question: "What are some popular investment options?",
    answer:
      "Popular investment options include stocks, bonds, mutual funds, ETFs, and real estate. Your choice should depend on your financial goals and risk tolerance.",
  },
  {
    question: "How much do I need to invest with Goldgroveco Investors?",
    answer:
      "The minimum investment required depends on the type of investment product you choose. Contact us for more details on the best investment for your portfolio.",
  },
  {
    question: "How to invest with Goldgroveco Investors?",
    answer:
      "To invest with Goldgroveco Investors, you can sign up on our platform, select your preferred investment options, and start growing your portfolio.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if the same index is clicked
    } else {
      setActiveIndex(index); // Open the clicked FAQ
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Can't find it here? Check out our{" "}
          <a href="/help-center" className="text-green-600 hover:underline">
            Help center
          </a>
        </p>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 cursor-pointer"
            >
              <div
                className="flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {item.question}
                </h3>
                <span>
                  {activeIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-2 text-gray-600">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
