import DepositList from "@/app/components/DepositList";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getdatabyId(id) {
  const res = await fetch(`${process.env.URI}/api/user/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
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
