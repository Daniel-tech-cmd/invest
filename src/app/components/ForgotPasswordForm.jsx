"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "./AuthShell";
import { TextField } from "./FormField";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      setIsLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessage(`If an account exists for ${email}, a reset link is on its way.`);
      setIsSubmitted(true);
    } catch {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <AuthShell eyebrow="Check your inbox" heading="Sent" subtext={message} maxWidth="560px">
        <p className="mb-6 text-xs text-ink-faint">Didn&apos;t receive the email? Check your spam folder or try again.</p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="btn btn-ghost w-full"
          >
            Try another email
          </button>
          <Link href="/login" className="btn btn-primary block w-full text-center">
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      heading="Reset"
      subtext="No worries. Enter your email address and we'll send you a link to reset your password."
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {error && (
          <div className="rounded-lg border px-4 py-3 text-sm text-down" style={{ borderColor: "var(--down)", background: "rgba(179,70,62,0.08)" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? "Sending..." : "Send reset link"}
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
