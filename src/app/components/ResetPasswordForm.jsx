"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "./AuthShell";
import { PasswordField } from "./FormField";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  useEffect(() => {
    if (!token || !userId) setIsValidLink(false);
  }, [token, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId, password }),
      });
      const data = await res.json();

      setIsLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessage("Your password has been reset.");
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  if (!isValidLink) {
    return (
      <AuthShell eyebrow="Link expired" heading="Invalid link" subtext="This password reset link is invalid or has expired. Please request a new one." maxWidth="560px">
        <Link href="/forgot-password" className="btn btn-primary block w-full text-center">
          Request new link
        </Link>
      </AuthShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthShell eyebrow="All set" heading="Reset" subtext={message} maxWidth="560px">
        <p className="mb-6 text-xs text-ink-faint">You will be redirected to the login page in a few seconds...</p>
        <Link href="/login" className="btn btn-primary block w-full text-center">
          Go to login now
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Almost there" heading="New password" subtext="Enter your new password below. Make sure it's at least 6 characters long." maxWidth="560px">
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          id="password"
          name="password"
          label="New password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm new password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />

        {error && (
          <div className="rounded-lg border px-4 py-3 text-sm text-down" style={{ borderColor: "var(--down)", background: "rgba(179,70,62,0.08)" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <div className="mt-6">
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gold-ink hover:underline">
          &larr; Back to login
        </Link>
      </div>
    </AuthShell>
  );
}
