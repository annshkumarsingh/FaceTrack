import React, { useState } from "react";
import {
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function AdminAssignments() {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [answerKey, setAnswerKey] = useState(null);
  const [marksFile, setMarksFile] = useState(null);
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [loadingAnswerKey, setLoadingAnswerKey] = useState(false);

  // -------------------------
  // UPLOAD MARKS ONLY
  // -------------------------
  const uploadMarks = async () => {
    if (!course || !semester || !subject || !marksFile) {
      alert("Please fill all fields and upload marks file.");
      return;
    }

    try {
      setLoadingMarks(true); // START LOADING

      const data = new FormData();
      data.append("course", course);
      data.append("semester", semester);
      data.append("subject", subject);
      data.append("marksFile", marksFile);

      const res = await fetch(
        "http://127.0.0.1:8000/admin/upload-assignment-marks",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      alert("Marks uploaded successfully!");
    } catch (error) {
      alert("Error uploading marks!");
    } finally {
      setLoadingMarks(false); // STOP LOADING
    }
  };

  // -------------------------
  // UPLOAD ANSWER KEY ONLY
  // -------------------------
  const uploadAnswerKey = async () => {
    if (!course || !semester || !subject || !answerKey) {
      alert("Please fill all fields and upload answer key.");
      return;
    }

    try {
      setLoadingAnswerKey(true); // START LOADING

      const data = new FormData();
      data.append("course", course);
      data.append("semester", semester);
      data.append("subject", subject);
      data.append("answerKey", answerKey);

      const res = await fetch("http://127.0.0.1:8000/admin/upload-answer-key", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Answer key uploaded successfully!");
    } catch (error) {
      alert("Error uploading answer key!");
    } finally {
      setLoadingAnswerKey(false); // STOP LOADING
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Manage Assignments
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Subject</option>
              <option>DBMS</option>
              <option>OOPS</option>
              <option>Computer Networks</option>
              <option>Operating System</option>
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
            <span className="font-medium">Drag & Drop Marks File</span> or Click
            to Upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Accepted: .csv, .xlsx
          </p>
          <input
            id="marksFile"
            type="file"
            className="hidden"
            onChange={(e) => setMarksFile(e.target.files[0])}
          />
        </label>

        {marksFile && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {marksFile.name}
          </p>
        )}

        {/* Marks Upload Button */}
        <button
          onClick={uploadMarks}
          disabled={loadingMarks}
          className={`mt-4 text-white px-4 py-2 rounded-lg w-full 
    ${loadingMarks ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loadingMarks ? "Uploading..." : "Upload Marks"}
        </button>
      </div>

      {/* ANSWER KEY UPLOAD */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Upload Answer Key
        </h3>

        <label
          htmlFor="answerKey"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 transition"
        >
          <DocumentArrowUpIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            Upload Answer Key (PDF / DOCX)
          </p>
          <input
            id="answerKey"
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => setAnswerKey(e.target.files[0])}
          />
        </label>

        {answerKey && (
          <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploaded: {answerKey.name}
          </p>
        )}

        {/* Answer key Upload Button */}
        <button
          onClick={uploadAnswerKey}
          disabled={loadingAnswerKey}
          className={`mt-4 text-white px-4 py-2 rounded-lg w-full 
    ${loadingAnswerKey ? "bg-gray-500" : "bg-blue-600 hover:bg-green-700"}`}
        >
          {loadingAnswerKey ? "Uploading..." : "Upload Answer Key"}
        </button>
      </div>
    </div>
  );
}
