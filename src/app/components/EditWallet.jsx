"use client";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import useFetch from "../hooks/useFetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks/useAuthContext";

export default function EditWallet({ wallet }) {
  const { user } = useAuthContext();
  const { updateWallet, error, isLoading } = useFetch();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [ico, setIco] = useState("");
  const [icochanged, seticochanged] = useState(false);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setAddress(wallet.address);
      setId(wallet.id);
      setImage(wallet.image);
      setIco(wallet.ico);
    }
  }, [wallet]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleIcoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setIco(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    seticochanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (address === "" || name === "" || ico === "") {
      toast.error("Fill everything!");
      return;
    }

    const data = {
      address: address.trim(),
      name: name.trim(),
      ico,
      image,
      icochanged,
      id: id.trim(), // Ensure ID is also trimmed
    };

    try {
      await updateWallet(wallet._id, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="shadow-lg rounded-lg p-6 w-full max-w-md min-h-screen bg-[#1c222c] p-4 md:p-6 w-full dash"
      style={{
        maxWidth: "calc(100vw - 260px)",
        padding: "70px 20px",
        boxSizing: "border-box",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <p className="text-lg font-semibold text-center border-b border-gray-300 pb-4 mb-4">
        Edit Wallet
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            style={{ color: "#fff" }}
          >
            Asset Name
          </label>
          <input
            type="text"
            value={name}
            placeholder="Name"
            style={{ color: "#000" }}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            style={{ color: "#fff" }}
          >
            ID
          </label>
          <input
            type="text"
            value={id}
            style={{ color: "#000" }}
            placeholder="ID"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            style={{ color: "#fff" }}
          >
            Wallet Address
          </label>
          <input
            type="text"
            value={address}
            style={{ color: "#000" }}
            placeholder="Wallet Address"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          {ico && (
            <img
              src={ico.url || ico}
              alt="Wallet Icon"
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <label
            htmlFor="fileInputIco"
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Choose Wallet Icon Image
          </label>
          <input
            type="file"
            id="fileInputIco"
            accept="image/*"
            onChange={handleIcoChange}
            className="hidden"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-red-500 mt-4 text-center">
          <b>{error}</b>
        </p>
      )}
      <ToastContainer />
    </div>
  );
}
