import { getCurrentUser } from "../../../lib/getCurrentUser";
import WithdrawBalanceBar from "./components/WithdrawBalanceBar";
import WithdrawWorkspace from "./components/WithdrawWorkspace";

export const metadata = { title: "Withdraw — GoldGroveco" };

export default async function WithdrawPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section aria-label="Withdraw balance">
        <WithdrawBalanceBar user={user} />
      </section>

      <section aria-label="Ask for a withdrawal">
        <WithdrawWorkspace user={user} />
      </section>
    </>
  );
}
