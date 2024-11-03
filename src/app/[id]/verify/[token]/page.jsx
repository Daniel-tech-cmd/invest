import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

async function getdatabyId(id, token) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/user/${id}/verify/${token}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return;
  }

  const data = await res.json();

  return data;
}

const Track = async ({ params }) => {
  const id = params.id;
  const token = params.token;
  const data = getdatabyId(id, token);
  const [dat] = await Promise.all([data]);

  return (
    <>
      <Navbar />
      {dat ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
          <Success message={"Email verification Successful!"} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
          <Image src="/failed.svg" width={70} height={70} alt="Failed" />
          <p className="text-2xl font-semibold text-red-600 mt-4">
            Verification link has expired! Try signing up again.
          </p>
          <Link
            href="/user/signup"
            className="mt-6 inline-flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
          >
            Sign up
            <span className="ml-2">
              <Image src="/arrow.svg" width={12} height={12} alt="arrow" />
            </span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Track;
