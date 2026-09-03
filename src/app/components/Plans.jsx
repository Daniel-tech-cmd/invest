"use client";

import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";

const PLANS = [
  {
    tag: "Entry tier",
    name: "Basic",
    rate: "4.6",
    meta: "5-day term · $100 minimum",
    perks: ["Daily payout to balance", "Withdraw or reinvest anytime after day 1", "Standard support queue"],
    featured: false,
  },
  {
    tag: "Most used",
    name: "Standard",
    rate: "6.8",
    meta: "7-day term · $500 minimum",
    perks: ["Everything in Basic", "One-tap reinvest with bonus allocation", "Priority withdrawal queue"],
    featured: false,
  },
  {
    tag: "Longer term",
    name: "Advanced",
    rate: "7.7",
    meta: "7-day term · $5,000 minimum",
    perks: ["Everything in Standard", "Referral bonus rate increased", "Same-day withdrawal processing"],
    featured: false,
  },
  {
    tag: "Highest daily return",
    name: "Silver",
    rate: "8.4",
    meta: "7-day term · $10,000 minimum",
    perks: ["Everything in Advanced", "Dedicated account contact", "Early access to new allocation types"],
    featured: true,
  },
];

export default function Plans() {
  const [ref, visible] = useReveal();
  return (
    <section id="plans" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          title="Plans built around how long your money works"
          description="The engine underneath every plan is identical. What changes is term length, minimum, and the rate that compounds."
        />
        <div
          ref={ref}
          className={`section-reveal grid grid-cols-1 gap-[18px] min-[560px]:grid-cols-2 min-[900px]:grid-cols-4 ${
            visible ? "is-visible" : ""
          }`}
        >
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="clip-card flex flex-col border p-[26px_22px] transition-transform hover:-translate-y-1"
              style={{
                "--cut": "18px",
                background: p.featured ? "linear-gradient(180deg, rgba(231,185,75,0.12), var(--surface-raised-2))" : "var(--surface-raised)",
                borderColor: p.featured ? "rgba(200,150,50,0.5)" : "var(--line-strong)",
                boxShadow: p.featured ? "0 0 0 1px rgba(200,150,50,0.12), 0 20px 50px -20px rgba(200,150,50,0.28)" : undefined,
              }}
            >
              <div className="mono mb-3.5 min-h-[1em] text-[0.66rem] uppercase tracking-[0.06em] text-gold-ink">{p.tag}</div>
              <div className="mb-4 font-display text-[1.3rem]">{p.name}</div>
              <div className="mono mb-0.5 text-[2.1rem] leading-none text-ink">
                {p.rate}
                <span className="text-[0.9rem] text-ink-faint"> % / day</span>
              </div>
              <div className="mb-5 text-[0.82rem] text-ink-dim">{p.meta}</div>
              <ul className="mb-[26px] flex flex-grow list-none flex-col gap-2.5 p-0">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-[0.84rem] text-ink-dim">
                    <span className="mt-[7px] h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: "var(--grove-ink)" }} />
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className={`btn btn-sm w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}
              >
                Choose {p.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
