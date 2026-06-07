import DepositList from "@/app/components/DepositList";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";

async function getdatabyId(id) {
  try {
    await connectToDB();
    const user = await User.findById(id).lean();
    if (!user) return notFound();
    return JSON.parse(JSON.stringify(user));
  } catch {
    return notFound();
  }
}
const page = async () => {
  const cookiestore = await cookies();
  const userjson = cookiestore.get("user");

  const user = userjson?.value ? JSON.parse(decodeURIComponent(userjson.value)) : null;

  const data = getdatabyId(user._id);
  const [dat] = await Promise.all([data]);
  return (
    <>
      <DepositList data={dat} />
    </>
  );
};

export default page;
