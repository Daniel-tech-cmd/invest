import { getCurrentUser } from "../../../lib/getCurrentUser";
import ReferralsBar from "./components/ReferralsBar";
import ReferralShare from "./components/ReferralShare";
import ReferralsList from "./components/ReferralsList";

export const metadata = { title: "Referrals — GoldGroveco" };

export default async function ReferralsPage() {
  const user = await getCurrentUser();

  return (
    <>
      <section aria-label="Referral summary">
        <ReferralsBar user={user} />
      </section>

      <section aria-label="Referral link and history" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReferralShare user={user} />
        </div>
        <div className="lg:col-span-2">
          <ReferralsList user={user} />
        </div>
      </section>
    </>
  );
}
