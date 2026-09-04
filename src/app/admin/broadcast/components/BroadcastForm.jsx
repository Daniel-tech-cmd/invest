"use client";

import { useMemo, useState } from "react";

const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };
const labelClass = "mb-1.5 block text-[11px] font-medium text-ink-faint";

export default function BroadcastForm({ users }) {
  const [mode, setMode] = useState("all"); // "all" | "selected"
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  const recipientCount = mode === "all" ? users.length : selectedIds.length;

  const toggleUser = (id) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
    setResult(null);
  };

  const selectAllFiltered = () => {
    setSelectedIds((ids) => Array.from(new Set([...ids, ...filteredUsers.map((u) => u.id)])));
  };
  const clearSelection = () => setSelectedIds([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }
    if (mode === "selected" && selectedIds.length === 0) {
      setError("Select at least one recipient.");
      return;
    }
    if (!channelEmail && !channelPush) {
      setError("Choose at least one delivery channel.");
      return;
    }
    setConfirming(true);
  };

  const handleConfirmSend = async () => {
    setConfirming(false);
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: mode === "all" ? "all" : selectedIds,
          subject,
          message,
          channels: { email: channelEmail, push: channelPush },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data);
      setSubject("");
      setMessage("");
      setSelectedIds([]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border p-5 sm:p-6" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">Reach your investors</p>
        <h2 className="text-[13px] font-semibold text-ink">Broadcast</h2>
      </div>

      <div>
        <label className={labelClass}>Send via</label>
        <div className="grid grid-cols-2 gap-2">
          <label
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium"
            style={channelEmail ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" } : { borderColor: "var(--line)", color: "var(--ink-faint)" }}
          >
            <input
              type="checkbox"
              checked={channelEmail}
              onChange={(e) => {
                setChannelEmail(e.target.checked);
                setResult(null);
                setError("");
              }}
            />
            Email
          </label>
          <label
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium"
            style={channelPush ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" } : { borderColor: "var(--line)", color: "var(--ink-faint)" }}
          >
            <input
              type="checkbox"
              checked={channelPush}
              onChange={(e) => {
                setChannelPush(e.target.checked);
                setResult(null);
                setError("");
              }}
            />
            Push notification
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Send to</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("all");
              setResult(null);
            }}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              mode === "all"
                ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            All users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("selected");
              setResult(null);
            }}
            className="rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition-colors"
            style={
              mode === "selected"
                ? { borderColor: "var(--gold)", background: "rgba(231,185,75,0.1)", color: "var(--gold-ink)" }
                : { borderColor: "var(--line)", color: "var(--ink-faint)" }
            }
          >
            Select users
          </button>
        </div>
      </div>

      {mode === "selected" && (
        <div className="flex flex-col gap-2.5 rounded-xl border p-3.5" style={{ background: "var(--surface-raised-2)", borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username or email"
              className="flex-1 rounded-lg border px-3 py-2 text-[12px] text-ink outline-none placeholder:text-ink-faint"
              style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}
            />
            <button type="button" onClick={selectAllFiltered} className="btn btn-ghost btn-sm shrink-0 !py-1.5 !px-2.5 !text-[10.5px]">
              Select all shown
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-lg border" style={{ borderColor: "var(--line)" }}>
            {filteredUsers.length === 0 ? (
              <p className="p-3 text-[11px] text-ink-faint">No users match your search.</p>
            ) : (
              filteredUsers.map((u) => (
                <label
                  key={u.id}
                  className="flex cursor-pointer items-center gap-2.5 border-b px-3 py-2 text-[12px] last:border-b-0"
                  style={{ borderColor: "var(--line)", background: "var(--surface-raised)" }}
                >
                  <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleUser(u.id)} className="shrink-0" />
                  <span className="truncate font-medium text-ink">{u.username}</span>
                  <span className="truncate text-ink-faint">{u.email}</span>
                </label>
              ))
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-ink-faint">
            <span>{selectedIds.length} selected</span>
            {selectedIds.length > 0 && (
              <button type="button" onClick={clearSelection} className="font-medium text-gold-ink hover:underline">
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="broadcast-subject">Subject</label>
        <input
          id="broadcast-subject"
          type="text"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setResult(null);
          }}
          placeholder="e.g. Scheduled maintenance this weekend"
          className={inputClass}
          style={fieldStyle}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="broadcast-message">Message</label>
        <textarea
          id="broadcast-message"
          rows={7}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setResult(null);
          }}
          placeholder="Write your announcement — line breaks are preserved in the email. Push notifications show this as plain text and may truncate long messages."
          className={`${inputClass} resize-y`}
          style={fieldStyle}
        />
      </div>

      {error && (
        <div className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}>
          <span>{result.total} recipient{result.total === 1 ? "" : "s"} targeted.</span>
          {result.email && (
            <span>
              Email: sent to {result.email.sent}{result.email.failed > 0 ? `, ${result.email.failed} failed` : ""}.
            </span>
          )}
          {result.push && (
            <span>
              Push: delivered to {result.push.sent}
              {result.push.notSubscribed > 0 ? `, ${result.push.notSubscribed} not subscribed` : ""}
              {result.push.failed > 0 ? `, ${result.push.failed} failed` : ""}.
            </span>
          )}
        </div>
      )}

      {confirming ? (
        <div className="flex flex-col gap-2 rounded-xl border px-4 py-3" style={{ background: "rgba(220,80,80,0.06)", borderColor: "rgba(220,80,80,0.25)" }}>
          <p className="text-[12px] font-medium text-ink">
            Send this via {[channelEmail && "email", channelPush && "push"].filter(Boolean).join(" and ")} to {recipientCount} user{recipientCount === 1 ? "" : "s"}? This can&rsquo;t be undone.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost btn-sm flex-1">
              Cancel
            </button>
            <button type="button" onClick={handleConfirmSend} className="btn btn-sm flex-1" style={{ background: "var(--down)", color: "#fff" }}>
              Confirm send
            </button>
          </div>
        </div>
      ) : (
        <button type="submit" disabled={sending} className="btn btn-primary w-full">
          {sending ? "Sending…" : `Send to ${recipientCount} user${recipientCount === 1 ? "" : "s"}`}
        </button>
      )}
    </form>
  );
}
