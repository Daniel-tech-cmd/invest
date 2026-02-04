import { Suspense } from "react";
import Footer from "../components/Footer";
import ResetPassword from "../components/ResetPassword";
import Navbar from "../components/Navbar";

const ResetPasswordContent = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
};

const page = () => {
  return (
    <>
      <Navbar />
      <ResetPasswordContent />
      <Footer />
    </>
  );
};

export default page;
