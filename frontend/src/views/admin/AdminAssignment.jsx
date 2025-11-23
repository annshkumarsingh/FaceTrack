import { useState } from "react";

export default function AdminAssignments() {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Upload Assignment Answer Key</h2>

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

        <div className="border-2 border-dashed p-6 rounded text-center">
          <input
            type="file"
            className="hidden"
            id="upload"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="upload" className="cursor-pointer">
            {file ? (
              <span className="font-medium">Selected: {file.name}</span>
            ) : (
              <span className="text-gray-600">
                Drag & Drop File or Click to Upload (PDF/DOCX)
              </span>
            )}
          </label>
        </div>

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Upload Answer Key
        </button>
      </div>
    </div>
  );
}
