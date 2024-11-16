import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SignUpForm from "../components/SignupForm";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <Suspense>
        <SignUpForm />
      </Suspense>
      <Footer />
    </>
  );
};

export default page;
