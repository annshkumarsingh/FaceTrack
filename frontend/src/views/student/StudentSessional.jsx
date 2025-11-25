import React, { useState } from "react";

const StudentSessionalMarks = () => {
  // const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  // Mock data — you will replace with API response later
  // const marksData = {
  //   studentName: "Neha Sharma",
  //   rollNumber: "21CSE034",
  //   teacher: "Prof. R. Kumar",
  //   uploadedOn: "15 Nov 2025",
  //   marks: "23/30",
  //   subjectTitle: "Data Structures",
  //   sessionalName: "Sessional 1",
  // };

  const showCard =  semester && subject;

  return (
    <div className="p-6 space-y-6">

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Sessional Marks
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        View and download your sessional marks uploaded by your teachers.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Course Dropdown */}
        {/* <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select Course</option>
          <option value="B.Tech CSE">B.Tech CSE</option>
          <option value="B.Tech ECE">B.Tech ECE</option>
        </select> */}

        {/* Semester Dropdown */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select Semester</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          <option value="3">3rd Semester</option>
          <option value="4">4th Semester</option>
          <option value="5">5th Semester</option>
          <option value="6">5th Semester</option>
          <option value="7">5th Semester</option>
        </select>

        {/* Subject Dropdown */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select Subject</option>
          <option value="DSA">Data Structures</option>
          <option value="DBMS">DBMS</option>
          <option value="OOPS">OOPS</option>
        </select>
      </div>

      {/* Results Card */}
      {showCard && (
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl">

          {/* <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            {marksData.subjectTitle} — {marksData.sessionalName}
          </h3> */}

          {/* <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Student Name:</strong> {marksData.studentName}
            </p>
            <p>
              <strong>Roll Number:</strong> {marksData.rollNumber}
            </p>
            <p>
              <strong>Teacher:</strong> {marksData.teacher}
            </p>
            <p>
              <strong>Uploaded On:</strong> {marksData.uploadedOn}
            </p>
            <p className="text-lg mt-2">
              <strong>Marks Obtained:</strong> {marksData.marks}
            </p>
          </div> */}

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Download Marks
            </button>

            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              Download Solutions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSessionalMarks;
