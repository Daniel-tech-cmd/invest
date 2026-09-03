"use client";

import { useEffect, useRef, useState } from "react";

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function effectiveTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit) return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Hero() {
  const heroRef = useRef(null);
  const treeCanvasRef = useRef(null);
  const sparklineRef = useRef(null);
  const spotlightRef = useRef(null);
  const demoValueRef = useRef(null);
  const demoDeltaRef = useRef(null);
  const demoDayRef = useRef(null);
  const demoCardRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load-in stagger
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setTimeout(() => setIsLoaded(true), 60);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mouse spotlight
  useEffect(() => {
    const hero = heroRef.current;
    const spotlight = spotlightRef.current;
    if (!hero || !spotlight) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      spotlight.style.setProperty("--sx", `${e.clientX - r.left}px`);
      spotlight.style.setProperty("--sy", `${e.clientY - r.top}px`);
      spotlight.classList.add("opacity-100");
    };
    const onLeave = () => spotlight.classList.remove("opacity-100");

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Live demo card: count up then tick, sparkline
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const demoStart = 10000;
    const demoTarget = 10482.17;
    const demoDay = 19;
    let counted = false;
    let tickInterval;

    const fmt = (v) =>
      "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    function startTicking() {
      if (reduceMotion) return;
      let current = demoTarget;
      let todayDelta = demoTarget - demoStart;
      tickInterval = setInterval(() => {
        const bump = Math.random() * 0.35;
        current += bump;
        todayDelta += bump;
        if (demoValueRef.current) demoValueRef.current.textContent = fmt(current);
        if (demoDeltaRef.current) demoDeltaRef.current.textContent = `+${fmt(todayDelta)} today`;
      }, 2600);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || counted) return;
          counted = true;
          io.disconnect();
          const start = performance.now();
          const dur = 1600;
          function tick(now) {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = demoStart + (demoTarget - demoStart) * eased;
            if (demoValueRef.current) demoValueRef.current.textContent = fmt(val);
            if (demoDeltaRef.current)
              demoDeltaRef.current.textContent = `+${fmt((demoTarget - demoStart) * eased)} today`;
            if (p < 1) requestAnimationFrame(tick);
            else {
              if (demoDayRef.current) demoDayRef.current.textContent = `Day ${demoDay} / 45`;
              startTicking();
            }
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    if (demoCardRef.current) io.observe(demoCardRef.current);

    // Sparkline
    const canvas = sparklineRef.current;
    const ctx = canvas.getContext("2d");
    const points = [8, 10, 9, 13, 15, 14, 18, 20, 19, 24, 26, 25, 30, 34, 33, 39, 44, 42, 48, 54];

    function redrawSparkline() {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width;
      const h = r.height;
      const lineColor = cssVar("--grove-ink") || "#0e8f62";
      ctx.clearRect(0, 0, w, h);
      const max = Math.max(...points);
      const min = Math.min(...points);
      const stepX = w / (points.length - 1);
      const y = (v) => h - 6 - ((v - min) / (max - min)) * (h - 14);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, lineColor + "59");
      grad.addColorStop(1, lineColor + "00");
      ctx.beginPath();
      ctx.moveTo(0, y(points[0]));
      points.forEach((v, i) => ctx.lineTo(i * stepX, y(v)));
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, y(points[0]));
      points.forEach((v, i) => ctx.lineTo(i * stepX, y(v)));
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w, y(points[points.length - 1]), 3, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    const ro = new ResizeObserver(redrawSparkline);
    ro.observe(canvas);
    redrawSparkline();

    const themeObserver = new MutationObserver(redrawSparkline);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      if (tickInterval) clearInterval(tickInterval);
    };
  }, []);

  // Signature tree canvas
  useEffect(() => {
    const canvas = treeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MAX_BRANCHES = 220;

    let treeW = 0;
    let treeH = 0;
    let branches = [];
    let fruit = [];
    let growStart = null;
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };
    let rafId;

    function buildTree() {
      branches = [];
      fruit = [];
      const baseX = treeW * 0.6;
      const baseY = treeH * 0.98;
      const maxDepth = treeW < 700 ? 5 : 6;
      const initLen = treeH * (treeW < 700 ? 0.16 : 0.19);

      function grow(x, y, angle, length, depth, widthPx) {
        if (depth <= 0 || length < 8 || branches.length >= MAX_BRANCHES) {
          if (fruit.length < 160 && Math.random() < 0.7)
            fruit.push({ x, y, phase: Math.random() * Math.PI * 2, r: 1.6 + Math.random() * 1.6 });
          return;
        }
        const x2 = x + Math.cos(angle) * length;
        const y2 = y + Math.sin(angle) * length;
        branches.push({ x1: x, y1: y, x2, y2, depth, width: widthPx, order: branches.length });
        const childCount = depth > maxDepth - 2 ? 2 : Math.random() < 0.3 ? 3 : 2;
        for (let i = 0; i < childCount; i++) {
          const spread = 0.34 + Math.random() * 0.28;
          const dir = i - (childCount - 1) / 2 || (Math.random() < 0.5 ? -1 : 1);
          const childAngle = angle + dir * spread + (Math.random() - 0.5) * 0.12;
          grow(x2, y2, childAngle, length * (0.66 + Math.random() * 0.1), depth - 1, widthPx * 0.68);
        }
      }
      grow(baseX, baseY, -Math.PI / 2, initLen, maxDepth, treeW < 700 ? 5.5 : 7);
    }

    function resizeTree() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      treeW = r.width;
      treeH = r.height;
      canvas.width = treeW * dpr;
      canvas.height = treeH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTree();
    }

    function drawFrame(t) {
      if (growStart === null) growStart = t;
      const isDark = effectiveTheme() === "dark";
      const branchColorA = isDark ? "#f6d77e" : "#8a5a12";
      const branchColorB = isDark ? "#4fe0ab" : "#0e8f62";
      const fruitColor = isDark ? "#f6d77e" : "#b8862e";
      const growDur = 2000;
      const progress = reduceMotion ? 1 : Math.min(1, (t - growStart) / growDur);
      const eased = 1 - Math.pow(1 - progress, 2);
      const revealCount = eased * branches.length;

      ctx.clearRect(0, 0, treeW, treeH);

      let offX = 0;
      let offY = 0;
      if (!reduceMotion) {
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.04;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.04;
        offX = mouseCurrent.x;
        offY = mouseCurrent.y;
      }
      ctx.save();
      ctx.translate(offX, offY);
      ctx.lineCap = "round";
      ctx.globalAlpha = isDark ? 0.85 : 0.7;

      const pathTrunk = new Path2D();
      const pathTwig = new Path2D();
      const pathThinTrunk = new Path2D();
      const pathThinTwig = new Path2D();
      const limit = Math.min(branches.length, Math.ceil(revealCount) + 1);
      for (let i = 0; i < limit; i++) {
        const b = branches[i];
        const localP = Math.min(1, revealCount - i);
        if (localP <= 0) break;
        const ex = b.x1 + (b.x2 - b.x1) * localP;
        const ey = b.y1 + (b.y2 - b.y1) * localP;
        const mix = 1 - b.depth / 6;
        const thick = b.width >= 3;
        const path = mix > 0.55 ? (thick ? pathTrunk : pathThinTrunk) : thick ? pathTwig : pathThinTwig;
        path.moveTo(b.x1, b.y1);
        path.lineTo(ex, ey);
      }
      ctx.strokeStyle = branchColorB;
      ctx.lineWidth = 4;
      ctx.stroke(pathTrunk);
      ctx.strokeStyle = branchColorA;
      ctx.lineWidth = 4;
      ctx.stroke(pathTwig);
      ctx.strokeStyle = branchColorB;
      ctx.lineWidth = 1.6;
      ctx.stroke(pathThinTrunk);
      ctx.strokeStyle = branchColorA;
      ctx.lineWidth = 1.6;
      ctx.stroke(pathThinTwig);
      ctx.globalAlpha = 1;

      if (progress > 0.7) {
        const fruitP = reduceMotion ? 1 : Math.min(1, (progress - 0.7) / 0.3);
        ctx.fillStyle = fruitColor;
        if (isDark) {
          ctx.shadowColor = fruitColor;
          ctx.shadowBlur = 5;
        }
        ctx.globalAlpha = (isDark ? 0.9 : 0.75) * fruitP;
        for (const f of fruit) {
          const pulse = reduceMotion ? 1 : 1 + Math.sin(t / 1500 + f.phase) * 0.3;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * pulse * fruitP, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      rafId = requestAnimationFrame(drawFrame);
    }

    const ro = new ResizeObserver(resizeTree);
    ro.observe(canvas);
    resizeTree();
    rafId = requestAnimationFrame(drawFrame);

    let onPointerMove;
    if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
      onPointerMove = (e) => {
        const r = canvas.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        mouseTarget.x = nx * 14;
        mouseTarget.y = ny * 10;
      };
      canvas.parentElement.addEventListener("pointermove", onPointerMove);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      if (onPointerMove) canvas.parentElement.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative pt-20 pb-[60px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[120px] -top-[180px] h-[520px] w-[520px] animate-[drift-a_26s_ease-in-out_infinite] rounded-full blur-[70px] motion-reduce:animate-none"
          style={{ background: "var(--gold)", opacity: "var(--glow-op)" }}
        />
        <div
          className="absolute -right-[160px] top-[60px] h-[460px] w-[460px] animate-[drift-b_32s_ease-in-out_infinite] rounded-full blur-[70px] motion-reduce:animate-none"
          style={{ background: "var(--violet)", opacity: "calc(var(--glow-op) * 0.6)" }}
        />
        <div
          className="absolute -bottom-[160px] left-[30%] h-[380px] w-[380px] animate-[drift-c_30s_ease-in-out_infinite] rounded-full blur-[70px] motion-reduce:animate-none"
          style={{ background: "var(--cyan)", opacity: "calc(var(--glow-op) * 0.45)" }}
        />
      </div>

      <canvas ref={treeCanvasRef} className="absolute inset-0 z-0 h-full w-full opacity-80" />

      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(460px circle at var(--sx,50%) var(--sy,10%), var(--spotlight), transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-[2]">
          <div
            className={`transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
            style={{ transitionDelay: "50ms" }}
          >
            <span className="eyebrow">Daily-yield investment, engineered to compound</span>
          </div>
          <h1
            className={`mt-[18px] mb-5 font-display text-[clamp(2.5rem,5vw,3.7rem)] font-medium leading-[1.06] tracking-[-0.015em] transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            Your capital,
            <br />
            <em
              className="not-italic bg-clip-text font-serif italic text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg, var(--gold-ink), var(--grove-ink))" }}
            >
              planted daily.
            </em>
          </h1>
          <p
            className={`mb-8 max-w-[46ch] text-[1.06rem] text-ink-dim transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            GoldGroveco allocates every deposit across real-estate leases, agricultural yield
            contracts, and liquid digital assets, then credits profit to your balance on the same
            schedule every day, without exception.
          </p>
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <a href="#plans" className="btn btn-primary">
              Get started
            </a>
            <a href="#calculator" className="btn btn-ghost">
              See how it compounds
            </a>
          </div>
          <div
            className={`mt-[38px] flex items-center gap-3.5 text-[0.82rem] text-ink-faint transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <span className="flex">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-[26px] w-[26px] rounded-full border-2 ${i > 0 ? "-ml-2" : ""}`}
                  style={{
                    borderColor: "var(--surface)",
                    background: "linear-gradient(135deg, var(--grove), var(--cyan))",
                  }}
                />
              ))}
            </span>
            <span>Joined by 823,000+ investors across 41 countries</span>
          </div>
        </div>

        <div
          ref={demoCardRef}
          className={`clip-card relative border p-[26px_26px_24px] transition-all duration-700 ${
            isLoaded ? "translate-y-0 scale-100 opacity-100" : "translate-y-3.5 scale-[0.98] opacity-0"
          }`}
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--line-strong)",
            backdropFilter: "blur(var(--card-blur))",
            boxShadow: "var(--shadow-soft)",
            transitionDelay: "500ms",
          }}
        >
          <div className="mb-[18px] flex items-start justify-between">
            <div className="max-w-[22ch] text-[0.82rem] text-ink-dim">
              A $10,000 deposit on the Standard plan
            </div>
            <span
              className="rounded-full border px-2 py-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-grove-ink"
              style={{ background: "rgba(34,192,138,0.12)", borderColor: "rgba(34,192,138,0.3)" }}
            >
              Live simulation
            </span>
          </div>
          <div ref={demoValueRef} className="mono mb-1 text-[2.5rem] font-medium tracking-[-0.01em] text-ink">
            $10,000.00
          </div>
          <div ref={demoDeltaRef} className="mono mb-5 text-[0.86rem] text-grove-ink">
            +$0.00 today
          </div>
          <canvas ref={sparklineRef} className="mb-4 block h-16 w-full" />
          <div
            className="mono flex items-center justify-between border-t pt-3.5 text-[0.72rem] text-ink-faint"
            style={{ borderColor: "var(--line)" }}
          >
            <span className="flex items-center">
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: "var(--grove-ink)", boxShadow: "0 0 8px var(--grove-ink)" }}
              />
              Updates daily at 00:00 UTC
            </span>
            <span ref={demoDayRef}>Day 1 / 45</span>
          </div>
        </div>
      </div>
    </section>
  );
}
