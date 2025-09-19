import React from "react";
import {
  HomeIcon,
  CalendarIcon,
  CheckCircleIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  EnvelopeIcon,
  UsersIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({
  role,
  activeView,
  setActiveView,
  isSidebarOpen,
}) {
  const studentMenu = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "schedule", label: "Schedule", icon: CalendarIcon },
    { id: "attendance", label: "Attendance", icon: CheckCircleIcon },
    { id: "reports", label: "Reports", icon: DocumentChartBarIcon },
    { id: "leave", label: "Leave", icon: EnvelopeIcon },
    { id: "profile", label: "Profile", icon: UserCircleIcon },
  ];

  const adminMenu = [
    { id: "dashboard", label: "Dashboard", icon: PresentationChartBarIcon },
    { id: "manage-students", label: "Manage Students", icon: UsersIcon },
    { id: "manage-schedule", label: "Manage Schedule", icon: CalendarIcon },
    { id: "leave-approvals", label: "Leave Approvals", icon: CheckCircleIcon },
    { id: "announcements", label: "Announcements", icon: EnvelopeIcon },
    { id: "profile", label: "Profile", icon: UserCircleIcon },
  ];

  const menu = role === "Admin" ? adminMenu : studentMenu;

  return (
    <aside
      className={
        "bg-gray-800 text-gray-100 flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden " +
        (isSidebarOpen ? "w-64" : "w-0")
      }
    >
      {/* Background color wapas dark kar diya hai aur logo hata diya hai */}
      <div className="h-16 flex items-center justify-center px-4 font-bold text-lg border-b border-gray-700 whitespace-nowrap">
        <span>FaceTrack</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {menu.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={
              "flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap " +
              (activeView === id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300")
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

