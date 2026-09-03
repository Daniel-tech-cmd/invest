"use client";

import { useEffect, useRef } from "react";
import useReveal from "../hooks/useReveal";
import { effectiveTheme } from "../lib/theme";

export default function Landscape() {
  const [ref, visible] = useReveal();
  const sectionRef = useRef(null);
  const particlesRef = useRef(null);
  const depthRefs = useRef([]);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles = [];
    let rafId;

    function buildParticles() {
      const count = canvas.clientWidth < 700 ? 22 : 36;
      particles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: 0.45 + Math.random() * 0.5,
        r: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) buildParticles();
    }

    function draw(t) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w && h) {
        ctx.clearRect(0, 0, w, h);
        const isDark = effectiveTheme() === "dark";
        const col = isDark ? "246,215,126" : "138,90,18";
        particles.forEach((p) => {
          const tw = reduceMotion ? 0.7 : 0.4 + Math.sin((t / 900) * p.speed + p.phase) * 0.35 + 0.35;
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col},${tw * 0.8})`;
          ctx.fill();
        });
      }
      rafId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafId = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let ticking = false;

    function updateParallax() {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const centered = (progress - 0.5) * 2;
      depthRefs.current.forEach((el) => {
        if (!el) return;
        const depth = parseFloat(el.dataset.depth);
        el.style.transform = `translateY(${centered * depth * 100}px)`;
      });
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setDepthRef = (i) => (el) => {
    depthRefs.current[i] = el;
  };

  return (
    <section id="landscape-section">
      <div
        ref={(el) => {
          ref.current = el;
          sectionRef.current = el;
        }}
        className={`section-reveal relative mx-5 h-[520px] overflow-hidden sm:mx-8 sm:h-[460px] ${
          visible ? "is-visible" : ""
        }`}
        style={{
          clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)",
        }}
      >
        <div className="absolute inset-0" style={{ background: "var(--sky-gradient)" }} />
        <canvas ref={particlesRef} className="absolute inset-0 h-full w-full" />
        <div
          ref={setDepthRef(0)}
          data-depth="0.06"
          className="landscape-hill"
          style={{ left: "-15%", width: "130%", height: "170px", bottom: "-30px", background: "var(--hill-1)", opacity: 0.55 }}
        />
        <div
          ref={setDepthRef(1)}
          data-depth="0.11"
          className="landscape-hill"
          style={{ left: "-5%", width: "118%", height: "210px", bottom: "-55px", background: "var(--hill-2)", opacity: 0.8 }}
        />
        <div
          ref={setDepthRef(2)}
          data-depth="0.18"
          className="landscape-hill"
          style={{
            left: "-20%",
            width: "145%",
            height: "250px",
            bottom: "-90px",
            background: "var(--hill-3)",
            boxShadow: "0 -1px 0 rgba(231,185,75,0.2), 0 -20px 50px -20px rgba(231,185,75,0.18)",
          }}
        />
        <div
          ref={setDepthRef(3)}
          data-depth="-0.03"
          className="absolute bottom-0 left-0 z-[3] max-w-[480px] p-8 sm:p-[44px_44px_40px]"
        >
          <span className="eyebrow text-gold-ink mb-3.5 block">Where the returns come from</span>
          <h2 className="mb-3 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium text-ink">
            Real assets, digital speed.
          </h2>
          <p className="max-w-[38ch] text-[0.96rem] text-ink-dim">
            Income-producing real estate, agricultural yield contracts, and liquid digital assets,
            rebalanced daily and settled to your balance on the same schedule every time.
          </p>
        </div>
      </div>
    </section>
  );
}
