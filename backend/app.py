from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import User, Schedule
from pydantic import BaseModel, EmailStr
import uvicorn
import bcrypt
import subprocess
import sys
import os
import pandas as pd
import io
from PIL import Image
import pytesseract
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000",  
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# MODELS
# ---------------------------
class UserRegister(BaseModel):
    fullName: str
    rollNumber: str
    course: str
    semester: str
    phone: str
    email: EmailStr
    password: str
    role: str = "Student"
    profilePic: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str  

class ScheduleItem(BaseModel):
    day: str
    time: str
    subject: str
    teacher: str
    course: str | None = None
    semester: str | None = None

# ---------------------------
# PASSWORD HELPERS
# ---------------------------
def prepare_password_for_bcrypt(password: str) -> str:
    """Prepare password for bcrypt by truncating if necessary"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        return password_bytes[:72].decode('utf-8', errors='ignore')
    return password

# ... (keep all your existing routes: home, start-attendance, register, login) ...

# ---------------------------
# UPLOAD SCHEDULE (Excel/CSV/Image)
# ---------------------------
@app.post("/upload-schedule")
async def upload_schedule(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        
        # Handle Excel/CSV files
        if file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(io.BytesIO(contents))
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        
        # Handle image files (PNG, JPG, JPEG)
        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            # Open image
            image = Image.open(io.BytesIO(contents))
            
            # Extract text using OCR
            text = pytesseract.image_to_string(image)
            
            # Save extracted text for admin review
            return {
                "message": "Image uploaded successfully. Please manually enter the schedule data.",
                "extracted_text": text,
                "note": "Image-based schedule upload requires manual data entry. Please use Excel/CSV for automatic import."
            }
        
        else:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file format. Use Excel (.xlsx, .xls), CSV (.csv), or Images (.png, .jpg, .jpeg)"
            )
        
        # Validate required columns for Excel/CSV
        required_columns = ['day', 'time', 'subject', 'teacher']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400, 
                detail=f"Excel/CSV must have columns: {', '.join(required_columns)}"
            )
        
        # Delete existing schedule
        db.query(Schedule).delete()
        
        # Insert new schedule
        for _, row in df.iterrows():
            schedule_entry = Schedule(
                day=str(row['day']).strip(),
                time=str(row['time']).strip(),
                subject=str(row['subject']).strip(),
                teacher=str(row['teacher']).strip(),
                course=str(row.get('course', '')).strip() or None,
                semester=str(row.get('semester', '')).strip() or None
            )
            db.add(schedule_entry)
        
        db.commit()
        
        return {
            "message": "Schedule uploaded successfully",
            "rows_processed": len(df)
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

# ---------------------------
# GET SCHEDULE
# ---------------------------
@app.get("/schedule")
def get_schedule(course: str | None = None, semester: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Schedule)
    
    if course:
        query = query.filter(Schedule.course == course)
    if semester:
        query = query.filter(Schedule.semester == semester)
    
    schedules = query.all()
    
    # Group by day
    schedule_by_day = {}
    for item in schedules:
        day = item.day
        if day not in schedule_by_day:
            schedule_by_day[day] = []
        schedule_by_day[day].append({
            "time": item.time,
            "subject": item.subject,
            "teacher": item.teacher,
            "course": item.course,
            "semester": item.semester
        })
    
    return schedule_by_day

# ---------------------------
# DELETE SCHEDULE
# ---------------------------
@app.delete("/schedule")
def delete_schedule(db: Session = Depends(get_db)):
    db.query(Schedule).delete()
    db.commit()
    return {"message": "All schedules deleted"}

# ---------------------------
# MANUAL SCHEDULE ADD
# ---------------------------
@app.post("/schedule/add")
def add_schedule_manually(schedules: List[ScheduleItem], db: Session = Depends(get_db)):
    try:
        for item in schedules:
            schedule_entry = Schedule(
                day=item.day,
                time=item.time,
                subject=item.subject,
                teacher=item.teacher,
                course=item.course,
                semester=item.semester
            )
            db.add(schedule_entry)
        
        db.commit()
        return {"message": f"{len(schedules)} schedule entries added successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding schedule: {str(e)}")

# ---------------------------
# SERVER START
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
