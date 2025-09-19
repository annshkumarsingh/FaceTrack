import React, { useState, useMemo } from "react";
import { initialUsers } from "../../data/mockData"; // .js extension hata diya gaya hai
import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AdminStudentProfiles() {
  const allStudents = useMemo(() => 
    Object.values(initialUsers).filter((user) => user.role === 'Student'), 
    []
  );

  const [students, setStudents] = useState(allStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setStudents(allStudents);
    } else {
      const filteredStudents = allStudents.filter(
        (student) =>
          student.profile.name.toLowerCase().includes(term) ||
          student.profile.rollNo.toLowerCase().includes(term)
      );
      setStudents(filteredStudents);
    }
  };
  
  const handleDelete = (rollNo) => {
    if (window.confirm(`Are you sure you want to delete student with Roll No: ${rollNo}? This action cannot be undone.`)) {
        // This is a mock delete. In a real app, you would make an API call.
        alert(`Student with Roll No: ${rollNo} has been deleted (mock).`);
        setStudents(students.filter(s => s.profile.rollNo !== rollNo));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Manage Student Profiles
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={student.profile.imageUrl} 
                            alt={student.profile.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/EFEFEF/3B82F6?text=${student.profile.name.charAt(0)}` }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.profile.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.profile.rollNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.profile.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="inline-flex items-center p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <EyeIcon className="h-5 w-5"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(student.profile.rollNo)}
                        className="inline-flex items-center p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <TrashIcon className="h-5 w-5"/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No students found.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

