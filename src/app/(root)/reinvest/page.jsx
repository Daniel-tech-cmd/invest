import ReinvestForm from "@/app/components/ReinvestForm";
import { cookies } from "next/headers";
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

  const user = userjson?.value ? JSON.parse(decodeURIComponent(userjson.value)) : null;

  const data = getdatabyId(user._id);
  const [dat] = await Promise.all([data]);

  return (
    <>
      <ReinvestForm data={dat} />
    </>
  );
};

export default page;
