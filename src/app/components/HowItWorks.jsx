"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";

const STEPS = [
  {
    title: "Deposit",
    text: "Fund your account by crypto. Deposits are confirmed and allocated within 24 hours.",
  },
  {
    title: "Allocate",
    text: "Your deposit is split across real-estate leases, agricultural yield contracts, and digital assets, based on your plan.",
  },
  {
    title: "Compound daily",
    text: "Profit posts to your balance every day at 00:00 UTC. It shows up in your dashboard; you never have to ask.",
  },
  {
    title: "Withdraw or reinvest",
    text: "Once your term completes, cash out to your wallet or reinvest with one tap and keep compounding.",
  },
];

export default function HowItWorks() {
  const [ref, visible] = useReveal();
  const stepsRef = useRef(null);
  const stepRefs = useRef([]);
  const [reached, setReached] = useState([false, false, false, false]);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = stepRefs.current.indexOf(e.target);
          if (e.isIntersecting && idx !== -1) {
            setReached((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFillPct(100);
      return;
    }
    let ticking = false;
    function update() {
      ticking = false;
      const section = stepsRef.current;
      if (!section) return;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / r.height));
      setFillPct(progress * 100);
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="how-it-works" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          title="From deposit to payout"
          description="The same four steps behind every plan, every time, in the order they actually happen."
        />
        <div
          ref={(el) => {
            ref.current = el;
            stepsRef.current = el;
          }}
          className={`section-reveal relative ${visible ? "is-visible" : ""}`}
        >
          <div className="relative mb-[46px] hidden h-0.5 overflow-hidden rounded sm:block" style={{ background: "var(--line)" }}>
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: `${fillPct}%`, background: "linear-gradient(90deg, var(--gold), var(--grove))" }}
            />
          </div>
          <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => (stepRefs.current[i] = el)}
              >
                <div
                  className="mono mb-[18px] flex h-[34px] w-[34px] items-center justify-center rounded-full border text-[0.84rem] transition-colors duration-300"
                  style={
                    reached[i]
                      ? { borderColor: "var(--gold-ink)", color: "var(--gold-ink)", background: "rgba(231,185,75,0.12)" }
                      : { borderColor: "var(--line-strong)", color: "var(--ink-faint)" }
                  }
                >
                  {i + 1}
                </div>
                <h3 className="mb-2 text-[1.05rem] font-medium">{step.title}</h3>
                <p className="m-0 text-[0.88rem] text-ink-dim">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
