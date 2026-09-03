import { redirect } from "next/navigation";
import DashboardShell from "../dashboard/components/DashboardShell";
import { getCurrentUser } from "../../lib/getCurrentUser";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  // Middleware already keeps non-admins out of /admin — this is just
  // defense in depth for the rare case a session outlives its account.
  if (!user || (user.role !== "admin" && user.role !== "master admin")) redirect("/login");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
