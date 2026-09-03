import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";

export const metadata = { title: "Log in — GoldGroveco" };

export default function LoginPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}
