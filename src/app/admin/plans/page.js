import { getAllCustomPlansForAdmin } from "../../../lib/customPlansData";
import CustomPlansGrid from "./components/CustomPlansGrid";

export const metadata = { title: "Custom Plans — GoldGroveco" };

export default async function CustomPlansPage() {
  const plans = (await getAllCustomPlansForAdmin()) || [];
  return (
    <section aria-label="Custom plans">
      <CustomPlansGrid plans={plans} />
    </section>
  );
}
