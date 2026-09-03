import { redirect } from "next/navigation";
import { getAllUsersSummary, getPendingRequests } from "../../lib/getAdminData";
import AdminStats from "./components/AdminStats";
import PendingRequestsPreview from "./components/PendingRequestsPreview";
import UsersGrid from "./components/UsersGrid";

export const metadata = { title: "Admin — GoldGroveco" };

export default async function AdminPage() {
  const [users, pendingRequests] = await Promise.all([getAllUsersSummary(), getPendingRequests()]);

  // Middleware already keeps non-admins out — null here means the session
  // somehow isn't an admin's despite reaching this far (defense in depth).
  if (!users || !pendingRequests) redirect("/login");

  return (
    <>
      <section aria-label="Platform stats">
        <AdminStats users={users} pendingRequests={pendingRequests} />
      </section>

      <section aria-label="Pending requests">
        <PendingRequestsPreview notifications={pendingRequests} />
      </section>

      <section aria-label="All users">
        <UsersGrid users={users} />
      </section>
    </>
  );
}
