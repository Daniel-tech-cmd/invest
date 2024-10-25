"use client";
import { useContext } from "react";
// import styles from "../../../styles/toggle.module.css";
import { navcon } from "../contexts/navcon";

const Hamburg = () => {
  const { mode, toggle } = useContext(navcon);

  // Handle toggle function to open or close the menu
  const handletoggle = () => {
    toggle();
  };

  return (
    <>
      {/* Menu Button */}
      <div
        onClick={() => handletoggle()}
        className={` sm:block haamburg`} // Make button visible only on small screens
        style={{
          cursor: "pointer",
          padding: "0 5px 0 0",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FF914D"
          style={{ margin: 0, padding: 0 }}
        >
          <path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" />
        </svg>
      </div>

      {/* Conditionally Rendered Content */}
      {mode === "open" && (
        <div className="sm:flex flex-col items-center bg-gray-800 text-white p-6 rounded-lg mt-4">
          {/* Your component's content goes here */}
          <p>
            This is the content displayed on small screens when the menu is
            open.
          </p>
          {/* Example close button */}
          <button
            onClick={handletoggle}
            className="mt-4 bg-gray-700 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Hamburg;
