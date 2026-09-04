"use client";

import { useEffect, useState } from "react";

function isIOSDevice() {
  // iPadOS 13+ reports as "MacIntel" with touch support — the standard
  // sniff for telling it apart from a real Mac.
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export default function PwaRegistration() {
  const [installEvent, setInstallEvent] = useState(null);
  const [platform, setPlatform] = useState(null); // "prompt" | "ios" | null
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error("Service worker registration failed:", err));
    }

    // Standalone display mode (already installed, or launched from home
    // screen) — never show the install prompt in that case.
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    try {
      if (sessionStorage.getItem("ggc-install-dismissed") === "1") setDismissed(true);
    } catch {}

    // iOS has no beforeinstallprompt event at all — Safari (and every other
    // iOS browser, all required to run on WebKit) has never implemented it
    // and Apple has no plans to. The only install path there is the user
    // manually tapping Share > Add to Home Screen, so that's shown as
    // instructions instead of a button that would do nothing.
    if (isIOSDevice()) {
      setPlatform("ios");
      return;
    }

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      setPlatform("prompt");
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

  if (dismissed || installed || !platform) return null;
  if (platform === "prompt" && !installEvent) return null;

  const handleInstall = async () => {
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setPlatform(null);
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
          <p className="text-[12px] font-semibold text-ink">Install GoldGroveco as an app</p>
          {platform === "ios" ? (
            <p className="text-[10.5px] text-ink-faint">
              Tap{" "}
              <svg className="mx-0.5 inline-block h-3 w-3 -translate-y-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>{" "}
              Share, then &ldquo;Add to Home Screen&rdquo;.
            </p>
          ) : (
            <p className="text-[10.5px] text-ink-faint">One tap for quick, full-screen access.</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={handleDismiss} className="btn btn-ghost btn-sm !px-2.5 !py-1.5 !text-[11px]">
          {platform === "ios" ? "Got it" : "Not now"}
        </button>
        {platform === "prompt" && (
          <button type="button" onClick={handleInstall} className="btn btn-primary btn-sm !px-2.5 !py-1.5 !text-[11px]">
            Install
          </button>
        )}
      </div>
    </div>
  );
}
