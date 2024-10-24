import Image from "next/image";
import Link from "next/link";

// Example SVG icons with adjusted size and color (orange-like)
const iconColor = "#FF914D"; // Replace with the orange-like color from the image
const iconSize = "18px";

const homeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
  </svg>
);

const depositIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
  </svg>
);

const withdrawIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M440-280h80v-40h40q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520H440v-40h160v-80h-80v-40h-80v40h-40q-17 0-28.5 11.5T360-600v120q0 17 11.5 28.5T400-440h120v40H360v80h80v40ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
  </svg>
);

const historyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
  </svg>
);

const profileIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360Zm0 360Z" />
  </svg>
);

const referralsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M120-80v-280h120v-160h200v-80H320v-280h320v280H520v80h200v160h120v280H520v-280h120v-80H320v80h120v280H120Zm280-440h160v-200H400v200ZM200-200h160v-200H200v200Zm400 0h160v-200H600v200ZM400-520Zm320 320ZM240-320Zm480 0Z" />
  </svg>
);

const logoutIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    width={iconSize}
    height={iconSize}
    fill={iconColor}
  >
    <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h240v80H160v560h240v80H160Zm471-142-57-57 89-89H360v-80h303l-89-89 57-57 184 184-184 184Z" />
  </svg>
);

export default function Sidebar() {
  return (
    <div
      className="min-h-screen bg-[#1c222c] text-gray-300 w-64 p-4 flex flex-col justify-between"
      style={{ position: "fixed" }}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6 mt-14">
          <Image
            src="/user.png"
            alt="User Profile"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
          <div
            className="text-xl text-orange-400 font-semibold"
            style={{ fontSize: "19px", fontWeight: 500 }}
          >
            Welcome, User!
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          <Link
            href="/home"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {homeIcon}
            <span>Home</span>
          </Link>

          <Link
            href="/deposit"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {depositIcon}
            <span>Deposit</span>
          </Link>

          <Link
            href="/withdraw"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {withdrawIcon}
            <span>Withdraw</span>
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {historyIcon}
            <span>History</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {profileIcon}
            <span>Profile</span>
          </Link>

          <Link
            href="/referrals"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {referralsIcon}
            <span>Referrals</span>
          </Link>
          <Link
            href="/logout"
            className="flex items-center gap-4 hover:text-orange-400 transition-colors"
            style={{ fontSize: "14px", padding: "0 15px" }}
          >
            {logoutIcon}
            <span>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
