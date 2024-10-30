"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import useFetch from "../hooks/useFetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Addwallet() {
  const { user } = useAuthContext();
  const { addwalet, error, isLoading } = useFetch();

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [id, setid] = useState("");
  const [image, setimage] = useState("");
  const [ico, setico] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setimage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleicochange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setico(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handletrade = async (e) => {
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
      id,
    };

    try {
      await addwalet(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="shadow-lg rounded-lg p-6 w-full max-w-md min-h-screen  bg-[#1c222c] p-4 md:p-6 w-full dash"
      style={{
        maxWidth: "calc(100vw - 260px)",
        padding: "70px 20px",
        boxSizing: "border-box",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <p className="text-lg font-semibold text-center border-b border-gray-300 pb-4 mb-4">
        Add Wallet
      </p>
      <form onSubmit={handletrade} className="space-y-4">
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
            onChange={(e) => setname(e.target.value)}
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
            onChange={(e) => setid(e.target.value)}
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
            onChange={(e) => setaddress(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          {ico && (
            <img
              src={ico}
              alt="Wallet Icon"
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <label
            htmlFor="fileInput2"
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Choose Wallet Icon Image
          </label>
          <input
            type="file"
            id="fileInput2"
            accept="image/*"
            onChange={handleicochange}
            className="hidden"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Add"}
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
