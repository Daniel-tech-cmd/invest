"use client"; // Ensures it's used in client-side rendering

import React, { useState } from "react";
import useSignup from "../hooks/useSignup";

const SignUpForm = () => {
  const { signup, isLoading, error } = useSignup();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);
    await signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side Image */}
          <div className="md:w-1/2 hidden md:block relative">
            <img
              src="/auth-one-bg.jpg" // Image source updated
              alt="Signup Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <p className="text-center text-xl font-semibold text-gray-900 mb-4">
              Register Account
            </p>
            <p className="text-center text-gray-600 mb-4">
              Get your Free Payyed Investors account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="username" className="sr-only">
                  Full Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <div>
                <label htmlFor="referralCode" className="sr-only">
                  Referral Code
                </label>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  required
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Referral Code"
                />
              </div>

              <p className="text-xs text-gray-600 mt-4">
                By registering you agree to the Velzon{" "}
                <a href="#" className="text-blue-500 underline">
                  Terms of Use
                </a>
              </p>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {isLoading ? "Submitting..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
