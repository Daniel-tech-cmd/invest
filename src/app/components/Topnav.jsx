"use client";
import Image from "next/image";
import Hamburg from "./Hamburger";
import useSignup from "../hooks/useSignup";
import { useTheme } from "../contexts/ThemeContext";

export default function TopNav() {
  const { logout } = useSignup();
  const { theme, toggleTheme } = useTheme();
  return (
    <header
      className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between border-b border-nav bg-nav px-6 text-foreground shadow-sm transition lg:left-64 lg:w-[calc(100%-16rem)]"
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <Hamburg />
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] to-[#1e3a8a]"
          style={{ fontWeight: "800" }}
        >
          GoldGroveco.
        </span>
      </div>

      {/* Right: Logout Icon */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          className="transition-colors text-accent hover:opacity-80"
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="24"
            height="24"
            fill="#327dff"
          >
            <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h240v80H160v560h240v80H160Zm471-142-57-57 89-89H360v-80h303l-89-89 57-57 184 184-184 184Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
