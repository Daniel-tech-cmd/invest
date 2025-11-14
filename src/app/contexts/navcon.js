"use client";

import { createContext, useEffect, useState } from "react";

export const navcon = createContext();

export const NavProvider = ({ children }) => {
  const [mode, setMode] = useState("nav-closed");

  const toggle = () => {
    setMode((prev) => (prev === "nav-closed" ? "nav-open" : "nav-closed"));
  };
  useEffect(() => {
    if (typeof document === "undefined") return;
    const classes = document.body.classList;
    if (mode === "nav-open") {
      classes.add("overflow-hidden", "lg:overflow-auto");
    } else {
      classes.remove("overflow-hidden");
    }
  }, [mode]);
  return (
    <navcon.Provider value={{ toggle, mode, setMode }}>
      <div className={mode}> {children} </div>
    </navcon.Provider>
  );
};
