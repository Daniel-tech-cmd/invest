"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useThemeToggle from "../hooks/useThemeToggle";

const LINKS = [
  { href: "/#markets", label: "Markets" },
  { href: "/#plans", label: "Plans" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about-us", label: "About Us" },
  { href: "/nft-market", label: "NFT Market" },
];

function BrandMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="" width={30} height={30} className="shrink-0" />;
}

function SunIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.3" />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M8 1.2V3" />
        <path d="M8 13V14.8" />
        <path d="M1.2 8H3" />
        <path d="M13 8H14.8" />
        <path d="M3.3 3.3L4.5 4.5" />
        <path d="M11.5 11.5L12.7 12.7" />
        <path d="M3.3 12.7L4.5 11.5" />
        <path d="M11.5 4.5L12.7 3.3" />
      </g>
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.2 9.6A5.4 5.4 0 016.9 2.9a5.4 5.4 0 106.3 6.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-surface/75 backdrop-blur-md border-line"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 py-[18px] sm:px-8">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2.5">
          <BrandMark />
          <span className="truncate font-body text-[1.05rem] font-bold tracking-tight text-ink max-[420px]:max-w-[34vw]">
            GoldGroveco
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm text-ink-dim min-[861px]:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={toggleTheme}
            aria-label="Switch theme"
            aria-pressed={isDark}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-line-strong text-ink transition-colors hover:border-gold-ink hover:text-gold-ink"
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>

          <div className="hidden items-center gap-3.5 min-[861px]:flex">
            <Link href="/login" className="text-sm text-ink-dim transition-colors hover:text-ink">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get started
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-line-strong text-ink min-[861px]:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 4H15M1 8H15M1 12H15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-b border-line bg-surface transition-[max-height] duration-300 min-[861px]:hidden ${
          menuOpen ? "max-h-[420px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 pb-[22px] pt-1.5 sm:px-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3 text-[0.98rem] text-ink-dim"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3.5 flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
