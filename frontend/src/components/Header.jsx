import React, { useEffect, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function Header({
  user,
  onLogout,
  onToggleTheme,
  setActiveView,
  toggleSidebar,
  darkMode,
}) {

  const [profile, setProfile] = useState(user);

  const backend_url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!user || !user.id) return;
    if (profile && profile.fetched) return;
    fetch(`${backend_url}/profile/id/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
        localStorage.setItem("user", JSON.stringify(data))
      })
      .catch((err) => console.log(err))
  }, [user.id])


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
          {/* Profile link */}
          <button
            onClick={() => setActiveView("profile")}
            className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              src={profile?.profile_pic || `https://placehold.co/32x32/EFEFEF/3B82F6?text=${profile.name.charAt(0)}`}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/32x32/EFEFEF/3B82F6?text=${profile.name.charAt(0)}` }}
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {profile.name}
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

