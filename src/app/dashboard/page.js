import { getCurrentUser } from "../../lib/getCurrentUser";
import { getCustomPlansForUser } from "../../lib/customPlansData";
import OverviewStats from "./components/OverviewStats";
import ActivePlans from "./components/ActivePlans";
import QuickActions from "./components/QuickActions";

export const metadata = { title: "Dashboard — GoldGroveco" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const customPlans = await getCustomPlansForUser(user.id);

  return (
    <>
      <section aria-label="Account overview">
        <OverviewStats user={user} />
      </section>

      <section aria-label="Plans and wallet" className="flex flex-col gap-5 xl:flex-row">
        <div className="min-w-0 flex-1">
          <ActivePlans deposits={user.activeDeposit} customPlans={customPlans} />
        </div>
        <div className="w-full shrink-0 xl:w-[280px]">
          <QuickActions />
        </div>
      </section>

      <p className="pt-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
        &copy; 2026 GoldGroveco &middot; All rights reserved
      </p>
    </>
  );
}
