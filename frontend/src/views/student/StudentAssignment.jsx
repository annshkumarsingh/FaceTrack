import { useState } from "react";

export default function StudentAssignments() {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const handleDownload = () => {
    alert("Downloading answer key... (connect backend)");
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Assignment Answer Keys</h2>

      <div className="space-y-4 w-full max-w-lg">
        
        <select
          className="w-full border p-2 rounded"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          <option>1</option><option>2</option><option>3</option>
          <option>4</option><option>5</option><option>6</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          <option>Maths</option>
          <option>DBMS</option>
          <option>DSA</option>
          <option>OS</option>
        </select>

        <button
          disabled={!semester || !subject}
          onClick={handleDownload}
          className="bg-green-600 text-white p-2 w-full rounded disabled:bg-gray-400"
        >
          Download Answer Key
        </button>
      </div>
    </div>
  );
}
