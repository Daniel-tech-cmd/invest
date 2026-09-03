import { getAllWallets } from "../../../lib/getWallets";
import WalletsGrid from "./components/WalletsGrid";

export const metadata = { title: "Wallets — GoldGroveco" };

export default async function WalletsPage() {
  const wallets = await getAllWallets();
  return (
    <section aria-label="Platform wallets">
      <WalletsGrid wallets={wallets} />
    </section>
  );
}
