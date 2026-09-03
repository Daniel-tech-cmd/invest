import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ResetPasswordForm from "../components/ResetPasswordForm";

export const metadata = { title: "Reset password — GoldGroveco" };

export default function ResetPasswordPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </>
  );
}
