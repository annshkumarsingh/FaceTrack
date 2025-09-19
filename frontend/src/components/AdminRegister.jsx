// src/components/AdminRegister.js

import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

// --- Icon Components ---
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.111 2.458.311M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.75 4.75l14.5 14.5"
    />
  </svg>
);

// --- AdminRegister Form Component (Updated & Simplified) ---
const AdminRegister = ({ onBack, onRegister }) => {
  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profilePic: "File size cannot exceed 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePic: reader.result });
        if (errors.profilePic) {
          const newErrors = { ...errors };
          delete newErrors.profilePic;
          setErrors(newErrors);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.designation.trim())
      newErrors.designation = "Designation is required";
    if (!form.department.trim())
      newErrors.department = "Department is required";
    if (!form.email.endsWith("@jcboseust.ac.in"))
      newErrors.email = "Must be an official @jcboseust.ac.in email";
    if (!validatePassword(form.password))
      newErrors.password =
        "Password must be 8+ chars, with upper, lower, digit, & special char.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.profilePic) newErrors.profilePic = "Profile picture is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onRegister(form.email, { ...form, role: "Admin" });
    }
  };

  const getInputClass = (fieldName) =>
    `w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ${
      errors[fieldName] ? "border-red-500 ring-red-500" : "border-gray-300"
    }`;

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Admin Registration
        </h3>
        <div className="flex flex-col items-center space-y-2">
          <label
            htmlFor="profilePicInput"
            className="cursor-pointer group relative"
          >
            <img
              src={
                form.profilePic ||
                "https://placehold.co/100x100/EFEFEF/3B82F6?text=Upload"
              }
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 group-hover:border-blue-500 transition"
            />
          </label>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {errors.profilePic && (
            <p className="text-red-500 text-sm">{errors.profilePic}</p>
          )}
        </div>

        {/* Form Fields */}
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            className={getInputClass("fullName")}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Assistant Professor"
            className={getInputClass("designation")}
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Electronics Engineering"
            className={getInputClass("department")}
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Admin Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="your_name@jcboseust.ac.in"
            className={getInputClass("email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className={getInputClass("password") + " pr-10"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              className={getInputClass("confirmPassword") + " pr-10"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegister;