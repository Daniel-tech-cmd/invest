"use client";

import { createContext, useEffect, useState } from "react";

export const navcon = createContext();

export const NavProvider = ({ children }) => {
  const [mode, setMode] = useState("dont");

  const toggle = () => {
    setMode((prev) => (prev === "dont" ? "show" : "dont"));
  };
  useEffect(() => {
    // setMode(JSON.parse(localStorage.getItem("mode")));
  }, []);
  return (
    <navcon.Provider value={{ toggle, mode, setMode }}>
      <div className={mode}> {children} </div>
    </navcon.Provider>
  );
};
