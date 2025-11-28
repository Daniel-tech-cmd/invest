"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatDate } from "../utils/formdate";
import useFetch from "../hooks/useFetch";
import { ToastContainer } from "react-toastify";

const EditProfile = ({ data }) => {
  const { isLoading, error, updateUser } = useFetch();
  const [formData, setFormData] = useState({
    fullName: data.fullName || "",
    username: data.username || "",
    bitcoinAccountId: data.bitcoinAccountId || "",
    ethereumAccountId: data.ethereumAccountId || "",
    litecoinAccountId: data.litecoinAccountId || "",
    usdtAccountId: data.usdtAccountId || "",
    dogeAccountId: data.dogeAccountId || "",
    email: data.email || "",
  });

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(formData);
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
              Profile Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Edit Your Profile
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-stroke bg-surface-elevated px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-muted">Balance</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                ${formatCurrency(data?.balance)}
              </p>
            </div>
            <div className="rounded-2xl border border-stroke bg-surface-elevated px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-muted">Total Withdraw</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                ${formatCurrency(data?.totalWithdraw || 0)}
              </p>
            </div>
          </div>
        </header>

        <div className="rounded-3xl border border-stroke bg-surface-elevated p-6 shadow-xl transition-colors sm:p-8">
          <div className="mx-auto max-w-3xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 border-b border-stroke pb-6">
              <Image
                src={data?.gender ? `/${data.gender}.webp` : "/user.png"}
                width={100}
                height={100}
                alt="Profile"
                className="rounded-full ring-4 ring-accent/20"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  {data?.username || "User"}
                </h2>
                <p className="mt-1 text-sm text-muted">{data?.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 space-y-4 border-b border-stroke pb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Account Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-stroke bg-surface px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted">Account Name</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {data?.username}
                  </p>
                </div>
                <div className="rounded-xl border border-stroke bg-surface px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted">Registration Date</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(data?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-stroke pt-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Cryptocurrency Wallet IDs
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Bitcoin (BTC)
                    </label>
                    <input
                      type="text"
                      name="bitcoinAccountId"
                      value={formData.bitcoinAccountId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Bitcoin wallet address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Ethereum (ETH)
                    </label>
                    <input
                      type="text"
                      name="ethereumAccountId"
                      value={formData.ethereumAccountId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Ethereum wallet address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Litecoin (LTC)
                    </label>
                    <input
                      type="text"
                      name="litecoinAccountId"
                      value={formData.litecoinAccountId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Litecoin wallet address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Dogecoin (DOGE)
                    </label>
                    <input
                      type="text"
                      name="dogeAccountId"
                      value={formData.dogeAccountId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Dogecoin wallet address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Tether (USDT)
                    </label>
                    <input
                      type="text"
                      name="usdtAccountId"
                      value={formData.usdtAccountId}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="USDT wallet address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 border-t border-stroke pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-contrast shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-500">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default EditProfile;
