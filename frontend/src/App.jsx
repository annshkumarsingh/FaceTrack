import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Views (Paths fixed with extensions)
import LockScreen from "./components/LockScreen.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// Student Views
import StudentDashboard from "./views/student/StudentDashboard.jsx";
import StudentProfile from "./views/student/StudentProfile.jsx";
import StudentSchedule from "./views/student/StudentSchedule.jsx";
import StudentAttendance from "./views/student/StudentAttendance.jsx";
import StudentReports from "./views/student/StudentReports.jsx";
import StudentLeave from "./views/student/StudentLeave.jsx";

// Admin Views
import AdminDashboard from "./views/admin/AdminDashboard.jsx";
import AdminManageSchedule from "./views/admin/AdminManageSchedule.jsx";
import AdminLeaveApprovals from "./views/admin/AdminLeaveApprovals.jsx";
import AdminAnnouncements from "./views/admin/AdminAnnouncements.jsx";
import AdminStudentProfiles from "./views/admin/AdminStudentProfiles.jsx";
import AdminProfile from "./views/admin/AdminProfile.jsx";

// Mock Data
import { initialUsers } from "./data/mockData.js";

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = (email, password, role) => {
    const user = users[email];
    if (user && user.password === password && user.role === role) {
      setCurrentUser({ ...user, email });
      setActiveView("dashboard");
      return true;
    }
    return false;
  };

  const handleRegister = (email, newUser) => {
    if (users[email]) {
      alert("This email is already registered!");
      return;
    }
    const userWithEmail = { ...newUser, email };
    setUsers(prevUsers => ({
      ...prevUsers,
      [email]: userWithEmail,
    }));
    setCurrentUser(userWithEmail);
    setActiveView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newDarkMode;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const DashboardLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        role={currentUser.role}
        activeView={activeView}
        setActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          user={currentUser}
          onLogout={handleLogout}
          onToggleTheme={toggleDarkMode}
          setActiveView={setActiveView}
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );

  const renderView = () => {
    if (!currentUser) return null;

    if (currentUser.role === "Student") {
      switch (activeView) {
        case "dashboard": return <StudentDashboard user={currentUser} />;
        case "profile": return <StudentProfile user={currentUser} onLogout={handleLogout} />;
        case "schedule": return <StudentSchedule />;
        case "attendance": return <StudentAttendance />;
        case "reports": return <StudentReports />;
        case "leave": return <StudentLeave user={currentUser}/>;
        default: return <StudentDashboard user={currentUser} />;
      }
    }

    if (currentUser.role === "Admin") {
      switch (activeView) {
        case "dashboard": return <AdminDashboard user={currentUser} setActiveView={setActiveView} />;
        case "manage-students": return <AdminStudentProfiles />;
        case "manage-schedule": return <AdminManageSchedule />;
        case "leave-approvals": return <AdminLeaveApprovals />;
        case "announcements": return <AdminAnnouncements />;
        case "profile": return <AdminProfile user={currentUser} onLogout={handleLogout} />;
        default: return <AdminDashboard user={currentUser} setActiveView={setActiveView} />;
      }
    }
    return null;
  };

  const AppRoutes = () => {
    if (!currentUser) {
      return (
        <Routes>
          <Route path="*" element={<LockScreen onLogin={handleLogin} onRegister={handleRegister} />} />
        </Routes>
      );
    }

    const dashboardPath = currentUser.role === "Student" ? "/dashboard" : "/admin-dashboard";

    return (
      <Routes>
        <Route path="/" element={<Navigate to={dashboardPath} />} />
        <Route path={dashboardPath} element={<DashboardLayout>{renderView()}</DashboardLayout>} />
        <Route path="*" element={<Navigate to={dashboardPath} />} />
      </Routes>
    );
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

