"use client";

import Image from "next/image";
import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import ShowcaseCard from "./ShowcaseCard";

export default function RealEstate() {
  const [ref, visible] = useReveal();
  return (
    <section id="real-estate" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          title="Real estate, held for income"
          description="Residential and commercial leases chosen for occupancy and cash flow, not speculation."
        />
        <div
          className="clip-card relative mb-[18px] h-[240px] w-full overflow-hidden sm:h-[300px]"
          style={{ "--cut": "24px" }}
        >
          <Image
            src="/photos/house.webp"
            alt="A residential property held in GoldGroveco's real-estate allocation"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(0.92) contrast(1.03)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,4,0.05) 0%, rgba(10,8,4,0.35) 100%)" }} />
        </div>
        <div ref={ref} className={`section-reveal grid grid-cols-1 gap-[18px] sm:grid-cols-2 ${visible ? "is-visible" : ""}`}>
          <ShowcaseCard
            icon={
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 14L15 6L25 14" stroke="#8a5a12" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V24H22V12" stroke="#0e8f62" strokeWidth="1.3" strokeLinejoin="round" />
                <rect x="13" y="17" width="4" height="7" stroke="#8a5a12" strokeWidth="1.2" />
              </svg>
            }
            title="Residential leases"
            text="Long-term rental units in stable metro markets, selected for occupancy rate and tenant quality over headline appreciation."
            stats={[
              { value: "94%", label: "Average occupancy" },
              { value: "6–9%", label: "Target annual yield" },
            ]}
          />
          <ShowcaseCard
            icon={
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect x="6" y="7" width="18" height="17" stroke="#8a5a12" strokeWidth="1.3" />
                <path d="M6 13H24M12 7V24M18 7V24" stroke="#0e8f62" strokeWidth="1.1" />
              </svg>
            }
            title="Commercial leases"
            text="Office and retail units under multi-year leases with established tenants, prioritized for contracted, predictable income."
            stats={[
              { value: "4.2 yrs", label: "Average lease term" },
              { value: "5–8%", label: "Target annual yield" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
