import WithdrawalHistory from "@/app/components/WithdrawHistory";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";

async function getdatabyId(id) {
  try {
    await connectToDB();
    const user = await User.findById(id).lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
}

const page = async () => {
  const cookiestore = await cookies();
  const userjson = cookiestore.get("user");

  let user = null;
  try {
    user = userjson?.value
      ? JSON.parse(decodeURIComponent(userjson.value))
      : null;
  } catch {
    user = null;
  }

  if (!user?._id) {
    redirect("/login");
  }

  const dat = await getdatabyId(user._id);

  if (!dat) {
    redirect("/login");
  }

  return (
    <>
      <WithdrawalHistory data={dat} />
    </>
  );
};

export default page;
