// src/components/LoginForm.jsx

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export default function LoginForm({ role, onLogin, onBack, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Har submit par purana error clear karein

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // YAHAN BADLAV KIYA GAYA HAI
    // Ab hum App.jsx ko email, password, aur role teeno bhej rahe hain
    const loginSuccess = onLogin(email, password, role);

    if (!loginSuccess) {
      setError("Invalid email, password, or role. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          {`${role} Login`}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`e.g., your.email@jcboseust.ac.in`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {isPasswordVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Error message ab yahan dikhega */}
        {error && <p className="text-sm text-center text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onForgotPassword(email)}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}