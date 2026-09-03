"use client";

import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import ShowcaseCard from "./ShowcaseCard";

export default function Agriculture() {
  const [ref, visible] = useReveal();
  return (
    <section id="agriculture" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead
          title="Agricultural yield contracts"
          description="Two of the crop categories currently held across GoldGroveco portfolios."
        />
        <div ref={ref} className={`section-reveal grid grid-cols-1 gap-[18px] sm:grid-cols-2 ${visible ? "is-visible" : ""}`}>
          <ShowcaseCard
            image={{ src: "/photos/weat.jpg", alt: "Wheat held under a GoldGroveco agricultural yield contract" }}
            title="Wheat contracts"
            text="Positions in cultivation, processing, and distribution, offering the benefits of both agricultural yield and market pricing."
            stats={[
              { value: "3", label: "Growing regions" },
              { value: "Annual", label: "Settlement cycle" },
            ]}
          />
          <ShowcaseCard
            image={{ src: "/photos/corn.jpg", alt: "Corn held under a GoldGroveco agricultural yield contract" }}
            title="Corn contracts"
            text="Cultivation and production positions paired with modern farming technology, aimed at improving both yield and sustainability."
            stats={[
              { value: "2", label: "Growing regions" },
              { value: "Annual", label: "Settlement cycle" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
