import AdminComp from "@/app/components/Admin";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getdataby() {
  const res = await fetch(`${process.env.URL}/api/user`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
}
async function getdatabyId(id) {
  const res = await fetch(`${process.env.URL}/api/user/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
}
const page = async () => {
  const cookiestore = cookies();
  const userjson = cookiestore.get("user");

  const user = JSON?.parse(userjson?.value);

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
