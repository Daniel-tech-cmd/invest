import { getPendingRequests } from "../../../lib/getAdminData";
import FundingRequestsWorkspace from "./components/FundingRequestsWorkspace";

export const metadata = { title: "Funding Requests — GoldGroveco" };

export default async function FundingRequestsPage() {
  const pendingRequests = (await getPendingRequests()) || [];

  return (
    <section aria-label="Funding requests">
      <FundingRequestsWorkspace notifications={pendingRequests} />
    </section>
  );
}
