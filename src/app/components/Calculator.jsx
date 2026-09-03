"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import { cssVar } from "../lib/theme";

const PLANS = {
  basic: { name: "Basic", rate: 4.6, days: 5, min: 100 },
  standard: { name: "Standard", rate: 6.8, days: 7, min: 500 },
  advanced: { name: "Advanced", rate: 7.7, days: 7, min: 5000 },
  silver: { name: "Silver", rate: 8.4, days: 7, min: 10000 },
};

function series(amount, plan) {
  const pts = [amount];
  let v = amount;
  for (let d = 1; d <= plan.days; d++) {
    v *= 1 + plan.rate / 100;
    pts.push(v);
  }
  return pts;
}

const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Calculator() {
  const [ref, visible] = useReveal(0.3);
  const chartRef = useRef(null);
  const animRef = useRef(null);
  const [planKey, setPlanKey] = useState("basic");
  const [amount, setAmount] = useState(500);
  const [figures, setFigures] = useState({ final: 10000, profit: 0 });

  const plan = PLANS[planKey];

  useEffect(() => {
    if (amount < plan.min) setAmount(plan.min);
  }, [planKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!visible) return;
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pts = series(amount, plan);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function drawChart(progress) {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width;
      const h = r.height;
      const padL = 4, padR = 4, padT = 10, padB = 22;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const visibleCount = Math.max(2, Math.round(pts.length * progress));
      const vis = pts.slice(0, visibleCount);
      const max = Math.max(...pts);
      const min = Math.min(...pts);
      const groveC = cssVar("--grove-ink") || "#0e8f62";
      const lineC = cssVar("--line") || "rgba(0,0,0,0.1)";
      const inkFaint = cssVar("--ink-faint") || "#867e6c";

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = lineC;
      ctx.lineWidth = 1;
      for (let g = 0; g <= 3; g++) {
        const gy = padT + innerH * (g / 3);
        ctx.beginPath();
        ctx.moveTo(padL, gy);
        ctx.lineTo(w - padR, gy);
        ctx.stroke();
      }

      const x = (i) => padL + (i / (pts.length - 1)) * innerW;
      const y = (v) => padT + innerH - ((v - min) / (max - min || 1)) * innerH;

      const grad = ctx.createLinearGradient(0, padT, 0, padT + innerH);
      grad.addColorStop(0, groveC + "3d");
      grad.addColorStop(1, groveC + "00");
      ctx.beginPath();
      ctx.moveTo(x(0), y(vis[0]));
      vis.forEach((v, i) => ctx.lineTo(x(i), y(v)));
      ctx.lineTo(x(vis.length - 1), padT + innerH);
      ctx.lineTo(x(0), padT + innerH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x(0), y(vis[0]));
      vis.forEach((v, i) => ctx.lineTo(x(i), y(v)));
      ctx.strokeStyle = groveC;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      const lastX = x(vis.length - 1);
      const lastY = y(vis[vis.length - 1]);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = groveC;
      ctx.fill();

      ctx.fillStyle = inkFaint;
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("Day 0", padL, h - 6);
      ctx.textAlign = "right";
      ctx.fillText("Day " + (pts.length - 1), w - padR, h - 6);
    }

    setFigures({ final: pts[pts.length - 1], profit: pts[pts.length - 1] - pts[0] });

    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (reduceMotion) {
      drawChart(1);
    } else {
      const start = performance.now();
      const dur = 900;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        drawChart(1 - Math.pow(1 - p, 3));
        if (p < 1) animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => drawChart(1));
    ro.observe(canvas);
    const mo = new MutationObserver(() => drawChart(1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [visible, amount, planKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="calculator" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          eyebrow={null}
          title="See your own numbers"
          description="Pick a plan and a deposit amount. The chart uses the exact daily rate that posts to real accounts."
        />
        <div
          ref={ref}
          className={`section-reveal clip-card grid grid-cols-1 gap-8 border p-7 md:grid-cols-[0.85fr_1.15fr] md:gap-10 md:p-[38px] ${
            visible ? "is-visible" : ""
          }`}
          style={{ "--cut": "30px", background: "var(--surface-raised)", borderColor: "var(--line-strong)", boxShadow: "var(--shadow-soft)" }}
        >
          <div>
            <div className="mb-[30px] flex flex-wrap gap-2">
              {Object.entries(PLANS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setPlanKey(key)}
                  className={`rounded-full border px-4 py-2 text-[0.84rem] font-semibold transition-colors ${
                    planKey === key
                      ? "border-transparent text-[#211203]"
                      : "border-line-strong text-ink-dim hover:border-gold-ink hover:text-gold-ink"
                  }`}
                  style={planKey === key ? { background: "linear-gradient(180deg, var(--gold-bright), var(--gold))" } : undefined}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[0.84rem] text-ink-dim">Deposit amount</span>
              <span className="mono text-[1.5rem] text-ink">${amount.toLocaleString("en-US")}</span>
            </div>
            <input
              type="range"
              min={plan.min}
              max={20000}
              step={50}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="range-slider my-2.5 mb-2 block h-1 w-full"
              aria-label="Deposit amount"
            />
            <div className="mb-5 text-[0.76rem] text-gold-ink">
              {plan.name} requires a ${plan.min.toLocaleString("en-US")} minimum.
            </div>
            <div className="flex flex-wrap gap-7 border-t pt-[18px]" style={{ borderColor: "var(--line)" }}>
              <div>
                <span className="mb-1 block text-[0.7rem] uppercase tracking-[0.07em] text-ink-faint">Daily rate</span>
                <span className="mono text-[1rem] text-ink">{plan.rate}%</span>
              </div>
              <div>
                <span className="mb-1 block text-[0.7rem] uppercase tracking-[0.07em] text-ink-faint">Term</span>
                <span className="mono text-[1rem] text-ink">{plan.days} days</span>
              </div>
              <div>
                <span className="mb-1 block text-[0.7rem] uppercase tracking-[0.07em] text-ink-faint">Minimum</span>
                <span className="mono text-[1rem] text-ink">${plan.min.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <canvas ref={chartRef} className="mb-[22px] block h-[220px] w-full" />
            <div className="flex gap-8 border-t pt-[18px]" style={{ borderColor: "var(--line)" }}>
              <div className="flex flex-col gap-1.5">
                <span className="text-[0.8rem] text-ink-dim">Final balance</span>
                <span className="mono text-[1.7rem] text-ink">{fmt(figures.final)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[0.8rem] text-ink-dim">Total profit</span>
                <span className="mono text-[1.7rem] text-grove-ink">+{fmt(figures.profit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
