import React, { useEffect, useState } from "react";

export default function StudentDashboard({ user }) {
  const [aiPlan, setAiPlan] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Fetch announcements from backend
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const response = await fetch("http://localhost:8000/announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // AI Plan (uncomment when you want to use it)
  // useEffect(() => {
  //   const overall = user?.attendanceSummary?.overall || 100;
  //   if (overall < 75) {
  //     setAiPlan(
  //       `Your attendance is below 75%. Here is a suggested plan:\n1. Attend all upcoming lectures for critical subjects.\n2. Meet with your subject teachers to discuss catch-up topics.\n3. Dedicate an extra hour daily for self-study.`
  //     );
  //   }
  // }, [user]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Welcome, {user.name}
      </h2>

      {/* Attendance Summary */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Attendance Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Overall Attendance:{" "}
          <span className="text-green-600 font-bold">
            {user?.attendanceSummary?.overall || "N/A"}%
          </span>
        </p>
      </div>

      {/* Announcements */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Recent Announcements
        </h3>

        {loadingAnnouncements ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No announcements available.
          </p>
        ) : (
          <ul className="space-y-3">
            {announcements.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {a.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {a.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {a.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        {announcements.length > 3 && (
          <button
            onClick={() => {/* Navigate to full announcements page */}}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View all announcements →
          </button>
        )}
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
