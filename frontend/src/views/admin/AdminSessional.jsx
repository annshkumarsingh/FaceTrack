import React, { useState } from "react";
import { ArrowUpTrayIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export default function AdminSessionalUpload() {
  const [marksFile, setMarksFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [sessionalType, setSessionalType] = useState("");

  const handleMarksUpload = (e) => {
    setMarksFile(e.target.files[0]);
  };

  const handleSolutionUpload = (e) => {
    setSolutionFile(e.target.files[0]);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Manage Sessional Marks
      </h2>

      {/* FILTERS */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Course */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
            </label>
            <select
              placeholder="BTech ECE"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Course</option>
              <option>B.Tech CSE</option>
              <option>B.Tech ECE</option>
              <option>BBA</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map((sem) => (
                <option key={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Sessional */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sessional
            </label>
            <select
              value={sessionalType}
              onChange={(e) => setSessionalType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Sessional</option>
              <option>Sessional 1</option>
              <option>Sessional 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* MARKS UPLOAD */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Upload Marks
        </h3>

        <label
          htmlFor="marksFile"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 transition"
        >
          <ArrowUpTrayIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            <span className="font-medium">Drag & Drop Marks File Here</span> or Click to Upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Accepted: .csv, .xlsx
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Required Columns: Roll Number | Name | Marks
          </p>
          <input id="marksFile" type="file" className="hidden" onChange={handleMarksUpload} />
        </label>

        {marksFile && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {marksFile.name}
          </p>
        )}
      </div>

      {/* SOLUTION PDF UPLOAD */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Upload Sessional Solution Sheet
        </h3>

        <label
          htmlFor="solutionFile"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 transition"
        >
          <DocumentArrowUpIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Upload Solution PDF
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Accepted Format: PDF</p>
          <input id="solutionFile" type="file" accept="application/pdf" className="hidden" onChange={handleSolutionUpload} />
        </label>

        {solutionFile && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {solutionFile.name}
          </p>
        )}
      </div>
    </div>
  );
}
