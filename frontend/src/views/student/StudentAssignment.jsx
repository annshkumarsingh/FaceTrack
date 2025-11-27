import { useState } from "react";

const API_BASE_URL = "http://localhost:8000"; // or your deployed backend

export default function StudentAssignments() {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [qaData, setQaData] = useState([]);

  const handleDownload = async () => {
    if (!semester || !subject) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        semester,
        subject,
        // exam_type: "Sessional 1", // if you later add dropdown
      }).toString();

      const res = await fetch(`${API_BASE_URL}/answer-keys?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || "No answer key found");
        setQaData([]);
        return;
      }

      const data = await res.json();
      setQaData(data.qa_data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch answer key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl px-7 font-bold text-gray-900 dark:text-gray-100">
        Check Answers
      </h2>
      <div className="space-y-4 w-full max-w-lg m-6">
        <select
          className="w-full border p-2 rounded"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          <option>1</option><option>2</option><option>3</option>
          <option>4</option><option>5</option><option>6</option>
          <option>7</option><option>8</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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

        <button
          disabled={!semester || !subject || loading}
          onClick={handleDownload}
          className="bg-blue-600 text-white p-2 w-full rounded disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Load Answer Key"}
        </button>
      </div>

      {qaData.length > 0 && (
        <div className="mt-4 px-7">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Answer Key
          </h3>
          <ul className="space-y-3">
            {qaData.map((item) => (
              <li key={item.q_no} className="border rounded p-3 bg-white dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Q{item.q_no}. {item.question}
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  Answer: {item.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
