import Link from "next/link";
import { getCustomPlanForAdmin } from "../../../../../lib/customPlansData";
import { getAllUsersSummary } from "../../../../../lib/getAdminData";
import CustomPlanForm from "../../../components/CustomPlanForm";

export const metadata = { title: "Edit Custom Plan — GoldGroveco" };

export default async function EditCustomPlanPage({ params }) {
  const { id } = await params;
  const [plan, users] = await Promise.all([getCustomPlanForAdmin(id), getAllUsersSummary()]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16" style={{ borderColor: "var(--line-strong)" }}>
        <p className="text-[13px] font-medium text-ink">Plan not found</p>
        <p className="text-[11px] text-ink-faint">No custom plan matches that id.</p>
        <Link href="/admin/plans" className="btn btn-primary btn-sm mt-2">
          Back to custom plans
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Edit custom plan">
      <CustomPlanForm mode="edit" initial={plan} users={users || []} />
    </section>
  );
}
