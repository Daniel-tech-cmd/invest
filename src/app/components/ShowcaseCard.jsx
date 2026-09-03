import Image from "next/image";

export default function ShowcaseCard({ icon, image, title, text, stats }) {
  return (
    <div
      className="clip-card overflow-hidden border transition-transform hover:-translate-y-1"
      style={{ "--cut": "18px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}
    >
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            style={{ filter: "saturate(0.92) contrast(1.03)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(20,15,5,0.05) 0%, var(--surface-raised) 100%)" }}
          />
        </div>
      )}
      <div className="p-[28px_26px]">
        {icon && <div className="mb-[18px]">{icon}</div>}
        <h3 className="mb-2.5 text-[1.1rem] font-medium">{title}</h3>
        <p className="m-0 text-[0.9rem] text-ink-dim">{text}</p>
        {stats && (
          <div className="mt-5 flex gap-6 border-t pt-4" style={{ borderColor: "var(--line)" }}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="mono text-[1.15rem] text-gold-ink">{s.value}</span>
                <span className="text-[0.74rem] text-ink-faint">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
