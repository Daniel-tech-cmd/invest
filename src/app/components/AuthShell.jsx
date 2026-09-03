"use client";

import { useEffect, useState } from "react";

function BrandMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="" width={30} height={30} />;
}

/**
 * Auth pages are a deliberate, always-dark moment regardless of the site-wide
 * light/dark toggle (matching product convention for onboarding flows) — this
 * temporarily forces data-theme="dark" on <html> while mounted, and restores
 * whatever it was on unmount so the rest of the site is unaffected.
 */
function useForcedDarkTheme() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "dark");
    return () => {
      if (prev) html.setAttribute("data-theme", prev);
      else html.removeAttribute("data-theme");
    };
  }, []);
}

export default function AuthShell({ eyebrow, heading, subtext, children, maxWidth = "760px" }) {
  useForcedDarkTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setLoaded(true), 40));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16" style={{ background: "var(--surface)" }}>
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-[460px] w-[460px] rounded-full blur-[100px]"
        style={{ background: "var(--gold)", opacity: 0.16 }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-[460px] w-[460px] rounded-full blur-[110px]"
        style={{ background: "var(--grove)", opacity: 0.12 }}
      />

      <div
        className={`relative w-full overflow-hidden rounded-[28px] border p-8 transition-all duration-700 sm:p-12 ${
          loaded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{
          maxWidth,
          borderColor: "var(--line-strong)",
          background: "var(--surface-raised)",
          boxShadow: "var(--shadow-soft)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      >
        <div className="relative mb-7 flex items-center gap-2">
          <BrandMark />
          <span className="font-body text-[0.9rem] font-semibold tracking-tight text-ink">GoldGroveco</span>
        </div>

        <span className="mono relative mb-2.5 block text-[0.66rem] font-medium uppercase tracking-[0.14em] text-gold-bright">{eyebrow}</span>
        <h1 className="relative font-body text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold uppercase leading-[1.15] tracking-tight text-ink">{heading}</h1>
        <div className="relative mb-5 mt-3 flex items-center gap-2">
          <span className="h-[2px] w-12 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="h-[2px] w-8 rounded-full" style={{ background: "var(--gold)", opacity: 0.4 }} />
        </div>
        {subtext && <p className="relative mb-8 max-w-[46ch] text-[0.88rem] leading-relaxed text-ink-dim">{subtext}</p>}

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
