import { getCurrentUser } from "../../../lib/getCurrentUser";
import { getAllWallets } from "../../../lib/getWallets";
import { getPlanCatalogForUser } from "../../../lib/customPlansData";
import { PLANS } from "../../lib/plans";
import DepositBalanceBar from "./components/DepositBalanceBar";
import DepositWorkspace from "./components/DepositWorkspace";

export const metadata = { title: "Deposit — GoldGroveco" };

export default async function DepositPage() {
  const user = await getCurrentUser();
  const [wallets, catalog] = await Promise.all([getAllWallets(), getPlanCatalogForUser(user.id, PLANS)]);

  return (
    <>
      <section aria-label="Deposit balance">
        <DepositBalanceBar user={user} />
      </section>

      <section aria-label="Make a deposit">
        <DepositWorkspace user={user} wallets={wallets} catalog={catalog} />
      </section>
    </>
  );
}
