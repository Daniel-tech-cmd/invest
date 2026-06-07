import AdminManagement from "@/app/components/AdminManagement";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";

async function fetchAllUsers() {
  try {
    await connectToDB();
    const users = await User.find({}).lean();
    return JSON.parse(JSON.stringify(users));
  } catch {
    return [];
  }
}

async function fetchAdmin(id) {
  try {
    await connectToDB();
    const user = await User.findById(id).lean();
    if (!user) return notFound();
    return JSON.parse(JSON.stringify(user));
  } catch {
    return notFound();
  }
}

const ManagementPage = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const adminUser = userCookie?.value ? JSON.parse(decodeURIComponent(userCookie.value)) : {};

  if (!adminUser?._id) {
    return notFound();
  }

  const [users, adminData] = await Promise.all([
    fetchAllUsers(),
    fetchAdmin(adminUser._id),
  ]);

  return (
    <AdminManagement
      requests={adminData?.notifications || []}
      users={users || []}
    />
  );
};

export default ManagementPage;
