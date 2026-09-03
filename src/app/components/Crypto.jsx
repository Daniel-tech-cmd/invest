"use client";

import { useEffect, useRef } from "react";
import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import { cssVar } from "../lib/theme";

const COINS = [
  { symbol: "BTC", name: "Bitcoin", price: "69,318.00", change: 1.8, seed: 3 },
  { symbol: "ETH", name: "Ethereum", price: "598.30", change: 2.7, seed: 9 },
  { symbol: "USDT", name: "Tether", price: "1.00", change: 0.0, seed: 15 },
  { symbol: "LTC", name: "Litecoin", price: "84.62", change: -1.4, seed: 21 },
  { symbol: "DOGE", name: "Dogecoin", price: "0.14", change: 4.2, seed: 27 },
];

function seeded(seed) {
  let s = seed;
  const pts = [10];
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 1; i < 18; i++) pts.push(pts[i - 1] + (rand() - 0.45) * 2);
  return pts;
}

function CryptoCard({ coin }) {
  const canvasRef = useRef(null);
  const up = coin.change >= 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pts = seeded(coin.seed);
      const max = Math.max(...pts);
      const min = Math.min(...pts);
      const w = r.width;
      const h = r.height;
      const color = cssVar(up ? "--grove-ink" : "--down") || "#0e8f62";
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      pts.forEach((v, i) => {
        const px = (i / (pts.length - 1)) * w;
        const py = h - ((v - min) / (max - min || 1)) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
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
  }, [coin, up]);

  return (
    <div
      className="w-[190px] flex-shrink-0 rounded-2xl border p-[18px_20px]"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.88rem] font-semibold text-ink">{coin.symbol}</span>
        <span className="text-[0.7rem] text-ink-faint">{coin.name}</span>
      </div>
      <div className="mono mb-1 text-[1.18rem] text-ink">${coin.price}</div>
      <div className={`mono text-[0.78rem] ${up ? "text-grove-ink" : "text-down"}`}>
        {up ? "+" : ""}
        {coin.change.toFixed(1)}%
      </div>
      <canvas ref={canvasRef} className="mt-2.5 block h-[34px] w-full" />
    </div>
  );
}

export default function Crypto() {
  const [ref, visible] = useReveal();
  const doubled = [...COINS, ...COINS];
  return (
    <section id="crypto" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead title="Digital assets, rebalanced daily" description="A working set of liquid positions across major and stable assets." />
      </div>
      <div ref={ref} className={`section-reveal overflow-hidden ${visible ? "is-visible" : ""}`}>
        <div className="crypto-track flex w-max gap-4">
          {doubled.map((coin, i) => (
            <CryptoCard coin={coin} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
