"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "./AuthShell";
import { TextField, PasswordField } from "./FormField";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <AuthShell eyebrow="Welcome back" heading="Login" subtext="Sign in to check today's profit, request a withdrawal, or start a new reinvestment." maxWidth="560px">
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <PasswordField id="password" name="password" label="Password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" />

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-gold-ink hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-down">{error}</p>}

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? "Submitting..." : "Login"}
        </button>

        <p className="text-xs text-ink-faint">
          By logging in, you agree to the GoldGroveco{" "}
          <a href="#" className="text-gold-ink underline">
            Terms of Use
          </a>
          .
        </p>
      </form>

      <p className="mt-7 text-sm text-ink-dim">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-gold-ink underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
