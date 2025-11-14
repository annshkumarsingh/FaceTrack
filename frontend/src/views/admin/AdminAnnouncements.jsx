import React, { useState, useEffect } from "react";
import { PlusIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      alert("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      return alert("Please enter both title and content.");
    }

    setPosting(true);

    try {
      const response = await fetch("http://localhost:5000/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Announcement posted successfully!");
        setAnnouncements([data, ...announcements]);
        setTitle("");
        setContent("");
      } else {
        alert(`❌ Failed to post announcement: ${data.detail}`);
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("Network error. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/announcements/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Announcement deleted successfully");
        setAnnouncements(announcements.filter((a) => a.id !== id));
      } else {
        const data = await response.json();
        alert(`❌ Failed to delete: ${data.detail}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete announcement");
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      return alert("Please enter a title first to give context to the AI.");
    }
    setLoadingAI(true);
    
    // Simple AI-like text generation (you can replace with actual Gemini API)
    const text = `This is an important notice regarding the upcoming ${title}. All students are requested to check the university portal for the detailed schedule and guidelines. Please ensure you have completed all necessary formalities beforehand. For any queries, please contact the administration office during working hours.`;
    
    setContent(text);
    setLoadingAI(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Manage Announcements
      </h2>

      {/* Post New Announcement Form */}
      <form
        onSubmit={handlePost}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Post a New Announcement
        </h3>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Mid-Term Exams Schedule"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
            disabled={posting}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            placeholder="Write the announcement details here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
            disabled={posting}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={posting}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {posting ? "Posting..." : "Post Announcement"}
          </button>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={loadingAI || posting}
            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            {loadingAI ? "Generating..." : "Generate with AI"}
          </button>
        </div>
      </form>

      {/* Announcements List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Posted Announcements
        </h3>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No announcements yet. Post your first announcement above!
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {a.date}
                  </p>
                  <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mt-1">
                    {a.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {a.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-4"
                  title="Delete announcement"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
