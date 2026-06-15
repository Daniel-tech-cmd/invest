import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NftMarket from "../components/NftMarket";

const fetchCollections = async () => {
  try {
    const res = await fetch(
      "https://api.reservoir.tools/collections/v7?limit=20&sortBy=allTimeVolume",
      {
        headers: { "x-api-key": "demo-api-key" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.collections || [];
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
