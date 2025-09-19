import React, { useState } from "react";
import { initialSchedule } from "../../data/mockData"; // .js extension hata diya gaya hai
import { ArrowUpTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function AdminManageSchedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      alert(`File selected: ${file.name}. In a real app, this would be uploaded and processed.`);
      // Future logic: parse PDF/Excel and update schedule state
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Manage Schedule
      </h2>

      {/* Upload Box */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Upload New Timetable or Academic Calendar
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold cursor-pointer">
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                <span>Choose File</span>
                <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </label>
            {fileName && <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {fileName}</p>}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Supported formats: PDF, Excel, JPG, PNG. The new file will replace the current schedule.
        </p>
      </div>

      {/* Current Schedule Preview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
            <CalendarDaysIcon className="h-6 w-6 mr-3 text-blue-500"/>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Current Weekly Schedule
            </h3>
        </div>
        <div className="space-y-4">
          {Object.entries(schedule).map(([day, sessions]) => (
            <div key={day} className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {day}
              </h4>
              {sessions.length > 0 ? (
                <ul className="mt-2 space-y-1 pl-4">
                  {sessions.map((s, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{s.time}</span> — {s.subject} <span className="text-xs text-gray-500">({s.teacher})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pl-4 text-sm text-gray-500 dark:text-gray-400">No classes scheduled.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

