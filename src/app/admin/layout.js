import { redirect } from "next/navigation";
import DashboardShell from "../dashboard/components/DashboardShell";
import { getCurrentUser } from "../../lib/getCurrentUser";
import { getUnreadNotificationCount } from "../../lib/getNotifications";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  // Middleware already keeps non-admins out of /admin — this is just
  // defense in depth for the rare case a session outlives its account.
  if (!user || (user.role !== "admin" && user.role !== "master admin")) redirect("/login");

  const initialUnreadCount = await getUnreadNotificationCount();

  return (
    <DashboardShell user={user} initialUnreadCount={initialUnreadCount}>
      {children}
    </DashboardShell>
  );
}
