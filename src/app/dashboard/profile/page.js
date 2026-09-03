import { getCurrentUser } from "../../../lib/getCurrentUser";
import ProfileSummary from "./components/ProfileSummary";
import ProfileForm from "./components/ProfileForm";
import PushNotificationsToggle from "./components/PushNotificationsToggle";

export const metadata = { title: "Profile — GoldGroveco" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <>
      <section aria-label="Profile summary">
        <ProfileSummary user={user} />
      </section>

      <section aria-label="Push notifications">
        <PushNotificationsToggle />
      </section>

      <section aria-label="Edit profile">
        <ProfileForm user={user} />
      </section>
    </>
  );
}
