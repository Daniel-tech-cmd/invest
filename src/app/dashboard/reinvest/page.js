import { getCurrentUser } from "../../../lib/getCurrentUser";
import { getPlanCatalogForUser } from "../../../lib/customPlansData";
import { PLANS } from "../../lib/plans";
import ReinvestBalanceBar from "./components/ReinvestBalanceBar";
import ReinvestWorkspace from "./components/ReinvestWorkspace";

export const metadata = { title: "Reinvest — GoldGroveco" };

export default async function ReinvestPage() {
  const user = await getCurrentUser();
  const catalog = await getPlanCatalogForUser(user.id, PLANS);

  return (
    <>
      <section aria-label="Reinvest balance">
        <ReinvestBalanceBar user={user} />
      </section>

      <section aria-label="Reinvest funds">
        <ReinvestWorkspace user={user} catalog={catalog} />
      </section>
    </>
  );
}
