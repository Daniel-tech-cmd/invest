"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const POLL_MS = 30000;

export default function NotificationBell({ initialUnreadCount = 0 }) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setUnreadCount(data.unreadCount || 0);
      } catch {
        // Silent — the header badge just keeps its last known value.
      }
    };

    const interval = setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/dashboard/notifications"
      className="relative flex items-center rounded-lg border p-2 text-ink-dim transition-colors hover:text-ink"
      style={{ borderColor: "var(--line-strong)" }}
      aria-label="Notifications"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {unreadCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
          style={{ background: "var(--down)" }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
