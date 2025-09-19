import React, { useEffect, useState } from "react";
import { initialAnnouncements } from "../../data/mockData.js";
// import { callGeminiAPI } from "../../utils/api"; // Assuming this exists

export default function StudentDashboard({ user }) {
  const [aiPlan, setAiPlan] = useState("");

  useEffect(() => {
    const overall = user?.attendanceSummary?.overall || 100;
    if (overall < 75) {
      // API call ki jagah dummy text taaki crash na ho
      setAiPlan(
        `Your attendance is below 75%. Here is a suggested plan:\n1. Attend all upcoming lectures for critical subjects.\n2. Meet with your subject teachers to discuss catch-up topics.\n3. Dedicate an extra hour daily for self-study.`
      );
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Message ko style kiya gaya hai */}
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Welcome, {user.profile.name}
      </h2>

      {/* Attendance Summary */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Attendance Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Overall Attendance:{" "}
          <span
            className={
              user.attendanceSummary.overall < 75
                ? "text-red-500 font-bold"
                : "text-green-600 font-bold"
            }
          >
            {user.attendanceSummary.overall}%
          </span>
        </p>
      </div>

      {/* Announcements */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Recent Announcements
        </h3>
        <ul className="space-y-3">
          {initialAnnouncements.slice(0, 3).map((a) => ( // Sirf 3 announcements dikhayenge
            <li
              key={a.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
            >
              <p className="font-bold text-gray-800 dark:text-gray-200">{a.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Plan */}
      {aiPlan && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
            ✨ AI Generated Catch-Up Plan
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
            {aiPlan}
          </p>
        </div>
      )}
    </div>
  );
}

