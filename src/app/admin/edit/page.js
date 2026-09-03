import Link from "next/link";
import { getUserForAdmin, getUserSummaryByUsername } from "../../../lib/getAdminData";
import { getCustomPlansForUser } from "../../../lib/customPlansData";
import EditUserHeader from "./components/EditUserHeader";
import EditUserForm from "./components/EditUserForm";
import AdminActionsPanel from "./components/AdminActionsPanel";

export const metadata = { title: "Edit User — GoldGroveco" };

export default async function EditUserPage({ searchParams }) {
  const { query } = await searchParams;
  const user = query ? await getUserForAdmin(query) : null;
  const referrer = user?.referredby ? await getUserSummaryByUsername(user.referredby) : null;
  const privatePlan = user ? (await getCustomPlansForUser(user.id)).find((p) => p.visibility === "private") || null : null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16" style={{ borderColor: "var(--line-strong)" }}>
        <p className="text-[13px] font-medium text-ink">User not found</p>
        <p className="text-[11px] text-ink-faint">No account matches that id.</p>
        <Link href="/admin" className="btn btn-primary btn-sm mt-2">
          Back to user management
        </Link>
      </div>
    );
  }

  return (
    <>
      <section aria-label="User summary">
        <EditUserHeader user={user} referrer={referrer} />
      </section>

      <section aria-label="Edit user account" className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EditUserForm user={user} />
        </div>
        <div>
          <AdminActionsPanel user={user} privatePlan={privatePlan} />
        </div>
      </section>
    </>
  );
}
