"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Investment Insurance",
    subtitle:
      "We are committed to protecting the privacy and security of the information that you share with us. In Ontario, insurance products are distributed by Aviva Agency Services Inc.",
    image: "/image-6.jpg",
  },
  {
    title: "Your Future, Our Commitment",
    subtitle: "Secure your investments with our comprehensive insurance plans.",
    image: "/image-10.jpg",
  },
  {
    title: "Tailored Investment Solutions",
    subtitle: "Get the best plans for your financial security and growth.",
    image: "/pc.jpg",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {slide.title}
            </h2>
            <p className="max-w-xl mb-6">{slide.subtitle}</p>
            <Link
              href={"/signup"}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-md shadow-md"
            >
              Get started
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={handlePrev}
          className="text-white bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={handleNext}
          className="text-white bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-2"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Banner;
