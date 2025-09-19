import React from "react";
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon, // Logout ke liye naya icon
  Bars3Icon, // Hamburger menu ke liye
} from "@heroicons/react/24/outline";

export default function Header({
  user,
  onLogout,
  onToggleTheme,
  setActiveView, // Profile par navigate karne ke liye
  toggleSidebar, // Sidebar ko toggle karne ke liye
  darkMode,
}) {
  // Dono student aur admin ke liye profile se naam nikalne ka logic
  const userName = user?.profile?.name || "User";

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 shadow-sm flex-shrink-0">
      <div className="flex items-center">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {user?.role === "Admin" ? "Admin Portal" : "Student Portal"}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => alert("All notifications will be shown here!")}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
          aria-label="View notifications"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 block w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Profile link (image aur naam par click karne se kaam karega) */}
          <button
            onClick={() => setActiveView("profile")}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              src={user?.profile?.imageUrl || `https://placehold.co/32x32/EFEFEF/3B82F6?text=${userName.charAt(0)}`}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/32x32/EFEFEF/3B82F6?text=${userName.charAt(0)}` }}
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {userName}
            </span>
          </button>
          
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

