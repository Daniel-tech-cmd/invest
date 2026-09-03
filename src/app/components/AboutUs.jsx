import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="pb-[100px]" style={{ background: "var(--surface)" }}>
      <div className="relative flex h-64 items-center justify-center overflow-hidden">
        <Image src="/photos/about.jpg" alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "rgba(10,8,4,0.55)" }} />
        <h1 className="relative z-10 font-display text-4xl font-medium text-white">About Us</h1>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1180px] grid-cols-1 gap-10 px-5 sm:px-8 md:grid-cols-2">
        <div>
          <p className="mb-4 text-[1.02rem] leading-relaxed text-ink-dim">
            At our agricultural investment platform, we believe in empowering individuals and
            institutions to contribute to the future of sustainable farming. Our platform provides
            a direct link between investors and thriving agricultural projects, ensuring that
            capital flows where it&apos;s needed the most.
          </p>
          <p className="mb-4 text-[1.02rem] leading-relaxed text-ink-dim">
            We focus on innovation, sustainability, and ethical farming practices. By connecting
            investors with projects ranging from organic farms to high-tech agribusiness ventures,
            we aim to drive growth in agriculture while delivering strong returns for our
            investors.
          </p>
          <p className="text-[1.02rem] leading-relaxed text-ink-dim">
            Our vision is to create a world where agriculture thrives through responsible
            investments, paving the way for global food security and environmental sustainability.
          </p>
        </div>
        <div className="clip-card relative aspect-[4/3] overflow-hidden" style={{ "--cut": "22px" }}>
          <Image src="/photos/image-6.jpg" alt="Managing a GoldGroveco investment" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
