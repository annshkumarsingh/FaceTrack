import React, { useState, useEffect } from "react";
import { 
  ArrowUpTrayIcon, 
  CalendarDaysIcon, 
  TrashIcon,
  DocumentTextIcon 
} from "@heroicons/react/24/outline";

export default function AdminManageSchedule() {
  const [schedule, setSchedule] = useState({});
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/schedule");
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      alert("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setExtractedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload-schedule", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Check if it's an image upload
        if (data.extracted_text) {
          setExtractedText(data.extracted_text);
          alert(`📷 Image uploaded! Please review the extracted text below and manually enter the schedule.`);
        } else {
          alert(`✅ Schedule uploaded successfully! ${data.rows_processed} rows processed.`);
          fetchSchedule();
        }
        setFileName("");
      } else {
        alert(`❌ Upload failed: ${data.detail}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleClearSchedule = async () => {
    if (!confirm("Are you sure you want to delete all schedules?")) return;

    try {
      const response = await fetch("http://localhost:5000/schedule", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Schedule cleared successfully");
        setSchedule({});
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete schedule");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Manage Schedule
        </h2>
        <button
          onClick={handleClearSchedule}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <TrashIcon className="h-5 w-5" />
          Clear Schedule
        </button>
      </div>

      {/* Upload Box */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Upload New Timetable
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold cursor-pointer disabled:opacity-50">
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            <span>{uploading ? "Uploading..." : "Choose File"}</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          {fileName && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {fileName}
            </p>
          )}
        </div>

        {/* Excel/CSV Format Guide */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            📋 Supported Formats:
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                Excel/CSV (Auto-Import):
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 ml-4">
                <li>• Columns: <strong>day, time, subject, teacher</strong></li>
                <li>• Optional: <strong>course, semester</strong></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                Image (PNG/JPG) - Manual Entry Required:
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 ml-4">
                <li>• Upload scanned timetable</li>
                <li>• Text will be extracted for reference</li>
                <li>• You'll need to manually enter the data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Extracted Text from Image */}
        {extractedText && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                Extracted Text from Image:
              </p>
            </div>
            <pre className="text-xs text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap bg-white dark:bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
              {extractedText}
            </pre>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              💡 Please use this text as reference and create an Excel file for auto-import.
            </p>
          </div>
        )}
      </div>

      {/* Current Schedule Preview */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="h-6 w-6 mr-3 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Current Weekly Schedule
          </h3>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading schedule...</p>
        ) : Object.keys(schedule).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No schedule uploaded yet. Upload an Excel/CSV file to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(schedule).map(([day, sessions]) => (
              <div
                key={day}
                className="border-t border-gray-200 dark:border-gray-700 pt-3"
              >
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  {day}
                </h4>
                {sessions.length > 0 ? (
                  <ul className="mt-2 space-y-1 pl-4">
                    {sessions.map((s, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {s.time}
                        </span>{" "}
                        — {s.subject}{" "}
                        <span className="text-xs text-gray-500">
                          ({s.teacher})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pl-4 text-sm text-gray-500 dark:text-gray-400">
                    No classes scheduled.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
