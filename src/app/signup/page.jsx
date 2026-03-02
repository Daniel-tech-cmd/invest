import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SignUpForm from "../components/SignupForm";
import { Suspense } from "react";

const SignupLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-200">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const page = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<SignupLoading />}>
        <SignUpForm />
      </Suspense>
      <Footer />
    </>
  );
};

export default page;
