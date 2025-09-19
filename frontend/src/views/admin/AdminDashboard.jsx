import React from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
// Path ko theek kar diya gaya hai
import { initialLeaveRequests, initialUsers } from "../../data/mockData.js";

// Yeh ek helper function hai jo data count karega
const getDashboardStats = () => {
  const pendingLeaves = initialLeaveRequests.filter(
    (req) => req.status === "Pending"
  ).length;
  const totalStudents = Object.values(initialUsers).filter(
    (user) => user.role === "Student"
  ).length;
  return { pendingLeaves, totalStudents };
};

export default function AdminDashboard({ user, setActiveView }) {
  const stats = getDashboardStats();
  const adminName = user?.profile?.name || "Admin";

  const summaryCards = [
    {
      title: "Leave Approvals",
      value: `${stats.pendingLeaves} Pending`,
      icon: CheckBadgeIcon,
      color: "bg-yellow-500",
      view: "leave-approvals",
    },
    {
      title: "Manage Students",
      value: `${stats.totalStudents} Students`,
      icon: UsersIcon,
      color: "bg-blue-500",
      view: "manage-students",
    },
    {
      title: "Manage Schedule",
      value: "View & Update",
      icon: CalendarDaysIcon,
      color: "bg-green-500",
      view: "manage-schedule",
    },
    {
      title: "Announcements",
      value: "Create & View",
      icon: MegaphoneIcon,
      color: "bg-purple-500",
      view: "announcements",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Welcome, {adminName}!
      </h2>

      <p className="text-gray-600 dark:text-gray-400 -mt-4">
        Here's a summary of the portal. Click on a card to navigate.
      </p>

      {/* Clickable Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <button
            key={card.view}
            onClick={() => setActiveView(card.view)}
            className={`p-6 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col items-start ${card.color}`}
          >
            <card.icon className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-bold">{card.title}</h3>
            <p className="text-sm opacity-90">{card.value}</p>
          </button>
        ))}
      </div>

      {/* Ek chhota sa "Quick Actions" section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveView("announcements")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Post an Announcement
          </button>
          <button
            onClick={() => setActiveView("manage-students")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
          >
            View Student List
          </button>
        </div>
      </div>
    </div>
  );
}

