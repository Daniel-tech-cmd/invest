"use client";

import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMemo, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const AdminComp = ({ data = [], data2 = {} }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState("");

  const notifications = data2?.notifications ?? [];

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const metrics = useMemo(() => {
    const totalUsers = data.length;
    const totalBalance = data.reduce(
      (sum, current) => sum + (Number(current?.balance) || 0),
      0
    );
    const pendingDeposits = notifications.filter(
      (item) => item?.type === "deposit"
    ).length;
    const pendingWithdrawals = notifications.filter(
      (item) => item?.type === "withdrawal"
    ).length;

    return {
      totalUsers,
      totalBalance,
      pendingDeposits,
      pendingWithdrawals,
    };
  }, [data, notifications]);

  const approvedepofn = async (trans, path) => {
    if (!user?._id) return;

    setIsSubmitting(true);
    setProcessingId(trans?.id || "");

    const payload = { ...trans };
    const endpoint =
      trans.type === "deposit"
        ? path === "approve"
          ? `/api/deposit/${user._id}`
          : `/api/deposit/decline/${user._id}`
        : path === "approve"
        ? `/api/withdraw/${user._id}`
        : `/api/withdraw/decline/${user._id}`;

    try {
      const response = await axios.patch(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        toast.success(
          `${path === "approve" ? "Approved" : "Declined"} successfully!`
        );
      } else {
        toast.error(response.data?.error || "Something went wrong");
      }
    } catch (error) {
      const errMessage =
        error?.response?.data?.error || error.message || "An error occurred";
      toast.error(errMessage);
    } finally {
      setIsSubmitting(false);
      setProcessingId("");
    }
  };

  return (
    <section
      className="dash min-h-screen w-full px-4 py-8 text-foreground sm:px-6 lg:px-10"
      style={{
        maxWidth: "calc(100vw - 260px)",
        paddingTop: "96px",
        boxSizing: "border-box",
        overflowX: "hidden",
        background: "var(--canvas-gradient)",
      }}
    >
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">
              Admin Console
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              User Management
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/management"
              className="rounded-full border border-stroke bg-surface px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-accent hover:text-foreground"
            >
              Review Requests
            </Link>
            <button
              onClick={() => setShowNotifications(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-lg transition hover:brightness-110"
            >
              <span>Notifications</span>
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-3.5 w-3.5 rounded-full bg-rose-500"></span>
              )}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Users",
              value: metrics.totalUsers.toLocaleString(),
              description: "Registered accounts",
            },
            {
              label: "Platform Balance",
              value: `$${formatCurrency(metrics.totalBalance)}`,
              description: "Aggregated user balances",
            },
            {
              label: "Pending Deposits",
              value: metrics.pendingDeposits,
              description: "Awaiting approval",
            },
            {
              label: "Pending Withdrawals",
              value: metrics.pendingWithdrawals,
              description: "Awaiting approval",
            },
          ].map(({ label, value, description }) => (
            <div
              key={label}
              className="rounded-3xl border border-stroke bg-surface-elevated p-5 shadow-xl transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                {label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
              <p className="mt-2 text-xs text-muted">{description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Users</h2>
              <p className="text-sm text-muted">
                Click any profile to review balances, plans, and account details.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Updated {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((userItem) => (
              <Link
                key={userItem?._id}
                href={`/admin/edit?query=${userItem?._id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-stroke bg-surface p-5 shadow-lg transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {userItem?.username || "Unnamed User"}
                    </p>
                    <p className="text-xs text-muted">{userItem?.email}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-stroke bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {userItem?.role === "admin" ? "Admin" : "Investor"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-muted">
                  <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3">
                    <p className="uppercase tracking-wide text-[10px] text-muted">
                      Balance
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      ${formatCurrency(userItem?.balance)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3">
                    <p className="uppercase tracking-wide text-[10px] text-muted">
                      Active Plans
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {userItem?.activeDeposit?.filter((d) => d?.stopped === false)
                        ?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3">
                    <p className="uppercase tracking-wide text-[10px] text-muted">
                      Total Deposit
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      ${formatCurrency(userItem?.totalDeposit)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stroke bg-surface-muted px-4 py-3">
                    <p className="uppercase tracking-wide text-[10px] text-muted">
                      Total Withdraw
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      ${formatCurrency(userItem?.totalWithdraw)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-1 font-medium text-accent">
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                  <span>
                    Joined {new Date(userItem?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="relative w-full max-w-xl rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-2xl transition-colors">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-surface text-muted transition hover:border-accent hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="pr-8">
              <h2 className="text-2xl font-semibold text-foreground">Activity Notifications</h2>
              <p className="mt-1 text-sm text-muted">
                Track new funding requests and take action directly from this panel.
              </p>
            </div>

            <div className="mt-6 space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stroke bg-surface-muted p-6 text-center">
                  <p className="text-sm font-semibold text-foreground">No pending notifications</p>
                  <p className="mt-1 text-xs text-muted">
                    You're all caught up. New requests will appear here automatically.
                  </p>
                </div>
              ) : (
                notifications
                  .slice()
                  .reverse()
                  .map((item) => (
                    <div
                      key={item?.id || item?._id}
                      className="rounded-2xl border border-stroke bg-surface p-5 shadow-sm transition-colors"
                    >
                      {(() => {
                        const requestUser = data.find((usr) => usr?._id === item?.userid);
                        const record =
                          item?.type === "deposit"
                            ? requestUser?.deposit?.[item?.index ?? -1]
                            : requestUser?.withdraw?.[item?.index ?? -1];

                        return (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{item?.text}</p>
                                  <p className="mt-1 text-xs text-muted">
                                    {requestUser?.email || "Unknown user"}
                                  </p>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-stroke bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                                  {item?.type === "deposit" ? "Deposit" : "Withdrawal"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-xs text-muted">
                                <div className="rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                  <p className="text-[10px] uppercase tracking-wide text-muted">
                                    Amount
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-foreground">
                                    ${formatCurrency(item?.amount)}
                                  </p>
                                </div>
                                <div className="rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                  <p className="text-[10px] uppercase tracking-wide text-muted">
                                    Requested
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-foreground">
                                    {new Date(item?.date || Date.now()).toLocaleString()}
                                  </p>
                                </div>
                                {record?.plan && (
                                  <div className="rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-muted">
                                      Plan
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                      {record.plan}
                                    </p>
                                  </div>
                                )}
                                {record?.method && (
                                  <div className="rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-muted">
                                      Method
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                      {record.method}
                                    </p>
                                  </div>
                                )}
                                {record?.wallet && (
                                  <div className="col-span-2 rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-muted">
                                      Wallet
                                    </p>
                                    <p className="mt-1 truncate text-sm font-semibold text-foreground">
                                      {record.wallet}
                                    </p>
                                  </div>
                                )}
                                {record?.note && (
                                  <div className="col-span-2 rounded-xl border border-stroke bg-surface-muted px-3 py-2">
                                    <p className="text-[10px] uppercase tracking-wide text-muted">
                                      Note
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                      {record.note}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                  onClick={() => approvedepofn(item, "approve")}
                                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                                  disabled={isSubmitting && processingId === (item?.id || item?._id)}
                                >
                                  {isSubmitting && processingId === (item?.id || item?._id)
                                    ? "Processing..."
                                    : "Approve"}
                                </button>
                                <button
                                  onClick={() => approvedepofn(item, "decline")}
                                  className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                                  disabled={isSubmitting && processingId === (item?.id || item?._id)}
                                >
                                  {isSubmitting && processingId === (item?.id || item?._id)
                                    ? "Processing..."
                                    : "Decline"}
                                </button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </section>
  );
}
;

export default AdminComp;
