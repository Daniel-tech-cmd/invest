"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <img src="/logo.png" alt="Payyed" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium ${
                  router.pathname === "/" ? "text-green-600" : "text-gray-700"
                } hover:text-green-600`}
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className={`px-3 py-2 text-sm font-medium ${
                  router.pathname === "/about"
                    ? "text-green-600"
                    : "text-gray-700"
                } hover:text-green-600`}
              >
                About Us
              </Link>
              <Link
                href="/services"
                className={`px-3 py-2 text-sm font-medium ${
                  router.pathname === "/services"
                    ? "text-green-600"
                    : "text-gray-700"
                } hover:text-green-600`}
              >
                Our Services
              </Link>
              <Link
                href="/nft-market"
                className={`px-3 py-2 text-sm font-medium ${
                  router.pathname === "/nft-market"
                    ? "text-green-600"
                    : "text-gray-700"
                } hover:text-green-600`}
              >
                NFT Market
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
            >
              Sign Up
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === "/" ? "text-green-600" : "text-gray-700"
              } hover:text-green-600`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === "/about-us"
                  ? "text-green-600"
                  : "text-gray-700"
              } hover:text-green-600`}
            >
              About Us
            </Link>
            <Link
              href="/services"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === "/services"
                  ? "text-green-600"
                  : "text-gray-700"
              } hover:text-green-600`}
            >
              Our Services
            </Link>
            <Link
              href="/nft-market"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === "/nft-market"
                  ? "text-green-600"
                  : "text-gray-700"
              } hover:text-green-600`}
            >
              NFT Market
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white shadow-md hover:bg-green-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
