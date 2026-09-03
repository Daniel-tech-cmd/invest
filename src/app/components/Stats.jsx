"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";

const STATS = [
  { target: 823406, format: "int", label: "Investors served" },
  { target: 192.8, format: "millions", label: "Total deposited" },
  { target: 148.6, format: "millions", label: "Total withdrawn" },
  { target: 1412, format: "int", label: "Days online" },
];

function formatValue(n, format) {
  if (format === "millions") return "$" + n.toFixed(1) + "M";
  return Math.round(n).toLocaleString("en-US");
}

export default function Stats() {
  const [ref, visible] = useReveal(0.4);
  const [values, setValues] = useState(STATS.map(() => 0));
  const animated = useRef(false);

  useEffect(() => {
    if (!visible || animated.current) return;
    animated.current = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValues(STATS.map((s) => s.target));
      return;
    }
    const start = performance.now();
    const dur = 1400;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValues(STATS.map((s) => s.target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <section id="stats" className="border-y py-[100px] transition-colors duration-500" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div ref={ref} className={`section-reveal grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 ${visible ? "is-visible" : ""}`}>
          {STATS.map((s, i) => (
            <div key={s.label}>
              <div className="mono mb-2 text-[clamp(1.9rem,3.4vw,2.6rem)] text-gold-ink">
                {formatValue(values[i], s.format)}
              </div>
              <div className="text-[0.86rem] text-ink-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
