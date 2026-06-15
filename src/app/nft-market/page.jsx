import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NftMarket from "../components/NftMarket";

const POPULAR_NFTS = [
  "bored-ape-yacht-club",
  "cryptopunks",
  "mutant-ape-yacht-club",
  "azuki",
  "pudgy-penguins",
  "doodles-official",
  "milady-maker",
  "moonbirds",
  "clone-x",
  "world-of-women-nft",
  "otherdeed-for-otherside",
  "art-blocks",
];

const fetchCollections = async () => {
  try {
    const results = await Promise.allSettled(
      POPULAR_NFTS.map((id) =>
        fetch(`https://api.coingecko.com/api/v3/nfts/${id}`, {
          next: { revalidate: 3600 },
        }).then((r) => {
          if (!r.ok) throw new Error(`Failed: ${id}`);
          return r.json();
        })
      )
    );
    return results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  } catch {
    return [];
  }
};

const page = async () => {
  const collections = await fetchCollections();
  return (
    <>
      <Navbar />
      <NftMarket collections={collections} />
      <Footer />
    </>
  );
};

export default page;
