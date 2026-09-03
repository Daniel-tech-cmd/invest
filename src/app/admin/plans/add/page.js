import { getAllUsersSummary } from "../../../../lib/getAdminData";
import CustomPlanForm from "../../components/CustomPlanForm";

export const metadata = { title: "Add Custom Plan — GoldGroveco" };

export default async function AddCustomPlanPage({ searchParams }) {
  const { forUser } = await searchParams;
  const users = (await getAllUsersSummary()) || [];

  return (
    <section aria-label="Add custom plan">
      <CustomPlanForm mode="add" initial={forUser ? { visibility: "private", userId: forUser } : undefined} users={users} />
    </section>
  );
}
