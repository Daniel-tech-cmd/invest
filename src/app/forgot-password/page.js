import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export const metadata = { title: "Forgot password — GoldGroveco" };

export default function ForgotPasswordPage() {
  return (
    <>
      <Nav />
      <ForgotPasswordForm />
      <Footer />
    </>
  );
}
