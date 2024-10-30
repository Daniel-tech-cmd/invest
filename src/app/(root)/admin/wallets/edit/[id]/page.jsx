import EditWallet from "@/app/components/EditWallet";
import { Suspense } from "react";

async function getdatabyId(id) {
  const res = await fetch(`${process.env.URL}/api/wallet/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
}

const page = async ({ params }) => {
  const data = getdatabyId(params.id);
  const [dat] = await Promise.all([data]);
  return (
    <>
      <Suspense>
        <EditWallet wallet={dat} />
      </Suspense>
    </>
  );
};

export default page;
