"use client";

import { useState } from "react";
import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";

const QUESTIONS = [
  {
    q: "What's the minimum deposit?",
    a: "$100 on Basic. Standard, Advanced, Silver, and Gold carry higher minimums in exchange for a higher daily rate: see the exact figures in the plan cards above or the calculator.",
  },
  {
    q: "How fast can I withdraw?",
    a: "Profit posts to your balance every day. Once you request a withdrawal, Basic clears within 5 days and Standard within 7, covering both your profit and your original deposit. Advanced gets same-day processing, and Silver and Gold get same-day priority processing with a dedicated account contact.",
  },
  {
    q: "Is my capital guaranteed?",
    a: "No. GoldGroveco allocates deposits into real-estate, agricultural, and digital-asset positions, and those markets move. Daily settlement means you see results early and can withdraw once cleared, but this is investing, not a savings account.",
  },
  {
    q: "How does the referral bonus work?",
    a: "Share your referral link. When someone you referred makes a deposit or reinvestment, you receive a 10% bonus credited to your balance.",
  },
  {
    q: "What happens when my term ends?",
    a: "The plan completes automatically. Your principal and accrued profit sit in your balance, ready to withdraw or reinvest into any plan, including a different one than you started with.",
  },
  {
    q: "Which assets actually back my deposit?",
    a: "A mix of income-producing real-estate leases, agricultural yield contracts, and liquid digital assets, rebalanced daily. The exact split depends on your plan and current market conditions.",
  },
];

export default function FAQ() {
  const [ref, visible] = useReveal();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead title="Questions worth asking before you deposit" description="The direct answers, not the marketing ones." />
        <div ref={ref} className={`section-reveal flex flex-col border-t ${visible ? "is-visible" : ""}`} style={{ borderColor: "var(--line)" }}>
          {QUESTIONS.map((item, i) => {
            const open = openIdx === i;
            return (
              <div key={item.q} className="border-b" style={{ borderColor: "var(--line)" }}>
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between gap-5 p-[22px_2px] text-left font-body text-[1rem] font-medium text-ink"
                >
                  <span>{item.q}</span>
                  <span className={`faq-icon relative h-4 w-4 flex-shrink-0 ${open ? "is-open" : ""}`} aria-hidden="true" />
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-300"
                  style={{ maxHeight: open ? "260px" : "0px" }}
                >
                  <p className="m-0 mb-[22px] max-w-[60ch] p-[0_2px] text-[0.92rem] text-ink-dim">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
