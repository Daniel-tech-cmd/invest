const formatUSD = (val) => {
  if (val === null || val === undefined || val === 0) return "N/A";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${Number(val).toFixed(2)}`;
};

const formatETH = (val) => {
  if (val === null || val === undefined) return "N/A";
  return `${Number(val).toFixed(3)} ETH`;
};

const VolumeChange = ({ change }) => {
  if (change === null || change === undefined) {
    return <span className="text-gray-400 text-xs">—</span>;
  }
  const pct = (change * 100).toFixed(1);
  const isPos = change >= 0;
  return (
    <span className={`text-xs font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}>
      {isPos ? "+" : ""}
      {pct}%
    </span>
  );
};

const NftMarket = ({ collections }) => {
  const totalVolume = collections.reduce(
    (sum, c) => sum + (c.volume?.allTime || 0),
    0
  );

  const topFloor = collections.reduce((best, c) => {
    const price = c.floorAsk?.price?.amount?.usd || 0;
    const bestPrice = best?.floorAsk?.price?.amount?.usd || 0;
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
          Browse top NFT collections by all-time trading volume. Data refreshes
          every hour.
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
            <p className="text-gray-500 text-sm mb-1">
              Combined All-Time Volume
            </p>
            <p className="text-3xl font-bold text-green-700">
              {formatUSD(totalVolume)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Highest Floor Price</p>
            <p className="text-3xl font-bold text-green-700">
              {topFloor
                ? formatETH(topFloor.floorAsk?.price?.amount?.native)
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
              We could not load NFT collection data right now. Please check back
              later.
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
                    {col.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={col.image}
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
                          {formatETH(col.floorAsk?.price?.amount?.native)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Floor (USD)</span>
                        <span className="font-semibold text-gray-800">
                          {formatUSD(col.floorAsk?.price?.amount?.usd)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">24h Volume</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-800">
                            {formatUSD(col.volume?.["1day"])}
                          </span>
                          <VolumeChange change={col.volumeChange?.["1day"]} />
                        </div>
                      </div>
                      {col.tokenCount && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Supply</span>
                          <span className="font-semibold text-gray-800">
                            {Number(col.tokenCount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {col.slug && (
                      <a
                        href={`https://opensea.io/collection/${col.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block w-full text-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition duration-200"
                      >
                        View on OpenSea
                      </a>
                    )}
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
