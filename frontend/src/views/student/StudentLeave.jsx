import React, { useState } from "react";
import { initialLeaveRequests } from "../../data/mockData.js";
// Icons import kiye gaye hain
import {
  PaperClipIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function StudentLeave({ user }) {
  // Aapke existing state ko use kiya gaya hai
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [form, setForm] = useState({ from: "", to: "", reason: "" });
  // File upload ke liye naya state
  const [document, setDocument] = useState(null);

  const handleChange = (e) => {
    // Yahan par syntax error theek kiya gaya hai ('of' ki jagah '=')
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRequest = {
      id: requests.length + 1,
      studentName: user.profile.name,
      studentId: user.email, // Roll number ki jagah email use kiya
      from: form.from,
      to: form.to,
      reason: form.reason,
      status: "Pending",
      // Document ka naam save kiya
      document: document ? document.name : "No document",
    };

    setRequests([newRequest, ...requests]);
    // Form aur document state reset kiya
    setForm({ from: "", to: "", reason: "" });
    setDocument(null);
    alert("Leave request submitted successfully!");
  };

  // Status ko sundar dikhane ke liye function
  const getStatusChip = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
            <ClockIcon className="w-4 h-4 mr-1.5" />
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            <XCircleIcon className="w-4 h-4 mr-1.5" />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Leave Management
      </h2>

      {/* New Request Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Submit Leave Request
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason <span className="text-red-500">*</span></label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            rows="3"
            placeholder="e.g., Attending a family function"
            className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* File Upload Section Add Kiya Gaya */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload Supporting Document
          </label>
          <div className="mt-1 flex items-center">
            <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
              <PaperClipIcon className="w-5 h-5 inline-block mr-2" />
              <span>{document ? document.name : "Attach a file"}</span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG up to 2MB.</p>
        </div>

        <div className="text-right">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            <PlusIcon className="w-5 h-5 mr-2" />
            Submit Request
          </button>
        </div>
      </form>

      {/* Past Requests */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          My Requests
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{request.from} to {request.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{request.document}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(request.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}