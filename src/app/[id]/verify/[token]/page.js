import Link from "next/link";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";

export const metadata = { title: "Verify — GoldGroveco" };

export default function VerifyPage() {
  // Verification isn't wired up yet — the external pages are being built first.
  return (
    <>
      <Nav />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center" style={{ background: "var(--surface)" }}>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(179,70,62,0.1)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="mb-6 max-w-md font-display text-xl font-medium text-ink">Verification link has expired. Try signing up again.</p>
        <Link href="/signup" className="btn btn-primary">
          Sign up &rarr;
        </Link>
      </div>
      <Footer />
    </>
  );
}
