"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function PushNotificationsToggle() {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setSupported(false);
      return;
    }
    setPermission(Notification.permission);

    navigator.serviceWorker.ready.then(async (registration) => {
      const sub = await registration.pushManager.getSubscription();
      setSubscribed(!!sub);
    });
  }, []);

  const handleEnable = async () => {
    setError("");
    setBusy(true);
    try {
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        setError("Push isn't configured on this deployment (missing VAPID key in the build). Ask an admin to rebuild the site.");
        return;
      }

      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      if (permissionResult !== "granted") {
        setError("Notifications were not allowed. You can enable them in your browser's site settings.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubscribed(true);
    } catch (err) {
      setError(err?.message ? `Something went wrong: ${err.message}` : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setError("");
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-5" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Stay updated</p>
        <h2 className="text-[13px] font-semibold text-ink">Push notifications</h2>
      </div>

      <div className="flex items-center justify-between rounded-xl border px-3.5 py-2.5" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
        <span className="text-[12px] font-medium text-ink-dim">
          {subscribed ? "Enabled on this device" : "Get notified about deposits, withdrawals, and account activity"}
        </span>
        {subscribed ? (
          <button type="button" onClick={handleDisable} disabled={busy} className="btn btn-ghost btn-sm !py-1.5 !px-3 !text-[10.5px]">
            {busy ? "…" : "Turn off"}
          </button>
        ) : (
          <button type="button" onClick={handleEnable} disabled={busy || permission === "denied"} className="btn btn-primary btn-sm !py-1.5 !px-3 !text-[10.5px]">
            {busy ? "…" : "Enable"}
          </button>
        )}
      </div>

      {permission === "denied" && !subscribed && (
        <p className="text-[11px] text-ink-faint">
          Notifications are blocked for this site in your browser. Enable them in your browser&rsquo;s site settings, then reload this page.
        </p>
      )}

      {error && (
        <p className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
