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
  // const {updatePost,isLoading,error} = useFetch()

  const [res, setRes] = useState("");
  const [username, setUsername] = useState(res.username || "");
  const [email, setEmail] = useState(res.email || "");
  const [role, setRole] = useState(res.role || "");
  const [plan, setPlan] = useState(res.plan || "");
  const [card, setCard] = useState(res.card || "");
  const [balance, setBalance] = useState(res.balance || "");
  const [number, setNumber] = useState(res.number || "");
  const [country, setCountry] = useState(res.country || "");
  const [profit, setProfit] = useState(res.profit || "");
  const [verified, setVerified] = useState(res.verified || "");
  const [minimumWithdrawal, setMinWith] = useState(res.minimumWithdrawal || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suspended, setsuspended] = useState(res.suspended || "");

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
      setPlan(data.plan);
      setCard(data.card);
      setBalance(data.balance);
      setNumber(data.number);
      setCountry(data.country);
      setProfit(data.profit);
      setVerified(data.verified);
      setMinWith(data.minimumWithdrawal);
      setsuspended(data.suspended);
    } catch (err) {
      console.error(err);
    }
  };

  const { updatePost } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !balance || !role || !email) {
      setError("All fields must be filled!");
      toast.error("All fields must be filled!");
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
    };

    try {
      setIsLoading(true);
      console.log(res._id);
      await updatePost(res._id, data);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1c222c] p-4 md:p-6 w-full dash"
      style={{
        maxWidth: "calc(100vw - 260px)",
        padding: "70px 20px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">Dashboard</h1>
          <p className="text-gray-400">/ Dashboard</p>
        </div>

        <div className="flex gap-6 md:gap-4 text-white">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Balance</p>
            <h2 className="text-xl font-semibold">${data?.balance}</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Withdraw</p>
            <h2 className="text-xl font-semibold">$0.00</h2>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-[#2d3748] shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Edit User
        </h2>

        <div className="flex flex-col items-center mb-6">
          <Image
            src="/user.png"
            width={100}
            height={100}
            alt="Profile"
            className="rounded-full"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 font-semibold">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">Role</label>
            <input
              type="text"
              required
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">Number</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Mobile Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">Balance</label>
            <input
              type="number"
              required
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">
              verified
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="verified"
              value={verified}
              onChange={(e) => setVerified(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold">
              Suspended
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 bg-[#1f2937] text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Suspended"
              value={suspended}
              onChange={(e) => setsuspended(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>

          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Edit;
