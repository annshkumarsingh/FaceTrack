import React, { useState } from "react";
import LoginForm from "./LoginForm";
import StudentRegister from "./StudentRegister";
import AdminRegister from "./AdminRegister";
import ResetPassword from "./ResetPassword";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function LockScreen({ onLogin, onRegister, users }) {
  const [view, setView] = useState("roleChoice");
  const [role, setRole] = useState(null);
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotPassword = (email) => {
    setResetEmail(email);
    setView("resetForm");
  };

  const RoleChoiceScreen = () => (
    <div className="text-center w-full">
      <img
        src="/public/FaceTrack_Logo.png"
        alt="FaceTrack Logo"
        className="h-24 w-24 mx-auto mb-4"
      />
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
        Welcome to FaceTrack!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        To get started, please select your role.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => {
            setRole("Student");
            setView("actionChoice");
          }}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
        >
          Student
        </button>
        <button
          onClick={() => {
            setRole("Admin");
            setView("actionChoice");
          }}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
        >
          Admin
        </button>
      </div>
    </div>
  );

  const ActionChoiceScreen = () => (
    <div className="w-full">
      <button
        onClick={() => setView("roleChoice")}
        className="absolute top-6 left-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:text-white">
          Welcome, {role}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please login or register to continue.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setView("loginForm")}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() =>
              setView(
                role === "Student" ? "studentRegisterForm" : "adminRegisterForm"
              )
            }
            className="w-full py-3 rounded-lg bg-gray-600 text-white font-semibold shadow-md hover:bg-gray-700 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderContent = () => {
    switch (view) {
      case "roleChoice":
        return <RoleChoiceScreen />;
      case "actionChoice":
        return <ActionChoiceScreen />;
      case "loginForm":
        return (
          <LoginForm
            role={role}
            onLogin={onLogin}
            onBack={() => setView("actionChoice")}
            onForgotPassword={handleForgotPassword}
          />
        );
      case "studentRegisterForm":
        return (
          <StudentRegister
            onRegister={(email, newUser) => {
              onRegister(newUser);
              setRole("Student");
              setResetEmail(email);
              setView("registerSuccess");
            }}
            onBack={() => setView("actionChoice")}
          />
        );
      case "adminRegisterForm":
        return (
          <AdminRegister
            onRegister={(email, newUser) => {
              onRegister(newUser);
              setRole("Admin");
              setResetEmail(email);
              setView("registerSuccess");
            }}
            onBack={() => setView("actionChoice")}
          />
        );
      case "registerSuccess":
        return <RegisterSuccess />;
      case "resetForm":
        return (
          <ResetPassword
            email={resetEmail}
            onBack={() => setView("loginForm")}
          />
        );
      default:
        return <RoleChoiceScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-blue-800 text-white p-4 flex items-center justify-center shadow-md w-full top-0 z-10">
        <div className="h-20 w-20 mr-4 rounded-xl bg-white overflow-hidden">
          <img
            src="/public/YMCA_Logo.jpg"
            alt="University Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">
          J.C. Bose University of Science and Technology, YMCA, Faridabad
        </h1>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}