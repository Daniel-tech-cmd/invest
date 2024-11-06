"use client";
import useSignup from "../hooks/useSignup";
const AccountSuspension = () => {
  const { logout } = useSignup();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-blue-600 font-bold text-lg md:text-xl mb-4">
          ACCOUNT SUSPENSION
        </h2>
        <p className="text-gray-700 mb-4">
          You have been restricted from accessing your account due to some
          unauthorized activities detected in your account.
        </p>
        <p className="text-gray-700 mb-6">
          Please contact <span className="font-semibold">Our support</span> for
          more assistance.
        </p>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md w-full transition"
          onClick={() => logout()}
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default AccountSuspension;
