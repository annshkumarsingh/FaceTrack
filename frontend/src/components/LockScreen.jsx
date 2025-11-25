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
        src="/FaceTrack_Logo.png"
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
              onRegister(email, newUser); // Pass email as first parameter
              // Remove these lines that set registerSuccess view
              // setRole("Student");
              // setResetEmail(email);
              // setView("registerSuccess");
            }}
            onBack={() => setView("actionChoice")}
          />
        );
      case "adminRegisterForm":
        return (
          <AdminRegister
            onRegister={(email, newUser) => {
              onRegister(email, newUser);
              // setRole("Admin");
              // setResetEmail(email);
              // setView("registerSuccess");
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

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800">

//       {/* Header */}
//       <header className="backdrop-blur-md bg-white/20 dark:bg-gray-900/20 border-b border-white/30 dark:border-gray-700/30 shadow-lg sticky top-0 z-20">
//         <div className="container mx-auto flex justify-center items-center gap-6 py-4 px-6">
//           <div className="h-20 w-20 rounded-3xl overflow-hidden shadow-xl ring-2 ring-white/50 dark:ring-gray-700 flex-shrink-0">
//             <img
//               src="/YMCA_Logo.jpg"
//               alt="University Logo"
//               className="h-full w-full object-cover"
//             />
//           </div>

//           <div className="flex flex-col text-gray-900 dark:text-white">
//             <h1 className="text-3xl md:text-3xl font-medium tracking-tight drop-shadow-sm">
//               J.C. Bose University of Science and Technology
//             </h1>
//             <p className="md:text-xl font-medium text-center text-base text-gray-700 dark:text-gray-300 tracking-wide">
//               YMCA, Faridabad
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex flex-1 items-center justify-center px-4 py-14">
//         <div className="relative w-full max-w-xl p-10 rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl">
//           {renderContent && renderContent()}
//         </div>
//       </main>
//     </div>
//   );
// }


return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all">

    {/* Improved Header */}
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border-b border-white/30 dark:border-gray-700/30 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 py-8 px-6">

        {/* Logo */}
        <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/40 dark:ring-gray-700/40 transition hover:scale-105">
          <img
            src="/YMCA_Logo.jpg"
            alt="University Logo"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="text-center text-gray-900 dark:text-white space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            J.C. Bose University of Science and Technology
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300">
            YMCA, Faridabad
          </p>
        </div>

      </div>
    </header>

    {/* Main Content */}
    <main className="flex flex-1 items-center justify-center px-6 py-20">

      <div className="
        w-full max-w-2xl 
        rounded-[45px] 
        p-12
        bg-white/30 dark:bg-gray-800/30 
        backdrop-blur-2xl
        shadow-[0_25px_70px_-10px_rgba(0,0,0,0.25)]
        hover:shadow-[0_35px_90px_-10px_rgba(0,0,0,0.35)]
        transition-all
        border border-white/40 dark:border-gray-700/30
      ">
        {/* Fade-in animation */}
        <div className="animate-[fadeIn_0.7s_ease]">
          {renderContent && renderContent()}
        </div>
      </div>
    </main>
  </div>
);
}