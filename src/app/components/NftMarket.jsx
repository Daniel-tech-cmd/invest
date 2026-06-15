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

const PriceChange = ({ pct }) => {
  if (pct === null || pct === undefined) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  const isPos = pct >= 0;
  return (
    <span
      className={`text-xs font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}
    >
      {isPos ? "+" : ""}
      {Number(pct).toFixed(2)}%
    </span>
  );
};

const NftMarket = ({ collections }) => {
  const totalMarketCap = collections.reduce(
    (sum, c) => sum + (c.market_cap?.usd || 0),
    0
  );

  const topFloor = collections.reduce((best, c) => {
    const price = c.floor_price?.usd || 0;
    const bestPrice = best?.floor_price?.usd || 0;
    return price > bestPrice ? c : best;
  }, collections[0] || null);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          NFT Market
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Browse top NFT collections with live floor prices and trading volume.
          Data refreshes every hour.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Collections Tracked</p>
            <p className="text-3xl font-bold text-green-700">
              {collections.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Combined Market Cap</p>
            <p className="text-3xl font-bold text-green-700">
              {formatUSD(totalMarketCap)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Highest Floor Price</p>
            <p className="text-3xl font-bold text-green-700">
              {topFloor
                ? formatETH(topFloor.floor_price?.native_currency)
                : "N/A"}
            </p>
            {topFloor && (
              <p className="text-xs text-gray-400 mt-1">{topFloor.name}</p>
            )}
          </div>
        </div>

        {/* Collection grid */}
        {collections.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Market Data Unavailable
            </h2>
            <p className="text-gray-500">
              We could not load NFT collection data right now. Please check
              back later.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Top Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((col, i) => (
                <div
                  key={col.id || i}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full h-44 bg-gray-100">
                    {col.image?.small ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={col.image.small}
                        alt={col.name || "NFT Collection"}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
                        <span className="text-gray-300 text-5xl">🖼</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      #{i + 1}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-green-700 mb-3 truncate">
                      {col.name || "Unknown Collection"}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Floor Price</span>
                        <span className="font-semibold text-gray-800">
                          {formatETH(col.floor_price?.native_currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Floor (USD)</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-800">
                            {formatUSD(col.floor_price?.usd)}
                          </span>
                          <PriceChange
                            pct={col.floor_price_in_usd_24h_percentage_change}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">24h Volume</span>
                        <span className="font-semibold text-gray-800">
                          {formatUSD(col.volume_24h?.usd)}
                        </span>
                      </div>
                      {col.total_supply != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Supply</span>
                          <span className="font-semibold text-gray-800">
                            {Number(col.total_supply).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.coingecko.com/en/nft/${col.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block w-full text-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition duration-200"
                    >
                      View Details
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
};

export default NftMarket;
