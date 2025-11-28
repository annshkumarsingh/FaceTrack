
## FaceTrack - Smart Attendance System
A full-stack web platform for automated attendance, academic workflow management, and student–admin collaboration.
## Description

𝐅𝐚𝐜𝐞𝐓𝐫𝐚𝐜𝐤 – 𝐒𝐦𝐚𝐫𝐭 𝐀𝐭𝐭𝐞𝐧𝐝𝐚𝐧𝐜𝐞 𝐒𝐲𝐬𝐭𝐞𝐦 is a university-level digital platform that automates attendance using 𝐟𝐚𝐜𝐞 𝐝𝐞𝐭𝐞𝐜𝐭𝐢𝐨𝐧 & 𝐟𝐚𝐜𝐞 𝐫𝐞𝐜𝐨𝐠𝐧𝐢𝐭𝐢𝐨𝐧 (local version) and centralizes academic workflows such as timetables, marks, assignments, announcements, and leave management.

The system includes:

✔ React frontend (Vercel)

✔ FastAPI backend (Render)

✔ PostgreSQL database (Supabase / Neon)

✔ Local AI-powered attendance using DeepFace

✔ Deployed academic management system for daily use

It is scalable, secure, institution-ready, and designed to eliminate proxy attendance while improving transparency and automation.
## Badges

![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)


## Features

🎓 𝐒𝐭𝐮𝐝𝐞𝐧𝐭 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬

• View subject-wise & day-wise attendance

• View weekly schedule

• Download attendance reports

• View sessional marks & assignment marks

• Download assignment solutions

• Apply for leave & track status

• View announcements

• Manage profile details

🧑‍💼 𝐀𝐝𝐦𝐢𝐧 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬

• Upload timetables (Excel/CSV)

• Upload sessional & assignment marks

• Upload assignment solutions

• Post announcements

• Approve/Reject leave requests

• Manage student profiles

• View attendance logs

🤖 𝐀𝐈-𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐀𝐭𝐭𝐞𝐧𝐝𝐚𝐧𝐜𝐞 (𝐋𝐨𝐜𝐚𝐥 𝐕𝐞𝐫𝐬𝐢𝐨𝐧)

• DeepFace-based face detection & recognition

• Automatic attendance marking

• Real-time verification logs 

☁️ 𝐂𝐥𝐨𝐮𝐝 𝐃𝐞𝐩𝐥𝐨𝐲𝐦𝐞𝐧𝐭 (𝐎𝐧𝐥𝐢𝐧𝐞 𝐌𝐨𝐝𝐞)

• All academic features enabled

• Attendance via face recognition disabled on free-tier Render 
## Tech Stack

𝐅𝐫𝐨𝐧𝐭𝐞𝐧𝐝

React.js (SPA)

Tailwind CSS

Heroicons

𝐁𝐚𝐜𝐤𝐞𝐧𝐝

FastAPI

Uvicorn

DeepFace (local)

Pandas, OpenPyXL

𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞

PostgreSQL (Supabase Local / Neon Cloud)

𝐃𝐞𝐩𝐥𝐨𝐲𝐦𝐞𝐧𝐭

Frontend → Vercel

Backend → Render

DB → Neon / Supabase

## Architecture

𝐇𝐢𝐠𝐡-𝐥𝐞𝐯𝐞𝐥 𝐰𝐨𝐫𝐤𝐟𝐥𝐨𝐰:

• User authenticates (Student/Admin)

• Role-based dashboards

• REST API communication

• Attendance via DeepFace (local)

• Admin uploads timetables, marks, assignments

• Students view data from PostgreSQL

• Cloud deployment for non-AI modules
## Installation

𝐏𝐫𝐞𝐫𝐞𝐪𝐮𝐢𝐬𝐢𝐭𝐞𝐬

Node.js ≥ 16

Python ≥ 3.9

PostgreSQL

Git

𝐂𝐥𝐨𝐧𝐞 𝐑𝐞𝐩𝐨

```bash
git clone https://github.com/annshkumarsingh/FaceTrack
cd FaceTrack
```

𝐅𝐫𝐨𝐧𝐭𝐞𝐧𝐝 𝐒𝐞𝐭𝐮𝐩
```arduino
cd frontend
npm install
npm run dev
```
𝐒𝐞𝐭 𝐞𝐧𝐯𝐢𝐫𝐨𝐧𝐦𝐞𝐧𝐭 𝐯𝐚𝐫𝐢𝐚𝐛𝐥𝐞𝐬:
```ini
VITE_BACKEND_URL=http://localhost:8000
```

## Usage/Examples

🧑‍🎓 𝐒𝐭𝐮𝐝𝐞𝐧𝐭

• Login → Dashboard

• View Attendance → View Reports

• Open Weekly Schedule

• Download Assignments & Marks

• Apply for Leave

🧑‍💼 𝐀𝐝𝐦𝐢𝐧

• Login → Admin Dashboard

• Manage Students

• Upload Timetable (Excel/CSV)

• Upload Marks / Assignment Solutions

• Post Announcements

• Approve Leave Requests

🤖 Local AI Attendance
```markdown
1. Open /attendance
2. Allow webcam access
3. Capture face → API call
4. DeepFace verification
5. Attendance stored in DB
```
## Deployment

𝐅𝐫𝐨𝐧𝐭𝐞𝐧𝐝 (𝐕𝐞𝐫𝐜𝐞𝐥)

• Connect GitHub repo

• Add environment variables

• Deploy automatically

𝐁𝐚𝐜𝐤𝐞𝐧𝐝 (𝐑𝐞𝐧𝐝𝐞𝐫)

• Create web service

• Use Python Build & Start commands

• Add environment variables

• Use Neon PostgreSQL URL

## Contributors

• 𝐀𝐧𝐧𝐬𝐡 𝐊𝐮𝐦𝐚𝐫 𝐒𝐢𝐧𝐠𝐡

• 𝐁𝐚𝐥𝐰𝐢𝐧𝐝𝐞𝐫 𝐒𝐢𝐧𝐠𝐡

• 𝐊𝐞𝐬𝐡𝐚𝐯

• 𝐍𝐞𝐡𝐚

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Footer
