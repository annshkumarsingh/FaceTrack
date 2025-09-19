import React from "react";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  CakeIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon, // Logout ke liye icon
} from "@heroicons/react/24/outline";

// Logout button ke liye 'onLogout' prop add kiya gaya hai
export default function AdminProfile({ user, onLogout }) {
  const adminDetails = [
    {
      label: "Designation",
      value: user?.profile?.designation || "Not Available",
      icon: BriefcaseIcon,
    },
    {
      label: "Department",
      value: user?.profile?.department || "Not Available",
      icon: BuildingOffice2Icon,
    },
    { label: "Email", value: user?.email || "Not Available", icon: EnvelopeIcon },
    {
      label: "Phone",
      value: user?.profile?.phone || "Not Available",
      icon: PhoneIcon,
    },
    {
      label: "Date of Birth",
      value: user?.profile?.dob || "Not Available",
      icon: CakeIcon,
    },
  ];

  const adminName = user?.profile?.name || "Admin User";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Admin Profile
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Profile Header section ko update kiya gaya hai */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user?.profile?.imageUrl || `https://placehold.co/128x128/EFEFEF/3B82F6?text=${adminName.charAt(0)}`}
            alt="Admin Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/128x128/EFEFEF/3B82F6?text=${adminName.charAt(0)}` }}
          />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {adminName}
            </h3>
            <p className="text-md text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
            {/* Edit aur Logout buttons add kiye gaye */}
            <div className="mt-4 flex justify-center sm:justify-start space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              <button 
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {adminDetails.map((detail) => (
              <div key={detail.label} className="sm:col-span-1 flex items-start">
                <detail.icon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-md font-semibold text-gray-900 dark:text-gray-100">
                    {detail.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

