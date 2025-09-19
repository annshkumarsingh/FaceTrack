import React, { useState } from "react";

// --- Icon Components ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.111 2.458.311M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.75 4.75l14.5 14.5" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// --- Mock Data ---
const universityCourses = [ "Computer Engineering", "Electronics Engineering", "Mechanical Engineering", "Civil Engineering", "Biotechnology" ];
const initialUsers = {
    "student@jcboseust.ac.in": { role: "Student" },
    "admin@jcboseust.ac.in": { role: "Admin" },
};


// --- AdminRegister Component (Integrated) ---
const AdminRegister = ({ onBack, onRegister }) => {
  const [form, setForm] = useState({ fullName: "", designation: "", department: "", email: "", password: "", confirmPassword: "", profilePic: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validatePassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { setErrors({ ...errors, profilePic: "File size cannot exceed 2MB." }); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePic: reader.result });
        if (errors.profilePic) { const newErrors = { ...errors }; delete newErrors.profilePic; setErrors(newErrors); }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.designation.trim()) newErrors.designation = "Designation is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.email.endsWith("@jcboseust.ac.in")) newErrors.email = "Must be an official @jcboseust.ac.in email";
    if (!validatePassword(form.password)) newErrors.password = "Password must be 8+ characters, with uppercase, lowercase, number, and special character.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.profilePic) newErrors.profilePic = "Profile picture is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) { onRegister(form.email, { ...form, role: "admin" }); }
  };
  
  const getInputClass = (fieldName) => `w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors[fieldName] ? 'border-red-500 ring-red-500' : 'border-gray-300'}`;

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Registration</h3>
      <div className="flex flex-col items-center space-y-2">
          <label className="block font-semibold text-gray-600 mb-1">Profile Picture <span className="text-red-500">*</span></label>
          <label htmlFor="profilePicInput" className="cursor-pointer">
              <img src={form.profilePic || 'https://placehold.co/100x100/EFEFEF/3B82F6?text=Upload'} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 hover:border-blue-500 transition"/>
          </label>
          <input id="profilePicInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {errors.profilePic && <p className="text-red-500 text-sm">{errors.profilePic}</p>}
      </div>
      <div>
        <label className="block font-semibold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
        <input type="text" placeholder="Enter full name" className={getInputClass('fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}/>
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block font-semibold text-gray-600 mb-1">Designation <span className="text-red-500">*</span></label>
        <input type="text" placeholder="e.g. Assistant Professor" className={getInputClass('designation')} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}/>
        {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
      </div>
       <div>
        <label className="block font-semibold text-gray-600 mb-1">Department <span className="text-red-500">*</span></label>
        <input type="text" placeholder="e.g. Computer Engineering" className={getInputClass('department')} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}/>
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
      </div>
      <div>
        <label className="block font-semibold text-gray-600 mb-1">Admin Email <span className="text-red-500">*</span></label>
        <input type="email" placeholder="official.email@jcboseust.ac.in" className={getInputClass('email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block font-semibold text-gray-600 mb-1">Password <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" className={getInputClass('password') + " pr-10"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block font-semibold text-gray-600 mb-1">Confirm Password <span className="text-red-500">*</span></label>
        <div className="relative">
          <input type={showConfirm ? "text" : "password"} placeholder="Re-enter password" className={getInputClass('confirmPassword') + " pr-10"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}/>
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
      <div className="flex items-center justify-between pt-4">
        <button type="button" className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition" onClick={onBack}>Back</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition">Register</button>
      </div>
    </form>
  );
};


// --- Main Auth Page Component ---
export default function AuthPage({ onLogin, onRegister }) {
  const [view, setView] = useState("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&_])[A-Za-z\d@$!%?&_]{8,}$/;
    if (!regex.test(pass)) { setPasswordError("Password must be 8+ chars with uppercase, lowercase, number, and special char."); return false; }
    setPasswordError("");
    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) { setProfilePicPreview(URL.createObjectURL(e.target.files[0])); }
  };

  const handleStudentRegister = (e) => {
    e.preventDefault();
    if (!validatePassword(password)) return;
    if (!email.endsWith("@jcboseust.ac.in")) { setError("Registration only allowed with @jcboseust.ac.in email IDs"); return; }
    setError("");
    const form = new FormData(e.target);
    const newUser = { role: "Student", profile: { name: form.get("fullName"), rollNo: form.get("rollNo"), course: form.get("course"), semester: form.get("semester"), imageUrl: profilePicPreview || `https://placehold.co/150x150/0d6efd/ffffff?text=${form.get("fullName")?.charAt(0) || "U"}`, phone: form.get("phone"), address: "" }, attendanceSummary: { overall: 100 } };
    onRegister(email, newUser);
    setSuccessMessage(`Student account for ${email} created! Please login.`);
    setView("success");
  };
  
  const handleAdminRegister = (email, formData) => {
      onRegister(email, formData);
      setSuccessMessage(`Admin account for ${email} created! Please login.`);
      setView("success");
  };

  const handleLogin = (e, role) => {
    e.preventDefault();
    const user = initialUsers[email];
    if (user && user.role === role) { onLogin(user); } 
    else { setError(`Invalid credentials or not a valid ${role.toLowerCase()} account.`); }
  };
  
  const renderContent = () => {
    switch (view) {
        case "registerStudent":
        return (
          <form onSubmit={handleStudentRegister} className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Student Registration</h3>
            <div className="flex justify-center">
              <label htmlFor="profilePicUpload" className="cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed">
                  {profilePicPreview ? <img src={profilePicPreview} className="w-full h-full rounded-full object-cover"/> : <CameraIcon />}
                </div>
                <input id="profilePicUpload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input name="fullName" className="w-full border rounded-lg p-3" type="text" required />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Roll Number <span className="text-red-500">*</span></label>
                <input name="rollNo" className="w-full border rounded-lg p-3" type="text" required />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">College Email <span className="text-red-500">*</span></label>
                <input name="email" onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-3" type="email" required/>
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-600 mb-1">Course <span className="text-red-500">*</span></label>
                <select name="course" className="w-full border rounded-lg p-3 bg-white" required>
                  <option value="">Select Course</option>
                  {universityCourses.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Semester <span className="text-red-500">*</span></label>
                <input name="semester" className="w-full border rounded-lg p-3" type="text" required />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input name="phone" className="w-full border rounded-lg p-3" type="tel" required />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Password <span className="text-red-500">*</span></label>
              <input className="w-full border rounded-lg p-3" type="password" value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }} required/>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" type="submit">Register</button>
            <p className="text-center text-sm mt-4">
              <button type="button" onClick={() => setView("registerSelection")} className="font-semibold text-blue-600 hover:text-blue-800">&larr; Back</button>
            </p>
          </form>
        );
      case "registerAdmin":
          return <AdminRegister onBack={() => setView("registerSelection")} onRegister={handleAdminRegister} />;
      case "registerSelection":
        return (
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Registration Type</h3>
                <div className="space-y-4">
                    <button onClick={() => setView("registerStudent")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Register as Student</button>
                    <button onClick={() => setView("registerAdmin")} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">Register as Admin</button>
                     <p className="text-center text-sm mt-4"><button type="button" onClick={() => setView("initial")} className="font-semibold text-blue-600 hover:text-blue-800">&larr; Back</button></p>
                </div>
            </div>
        );
      case "loginStudent":
        return (
          <form onSubmit={(e) => handleLogin(e, "Student")} className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Student Login</h3>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">College Email</label>
              <input onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-3" type="email" placeholder="student@jcboseust.ac.in" required/>
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Password</label>
              <input className="w-full border rounded-lg p-3" type="password" required />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" type="submit">Sign In</button>
            <p className="text-center text-sm mt-4"><button type="button" onClick={() => setView("loginSelection")} className="font-semibold text-blue-600 hover:text-blue-800">&larr; Back</button></p>
          </form>
        );
     case "loginAdmin":
        return (
          <form onSubmit={(e) => handleLogin(e, "Admin")} className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Login</h3>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Admin Email</label>
              <input onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-3" type="email" placeholder="admin@jcboseust.ac.in" required/>
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Password</label>
              <input className="w-full border rounded-lg p-3" type="password" required />
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg" type="submit">Sign In</button>
            <p className="text-center text-sm mt-4"><button type="button" onClick={() => setView("loginSelection")} className="font-semibold text-blue-600 hover:text-blue-800">&larr; Back</button></p>
          </form>
        );
      case "loginSelection":
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Login Type</h3>
            <div className="space-y-4">
              <button onClick={() => setView("loginStudent")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Login as Student</button>
              <button onClick={() => setView("loginAdmin")} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">Login as Admin</button>
              <p className="text-center text-sm mt-4"><button type="button" onClick={() => setView("initial")} className="font-semibold text-blue-600 hover:text-blue-800">&larr; Back</button></p>
            </div>
          </div>
        );
      case "success":
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
                <p className="text-gray-700 mb-6">{successMessage}</p>
                <button onClick={() => setView("loginSelection")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Proceed to Login</button>
            </div>
        );
      case "initial":
      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome</h3>
            <div className="space-y-4">
              <button onClick={() => setView("loginSelection")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Login</button>
              <button onClick={() => setView("registerSelection")} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg">Register</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <img src="https://upload.wikimedia.org/wikipedia/en/3/37/J.C._Bose_University_of_Science_and_Technology%2C_YMCA_logo.png" alt="University Logo" className="h-16 mx-auto mb-6"/>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {renderContent()}
      </div>
    </div>
  );
}
