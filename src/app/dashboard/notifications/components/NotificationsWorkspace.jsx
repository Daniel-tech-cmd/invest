"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function NotificationsWorkspace({ initialNotifications }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = async (notification) => {
    if (!notification.read) {
      setNotifications((list) => list.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
      fetch(`/api/notifications/${notification.id}/read`, { method: "PATCH" }).catch(() => {});
    }
    router.push(notification.url || "/dashboard");
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
    } catch {
      // Best-effort — the list already reflects the intent locally, and a
      // failed request here just means the server catches up next load.
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-wide text-ink-faint">Stay in the loop</p>
          <h2 className="text-[13px] font-semibold text-ink">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} disabled={markingAll} className="btn btn-ghost btn-sm !py-1.5 !px-3 !text-[10.5px]">
            {markingAll ? "…" : "Mark all as read"}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
          <p className="text-[12px] text-ink-faint">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => openNotification(notification)}
              className="flex flex-col gap-1 rounded-2xl border p-4 text-left transition-colors"
              style={{
                background: notification.read ? "var(--surface-raised)" : "rgba(231,185,75,0.08)",
                borderColor: notification.read ? "var(--line)" : "rgba(231,185,75,0.3)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!notification.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />}
                  <span className="text-[12.5px] font-semibold text-ink">{notification.title}</span>
                </div>
                <span className="shrink-0 text-[10.5px] text-ink-faint">{timeAgo(notification.createdAt)}</span>
              </div>
              <p className="pl-3.5 text-[11.5px] leading-relaxed text-ink-dim">{notification.body}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
