import React, { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

const StudentSessionalMarks = () => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [sessionalType, setSessionalType] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [loadingMarks, setLoadingMarks] = useState(false);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [marksRows, setMarksRows] = useState([]);
  const [solutionPath, setSolutionPath] = useState("");
  const [solutionText, setSolutionText] = useState("");
const [solutionQa, setSolutionQa] = useState([]);

  const canFetch = !!course && !!semester && !!sessionalType;

  const fetchMarks = async () => {
    if (!canFetch) return;

    try {
      setLoadingMarks(true);
      const params = new URLSearchParams({
        course,
        semester,
        sessional_type: sessionalType,
      }).toString();

      const res = await fetch(`${API_BASE_URL}/sessionals/marks?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || "Failed to load marks");
        setMarksRows([]);
        return;
      }
      const data = await res.json();
      setMarksRows(data || []);
    } catch (e) {
      console.error(e);
      alert("Error fetching marks");
    } finally {
      setLoadingMarks(false);
    }
  };

  const fetchSolution = async () => {
  if (!canFetch) return;

  try {
    setLoadingSolution(true);
    const params = new URLSearchParams({
      course,
      semester,
      sessional_type: sessionalType,
    }).toString();

    const res = await fetch(`${API_BASE_URL}/sessionals/solution?${params}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.detail || "Solution not found");
      setSolutionText("");
      setSolutionQa([]);
      return;
    }
    const data = await res.json();
    setSolutionText(data.raw_text || "");
    setSolutionQa(data.qa_data || []);
  } catch (e) {
    console.error(e);
    alert("Error fetching solution");
  } finally {
    setLoadingSolution(false);
  }
};

  const filteredRows = subjectFilter
    ? marksRows.filter(
        (r) =>
          r.subject &&
          r.subject.toLowerCase().includes(subjectFilter.toLowerCase())
      )
    : marksRows;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Sessional Marks
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        View sessional marks and download solution sheets.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Course */}
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select Course</option>
          <option value="B.Tech CSE">B.Tech CSE</option>
          <option value="B.Tech ECE">B.Tech ECE</option>
          <option value="BBA">BBA</option>
        </select>

        {/* Semester */}
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
          <option value="6">6th Semester</option>
          <option value="7">7th Semester</option>
          <option value="8">8th Semester</option>
        </select>

        {/* Sessional type */}
        <select
          value={sessionalType}
          onChange={(e) => setSessionalType(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Select Sessional</option>
          <option value="Sessional 1">Sessional 1</option>
          <option value="Sessional 2">Sessional 2</option>
        </select>

        {/* Subject filter (optional) */}
        <input
          type="text"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          placeholder="Filter by subject (optional)"
          className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          disabled={!canFetch || loadingMarks}
          onClick={fetchMarks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {loadingMarks ? "Loading Marks..." : "Load Marks"}
        </button>

        <button
          disabled={!canFetch || loadingSolution}
          onClick={fetchSolution}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-400"
        >
          {loadingSolution ? "Loading Solution..." : "Load Solution PDF"}
        </button>

        {(solutionText || solutionQa.length > 0) && (
  <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl mt-4">
    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
      {course} — {sessionalType} Solution
    </h3>

    {solutionQa.length > 0 ? (
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {solutionQa.map((item, idx) => (
          <li key={idx}>
            <p className="font-semibold">
              Q{item.q_no}. {item.question}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Answer: {item.answer}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm">
        {solutionText}
      </pre>
    )}
  </div>
)}

      </div>

      {/* Marks Results */}
      {filteredRows.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl mt-4">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            {course} — {sessionalType} — Semester {semester}
          </h3>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {filteredRows.map((row, idx) => (
              <div
                key={idx}
                className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0"
              >
                <p>
                  <strong>Roll:</strong> {row.roll_number}
                  {row.student_name ? ` — ${row.student_name}` : ""}
                </p>
                <p>
                  <strong>Subject:</strong> {row.subject || "N/A"}
                </p>
                <p>
                  <strong>Marks:</strong> {row.marks}
                  {row.max_marks ? ` / ${row.max_marks}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {canFetch && !loadingMarks && filteredRows.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No marks found for the selected filters.
        </p>
      )}
    </div>
  );
};

export default StudentSessionalMarks;
