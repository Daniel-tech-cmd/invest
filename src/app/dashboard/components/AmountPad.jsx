"use client";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

const fmt = (n) => `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function AmountPad({ amount, onChange, min, max, quickAdd = [100, 500, 1000, 5000], label = "Amount" }) {
  const handleKey = (key) => {
    if (key === "back") {
      onChange(amount.slice(0, -1));
      return;
    }
    if (key === "." && amount.includes(".")) return;
    if (amount.replace(".", "").length >= 9) return;
    onChange(amount + key);
  };

  const numeric = parseFloat(amount) || 0;
  const belowMin = min && numeric > 0 && numeric < min;
  const aboveMax = max != null && numeric > max;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-ink-faint">{label}</p>
        <p className="mono text-4xl font-semibold leading-none text-ink">{fmt(numeric)}</p>
        {belowMin && (
          <p className="mt-2 text-[11px] font-medium" style={{ color: "var(--down)" }}>
            Below the ${min.toLocaleString()} minimum for this plan
          </p>
        )}
        {aboveMax && (
          <p className="mt-2 text-[11px] font-medium" style={{ color: "var(--down)" }}>
            Exceeds available balance of ${max.toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAdd.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(numeric + n))}
            className="rounded-lg border py-2 text-[11px] font-medium text-ink-dim transition-colors hover:text-gold-ink"
            style={{ borderColor: "var(--line)", background: "var(--surface-raised-2)" }}
          >
            +${n.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="mono rounded-xl border py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-gold"
            style={{ borderColor: "var(--line)", background: "var(--surface-raised-2)" }}
          >
            {key === "back" ? (
              <svg className="mx-auto h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            ) : (
              key
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("")}
          className="col-span-3 rounded-xl border py-2.5 text-[11px] font-medium text-ink-faint transition-colors hover:text-ink"
          style={{ borderColor: "var(--line)" }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
