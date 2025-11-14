"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks/useAuthContext";

const STATUS_BADGE = {
  pending: "bg-[#f97360]/20 text-[#f97360]",
  approved: "bg-[#22c55e]/20 text-[#22c55e]",
  declined: "bg-[#ef4444]/20 text-[#ef4444]",
};

const typePalette = {
  deposit: {
    accent: "#22d3ee",
    bg: "bg-[#0c1424]",
  },
  withdrawal: {
    accent: "#a855f7",
    bg: "bg-[#120f27]",
  },
};

const columns = [
  { key: "date", label: "Requested" },
  { key: "user", label: "User" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
];

const AdminManagement = ({ requests = [], users = [] }) => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState("");
  const [search, setSearch] = useState("");

  const enhanceRequest = (request) => {
    const owner = users.find((item) => item?._id === request?.userid) || {};
    const record =
      request.type === "deposit"
        ? owner?.deposit?.[request?.index ?? -1]
        : owner?.withdraw?.[request?.index ?? -1];

    return {
      ...request,
      owner,
      record,
      amount: request?.amount || record?.amount || 0,
      method: record?.method || record?.plan || request?.method || "-",
      note: record?.note,
      wallet: record?.wallet,
      receipt: record?.receipt,
      status: record?.status || "pending",
      date: request?.date || record?.date,
    };
  };

  const requestsByType = useMemo(() => {
    const grouped = { deposit: [], withdrawal: [] };
    requests.forEach((item) => {
      if (!grouped[item?.type]) return;
      grouped[item.type].push(enhanceRequest(item));
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key] = grouped[key]
        .filter((item) =>
          search
            ? item.owner?.email?.toLowerCase().includes(search.toLowerCase()) ||
              item.owner?.username?.toLowerCase().includes(search.toLowerCase())
            : true
        )
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    });

    return grouped;
  }, [requests, users, search]);

  const tabTotals = useMemo(
    () => ({
      deposit: requestsByType.deposit.length,
      withdrawal: requestsByType.withdrawal.length,
    }),
    [requestsByType]
  );

  const handleAction = async (request, action) => {
    if (!user?._id) return;
    setIsSubmitting(true);
    setProcessingId(request?.id || request?._id || "");

    const endpoint =
      request.type === "deposit"
        ? action === "approve"
          ? `/api/deposit/${user._id}`
          : `/api/deposit/decline/${user._id}`
        : action === "approve"
        ? `/api/withdraw/${user._id}`
        : `/api/withdraw/decline/${user._id}`;

    try {
      const response = await axios.patch(
        endpoint,
        {
          ...request,
          amount: request.amount,
          userid: request.userid,
          index: request.index,
          id: request.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          `${request.type === "deposit" ? "Deposit" : "Withdrawal"} ${
            action === "approve" ? "approved" : "declined"
          } successfully`
        );
      } else {
        toast.error(response.data?.error || "Something went wrong");
      }
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setProcessingId("");
    }
  };

  const renderRow = (request) => {
    const palette = typePalette[request.type] || typePalette.deposit;
    return (
      <div
        key={request?.id || request?._id}
        className={`rounded-3xl border border-[#1f2a3e] ${palette.bg} p-5 shadow-[0_20px_45px_rgba(9,14,27,0.45)] transition`}
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              {request.owner?.username || "Unknown User"}
            </p>
            <p className="text-xs text-[#8ca4d4]">
              {request.owner?.email || request.userid}
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full border border-[#1f2a3e] bg-[#0f1628] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7a8bbb]"
            style={{ borderColor: palette.accent, color: palette.accent }}
          >
            {request.type === "deposit" ? "Deposit" : "Withdrawal"}
          </span>
        </header>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-[#9ca9ce] sm:grid-cols-4">
          <div className="rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4">
            <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
              Requested
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">
              {request.date ? new Date(request.date).toLocaleString() : "--"}
            </dd>
          </div>
          <div className="rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4">
            <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
              Amount
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">
              ${formatCurrency(request.amount)}
            </dd>
          </div>
          <div className="rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4">
            <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
              Method / Plan
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">
              {request.method || "--"}
            </dd>
          </div>
          <div className="rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4">
            <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
              Status
            </dt>
            <dd
              className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                STATUS_BADGE[request.status] || STATUS_BADGE.pending
              }`}
            >
              {request.status}
            </dd>
          </div>
          {request.wallet && (
            <div className="col-span-2 rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4 sm:col-span-4">
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
                Wallet / Account
              </dt>
              <dd className="mt-2 text-sm font-semibold text-white">
                {request.wallet}
              </dd>
            </div>
          )}
          {request.note && (
            <div className="col-span-2 rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4 sm:col-span-4">
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
                Note
              </dt>
              <dd className="mt-2 text-sm font-semibold text-white">
                {request.note}
              </dd>
            </div>
          )}
          {request.receipt?.url && (
            <div className="col-span-2 rounded-xl border border-[#1f2a3e] bg-[#111b2d]/60 p-4 sm:col-span-4">
              <dt className="text-[11px] uppercase tracking-[0.3em] text-[#6f83b3]">
                Receipt
              </dt>
              <dd className="mt-2 text-sm font-semibold text-white">
                <a
                  href={request.receipt.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#38bdf8] hover:underline"
                >
                  View proof of payment
                </a>
              </dd>
            </div>
          )}
        </dl>

        <footer className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleAction(request, "approve")}
            className="inline-flex items-center justify-center rounded-full bg-[#22c55e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#15803d]"
            disabled={isSubmitting && processingId === (request?.id || request?._id)}
          >
            {isSubmitting && processingId === (request?.id || request?._id)
              ? "Processing..."
              : "Approve"}
          </button>
          <button
            onClick={() => handleAction(request, "decline")}
            className="inline-flex items-center justify-center rounded-full bg-[#ef4444] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#b91c1c]"
            disabled={isSubmitting && processingId === (request?.id || request?._id)}
          >
            {isSubmitting && processingId === (request?.id || request?._id)
              ? "Processing..."
              : "Decline"}
          </button>
        </footer>
      </div>
    );
  };

  return (
    <section
      className="min-h-screen w-full dash px-4 sm:px-6 lg:px-10 py-8"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "96px",
        boxSizing: "border-box",
        overflowX: "hidden",
        background:
          "radial-gradient(120% 120% at 0% 0%, rgba(46, 91, 255, 0.12) 0%, rgba(9, 14, 27, 0.85) 42%, rgba(9, 14, 27, 1) 100%)",
      }}
    >
      <div className="flex flex-col gap-8 text-white">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-[#7a8bbb]">
              Admin Console
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Funding Requests
            </h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex overflow-hidden rounded-full border border-[#1f2a3e] bg-[#111b2d]/80 p-1 text-sm font-semibold text-[#8ca4d4]">
              {[
                { key: "deposit", label: "Deposits" },
                { key: "withdrawal", label: "Withdrawals" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 rounded-full px-5 py-2 transition ${
                    activeTab === key
                      ? "bg-[#327dff] text-white"
                      : "hover:text-white"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-xs text-[#8ea2d2]">
                    {tabTotals[key]}
                  </span>
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user or email"
              className="w-full rounded-full border border-[#1f2a3e] bg-[#0f1628] px-5 py-2.5 text-sm text-white placeholder:text-[#6b7da6] focus:border-[#327dff] focus:outline-none sm:w-64"
            />
          </div>
        </header>

        <section className="space-y-6">
          <div className="rounded-3xl border border-[#1f2a3e] bg-[#10182c] p-6 shadow-[0_16px_40px_rgba(7,12,24,0.5)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {activeTab === "deposit" ? "Deposit Requests" : "Withdrawal Requests"}
                </h2>
                <p className="text-sm text-[#6b7da6]">
                  Review, approve, or decline incoming funding requests with complete context.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6379a6]">
                {tabTotals[activeTab]} open requests
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {requestsByType[activeTab].length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#1f2a3e] bg-[#0f1628] p-8 text-center">
                  <p className="text-sm font-semibold text-white">No requests available</p>
                  <p className="mt-1 text-xs text-[#6b7da6]">
                    When users submit new {activeTab === "deposit" ? "deposits" : "withdrawals"}, they will appear here automatically.
                  </p>
                </div>
              ) : (
                requestsByType[activeTab].map((request) => renderRow(request))
              )}
            </div>
          </div>
        </section>
      </div>

      <ToastContainer />
    </section>
  );
};

export default AdminManagement;
