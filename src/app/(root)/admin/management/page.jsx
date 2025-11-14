import AdminManagement from "@/app/components/AdminManagement";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function fetchAllUsers() {
  const response = await fetch(`${process.env.URI}/api/user`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound();
  }

  return response.json();
}

async function fetchAdmin(id) {
  const response = await fetch(`${process.env.URI}/api/user/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return notFound();
  }

  return response.json();
}

const ManagementPage = async () => {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user");
  const adminUser = JSON?.parse(userCookie?.value || "{}");

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
