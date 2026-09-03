"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass = "w-full rounded-xl border px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint";
const fieldStyle = { background: "var(--surface-raised-2)", borderColor: "var(--line)" };
const labelClass = "mb-1.5 block text-[11px] font-medium text-ink-faint";

export default function WalletForm({ mode, initial }) {
  const router = useRouter();
  const [form, setForm] = useState({
    label: initial?.label || "",
    assetId: initial?.assetId || "",
    address: initial?.address || "",
    network: initial?.network || "",
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [iconDataUrl, setIconDataUrl] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSubmitted(false);
    setError("");
  };

  const handleIcon = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setIconPreview(ev.target.result);
      setIconDataUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.assetId.trim() || !form.address.trim()) {
      setError("Asset name, asset ID, and wallet address are required.");
      return;
    }
    setError("");
    setSaving(true);

    const payload = { ...form };
    if (iconDataUrl) payload.icon = iconDataUrl;

    try {
      const res = await fetch(mode === "add" ? "/api/admin/wallets" : `/api/admin/wallets/${initial.id}`, {
        method: mode === "add" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSubmitted(true);
      router.push("/admin/wallets");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-2xl border p-5 sm:p-6" style={{ background: "var(--surface-raised)", borderColor: "var(--line)" }}>
      <div>
        <p className="text-[11px] tracking-wide text-ink-faint">{mode === "add" ? "New deposit destination" : "Edit deposit destination"}</p>
        <h2 className="text-[13px] font-semibold text-ink">{mode === "add" ? "Add wallet" : "Edit wallet"}</h2>
      </div>

      <div>
        <label className={labelClass} htmlFor="wallet-name">Asset name</label>
        <input id="wallet-name" type="text" value={form.label} onChange={set("label")} placeholder="e.g. Bitcoin" className={inputClass} style={fieldStyle} />
      </div>

      <div>
        <label className={labelClass} htmlFor="wallet-id">Asset ID</label>
        <input id="wallet-id" type="text" value={form.assetId} onChange={set("assetId")} placeholder="e.g. BTC" className={`${inputClass} mono`} style={fieldStyle} />
      </div>

      <div>
        <label className={labelClass} htmlFor="wallet-address">Wallet address</label>
        <input id="wallet-address" type="text" value={form.address} onChange={set("address")} placeholder="Receiving address" className={`${inputClass} mono`} style={fieldStyle} />
      </div>

      <div>
        <label className={labelClass} htmlFor="wallet-network">Network</label>
        <input id="wallet-network" type="text" value={form.network} onChange={set("network")} placeholder="e.g. ERC-20, TRC-20, BEP-20" className={inputClass} style={fieldStyle} />
      </div>

      <div>
        <label className={labelClass} htmlFor="wallet-icon">Wallet icon</label>
        <div className="flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border text-[11px] font-semibold text-gold-ink"
            style={{ background: "rgba(231,185,75,0.1)", borderColor: "rgba(231,185,75,0.25)" }}
          >
            {iconPreview || initial?.icon?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={iconPreview || initial.icon.url} alt="Wallet icon preview" className="h-full w-full object-cover" />
            ) : (
              form.assetId || "?"
            )}
          </div>
          <input
            id="wallet-icon"
            type="file"
            accept="image/*"
            onChange={handleIcon}
            className="flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-[12px] text-ink-dim outline-none file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:px-2.5 file:py-1.5 file:text-[11px] file:font-medium"
            style={fieldStyle}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(220,80,80,0.08)", borderColor: "rgba(220,80,80,0.25)", color: "var(--down)" }}>
          {error}
        </div>
      )}

      {submitted && (
        <div className="rounded-lg border px-3 py-2.5 text-[11px] font-medium" style={{ background: "rgba(34,192,138,0.08)", borderColor: "rgba(34,192,138,0.25)", color: "var(--grove-ink)" }}>
          {mode === "add" ? "Wallet added." : "Changes saved."}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={() => router.push("/admin/wallets")} className="btn btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
          {saving ? "Saving…" : mode === "add" ? "Add wallet" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
