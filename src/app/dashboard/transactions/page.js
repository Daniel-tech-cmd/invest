import { getCurrentUser } from "../../../lib/getCurrentUser";
import TransactionsBar from "./components/TransactionsBar";
import TransactionsTable from "./components/TransactionsTable";

export const metadata = { title: "Transactions — GoldGroveco" };

export default async function TransactionsPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section aria-label="Transactions summary">
        <TransactionsBar user={user} />
      </section>

      <section aria-label="Transaction history">
        <TransactionsTable user={user} />
      </section>
    </>
  );
}
