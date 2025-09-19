import React from "react";
import { initialReportsData } from "../../data/mockData"; // .js extension hata diya gaya hai
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function StudentReports() {
  const handleDownload = (report) => {
    alert(`Pretending to download: ${report.name}`);
    // Real application mein yahan file download ka logic aayega
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Download Reports
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {initialReportsData.map((report) => (
            <li
              key={report.id}
              className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {report.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  File Type: {report.type}
                </p>
              </div>
              <button
                onClick={() => handleDownload(report)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}