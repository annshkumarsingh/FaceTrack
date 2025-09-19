import React, { useState } from "react"

export default function StudentProfile({ user, onLogout }) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(user.profile)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setEditing(false)
    alert("Profile updated locally (not saved to server in this prototype).")
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        My Profile
      </h2>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="h-32 w-32 rounded-full border object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Roll No:</strong> {profile.rollNo}
          </p>
          <p>
            <strong>Course:</strong> {profile.course}
          </p>
          <p>
            <strong>Semester:</strong> {profile.semester}
          </p>
          <p>
            <strong>College:</strong> {profile.college}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input-field w-48"
              />
            ) : (
              profile.phone
            )}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {editing ? (
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="input-field w-64"
              />
            ) : (
              profile.address || "Not set"
            )}
          </p>

          <div className="flex gap-4 mt-4">
            {editing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}