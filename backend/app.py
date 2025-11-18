from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import User, Class, Schedule, Announcement, Attendance ,LeaveRequest
from datetime import datetime 
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

class UserUpdate(BaseModel):
    phone: str | None = None

class AttendanceCreate(BaseModel):
    student_id: int
    class_id: int
    status: str = "present"







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
# HOME PAGE
# ---------------------------
@app.get("/")
def home():
    html_content = '''
    <html>
        <body>
            <h2>AI Attendance System</h2>
            <form action="/start-attendance" method="post">
                <button type="submit" style="padding: 10px 20px; font-size: 16px;">Start Attendance</button>
            </form>
        </body>
    </html>
    '''
    return HTMLResponse(content=html_content)


# ---------------------------
# START ATTENDANCE
# ---------------------------
@app.post("/start-attendance")
def start_attendance():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(base_dir, "Face_Recognition", "face_rec.py")

        if not os.path.exists(script_path):
            raise FileNotFoundError(f"Could not find: {script_path}")

        # ✅ Use the same Python executable as the running FastAPI app
        python_executable = sys.executable

        print(f"Running: {script_path}")
        print(f"Python path: {python_executable}")

        subprocess.Popen([python_executable, script_path])
        return JSONResponse(content={"status": "started", "message": "Attendance system launched"})

    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


# ---------------------------
# MARK ATTENDANCE
# ---------------------------   
@app.post("/attendance")
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    try:
        entry = Attendance(
            student_id=data.student_id,
            class_id=data.class_id,
            status=data.status
        )

        db.add(entry)
        db.commit()
        db.refresh(entry)

        return {
            "success": True,
            "entry": {
                "id": entry.id,
                "student_id": entry.student_id,
                "class_id": entry.class_id,
                "status": entry.status,
                "marked_at": entry.marked_at
            }
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

# ---------------------------
# GET ATTENDANCE
# --------------------------- 
@app.get("/attendance")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).order_by(Attendance.marked_at.desc()).all()

    return [
        {
            "id": r.id,
            "student_id": r.student_id,
            "class_id": r.class_id,
            "status": r.status,
            "marked_at": r.marked_at,
            "student_name": r.student.full_name if r.student else None,
            "class_name": r.class_.name if r.class_ else None
        }
        for r in records
    ]

# --------------------------- 
# GET STUDENT BY ROLL NUMBER
# --------------------------- 
@app.get("/getstudent/rollnum/{roll_num}")
def get_student(roll_num: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.roll_number == roll_num).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.full_name}


# ---------------------------
# REGISTER
# ---------------------------
@app.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered")

    if user.role == "Student" and user.rollNumber and user.rollNumber != "N/A":
        existing_roll = db.query(User).filter(User.roll_number == user.rollNumber).first()
        if existing_roll:
            raise HTTPException(status_code=400, detail="Roll number already exists")

    prepared_password = prepare_password_for_bcrypt(user.password)
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(prepared_password.encode('utf-8'), salt).decode('utf-8')

    roll_number_value = None
    if user.role == "Student" and user.rollNumber and user.rollNumber != "N/A":
        roll_number_value = user.rollNumber

    new_user = User(
        full_name=user.fullName,
        roll_number=roll_number_value,
        course=user.course,
        semester=user.semester,
        phone=user.phone,
        email=user.email,
        password=hashed_pw,
        profile_pic=user.profilePic,
        role=user.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration successful",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.full_name,
            "role": new_user.role,
        },
    }


# ---------------------------
# LOGIN
# ---------------------------
@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    existingUser = db.query(User).filter(User.email == user.email).first()
    if not existingUser:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    prepared_password = prepare_password_for_bcrypt(user.password)
    if not bcrypt.checkpw(prepared_password.encode('utf-8'), existingUser.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "id": existingUser.id,
            "email": existingUser.email,
            "name": existingUser.full_name,
            "role": existingUser.role,
            "roll_number": existingUser.roll_number,
            "course": existingUser.course,
            "semester": existingUser.semester,
            "department": getattr(existingUser, 'department', None),
            "designation": getattr(existingUser, 'designation', None)
        }
    }



# ---------------------------
# GET USER PROFILE
# ---------------------------
@app.get("/profile/id/{user_id}")
def get_profile_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "roll_number": user.roll_number,
        "course": user.course,
        "semester": user.semester,
        "phone": user.phone,
        "department": getattr(user, "department", None),
        "designation": getattr(user, "designation", None),
        "profile_pic": user.profile_pic,
        "role": user.role,
        "college": getattr(user, "college", "YMCA"),
        "address": getattr(user, "address", None),
    }


# ---------------------------
# UPDATE USER PROFILE
# ---------------------------
@app.put("/profile/id/{user_id}")
def update_profile(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields if provided
    if update.phone is not None:
        user.phone = update.phone

    db.commit() 
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "roll_number": user.roll_number,
        "course": user.course,
        "semester": user.semester,
        "phone": user.phone,
        "department": getattr(user, "department", None),
        "designation": getattr(user, "designation", None),
        "profile_pic": user.profile_pic,
        "role": user.role,
        "college": getattr(user, "college", "YMCA"),
        "address": getattr(user, "address", None),
    }


# ---------------------------
# GET CLASS
# ---------------------------
@app.get("/getclass/{user_id}")
def get_current_class(user_id: int, db: Session = Depends(get_db)):
    # Get user details
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Determine today's weekday
    today = datetime.now().strftime("%A")

    # Get current time in "HH:MM"
    current_time = datetime.now().strftime("%H:%M")

    # Query matching schedule row
    schedule = db.query(Schedule).filter(
        Schedule.day == today,
        Schedule.course == user.course,
        Schedule.semester == user.semester,
        Schedule.time == current_time
    ).first()

    if not schedule:
        return {"message": "No class right now", "current_class": None}

    # Fetch class_code/class_id from Class table
    class_info = db.query(Class).filter(Class.subject == schedule.subject).first()

    return {
        "message": "Current class found",
        "current_class": {
            "subject": schedule.subject,
            "teacher": schedule.teacher,
            "time": schedule.time,
            "day": schedule.day,
            "subject_code": class_info.subject_code if class_info else None,
            "class_id": class_info.id if class_info else None
        }
    }





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
    # Get all schedules
    all_schedules = db.query(Schedule).all()
    
    # Filter by course if provided
    if course:
        # Normalize the search term
        search_term = course.replace(" ", "").replace("-", "").replace(".", "").lower()
        
        filtered_schedules = [
            s for s in all_schedules
            if s.course and search_term in s.course.replace(" ", "").replace("-", "").replace(".", "").lower()
        ]
    else:
        filtered_schedules = all_schedules
    
    # Filter by semester if provided
    if semester:
        filtered_schedules = [
            s for s in filtered_schedules
            if s.semester and str(s.semester) == str(semester)
        ]
    
    # Group by day
    schedule_by_day = {}
    for item in filtered_schedules:
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





class AnnouncementCreate(BaseModel):
    title: str
    content: str

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    date: str
    
    class Config:
        from_attributes = True


# ---------------------------
# CREATE ANNOUNCEMENT
# ---------------------------
@app.post("/announcements", response_model=AnnouncementResponse)
def create_announcement(announcement: AnnouncementCreate, db: Session = Depends(get_db)):
    try:
        # Get current date in YYYY-MM-DD format
        current_date = datetime.utcnow().strftime("%Y-%m-%d")
        
        new_announcement = Announcement(
            title=announcement.title,
            content=announcement.content,
            date=current_date
        )
        
        db.add(new_announcement)
        db.commit()
        db.refresh(new_announcement)
        
        return new_announcement
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating announcement: {str(e)}")

# ---------------------------
# GET ALL ANNOUNCEMENTS
# ---------------------------
@app.get("/announcements", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    return announcements

# ---------------------------
# GET SINGLE ANNOUNCEMENT
# ---------------------------
@app.get("/announcements/{announcement_id}", response_model=AnnouncementResponse)
def get_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement

# ---------------------------
# DELETE ANNOUNCEMENT
# ---------------------------
@app.delete("/announcements/{announcement_id}")
def delete_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    db.delete(announcement)
    db.commit()
    
    return {"message": "Announcement deleted successfully"}

# ---------------------------
# UPDATE ANNOUNCEMENT (Optional)
# ---------------------------
@app.put("/announcements/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int, 
    announcement: AnnouncementCreate, 
    db: Session = Depends(get_db)
):
    existing = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    existing.title = announcement.title
    existing.content = announcement.content
    
    db.commit()
    db.refresh(existing)
    
    return existing





class LeaveRequestCreate(BaseModel):
    from_date: str  # YYYY-MM-DD format
    to_date: str    # YYYY-MM-DD format
    reason: str
    teacher_name: str | None = None
    document: str | None = None

class LeaveRequestResponse(BaseModel):
    id: int
    student_id: int
    student_name: str
    student_email: str
    teacher_name: str | None
    from_date: str
    to_date: str
    reason: str
    document: str | None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ---------------------------
# CREATE LEAVE REQUEST
# ---------------------------
@app.post("/leave-requests")
def create_leave_request(
    request: LeaveRequestCreate,
    student_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Get student details
        student = db.query(User).filter(User.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Create leave request
        new_request = LeaveRequest(
            student_id=student_id,
            student_name=student.full_name,
            student_email=student.email,
            teacher_name=request.teacher_name,
            from_date=request.from_date,
            to_date=request.to_date,
            reason=request.reason,
            document=request.document,
            status="Pending"
        )
        
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        
        return {
            "message": "Leave request submitted successfully",
            "request": {
                "id": new_request.id,
                "student_name": new_request.student_name,
                "from_date": str(new_request.from_date),
                "to_date": str(new_request.to_date),
                "reason": new_request.reason,
                "teacher_name": new_request.teacher_name,
                "status": new_request.status
            }
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating leave request: {str(e)}")

# ---------------------------
# GET STUDENT'S LEAVE REQUESTS
# ---------------------------
@app.get("/leave-requests/student/{student_id}")
def get_student_leave_requests(student_id: int, db: Session = Depends(get_db)):
    requests = db.query(LeaveRequest).filter(
        LeaveRequest.student_id == student_id
    ).order_by(LeaveRequest.created_at.desc()).all()
    
    return [
        {
            "id": r.id,
            "from": str(r.from_date),
            "to": str(r.to_date),
            "reason": r.reason,
            "teacher_name": r.teacher_name,
            "document": r.document or "No document",
            "status": r.status,
            "created_at": r.created_at
        }
        for r in requests
    ]

# ---------------------------
# GET ALL LEAVE REQUESTS (Admin)
# ---------------------------
@app.get("/leave-requests")
def get_all_leave_requests(status: str | None = None, db: Session = Depends(get_db)):
    query = db.query(LeaveRequest)
    
    if status:
        query = query.filter(LeaveRequest.status == status)
    
    requests = query.order_by(LeaveRequest.created_at.desc()).all()
    
    return [
        {
            "id": r.id,
            "student_id": r.student_id,
            "student_name": r.student_name,
            "student_email": r.student_email,
            "teacher_name": r.teacher_name,
            "from": str(r.from_date),
            "to": str(r.to_date),
            "reason": r.reason,
            "document": r.document,
            "status": r.status,
            "created_at": r.created_at
        }
        for r in requests
    ]

# ---------------------------
# UPDATE LEAVE REQUEST STATUS (Admin)
# ---------------------------
@app.put("/leave-requests/{request_id}/status")
def update_leave_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    if status not in ["Pending", "Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    leave_request.status = status
    db.commit()
    
    return {"message": f"Leave request {status.lower()}", "status": status}

# ---------------------------
# DELETE LEAVE REQUEST
# ---------------------------
@app.delete("/leave-requests/{request_id}")
def delete_leave_request(request_id: int, db: Session = Depends(get_db)):
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()
    
    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    db.delete(leave_request)
    db.commit()
    
    return {"message": "Leave request deleted successfully"}

# ---------------------------
# GET AVAILABLE TEACHERS (for dropdown)
# ---------------------------
@app.get("/teachers")
def get_teachers(db: Session = Depends(get_db)):
    teachers = db.query(User).filter(User.role == "Admin").all()
    
    return [
        {
            "id": t.id,
            "name": t.full_name,
            "department": t.department,
            "designation": t.designation
        }
        for t in teachers
    ]






# ---------------------------
# SERVER START
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

