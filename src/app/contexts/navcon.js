"use client";

import {
  createContext,
  useEffect,
  useState,
} from "react";

export const navcon = createContext();

export const NavProvider = ({ children }) => {
  const [mode, setMode] = useState("nav-closed");

  const toggle = () => {
    setMode((prev) =>
      prev === "nav-closed"
        ? "nav-open"
        : "nav-closed",
    );
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const classes = document.body.classList;
    if (mode === "nav-open") {
      classes.add(
        "nav-open",
        "overflow-hidden",
        "lg:overflow-auto",
      );
      classes.remove("nav-closed");
    } else {
      classes.add("nav-closed");
      classes.remove(
        "nav-open",
        "overflow-hidden",
        "lg:overflow-auto",
      );
    }
  }, [mode]);

  return (
    <navcon.Provider
      value={{ toggle, mode, setMode }}
    >
      {children}
    </navcon.Provider>
  );
};
