import EditProfile from "@/app/components/EditProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getdatabyId(id) {
  try {
    const res = await fetch(
      `${process.env.URI}/api/user/${id}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const page = async () => {
  const cookiestore = cookies();
  const userjson = cookiestore.get("user");

  let user = null;
  try {
    user = userjson?.value
      ? JSON.parse(userjson.value)
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
      <EditProfile data={dat} />
    </>
  );
};

export default page;
