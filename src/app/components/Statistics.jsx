"use client";
import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Unobserve after the first load
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the component is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col items-center py-20 bg-cover bg-center"
      style={{ backgroundImage: "url('/agro.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-10">Statistics</h2>

        <div className="flex flex-col md:flex-row justify-around w-full max-w-4xl">
          <div className="text-center m-4 p-6 border-2 border-dotted border-white rounded-lg">
            <div className="text-3xl md:text-2xl font-semibold text-white">
              {isVisible && <CountUp end={4000} duration={6} />}
            </div>
            <div className="text-base md:text-sm text-white">Days Online</div>
          </div>

          <div className="text-center m-4 p-6 border-2 border-dotted border-white rounded-lg">
            <div className="text-3xl md:text-2xl font-semibold text-white">
              {isVisible && <CountUp end={823000} duration={6} />}
            </div>
            <div className="text-base md:text-sm text-white">
              Total Investors
            </div>
          </div>

          <div className="text-center m-4 p-6 border-2 border-dotted border-white rounded-lg">
            <div className="text-3xl md:text-2xl font-semibold text-white">
              {isVisible && (
                <CountUp
                  end={192811173.55}
                  duration={6}
                  decimals={2}
                  prefix="$"
                />
              )}
            </div>
            <div className="text-base md:text-sm text-white">
              Total Deposited
            </div>
          </div>

          <div className="text-center m-4 p-6 border-2 border-dotted border-white rounded-lg">
            <div className="text-3xl md:text-2xl font-semibold text-white">
              {isVisible && (
                <CountUp
                  end={3981385.96}
                  duration={6}
                  decimals={2}
                  prefix="$1,048,"
                />
              )}
            </div>
            <div className="text-base md:text-sm text-white">
              Total Withdrawal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
