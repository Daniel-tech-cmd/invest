import Link from "next/link";

const VerifySection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 md:p-16  shadow-lg">
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
          Having Doubts About Our Legitimacy?
        </h2>
        <p className="text-gray-600">
          It takes about 30 seconds to verify our identity.
        </p>
      </div>
      <Link
        href="/firm_39914.pdf"
        target="_blank"
        passHref
        className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-pink-600 transition duration-300"
        style={{ fontWeight: "500" }}
      >
        Verify Now
      </Link>
    </div>
  );
};

export default VerifySection;
