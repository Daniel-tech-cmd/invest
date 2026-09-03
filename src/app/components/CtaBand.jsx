"use client";

import useReveal from "../hooks/useReveal";

export default function CtaBand({ title, buttonLabel, buttonHref = "#", variant = "primary" }) {
  const [ref, visible] = useReveal();
  return (
    <section className="py-[100px] first:pt-0">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div
          ref={ref}
          className={`section-reveal clip-card flex flex-col items-start gap-7 border p-9 transition-colors duration-500 sm:flex-row sm:items-center sm:justify-between sm:p-12 ${
            visible ? "is-visible" : ""
          }`}
          style={{ "--cut": "34px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}
        >
          <h2 className="max-w-[14ch] font-display text-[clamp(1.7rem,3vw,2.2rem)] font-medium">{title}</h2>
          <a href={buttonHref} className={`btn ${variant === "primary" ? "btn-primary" : "btn-ghost"}`} target={variant === "ghost" ? "_blank" : undefined} rel={variant === "ghost" ? "noopener" : undefined}>
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
