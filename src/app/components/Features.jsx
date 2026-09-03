"use client";

import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";

const FEATURES = [
  {
    title: "Diversified by design",
    text: "Every deposit is spread across real-estate leases, agricultural yield contracts, and liquid digital assets, so no single market swing determines your return.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="4" y="14" width="6" height="12" stroke="#8a5a12" strokeWidth="1.3" />
        <rect x="12" y="8" width="6" height="18" stroke="#0e8f62" strokeWidth="1.3" />
        <rect x="20" y="17" width="6" height="9" stroke="#1fb3c2" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    title: "Custody you can verify",
    text: "Funds sit in audited multi-signature cold wallets. Your balance, deposit history, and payout schedule are visible from your dashboard at all times.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="6" y="13" width="18" height="12" rx="1" stroke="#8a5a12" strokeWidth="1.3" />
        <path d="M10 13V9a5 5 0 0110 0v4" stroke="#8a5a12" strokeWidth="1.3" />
        <circle cx="15" cy="19" r="1.6" fill="#0e8f62" />
      </svg>
    ),
  },
  {
    title: "Daily settlement, no lock-in surprises",
    text: "Profit posts to your balance every 24 hours. Withdraw once cleared, or reinvest with one tap and keep compounding.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="10.5" stroke="#8a5a12" strokeWidth="1.3" />
        <path d="M15 9V15L19.5 17.5" stroke="#0e8f62" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Discreet by default",
    text: "No public account activity, no unsolicited contact. Your investment stays between you and GoldGroveco.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path
          d="M5 15C5 15 9.5 8 15 8C20.5 8 25 15 25 15C25 15 20.5 22 15 22C9.5 22 5 15 5 15Z"
          stroke="#8a5a12"
          strokeWidth="1.3"
        />
        <path d="M5 5L25 25" stroke="#1fb3c2" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Features() {
  const [ref, visible] = useReveal();
  return (
    <section id="security" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          title="Why investors stay past the first payout"
          description="The fundamentals of a daily-return platform, and how GoldGroveco handles each one."
        />
        <div
          ref={ref}
          className={`section-reveal grid grid-cols-1 gap-px border sm:grid-cols-2 ${visible ? "is-visible" : ""}`}
          style={{ background: "var(--line)", borderColor: "var(--line)" }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-[34px_32px] transition-colors hover:bg-[var(--surface-raised-2)]"
              style={{ background: "var(--surface)" }}
            >
              <div className="mb-5">{f.icon}</div>
              <h3 className="mb-2.5 text-[1.15rem] font-medium">{f.title}</h3>
              <p className="m-0 text-[0.92rem] text-ink-dim">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
