import React, { useState } from "react";
import { ArrowUpTrayIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = "http://localhost:8000";

export default function AdminSessionalUpload() {
  const [marksFile, setMarksFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [sessionalType, setSessionalType] = useState("");
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);

  const handleMarksUpload = (e) => {
    setMarksFile(e.target.files[0] || null);
  };

  const handleSolutionUpload = (e) => {
    setSolutionFile(e.target.files[0] || null);
  };

  // --------- CALL /sessionals/upload-marks ----------
  const uploadMarks = async () => {
    if (!course || !semester || !sessionalType || !marksFile) {
      alert("Please select course, semester, sessional and upload marks file.");
      return;
    }

    try {
      setLoadingMarks(true);

      const data = new FormData();
      data.append("file", marksFile);

      const params = new URLSearchParams({
        course,
        semester,
        sessional_type: sessionalType,
      }).toString();

      const res = await fetch(
        `${API_BASE_URL}/sessionals/upload-marks?${params}`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      const result = await res.json();
      console.log("Marks upload result:", result);
      alert(`Marks uploaded successfully (${result.rows_inserted} rows).`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error uploading marks");
    } finally {
      setLoadingMarks(false);
    }
  };

  // --------- CALL /sessionals/upload-solution ----------
  const uploadSolution = async () => {
    if (!course || !semester || !sessionalType || !solutionFile) {
      alert("Please select course, semester, sessional and upload solution PDF.");
      return;
    }

    try {
      setLoadingSolution(true);

      const data = new FormData();
      data.append("file", solutionFile);

      const params = new URLSearchParams({
        course,
        semester,
        sessional_type: sessionalType,
      }).toString();

      const res = await fetch(
        `${API_BASE_URL}/sessionals/upload-solution?${params}`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      const result = await res.json();
      console.log("Solution upload result:", result);
      alert("Solution PDF uploaded successfully.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error uploading solution");
    } finally {
      setLoadingSolution(false);
    }
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
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Course</option>
              <option>B.Tech CSE</option>
              <option>B.Tech CDSE</option>
              <option>B.Tech IT</option>
              <option>B.Tech ECE</option>
              <option>B.Tech ENC</option>
              <option>B.Tech CIVIL</option>
              <option>B.Tech ELECTRICAL</option>
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
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
            <span className="font-medium">Drag &amp; Drop Marks File Here</span> or Click to Upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Accepted: .csv, .xlsx
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Required Columns: roll_number | name | marks | [max_marks]
          </p>
          <input
            id="marksFile"
            type="file"
            accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={handleMarksUpload}
          />
        </label>

        {marksFile && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {marksFile.name}
          </p>
        )}

        <button
          onClick={uploadMarks}
          disabled={loadingMarks}
          className={`mt-4 text-white px-4 py-2 rounded-lg w-full ${
            loadingMarks ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingMarks ? "Uploading..." : "Upload Marks"}
        </button>
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Accepted Format: PDF
          </p>
          <input
            id="solutionFile"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleSolutionUpload}
          />
        </label>

        {solutionFile && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {solutionFile.name}
          </p>
        )}

        <button
          onClick={uploadSolution}
          disabled={loadingSolution}
          className={`mt-4 text-white px-4 py-2 rounded-lg w-full ${
            loadingSolution ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loadingSolution ? "Uploading..." : "Upload Solution"}
        </button>
      </div>
    </div>
  );
}
