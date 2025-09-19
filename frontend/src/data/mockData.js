// src/data/mockData.js

// ----------------------------
// University Courses
// ----------------------------
export const universityCourses = [
  "B.Tech - Electronics and Communication Engineering",
  "B.Tech - Electronics and Computer Engineering",
  "B.Tech - Electronics Engineering in Internet of Things",
  "B.Tech - Electrical Engineering",
  "B.Tech - Computer Engineering",
  "B.Tech - Computer Engineering with specialization in Data Science",
  "B.Tech - Mechanical Engineering",
  "B.Tech - Robotics and Artificial Intelligence",
  "B.Tech - Civil Engineering",
  "B.Tech - Information Technology",
  "B.A - Bachelor of Arts",
  "B.Sc - Chemistry",
  "M.Tech - VLSI Design",
  "M.Tech - Computer Engineering",
  "M.Sc. - Physics",
  "MBA - Master of Business Administration",
];

// ----------------------------
// Initial Users (With Passwords)
// ----------------------------
export const initialUsers = {
  // Students
  "22001008024@jcboseust.ac.in": {
    password: "Password@123",
    role: "Student",
    profile: {
      name: "Keshav",
      dob: "2004-10-30",
      coursePeriod: "2022-2026",
      rollNo: "22001008024",
      course: "B.Tech - Electronics and Communication Engineering",
      semester: "7th",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      imageUrl: "/Keshav_Photo.jpeg",
      phone: "+91-9876543210",
      address: "123 University Campus, Faridabad, Haryana",
    },
    attendanceSummary: { overall: 98 },
  },
  "22001008033@jcboseust.ac.in": {
    password: "Password@123",
    role: "Student",
    profile: {
      name: "Neha",
      dob: "2004-05-20",
      coursePeriod: "2022-2026",
      rollNo: "22001008033",
      course: "B.Tech - Computer Engineering",
      semester: "7th",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      imageUrl: "https://placehold.co/150x150/ef4444/ffffff?text=N",
      phone: "+91-9876543211",
      address: "456 Student Hostel, Faridabad, Haryana",
    },
    attendanceSummary: { overall: 72 },
  },
  "22001008008@jcboseust.ac.in": {
    password: "Password@123",
    role: "Student",
    profile: {
      name: "Annsh Kumar Singh",
      dob: "2004-08-15",
      coursePeriod: "2022-2026",
      rollNo: "22001008008",
      course: "B.Tech - Computer Engineering",
      semester: "7th",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      imageUrl: "https://placehold.co/150x150/22c55e/ffffff?text=A",
      phone: "+91-9123456789",
      address: "789 College Road, Faridabad, Haryana",
    },
    attendanceSummary: { overall: 85 },
  },
  "22001008014@jcboseust.ac.in": {
    password: "Password@123",
    role: "Student",
    profile: {
      name: "Balwinder Singh",
      dob: "2003-12-01",
      coursePeriod: "2022-2026",
      rollNo: "22001008014",
      course: "B.Tech - Mechanical Engineering",
      semester: "7th",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      imageUrl: "https://placehold.co/150x150/8b5cf6/ffffff?text=B",
      phone: "+91-9988776655",
      address: "101 Sector 15, Faridabad, Haryana",
    },
    attendanceSummary: { overall: 91 },
  },

  // Admins
  "manju.kumari@jcboseust.ac.in": {
    password: "AdminPassword@123",
    role: "Admin",
    profile: {
      name: "Dr. Manju Kumari",
      dob: "1980-03-10",
      designation: "Assistant Professor",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      department: "Electronics and Communication Engineering",
      imageUrl: "/Manju_Mam_Photo.jpg",
    },
  },
  "amit.kumar@jcboseust.ac.in": {
    password: "AdminPassword@123",
    role: "Admin",
    profile: {
      name: "Dr. Amit Kumar",
      dob: "1975-11-25",
      designation: "Professor",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      department: "Computer Science and Engineering",
      imageUrl: "https://placehold.co/150x150/f97316/ffffff?text=AK",
    },
  },
  "sunita.sharma@jcboseust.ac.in": {
    password: "AdminPassword@123",
    role: "Admin",
    profile: {
      name: "Dr. Sunita Sharma",
      dob: "1982-07-19",
      designation: "Head of Department",
      college:
        "J.C. Bose University of Science and Technology, YMCA, Faridabad",
      department: "Mechanical Engineering",
      imageUrl: "https://placehold.co/150x150/ec4899/ffffff?text=SS",
    },
  },
};
// ----------------------------
// Weekly Schedule
// ----------------------------
export const initialSchedule = {
  Monday: [
    { time: "08:30", subject: "ECE-401: VLSI Design", teacher: "Dr. S. Mehra" },
    { time: "09:30", subject: "ECE-403: Microwave Engg.", teacher: "Dr. V. Singh" },
    { time: "10:30", subject: "CS-401: AI & Machine Learning", teacher: "Prof. R. Kumar" },
  ],
  Tuesday: [
    { time: "09:30", subject: "ECE-403: Microwave Engg.", teacher: "Dr. V. Singh" },
    { time: "14:30", subject: "ECE-411: VLSI Design Lab", teacher: "Mr. A. Garg" },
  ],
  Wednesday: [
    { time: "08:30", subject: "ECE-401: VLSI Design", teacher: "Dr. S. Mehra" },
    { time: "10:30", subject: "ECE-405: Data Communication", teacher: "Ms. P. Sharma" },
  ],
  Thursday: [
    { time: "11:30", subject: "CS-411: AI & ML Lab", teacher: "Prof. R. Kumar" },
    { time: "15:30", subject: "ECE-405: Data Communication", teacher: "Ms. P. Sharma" },
  ],
  Friday: [
    { time: "10:30", subject: "ECE-403: Microwave Engg.", teacher: "Dr. V. Singh" },
    { time: "11:30", subject: "CS-401: AI & Machine Learning", teacher: "Prof. R. Kumar" },
  ],
  Saturday: [
    { time: "10:00", subject: "Major Project Work", teacher: "Project Coordinator" },
  ],
};

// ----------------------------
// Academic & Holiday Calendar
// ----------------------------
export const academicCalendar = [
  { event: "Sessional Exam 1", start: new Date("2025-09-22"), end: new Date("2025-09-26") },
  { event: "Sessional Exam 2", start: new Date("2025-10-27"), end: new Date("2025-10-31") },
  { event: "Practical Exams", start: new Date("2025-11-17"), end: new Date("2025-11-21") },
  { event: "End Semester Exams", start: new Date("2025-12-01"), end: new Date("2025-12-12") },
  { event: "Winter Break", start: new Date("2025-12-13"), end: new Date("2026-01-05") },
];

export const holidayCalendar = [
  { date: "2025-10-02", name: "Gandhi Jayanti" },
  { date: "2025-10-21", name: "Diwali" },
];

// ----------------------------
// Attendance
// ----------------------------
export const initialAttendanceData = [
  { subject: "ECE-401: VLSI Design", total: 25, attended: 18 },
  { subject: "ECE-403: Microwave Engg.", total: 28, attended: 22 },
  { subject: "CS-401: AI & Machine Learning", total: 24, attended: 15 },
  { subject: "ECE-405: Data Communication", total: 22, attended: 19 },
  { subject: "ECE-411: VLSI Design Lab", total: 10, attended: 8 },
  { subject: "CS-411: AI & ML Lab", total: 9, attended: 7 },
];

// ----------------------------
// Reports
// ----------------------------
export const initialReportsData = [
  { id: 1, name: "Monthly Attendance Report - August 2025", type: "PDF" },
  { id: 2, name: "Monthly Attendance Report - July 2025", type: "PDF" },
  { id: 3, name: "Consolidated Attendance (Till Date)", type: "PDF" },
  { id: 4, name: "Academic Calendar 2025-26", type: "PDF" },
  { id: 5, name: "Fee Receipt 2025-26 (Odd Sem)", type: "PDF" },
];

// ----------------------------
// Leave Requests
// ----------------------------
export const initialLeaveRequests = [
  {
    id: 1,
    studentName: "Keshav",
    studentId: "22001008024@jcboseust.ac.in",
    from: "2025-09-15",
    to: "2025-09-16",
    reason: "Family function",
    status: "Approved",
    document: "invitation.pdf",
  },
  {
    id: 2,
    studentName: "Neha",
    studentId: "22001008033@jcboseust.ac.in",
    from: "2025-09-18",
    to: "2025-09-19",
    reason: "Medical Checkup",
    status: "Pending",
    document: "medical_cert.pdf",
  },
  {
    id: 3,
    studentName: "Annsh Kumar Singh",
    studentId: "22001008008@jcboseust.ac.in",
    from: "2025-09-20",
    to: "2025-09-20",
    reason: "Participating in college fest",
    status: "Pending",
    document: "event_pass.pdf",
  },
  {
    id: 4,
    studentName: "Balwinder Singh",
    studentId: "22001008014@jcboseust.ac.in",
    from: "2025-09-11",
    to: "2025-09-12",
    reason: "Sick leave",
    status: "Rejected",
    document: "prescription.pdf",
  },
];

// ----------------------------
// Announcements
// ----------------------------
export const initialAnnouncements = [
  {
    id: 1,
    title: "Mid-Term Exams Schedule",
    content:
      "The mid-term exams will be conducted from Sep 22nd to Sep 26th. The detailed schedule is available in the reports section.",
    date: "2025-09-12",
  },
  {
    id: 2,
    title: "Holiday Announcement: Gandhi Jayanti",
    content:
      "The university will remain closed on October 2nd, 2025 on account of Gandhi Jayanti.",
    date: "2025-09-10",
  },
  {
    id: 3,
    title: "Workshop on AI & Robotics",
    content:
      "A 2-day workshop on AI & Robotics will be held on Sep 18th and 19th. Interested students can register online.",
    date: "2025-09-08",
  },
  {
    id: 4,
    title: "Library Books Return Reminder",
    content:
      "Please return all overdue library books by September 20th to avoid fines. Check your library account for details.",
    date: "2025-09-14",
  },
  {
    id: 5,
    title: "Guest Lecture on VLSI Design Trends",
    content:
      "A guest lecture by Dr. R. Sharma from IIT Delhi is scheduled for September 17th at 11:00 AM in the seminar hall.",
    date: "2025-09-13",
  },
];
