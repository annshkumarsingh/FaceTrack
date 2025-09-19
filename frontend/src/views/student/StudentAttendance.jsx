import React from "react"
import { initialAttendanceData } from "../../data/mockData"

export default function StudentAttendance() {
  const getPercentage = (attended, total) =>
    total > 0 ? Math.round((attended / total) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Subject-wise Attendance
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        {initialAttendanceData.map((a, idx) => {
          const percent = getPercentage(a.attended, a.total)
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {a.subject}
                </span>
                <span
                  className={
                    percent < 75
                      ? "text-red-500 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {percent}% ({a.attended}/{a.total})
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className={`h-3 rounded ${
                    percent < 75 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
