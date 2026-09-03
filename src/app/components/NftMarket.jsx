import Image from "next/image";

const formatUSD = (val) => {
  if (val === null || val === undefined || val === 0) return "N/A";
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${Number(val).toFixed(2)}`;
};

const formatETH = (val) => {
  if (val === null || val === undefined) return "N/A";
  return `${Number(val).toFixed(3)} ETH`;
};

function PriceChange({ pct }) {
  if (pct === null || pct === undefined) {
    return <span className="text-xs text-ink-faint">&mdash;</span>;
  }
  const isPos = pct >= 0;
  return (
    <span className={`mono text-xs font-semibold ${isPos ? "text-grove-ink" : "text-down"}`}>
      {isPos ? "+" : ""}
      {Number(pct).toFixed(2)}%
    </span>
  );
}

export default function NftMarket({ collections }) {
  const totalMarketCap = collections.reduce((sum, c) => sum + (c.market_cap?.usd || 0), 0);
  const topFloor = collections.reduce((best, c) => {
    const price = c.floor_price?.usd || 0;
    const bestPrice = best?.floor_price?.usd || 0;
    return price > bestPrice ? c : best;
  }, collections[0] || null);

  return (
    <section style={{ background: "var(--surface)" }}>
      <div className="px-4 py-20 text-center" style={{ background: "linear-gradient(155deg, #0e1015 0%, #1c1408 55%, #0e1015 100%)" }}>
        <span className="eyebrow mb-4 justify-center text-gold-bright">Public market data</span>
        <h1 className="mb-4 font-display text-4xl font-medium text-[#f3efe4] md:text-5xl">NFT Market</h1>
        <p className="mx-auto max-w-2xl text-lg text-[#a39d8d]">
          Browse top NFT collections with live floor prices and trading volume. Data refreshes every hour.
        </p>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="clip-card border p-6 text-center" style={{ "--cut": "16px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}>
            <p className="mb-1 text-sm text-ink-dim">Collections tracked</p>
            <p className="mono text-3xl text-gold-ink">{collections.length}</p>
          </div>
          <div className="clip-card border p-6 text-center" style={{ "--cut": "16px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}>
            <p className="mb-1 text-sm text-ink-dim">Combined market cap</p>
            <p className="mono text-3xl text-gold-ink">{formatUSD(totalMarketCap)}</p>
          </div>
          <div className="clip-card border p-6 text-center" style={{ "--cut": "16px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}>
            <p className="mb-1 text-sm text-ink-dim">Highest floor price</p>
            <p className="mono text-3xl text-gold-ink">{topFloor ? formatETH(topFloor.floor_price?.native_currency) : "N/A"}</p>
            {topFloor && <p className="mt-1 text-xs text-ink-faint">{topFloor.name}</p>}
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="mb-2 text-xl font-semibold text-ink">Market data unavailable</h2>
            <p className="text-ink-dim">We could not load NFT collection data right now. Please check back later.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-xl font-semibold text-ink">Top collections</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections.map((col, i) => (
                <div
                  key={col.id || i}
                  className="clip-card overflow-hidden border transition-transform hover:-translate-y-1"
                  style={{ "--cut": "16px", background: "var(--surface-raised)", borderColor: "var(--line-strong)" }}
                >
                  <div className="relative h-44 w-full" style={{ background: "var(--surface-raised-2)" }}>
                    {col.image?.small ? (
                      <Image src={col.image.small} alt={col.name || "NFT collection"} fill sizes="280px" className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-faint">No image</div>
                    )}
                    <span className="mono absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">#{i + 1}</span>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-3 truncate text-base font-semibold text-gold-ink">{col.name || "Unknown collection"}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-dim">Floor price</span>
                        <span className="mono font-semibold text-ink">{formatETH(col.floor_price?.native_currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink-dim">Floor (USD)</span>
                        <div className="flex items-center gap-1.5">
                          <span className="mono font-semibold text-ink">{formatUSD(col.floor_price?.usd)}</span>
                          <PriceChange pct={col.floor_price_in_usd_24h_percentage_change} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink-dim">24h volume</span>
                        <span className="mono font-semibold text-ink">{formatUSD(col.volume_24h?.usd)}</span>
                      </div>
                      {col.total_supply != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-ink-dim">Supply</span>
                          <span className="mono font-semibold text-ink">{Number(col.total_supply).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.coingecko.com/en/nft/${col.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm mt-4 block w-full text-center"
                    >
                      View details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
