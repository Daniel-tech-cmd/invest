"use client";

import useReveal from "../hooks/useReveal";
import SectionHead from "./SectionHead";
import ShowcaseCard from "./ShowcaseCard";

const PRODUCTS = [
  {
    title: "Stocks",
    text: "Fair, seamless stock investment options with transactions that settle without friction.",
    image: { src: "/photos/stock.jpg", alt: "Stock market ticker display" },
  },
  {
    title: "Options",
    text: "Go bullish on the positions you believe in and bearish on the ones you don't. The choice stays yours.",
    image: { src: "/photos/option.jpg", alt: "Options trading chart" },
  },
  {
    title: "Livestock farming",
    text: "A rewarding, stable route to long-term gains through diversified farming ventures.",
    image: { src: "/photos/livestock.jpg", alt: "Livestock held under a GoldGroveco farming position" },
  },
  {
    title: "Crop investments",
    text: "High-demand crop positions backed by expert analysis, built to help a portfolio flourish.",
    image: { src: "/photos/crop.jpg", alt: "Crop field held under a GoldGroveco investment" },
  },
];

export default function Products() {
  const [ref, visible] = useReveal();
  return (
    <section id="products" className="py-[100px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead title="Our products" description="Explore diverse investment options across GoldGroveco." />
        <div
          ref={ref}
          className={`section-reveal grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[900px]:grid-cols-4 ${
            visible ? "is-visible" : ""
          }`}
        >
          {PRODUCTS.map((p) => (
            <ShowcaseCard key={p.title} image={p.image} title={p.title} text={p.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
