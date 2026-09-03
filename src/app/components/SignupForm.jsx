"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "./AuthShell";
import { TextField, SelectField, PasswordField } from "./FormField";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("r");

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (referralFromUrl) {
      setFormData((prev) => ({ ...prev, referralCode: referralFromUrl }));
    }
  }, [referralFromUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          gender: formData.gender,
          referralCode: formData.referralCode || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      setIsLoading(false);

      if (signInRes?.error) {
        // Account was created but auto sign-in failed for some reason — send
        // them to log in manually rather than leaving them stuck.
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthShell eyebrow="Create account" heading="Register" subtext="Join the investors compounding daily with GoldGroveco.">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          className="sm:col-span-2"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <TextField
          id="username"
          name="username"
          type="text"
          label="Username"
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
        />
        <SelectField id="gender" name="gender" label="Gender" required value={formData.gender} onChange={handleChange}>
          <option value="" disabled>
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </SelectField>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 6 characters"
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat password"
        />
        <TextField
          id="referralCode"
          name="referralCode"
          type="text"
          label="Referral code"
          className="sm:col-span-2"
          value={formData.referralCode}
          onChange={handleChange}
          placeholder="Optional"
        />

        <div className="sm:col-span-2">
          <p className="mb-5 text-xs text-ink-faint">
            By registering you agree to the GoldGroveco{" "}
            <a href="#" className="text-gold-ink underline">
              Terms of Use
            </a>
            .
          </p>

          {error && <p className="mb-4 text-sm text-down">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
            {isLoading ? "Submitting..." : "Sign up"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
