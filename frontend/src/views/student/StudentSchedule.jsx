import React, { useState, useEffect } from "react";

export default function StudentSchedule({ user }) {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const backend_url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetchSchedule();
  }, [user]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      // Fetch schedule filtered by user's course and semester
      const response = await fetch(
        `${backend_url}/schedule?course=${encodeURIComponent(user.course)}&semester=${user.semester}`
      );
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Weekly Schedule
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {user.course} • Semester {user.semester}
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading schedule...</p>
        ) : Object.keys(schedule).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No schedule available for your course and semester.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Please contact your admin to upload the timetable.
            </p>
          </div>
        ) : (
          Object.entries(schedule).map(([day, sessions]) => (
            <div key={day} className="mb-4 last:mb-0">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {day}
              </h3>
              {sessions.length > 0 ? (
                <ul className="space-y-1">
                  {sessions.map((s, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="font-medium">
                        {s.time} — {s.subject}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {s.teacher}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 pl-3">No classes</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Academic Calendar - Static for now */}
      {/* <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Academic Calendar
        </h3>
        <ul className="space-y-2">
          <li className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span>Sessional Exam 1</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Sep 22, 2025 → Sep 26, 2025
            </span>
          </li>
          <li className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span>Sessional Exam 2</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Oct 27, 2025 → Oct 31, 2025
            </span>
          </li>
          <li className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span>End Semester Exams</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Dec 1, 2025 → Dec 12, 2025
            </span>
          </li>
          <li className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span>Winter Break</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Dec 13, 2025 → Jan 5, 2026
            </span>
          </li>
        </ul>
      </div> */}

      {/* Holidays - Static for now */}
      {/* <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Holidays
        </h3>
        <ul className="space-y-2">
          <li className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded">
            <span>Gandhi Jayanti</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Oct 2, 2025
            </span>
          </li>
          <li className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded">
            <span>Diwali</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Oct 21, 2025
            </span>
          </li>
          <li className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded">
            <span>Christmas</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Dec 25, 2025
            </span>
          </li>
        </ul>
      </div> */}
    </div>
  );
}
