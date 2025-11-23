import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MegaphoneIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { initialLeaveRequests, initialUsers } from "../../data/mockData.js";

export default function AdminDashboard({ user, setActiveView }) {
  const [todayClasses, setTodayClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  const backend_url = import.meta.env.VITE_BACKEND_URL

  // Fetch today's classes for the teacher
  const fetchTodayClasses = async () => {
    try {
      const res = await fetch(`${backend_url}/getclasses/${user.id}`);
      const data = await res.json();
      setTodayClasses(data.classes || []);
      if (data.classes && data.classes.length > 0) {
        let currClass = null;
        for (let i = 0; i < data.classes.length; i++) {
          // Convert the fetched time to valid date-time format
          const class_start_hour = parseInt(data.classes[i].time.slice(0, 2));
          const class_end_hour = class_start_hour + 1;
          const class_start_minutes = data.classes[i].time.slice(3, 5)

          // Fetch current date-time value
          const now = new Date();
          const now_hour = parseInt(now.getHours());
          const now_minutes = parseInt(now.getMinutes());
          
          if ((now_hour > class_start_hour || (now_hour==class_start_hour && now_minutes>=class_start_minutes)) && now_hour < class_end_hour) currClass = data.classes[i]
        }
        if (!selectedClass) setSelectedClass(currClass || data.classes[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayClasses();
  }, []);

  // Attendance system
  const startAttendance = async () => {
    if (!selectedClass) {
      alert("Please select a class first!");
      return;
    }
    try {
      const res = await fetch(`${backend_url}/start-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: selectedClass.course, semester: selectedClass.semester }),
      });
      const data = await res.json();
      alert("Attendance system started!");
    } catch (err) {
      console.error(err);
      alert("Failed to start attendance system");
    }
  };

  const getDashboardStats = () => {
    const pendingLeaves = initialLeaveRequests.filter(
      (req) => req.status === "Pending"
    ).length;
    const totalStudents = Object.values(initialUsers).filter(
      (user) => user.role === "Student"
    ).length;
    return { pendingLeaves, totalStudents };
  };
  const stats = getDashboardStats();
  const adminName = user?.name || "Admin";

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

    {
  title: "Manage Sessionals",
  value: "Upload Marks and Answer Key",
  icon: DocumentArrowUpIcon,
  color: "bg-red-500",
  view: "sessionals",
},

  {
  title: "Manage Assignments",
  value: "Upload Marks and Answer key",
  icon: DocumentArrowUpIcon,
  color: "bg-pink-500",
  view: "assignments",
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

      {/* Quick Actions */}
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

      {/* Mark Attendance */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Classes for Today:
        </h2>

        {loading ? (
          <p className="font-medium text-gray-500">
            Loading your classes for today...
          </p>
        ) : todayClasses.length === 0 ? (
          <p className="font-medium text-gray-500">
            No classes scheduled for today.
          </p>
        ) : (
          <div className="flex items-center gap-6">
            <select
              value={selectedClass?.id || ""}
              onChange={(e) => {
                const cls = todayClasses.find(c => c.id === parseInt(e.target.value));
                setSelectedClass(cls);
              }}

              className="p-2 rounded-lg border dark:bg-gray-700 dark:text-gray-200"
            >
              {todayClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subject} ({cls.time})
                </option>
              ))}
            </select>

            <button
              onClick={startAttendance}
              className="w-[250px] py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
            >
              Start Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
