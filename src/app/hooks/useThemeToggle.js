"use client";

import { useEffect, useState } from "react";

export default function useThemeToggle() {
  const [theme, setThemeState] = useState(null); // null = system
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ggc-theme");
      if (saved === "light" || saved === "dark") setThemeState(saved);
    } catch (e) {}
    setSystemDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const isDark = theme ? theme === "dark" : systemDark;

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ggc-theme", next);
    } catch (e) {}
  };

  return { isDark, toggleTheme };
}
