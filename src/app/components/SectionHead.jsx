export default function SectionHead({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`mb-[52px] flex flex-col items-start justify-between gap-3.5 sm:flex-row sm:items-end sm:gap-10 ${className}`}>
      <div>
        {eyebrow && <span className="eyebrow mb-3 block">{eyebrow}</span>}
        <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,3vw,2.5rem)] font-medium">{title}</h2>
      </div>
      {description && <p className="m-0 max-w-[34ch] text-[0.98rem] text-ink-dim">{description}</p>}
    </div>
  );
}
