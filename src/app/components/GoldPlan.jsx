"use client";

import useReveal from "../hooks/useReveal";

const PERKS = [
  "Everything in Silver",
  "Custom allocation across real estate, agriculture, and digital assets",
  "Direct line to the trading desk that manages your position",
  "Priority, same-day withdrawal processing",
];

export default function GoldPlan() {
  const [ref, visible] = useReveal();
  return (
    <section id="gold" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div
          ref={ref}
          className={`section-reveal clip-card grid grid-cols-1 items-center gap-10 border p-8 transition-colors duration-500 sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:gap-14 ${
            visible ? "is-visible" : ""
          }`}
          style={{
            "--cut": "36px",
            background: "linear-gradient(135deg, rgba(231,185,75,0.1), var(--surface-raised) 55%)",
            borderColor: "rgba(200,150,50,0.5)",
            boxShadow: "0 0 0 1px rgba(200,150,50,0.12), 0 30px 70px -30px rgba(200,150,50,0.32)",
          }}
        >
          <div>
            <span className="eyebrow mb-4 block">For serious capital</span>
            <h2 className="mb-5 max-w-[16ch] font-display text-[clamp(2rem,3.4vw,2.7rem)] font-medium">
              Gold, built for the largest positions.
            </h2>
            <p className="max-w-[52ch] text-[1.02rem] text-ink-dim">
              At $20,000 and above, GoldGroveco runs the same daily-settlement engine as every
              other plan, just with more room to work with: a custom allocation split tuned to a
              single investor&apos;s position, and a direct line to the desk that manages it.
            </p>
          </div>

          <div
            className="clip-card border p-8"
            style={{ "--cut": "22px", background: "var(--surface-raised)", borderColor: "var(--line-strong)", boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mono mb-3.5 text-[0.66rem] uppercase tracking-[0.06em] text-gold-ink">Top tier</div>
            <div className="mb-4 font-display text-[1.5rem]">Gold</div>
            <div className="mono mb-1 text-[2.6rem] leading-none text-ink">
              9.2
              <span className="text-[1rem] text-ink-faint"> % / day</span>
            </div>
            <div className="mb-6 text-[0.88rem] text-ink-dim">7-day term &middot; $20,000 minimum</div>
            <ul className="mb-8 flex list-none flex-col gap-3 p-0">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-[0.9rem] text-ink-dim">
                  <span className="mt-[7px] h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: "var(--grove-ink)" }} />
                  {perk}
                </li>
              ))}
            </ul>
            <a href="/signup" className="btn btn-primary w-full">
              Choose Gold
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
