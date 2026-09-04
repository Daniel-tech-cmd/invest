import { getAllUsersSummary } from "../../../lib/getAdminData";
import BroadcastForm from "./components/BroadcastForm";

export const metadata = { title: "Broadcast Email — GoldGroveco" };

export default async function BroadcastPage() {
  const users = (await getAllUsersSummary()) || [];

  return (
    <section aria-label="Broadcast email">
      <BroadcastForm users={users} />
    </section>
  );
}
