const ITEMS = [
  { b: "Amara O.", text: "withdrew", g: "$3,240.00", time: "2m ago" },
  { b: "David K.", text: "reinvested", g: "$12,000.00", time: "6m ago" },
  { b: "Priya S.", text: "joined the Silver plan", time: "11m ago" },
  { b: "Tunde A.", text: "withdrew", g: "$860.50", time: "14m ago" },
  { b: "Elena R.", text: "referred a new investor", time: "19m ago" },
  { b: "Marcus T.", text: "withdrew", g: "$2,140.00", time: "23m ago" },
  { b: "Wei C.", text: "reinvested", g: "$5,400.00", time: "27m ago" },
];

function Pill({ item }) {
  return (
    <span
      className="mono flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.78rem] text-ink-dim"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <b className="font-medium text-ink">{item.b}</b> {item.text}
      {item.g && <span className="text-grove-ink"> {item.g}</span>} &middot; {item.time}
    </span>
  );
}

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: "var(--line)" }}>
      <div className="marquee-track flex w-max gap-3.5">
        {doubled.map((item, i) => (
          <Pill item={item} key={i} />
        ))}
      </div>
    </div>
  );
}
