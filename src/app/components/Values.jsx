"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useReveal from "../hooks/useReveal";

const BARS = [
  { label: "Trading", target: 95.7 },
  { label: "Investment", target: 92 },
  { label: "Commercial", target: 85 },
];

const GALLERY = [
  { src: "/photos/auto.jpg", alt: "Automated trading systems", caption: "Automated trades" },
  { src: "/photos/support.jpg", alt: "GoldGroveco support desk", caption: "Best support" },
  { src: "/photos/creative.jpg", alt: "A creative idea in progress", caption: "Creative idea" },
  { src: "/photos/withdraw.jpg", alt: "A withdrawal being processed", caption: "Withdrawal" },
];

export default function Values() {
  const [ref, visible] = useReveal(0.4);
  const [widths, setWidths] = useState([0, 0, 0]);
  const [labels, setLabels] = useState([0, 0, 0]);
  const animated = useRef(false);

  useEffect(() => {
    if (!visible || animated.current) return;
    animated.current = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setWidths(BARS.map((b) => b.target));

    if (reduceMotion) {
      setLabels(BARS.map((b) => b.target));
      return;
    }
    const start = performance.now();
    const dur = 1000;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setLabels(BARS.map((b) => b.target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <section id="values" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div ref={ref} className={`section-reveal grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-[52px] ${visible ? "is-visible" : ""}`}>
          <div>
            <span className="eyebrow mb-3.5 block">Our values</span>
            <h2 className="mb-[18px] font-display text-[clamp(1.7rem,3vw,2.1rem)] font-medium">Our skills</h2>
            <p className="mb-6 text-[0.98rem] text-ink-dim">
              Our trading desk carries an average of seven years in the cryptocurrency markets, with
              a 96.7% success rate on trading profits over that time.
            </p>
            <div className="mb-8 flex flex-col gap-4">
              {BARS.map((bar, i) => (
                <div key={bar.label}>
                  <div className="mb-[7px] flex justify-between text-[0.86rem] text-ink">
                    <span>{bar.label}</span>
                    <span className="mono text-gold-ink">{labels[i].toFixed(1)}%</span>
                  </div>
                  <div className="h-[5px] overflow-hidden rounded" style={{ background: "var(--line-strong)" }}>
                    <div
                      className="h-full rounded transition-[width] duration-[1100ms] ease-out"
                      style={{ width: `${widths[i]}%`, background: "linear-gradient(90deg, var(--gold), var(--grove))" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mb-3 text-[1.1rem] font-bold">Our mission</h3>
            <p className="mb-2 text-[0.94rem] text-ink-dim">
              With hundreds of cryptocurrencies already trading and more launched every month,
              deciding what to hold beyond Bitcoin is genuinely hard. Our trading desk exists to
              make that call, so investors can build financial stability without becoming
              full-time traders themselves.
            </p>
            <h3 className="mb-3 mt-[26px] text-[1.1rem] font-bold">Automated, supported, transparent</h3>
            <p className="mb-2 text-[0.94rem] text-ink-dim">
              Allocation runs on automated rules, backed by a support desk that responds same-day,
              with every position visible from your dashboard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {GALLERY.map((g) => (
              <div key={g.caption} className="clip-card relative aspect-[4/3] overflow-hidden" style={{ "--cut": "14px" }}>
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  style={{ filter: "saturate(0.92) contrast(1.03)" }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-2.5 text-center text-[0.8rem] font-medium text-white"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(10,8,4,0.75))" }}
                >
                  {g.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
