"use client";

import { useState } from "react";

export default function ImpersonationBanner({ username, adminUsername }) {
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState("");

  const handleReturn = async () => {
    setError("");
    setReturning(true);
    try {
      const res = await fetch("/api/admin/return-to-admin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setReturning(false);
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Something went wrong. Please try again.");
      setReturning(false);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-[12px]"
      style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.3)" }}
    >
      <p className="font-medium" style={{ color: "var(--down)" }}>
        You&rsquo;re signed in as <span className="font-semibold">{username}</span> (impersonating, as {adminUsername}).
        {error && <span className="ml-2 font-normal">{error}</span>}
      </p>
      <button onClick={handleReturn} disabled={returning} className="btn btn-ghost btn-sm !py-1 !px-3 !text-[11px]" style={{ borderColor: "var(--down)", color: "var(--down)" }}>
        {returning ? "Returning…" : "Return to admin"}
      </button>
    </div>
  );
}
