import Edit from "@/app/components/Edit";
import { Suspense } from "react";
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
  const cookiestore = cookies();
  const userjson = cookiestore.get("user");

  const user = JSON?.parse(userjson?.value);

  const data = getdatabyId(user._id);
  const [dat] = await Promise.all([data]);
  return (
    <>
      <Suspense>
        <Edit data={dat} />
      </Suspense>
    </>
  );
};

export default page;
