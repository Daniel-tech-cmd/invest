function BrandMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="" width={30} height={30} />;
}

const COLUMNS = [
  { title: "Product", links: [["Plans", "#plans"], ["Security", "#security"], ["Referrals", "#"]] },
  { title: "Company", links: [["About", "#"], ["FAQ", "#faq"], ["Contact", "#"]] },
  { title: "Legal", links: [["Terms", "#"], ["Privacy", "#"], ["Risk disclosure", "#"]] },
];

export default function Footer() {
  return (
    <footer className="pb-10 pt-[70px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-body text-[1.05rem] font-bold tracking-tight text-ink">GoldGroveco</span>
            </div>
            <p className="mt-3.5 max-w-[32ch] text-[0.9rem] text-ink-dim">
              Daily-settlement investment across real estate, agriculture, and digital assets.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-ink-faint">{col.title}</h4>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-[0.9rem] text-ink-dim transition-colors hover:text-ink">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start gap-5 border-t pt-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--line)" }}>
          <p className="m-0 max-w-[60ch] text-[0.76rem] text-ink-faint">
            GoldGroveco is a simulated returns platform built for demonstration purposes. Investing
            involves risk, and past performance does not guarantee future results.
          </p>
          <p className="m-0 text-[0.76rem] text-ink-faint">&copy; 2026 GoldGroveco</p>
        </div>
      </div>
    </footer>
  );
}
