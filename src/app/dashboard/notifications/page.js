import { getNotificationsForUser } from "../../../lib/getNotifications";
import NotificationsWorkspace from "./components/NotificationsWorkspace";

export const metadata = { title: "Notifications — GoldGroveco" };

export default async function NotificationsPage() {
  const { notifications } = await getNotificationsForUser();

  return (
    <section aria-label="Notifications">
      <NotificationsWorkspace initialNotifications={notifications} />
    </section>
  );
}
