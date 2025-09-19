import React from "react"
import { initialSchedule, academicCalendar, holidayCalendar } from "../../data/mockData"

export default function StudentSchedule() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Weekly Schedule
      </h2>

      {/* Timetable */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {Object.entries(initialSchedule).map(([day, sessions]) => (
          <div key={day} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {day}
            </h3>
            {sessions.length > 0 ? (
              <ul className="space-y-1">
                {sessions.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <span>
                      {s.time} — {s.subject}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {s.teacher}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No classes</p>
            )}
          </div>
        ))}
      </div>

      {/* Academic Calendar */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Academic Calendar
        </h3>
        <ul className="space-y-2">
          {academicCalendar.map((e, idx) => (
            <li
              key={idx}
              className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded"
            >
              <span>{e.event}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {e.start.toDateString()} → {e.end.toDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Holidays */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Holidays
        </h3>
        <ul className="space-y-2">
          {holidayCalendar.map((h, idx) => (
            <li
              key={idx}
              className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded"
            >
              <span>{h.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(h.date).toDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}