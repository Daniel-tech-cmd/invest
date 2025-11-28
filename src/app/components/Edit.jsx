"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Edit = ({ data }) => {
  const router = useSearchParams();
  const query = router.get("query");

  const [res, setRes] = useState("");
  const [username, setUsername] = useState(res.username || "");
  const [email, setEmail] = useState(res.email || "");
  const [role, setRole] = useState(res.role || "");
  const [plan, setPlan] = useState("");
  const [card, setCard] = useState(res.card || "");
  const [balance, setBalance] = useState(res.balance || "");
  const [prevBalance, setPrevBalance] = useState(res.balance || "");
  const [number, setNumber] = useState(res.number || "");
  const [country, setCountry] = useState(res.country || "");
  const [profit, setProfit] = useState(res.profit || "");
  const [verified, setVerified] = useState(res.verified || "");
  const [minimumWithdrawal, setMinWith] = useState(res.minimumWithdrawal || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suspended, setsuspended] = useState(res.suspended || "");
  // Crypto account ID states
  const [bitcoinAccountId, setBitcoinAccountId] = useState(res.bitcoinAccountId || "");
  const [ethereumAccountId, setEthereumAccountId] = useState(res.ethereumAccountId || "");
  const [dogeAccountId, setDogeAccountId] = useState(res.dogeAccountId || "");
  const [litecoinAccountId, setLitecoinAccountId] = useState(res.litecoinAccountId || "");
  const [usdtAccountId, setUsdtAccountId] = useState(res.usdtAccountId || "");

  const [plans] = useState([
    {
      planName: "Basic Plan",
      planDescription: "Plan 1",
      amountRange: "$100.00 - $499.00",
      dailyProfit: "4.60%",
      hasDeposit: false,
    },
    {
      planName: "Standard Plan",
      planDescription: "Plan 2",
      amountRange: "$500.00 - $4999.00",
      dailyProfit: "6.80%",
      hasDeposit: false,
    },
    {
      planName: "Advanced Plan",
      planDescription: "Plan 3",
      amountRange: "$5000.00 - $9999.00",
      dailyProfit: "7.70%",
      hasDeposit: false,
    },
    {
      planName: "Silver Plan",
      planDescription: "Plan 4",
      amountRange: "$10000.00 - $19999.00",
      dailyProfit: "8.40%",
      hasDeposit: false,
    },
    {
      planName: "Gold Plan",
      planDescription: "Plan 5",
      amountRange: "$20000.00 - ∞",
      dailyProfit: "9.20%",
      hasDeposit: false,
    },
  ]);

  useEffect(() => {
    if (query) {
      handleFetch(query);
    }
  }, [query]);

  const handleFetch = async (searchKeyword) => {
    try {
      const encodedQuery = encodeURIComponent(searchKeyword.trim());
      const response = await fetch(`/api/user/${encodedQuery}`);
      const data = await response.json();
      setRes(data);
      setUsername(data.username);
      setEmail(data.email);
      setRole(data.role);
      setPlan("");
      setCard(data.card);
      setBalance(data.balance);
      setPrevBalance(data.balance);
      setNumber(data.number);
      setCountry(data.country);
      setProfit(data.profit);
      setVerified(data.verified);
      setMinWith(data.minimumWithdrawal);
      setsuspended(data.suspended);
      // Set crypto account IDs
      setBitcoinAccountId(data.bitcoinAccountId || "");
      setEthereumAccountId(data.ethereumAccountId || "");
      setDogeAccountId(data.dogeAccountId || "");
      setLitecoinAccountId(data.litecoinAccountId || "");
      setUsdtAccountId(data.usdtAccountId || "");
    } catch (err) {
      console.error(err);
    }
  };

  const { updatePost } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username) {
      setError("Username is missing!");
      toast.error("Username is missing!");
      return;
    }
    if (balance < 0) {
      setError("Balance is missing!");
      toast.error("Balance is missing!");
      return;
    }
    if (!role) {
      setError("Role is missing!");
      toast.error("Role is missing!");
      return;
    }
    if (!email) {
      setError("Email is missing!");
      toast.error("Email is missing!");
      return;
    }
    if (balance !== prevBalance && !plan) {
      setError("Please select a plan before submitting.");
      toast.error("Please select a plan before submitting.");
      return;
    }

    const data = {
      username: username?.trim(),
      number,
      country: country?.trim(),
      balance,
      profit,
      role: role?.trim(),
      email: email?.trim(),
      minimumWithdrawal,
      verified,
      suspended,
      plan,
      bitcoinAccountId: bitcoinAccountId?.trim(),
      ethereumAccountId: ethereumAccountId?.trim(),
      dogeAccountId: dogeAccountId?.trim(),
      litecoinAccountId: litecoinAccountId?.trim(),
      usdtAccountId: usdtAccountId?.trim(),
    };

    try {
      setIsLoading(true);
      await updatePost(res._id, data);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
              Edit User Account
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
            <div className="flex flex-col items-center gap-6 border-b border-stroke pb-6">
              <Image
                src={`/${data.gender}.webp`}
                width={100}
                height={100}
                alt="Profile"
                className="rounded-full ring-4 ring-accent/20"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  {res?.username || "Loading..."}
                </h2>
                <p className="mt-1 text-sm text-muted">{res?.email}</p>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Username
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Role
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Mobile Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Country
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Account Balance
                  </label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Balance"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Minimum Withdrawal
                  </label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Minimum Withdrawal"
                    value={minimumWithdrawal}
                    onChange={(e) => setMinWith(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Verified Status
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="true or false"
                    value={verified}
                    onChange={(e) => setVerified(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                    Suspended Status
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="true or false"
                    value={suspended}
                    onChange={(e) => setsuspended(e.target.value)}
                  />
                </div>

                {balance !== prevBalance && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Investment Plan
                    </label>
                    <select
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                    >
                      <option value="">Select Plan</option>
                      {plans.map((p) => (
                        <option key={p.planName} value={p.planName}>
                          {p.planName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Bitcoin Account ID"
                      value={bitcoinAccountId}
                      onChange={(e) => setBitcoinAccountId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Ethereum (ETH)
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Ethereum Account ID"
                      value={ethereumAccountId}
                      onChange={(e) => setEthereumAccountId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Dogecoin (DOGE)
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Dogecoin Account ID"
                      value={dogeAccountId}
                      onChange={(e) => setDogeAccountId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Litecoin (LTC)
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="Litecoin Account ID"
                      value={litecoinAccountId}
                      onChange={(e) => setLitecoinAccountId(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      Tether (USDT)
                    </label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-stroke bg-surface px-4 py-3 text-foreground transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="USDT Account ID"
                      value={usdtAccountId}
                      onChange={(e) => setUsdtAccountId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 border-t border-stroke pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-contrast shadow-lg transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Edit;