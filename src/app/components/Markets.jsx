"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";
import { cssVar } from "../lib/theme";

const SYMBOLS = {
  aapl: { icon: "A", name: "Apple Inc.", symbol: "AAPL", price: 189.91, change: 0.5, seed: 11 },
  btc: { icon: "B", name: "Bitcoin", symbol: "BTC", price: 69318, change: -412.3, seed: 23 },
  eth: { icon: "E", name: "Ethereum", symbol: "ETH", price: 598.3, change: 14.6, seed: 37 },
  re: { icon: "R", name: "Real Estate Index", symbol: "GGRE", price: 142.18, change: 0.86, seed: 51 },
};
const TF_POINTS = { "1d": 48, "1m": 30, "3m": 60, "1y": 120, "5y": 160, all: 200 };
const TIMEFRAMES = ["1d", "1m", "3m", "1y", "5y", "all"];

function seededSeries(seed, count, drift) {
  let v = 100;
  let s = seed;
  const pts = [100];
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 1; i < count; i++) {
    v += (rand() - 0.48) * 3 + drift;
    pts.push(v);
  }
  return pts;
}

export default function Markets() {
  const [ref, visible] = useReveal(0.3);
  const canvasRef = useRef(null);
  const [symbol, setSymbol] = useState("aapl");
  const [tf, setTf] = useState("1d");

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width;
      const h = r.height;
      const s = SYMBOLS[symbol];
      const up = s.change >= 0;
      const pts = seededSeries(s.seed + tf.length, TF_POINTS[tf] || 48, up ? 0.06 : -0.06);
      const max = Math.max(...pts);
      const min = Math.min(...pts);
      const lineC = cssVar(up ? "--grove-ink" : "--down") || "#0e8f62";
      ctx.clearRect(0, 0, w, h);
      const x = (i) => (i / (pts.length - 1)) * w;
      const y = (v) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, lineC + "33");
      grad.addColorStop(1, lineC + "00");
      ctx.beginPath();
      ctx.moveTo(x(0), y(pts[0]));
      pts.forEach((v, i) => ctx.lineTo(x(i), y(v)));
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x(0), y(pts[0]));
      pts.forEach((v, i) => ctx.lineTo(x(i), y(v)));
      ctx.strokeStyle = lineC;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [visible, symbol, tf]);

  const s = SYMBOLS[symbol];
  const up = s.change >= 0;
  const pct = ((s.change / s.price) * 100).toFixed(2);

  return (
    <section id="markets" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div
          ref={ref}
          className={`section-reveal grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.05fr] ${
            visible ? "is-visible" : ""
          }`}
        >
          <div>
            <span className="eyebrow mb-3 block">Who&apos;s behind the numbers</span>
            <h2 className="mb-4 font-display text-[clamp(1.9rem,3vw,2.5rem)] font-medium">GoldGroveco Investors</h2>
            <p className="mb-4 text-[0.98rem] text-ink-dim">
              A highly selective independent firm specializing in advisory, private placement, and
              investor relations for leading alternative asset managers, with access to a wide range
              of CFD products including forex, cryptocurrencies, commodities, indices, and stocks.
            </p>
            <p className="text-[0.98rem] text-ink-dim">
              Over 350 financial instruments are accessible across three trading terminals in eleven
              languages. Combined with our analytical tools and flexible account types, GoldGroveco
              is built for investors who expect more from an online investment platform.
            </p>
          </div>

          <div
            className="clip-card border p-7"
            style={{ "--cut": "26px", background: "var(--surface-raised)", borderColor: "var(--line-strong)", boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mb-[22px] flex flex-wrap gap-2">
              {Object.entries(SYMBOLS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSymbol(key)}
                  className={`rounded-full border px-4 py-2 text-[0.84rem] font-semibold transition-colors ${
                    symbol === key
                      ? "border-transparent text-[#211203]"
                      : "border-line-strong text-ink-dim hover:border-gold-ink hover:text-gold-ink"
                  }`}
                  style={symbol === key ? { background: "linear-gradient(180deg, var(--gold-bright), var(--gold))" } : undefined}
                >
                  {val.symbol}
                </button>
              ))}
            </div>

            <div className="mb-3.5 flex items-center gap-3">
              <div
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-mono text-[0.72rem] font-semibold"
                style={{ background: "var(--surface-raised-2)" }}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-[0.96rem] font-semibold">{s.name}</div>
                <div className="mono text-[0.76rem] text-ink-faint">{s.symbol} &middot; USD</div>
              </div>
            </div>
            <div className="mono mb-0.5 text-[2.1rem] text-ink">
              ${s.price.toLocaleString("en-US", { minimumFractionDigits: s.price > 1000 ? 0 : 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`mono mb-5 text-[0.88rem] ${up ? "text-grove-ink" : "text-down"}`}>
              {up ? "+" : ""}
              {s.change.toFixed(2)} ({up ? "+" : ""}
              {pct}%) {tf === "1d" ? "today" : tf.toUpperCase()}
            </div>
            <canvas ref={canvasRef} className="mb-4 block h-[140px] w-full" />
            <div className="flex flex-wrap gap-1">
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  className={`mono rounded-lg px-3 py-1.5 text-[0.78rem] transition-colors ${
                    tf === t ? "text-ink" : "text-ink-faint"
                  }`}
                  style={tf === t ? { background: "var(--surface-raised-2)" } : undefined}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
