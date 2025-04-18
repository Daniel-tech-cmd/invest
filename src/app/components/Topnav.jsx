"use client";
import Image from "next/image";
import Hamburg from "./Hamburger";
import useSignup from "../hooks/useSignup";

export default function TopNav() {
  const { logout } = useSignup();
  return (
    <header
      className="w-full bg-[#1c222c] h-16 flex justify-between items-center px-6 border-b-2 border-orange-400"
      style={{ position: "fixed", top: 0, zIndex: 10 }}
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <Hamburg />
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-black"
          style={{ fontWeight: "800" }}
        >
          GoldGroveco.
        </span>
      </div>

      {/* Right: Logout Icon */}
      <div className="flex items-center">
        <button
          className="hover:text-orange-400 transition-colors"
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="24"
            height="24"
            fill="#FF914D"
          >
            <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h240v80H160v560h240v80H160Zm471-142-57-57 89-89H360v-80h303l-89-89 57-57 184 184-184 184Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
