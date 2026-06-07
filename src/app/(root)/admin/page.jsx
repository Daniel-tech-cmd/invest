import AdminComp from "@/app/components/Admin";
import { cookies } from "next/headers";
import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";

async function getdataby() {
  try {
    await connectToDB();
    const users = await User.find({}).lean();
    return JSON.parse(JSON.stringify(users));
  } catch {
    return [];
  }
}

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

  const data = getdataby();
  const [dat] = await Promise.all([data]);

  const datium = getdatabyId(user?._id);
  const [dat2] = await Promise.all([datium]);
  return (
    <>
      <AdminComp data={dat} data2={dat2} />
    </>
  );
};

export default page;
