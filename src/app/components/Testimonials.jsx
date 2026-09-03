"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";

const QUOTES = [
  {
    quote:
      "I started with Basic just to test the daily payout claim. Eleven months and three reinvestments later, I moved to Advanced. What sold me wasn't the number. It was that the balance updates on the same schedule, every day, without me asking.",
    cite: "Amara O., investor since 2024",
  },
  {
    quote:
      "I referred my brother mostly as a formality. Watching two accounts compound side by side, comparing notes every Sunday, turned into the most consistent thing either of us has stuck with this year.",
    cite: "David K., investor since 2023",
  },
  {
    quote:
      "The first withdrawal is the one that matters. Mine cleared in under four hours on a Sunday night, which is when I happened to test it. After that I stopped checking so often.",
    cite: "Priya S., investor since 2025",
  },
  {
    quote:
      "GoldGroveco Investors has been a game-changer for our investment strategy. Their expertise and personalized service have significantly improved our portfolio's performance.",
    cite: "John Thompson, CFO at Bright Ventures",
  },
  {
    quote:
      "I'm thoroughly impressed with GoldGroveco Investors. Their deep market insights and commitment to customer success are unmatched.",
    cite: "Emily Roberts, Senior Financial Analyst at Global Holdings",
  },
  {
    quote:
      "GoldGroveco's approach to customer service and investment strategy is world-class. They made it easy for us to diversify and increase our returns.",
    cite: "Michael Sanders, CEO at Investwise",
  },
];

export default function Testimonials() {
  const [ref, visible] = useReveal();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setIdx(i);
    clearInterval(timerRef.current);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      timerRef.current = setInterval(() => setIdx((v) => (v + 1) % QUOTES.length), 6000);
    }
  };

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div ref={ref} className={`section-reveal grid grid-cols-1 gap-9 sm:grid-cols-[2px_1fr] ${visible ? "is-visible" : ""}`}>
          <div className="h-0.5 w-full sm:h-full sm:w-full" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          <div
            ref={trackRef}
            onMouseEnter={() => clearInterval(timerRef.current)}
            onMouseLeave={() => goTo(idx)}
          >
            <div className="relative min-h-[170px] sm:min-h-[130px]">
              {QUOTES.map((q, i) => (
                <div
                  key={i}
                  className={`transition-opacity duration-500 ${
                    i === idx ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                  }`}
                >
                  <blockquote className="m-0 mb-[22px] max-w-[52ch] font-display text-[clamp(1.3rem,2.4vw,1.7rem)] italic leading-[1.45] text-ink">
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                  <cite className="text-[0.86rem] not-italic text-ink-dim">{q.cite}</cite>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className="h-2 w-2 rounded-full transition-transform"
                  style={{
                    background: i === idx ? "var(--gold-ink)" : "var(--line-strong)",
                    transform: i === idx ? "scale(1.35)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
