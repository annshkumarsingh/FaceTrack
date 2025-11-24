#📌 FaceTrack – Smart Attendance System

A full-stack AI-enabled smart attendance and academic management system designed for university environments. FaceTrack automates attendance using DeepFace-based face detection & recognition (local version), while also providing schedule management, leave management, announcements, sessional marks, assignment uploads, and student dashboards.

🔗 ###Live Frontend: https://facetrack-ai.vercel.app

🔗 ###Live Backend: https://facetrack-lia6.onrender.com

⚠️ ###Note:
Due to FastAPI + DeepFace model limitations on Render free tier, attendance marking (face recognition) is available only in the localhost version, not in the deployed version.
All other modules work perfectly in both versions.

📌 🚀 #Features
✅ ##Student Features

Face-based attendance (available in localhost version)

View daily & subject-wise attendance logs

View academic calendar & weekly class schedule

View sessional marks & assignment marks

Download assignment solutions uploaded by admin

Apply for leave & track leave status

Access announcements from admin/faculty

Manage profile (photo, address, phone, etc.)

✅ ##Admin Features

Approve/reject student leave requests

Upload weekly timetable via Excel / CSV

Upload scanned timetable images (OCR extraction supported)

Upload sessional marks, assignment marks, and assignment solutions

Manage students (view, search, remove)

Post announcements

View platform-wide dashboard stats

✔️ ##AI/ML Components

DeepFace-based:

Face Detection

Face Alignment

Face Verification (one-to-one matching)

📌 ##Architecture Overview
Localhost Version (Full System)
React Frontend (localhost) 
      ↓
FastAPI Server (localhost)
      ↓
Supabase / Neon PostgreSQL Database


This version supports real-time face attendance using DeepFace.

##Deployed Version (Live)
React Frontend (Vercel)
      ↓
FastAPI Backend (Render)
      ↓
Neon PostgreSQL Database


Supports all features except attendance marking (DeepFace heavy models not supported on Render free tier).

📌 🛠️ #Technology Stack
#Frontend

React.js

React Router DOM

Tailwind CSS

Heroicons

Fetch API

LocalStorage API

Vercel (deployment)

Backend

FastAPI

Uvicorn

DeepFace

Pydantic

Pandas (Excel/CSV timetable parsing)

OpenPyXL

Render (deployment)

Database

PostgreSQL

Supabase (local version / development DB)

Neon (production / deployed DB)

📌 📁 #Project Structure
FaceTrack/
│── frontend/
│   ├── src/
│   ├── components/
│   ├── views/
│   ├── utils/
│   └── styles/
│── backend/
│   ├── app/
│   ├── routers/
│   ├── models/
│   ├── database/
│   └── services/
└── README.md

📌 🌐 #Deployment URLs
Component	Platform	URL
Frontend	Vercel	https://facetrack-ai.vercel.app

Backend	Render	https://facetrack-lia6.onrender.com

Local Backend	Localhost	http://localhost:8000
📌 🔐 #Environment Variables
##Frontend (.env)
VITE_GEMINI_API_KEY=AIzaSyDGCvM-9DqR0l0bSSCvWknIjc4EhBKTXVM
VITE_BACKEND_URL=http://localhost:8000
VITE_HEADLESS=False

##Backend (.env)

Supabase:

POSTGRE_DATABASE_URL=postgresql://postgres:Aiattendance%40123@db.wuavfrozdmexfccjkyxf.supabase.co:5432/postgres


Neon:

POSTGRE_DATABASE_URL=postgresql://neondb_owner:npg_A7weVhEvc8Kk@ep-tiny-block-a48hy462-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require


General:

BACKEND_URL=http://localhost:8000
HEADLESS=False

📌 🧪 #Running the Project Locally
1️⃣ ##Clone the Repo
git clone https://github.com/annshkumarsingh/FaceTrack
cd FaceTrack

2️⃣ ##Run Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Backend will run at:

http://localhost:8000

3️⃣ ##Run Frontend
cd frontend
npm install
npm run dev


Frontend will run at:

http://localhost:5173

📌 📤 #API Documentation

Once backend is running locally, view interactive documentation:

Swagger UI:

http://localhost:8000/docs


ReDoc:

http://localhost:8000/redoc

📌 📄 #Modules Overview
✔ ##Attendance Module

Webcam capture → backend (base64)

DeepFace verification

If matched → attendance saved in DB

✔ ##Schedule Module

Upload Excel/CSV

Auto-parse using Pandas

Optional image upload → OCR → manual entry

✔ ##Leave Management

Students apply

Admin approves/rejects

Status updates in dashboard

✔ ##Marks & Assignments Module

Admin uploads:

Sessional marks

Assignment marks

Assignment solutions (PDF/images)

Students view/download

✔ ##Announcement Module

Admin posts updates

Students view chronologically

📌 🤝 #Contributors

Annsh Kumar Singh

Balwinder Singh

Keshav

Neha

📌 📜 #License

This project is open-source. You may use it for learning, research, or academic purposes.
