import WalletComp from "@/app/components/WalletComp";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getdatabyId(id) {
  const res = await fetch(`${process.env.URI}/api/wallet/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
}

const page = async () => {
  const data = getdatabyId();
  const [dat] = await Promise.all([data]);
  return (
    <>
      <WalletComp wallets={dat} />
    </>
  );
};

export default page;
