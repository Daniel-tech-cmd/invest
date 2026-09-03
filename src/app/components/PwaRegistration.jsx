"use client";

import { useEffect, useState } from "react";

export default function PwaRegistration() {
  const [installEvent, setInstallEvent] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error("Service worker registration failed:", err));
    }

    // Standalone display mode (already installed, or launched from home
    // screen) — never show the install prompt in that case.
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) setInstalled(true);

    try {
      if (sessionStorage.getItem("ggc-install-dismissed") === "1") setDismissed(true);
    } catch {}

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!installEvent || dismissed || installed) return null;

  const handleInstall = async () => {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("ggc-install-dismissed", "1");
    } catch {}
  };

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg sm:inset-x-auto sm:right-4 sm:w-80"
      style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" width={36} height={36} className="shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-ink">Install GoldGroveco</p>
          <p className="text-[10.5px] text-ink-faint">Add to your home screen for quick access.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={handleDismiss} className="btn btn-ghost btn-sm !px-2.5 !py-1.5 !text-[11px]">
          Not now
        </button>
        <button type="button" onClick={handleInstall} className="btn btn-primary btn-sm !px-2.5 !py-1.5 !text-[11px]">
          Install
        </button>
      </div>
    </div>
  );
}
