import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

export const metadata = { title: "Sign up — GoldGroveco" };

export default function SignupPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
      <Footer />
    </>
  );
}
