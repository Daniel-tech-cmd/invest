"use client";

import { useState } from "react";

export default function ReferralShare({ user }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const referralLink = `https://goldgroveco.com/signup?r=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  const copyCode = () => {
    navigator.clipboard?.writeText(user.referralCode).catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Grow your network</p>
        <h2 className="text-[13px] font-semibold text-ink">Share your referral link</h2>
      </div>

      <div className="flex items-center gap-2 rounded-xl border px-3.5 py-3" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
        <span className="mono flex-1 truncate text-[12px] text-ink-dim">{referralLink}</span>
        <button
          onClick={copyLink}
          className={`btn btn-sm shrink-0 !py-1.5 !px-3 !text-[11px] ${linkCopied ? "" : "btn-primary"}`}
          style={linkCopied ? { background: "var(--grove-ink)", color: "#fff" } : undefined}
        >
          {linkCopied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border px-3.5 py-3" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
        <span className="text-[11px] text-ink-faint">Referral code</span>
        <span className="mono flex-1 text-[12px] font-medium text-ink">{user.referralCode}</span>
        <button
          onClick={copyCode}
          className={`btn btn-ghost btn-sm shrink-0 !py-1.5 !px-3 !text-[11px] ${codeCopied ? "" : ""}`}
          style={codeCopied ? { borderColor: "var(--grove-ink)", color: "var(--grove-ink)" } : undefined}
        >
          {codeCopied ? "Copied" : "Copy code"}
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-faint">
        You earn a 10% commission whenever someone you referred makes an approved deposit, and again on every reinvestment they make afterward.
      </p>
    </div>
  );
}
