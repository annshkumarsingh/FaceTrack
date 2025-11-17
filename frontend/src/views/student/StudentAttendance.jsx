import React, { useState, useEffect } from "react"
import { initialAttendanceData } from "../../data/mockData"

export default function StudentAttendance() {

  const [currClass, setCurrClass] = useState({ name: "Data Structures and Algorithms", subject_code: "CE351" });

  useEffect(() => {
    getClass();
  }, []);

  const getPercentage = (attended, total) =>
    total > 0 ? Math.round((attended / total) * 100) : 0

  const getClass = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getclass/${user.id}`);
      const data = await res.json();

      if (data.current_class) {
        setCurrClass({
          name: data.current_class.subject,
          subject_code: data.current_class.subject_code,
        });
      } else {
        setCurrClass({ name: "No class right now", subject_code: "" });
      }

    } catch (err) {
      console.error(err);
    }
  };


  //Attendance system
  const startAttendance = async () => {
    try {
      const res = await fetch("http://localhost:8000/start-attendance", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      alert("Attendance system started!");
    } catch (err) {
      console.error(err);
      alert("Failed to start attendance system");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Current Class:
        </h2>

        <div className="flex items-center gap-10">
          {/* Fetch details about current class and display*/}
          <div className="ml-10 mt-2">
            <h3 className="text-lg font-medium">
              {currClass.name}
            </h3>
            <p>
              {currClass.subject_code}
            </p>
          </div>
          {/* Start the attendance of the current class */}
          <button onClick={startAttendance} className="w-[250px] py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition-opacity">
            Mark Attendance
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Subject-wise Attendance
        </h2>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-5">
          {initialAttendanceData.map((a, idx) => {
            const percent = getPercentage(a.attended, a.total)
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {a.subject}
                  </span>
                  <span
                    className={
                      percent < 75
                        ? "text-red-500 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {percent}% ({a.attended}/{a.total})
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
                  <div
                    className={`h-3 rounded ${percent < 75 ? "bg-red-500" : "bg-green-500"
                      }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
