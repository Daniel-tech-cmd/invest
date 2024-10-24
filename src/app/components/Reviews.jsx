"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    quote:
      "Payyed Investors has been a game-changer for our investment strategy. Their expertise and personalized service have significantly improved our portfolio's performance.",
    author: "John Thompson",
    position: "CFO at Bright Ventures",
  },
  {
    quote:
      "I'm thoroughly impressed with Payyed Investors. Their deep market insights and commitment to customer success are unmatched.",
    author: "Emily Roberts",
    position: "Senior Financial Analyst at Global Holdings",
  },
  {
    quote:
      "Payyed's approach to customer service and investment strategy is world-class. They made it easy for us to diversify and increase our returns.",
    author: "Michael Sanders",
    position: "CEO at Investwise",
  },
  {
    quote:
      "Payyed Investors stands out because of their in-depth knowledge of the markets and their personalized approach to investing.",
    author: "Sarah Mitchell",
    position: "Portfolio Manager at FinGrowth",
  },
  {
    quote:
      "We’ve seen tremendous growth in our investments since working with Payyed Investors. Their strategy is truly superior.",
    author: "David Johnson",
    position: "Investor at Future Wealth",
  },
  {
    quote:
      "Thanks to Payyed, our investment returns have consistently outperformed expectations. Their insights and strategies are invaluable.",
    author: "Laura Garcia",
    position: "Financial Consultant at ValuePro",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile or not
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // If screen width is below 768px, it's mobile
    };

    handleResize(); // Run on component mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide functionality with useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (isMobile) {
          return (prevIndex + 1) % testimonials.length; // For mobile, slide one testimonial at a time
        }
        return (prevIndex + 2) % testimonials.length; // For desktop, slide two testimonials at a time
      });
    }, 5000); // Slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [isMobile]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        return (prevIndex + 1) % testimonials.length;
      }
      return (prevIndex + 2) % testimonials.length;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (isMobile) {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
      return prevIndex === 0 ? testimonials.length - 2 : prevIndex - 2;
    });
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-black text-center mb-8">
          What people are saying about Payyed Investors
        </h2>

        {/* Testimonials */}
        <div className="flex justify-between overflow-hidden">
          {testimonials
            .slice(currentIndex, currentIndex + (isMobile ? 1 : 2))
            .map((testimonial, index) => (
              <div key={index} className="w-full md:w-1/2 px-4 mb-4">
                <div className="bg-gray-50 shadow-md rounded-lg p-6 text-center">
                  <blockquote className="text-lg text-gray-700 mb-4">
                    “{testimonial.quote}”
                  </blockquote>
                  <p className="font-bold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({
            length: isMobile ? testimonials.length : testimonials.length / 2,
          }).map((_, dotIndex) => (
            <div
              key={dotIndex}
              onClick={() => setCurrentIndex(dotIndex * (isMobile ? 1 : 2))}
              className={`h-3 w-3 rounded-full cursor-pointer ${
                currentIndex / (isMobile ? 1 : 2) === dotIndex
                  ? "bg-gray-800"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevSlide}
            className="text-gray-500 hover:text-gray-800"
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="text-gray-500 hover:text-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
