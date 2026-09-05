import { redirect } from "next/navigation";
import DashboardShell from "./components/DashboardShell";
import { getCurrentUser } from "../../lib/getCurrentUser";
import { getUnreadNotificationCount } from "../../lib/getNotifications";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  // Middleware already guarantees a valid session to get this far — a null
  // user here means the session outlived the account (e.g. deleted mid-session).
  if (!user) redirect("/login");

  const initialUnreadCount = await getUnreadNotificationCount();

  return (
    <DashboardShell user={user} initialUnreadCount={initialUnreadCount}>
      {children}
    </DashboardShell>
  );
}
