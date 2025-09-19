import React, { useState } from "react";
import { initialAnnouncements } from "../../data/mockData"; // .js extension hata diya gaya hai
// import { callGeminiAPI } from "../../utils/api"; // Assuming this exists
import { PlusIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please enter both title and content.");

    const newAnn = {
      id: announcements.length + 1,
      title,
      content,
      date: new Date().toISOString().slice(0, 10),
    };
    setAnnouncements([newAnn, ...announcements]);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const handleGenerateAI = async () => {
    if (!title) return alert("Please enter a title first to give context to the AI.");
    setLoadingAI(true);
    // const prompt = `Write a professional university announcement with the title: "${title}".`;
    // const text = await callGeminiAPI(prompt);
    // Using dummy text for now as API might not be set up
    const text = `This is an important notice regarding the upcoming ${title}. All students are requested to check the university portal for the detailed schedule and guidelines. Please ensure you have completed all necessary formalities beforehand.`;
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Mid-Term Exams Schedule"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
          <textarea
            id="content"
            placeholder="Write the announcement details here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post Announcement
          </button>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={loadingAI}
            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
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
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {a.date}
                </p>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  {a.title}
                </h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{a.content}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

