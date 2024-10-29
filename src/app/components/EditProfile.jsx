"use client";
import React, { useState } from "react";
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
    accountName: data.accountName || "",
    registrationDate: data.registrationDate || "",
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
    // Handle form submission, e.g., API call to update the profile
    await updateUser(formData);
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
          <h1
            className="text-2xl text-white font-bold"
            style={{ fontSize: "19px" }}
          >
            Dashboard
          </h1>
          <p className="text-gray-400">/ Dashboard</p>
        </div>

        {/* Total Balance and Total Withdraw Section */}
        <div className="flex gap-6 md:gap-4 sm:justify-between sm:flex-row sm:items-center sm:text-left text-white cont-bal">
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Balance</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              ${data?.balance.toFixed(2)}
            </h2>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm md:text-base">Total Withdraw</p>
            <h2 className="text-xl md:text-2xl font-semibold md:font-bold">
              $0.00
            </h2>
          </div>
        </div>
      </div>
      <div
        className="bg-[#f57c00] text-white text-xl font-semibold py-4 px-6 mb-6"
        style={{ fontSize: "16px", fontWeight: "500" }}
      >
        Your account
      </div>
      <div className="bg-[#232a35] text-gray-200 p-6 rounded-lg">
        {/* Account Info */}
        <div className="flex justify-between mb-4">
          <p>Account Name:</p>
          <p>{formData.username}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Registration date:</p>
          <p>{formatDate(data.createdAt)}</p>
        </div>

        {/* Edit Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Your Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Your User Name:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Your BITCOIN Account ID:
            </label>
            <input
              type="text"
              name="bitcoinAccountId"
              value={formData.bitcoinAccountId}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Your ETHEREUM Account ID:
            </label>
            <input
              type="text"
              name="ethereumAccountId"
              value={formData.ethereumAccountId}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Your LITECOIN Account ID:
            </label>
            <input
              type="text"
              name="litecoinAccountId"
              value={formData.litecoinAccountId}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Your USDT Account ID:</label>
            <input
              type="text"
              name="usdtAccountId"
              value={formData.usdtAccountId}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Your DOGE Account ID:</label>
            <input
              type="text"
              name="dogeAccountId"
              value={formData.dogeAccountId}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Your E-mail address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-[#1c222c] text-gray-200 border border-gray-700 rounded"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-[#f57c00] text-white py-2 px-4 rounded-lg hover:bg-[#e06800] transition"
              style={{ fontSize: "14px" }}
            >
              {isLoading ? "Updating..." : "Change Account data"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
