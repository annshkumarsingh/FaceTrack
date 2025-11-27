from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import (
    User,
    Class,
    Schedule,
    Announcement,
    Attendance,
    LeaveRequest,
    Assignment,
    StudentMarks,
    AnswerKey,
    SessionalMarks,
    SessionalSolution,
)
from datetime import datetime, date
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
from typing import List, Optional
from dotenv import load_dotenv
from routers.admin_routes import router as admin_router
import re
import pdfplumber


from database.database import Base, engine
Base.metadata.create_all(bind=engine)


origins = [
    "https://facetrack-ai.vercel.app",
    "http://localhost:5173",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)

load_dotenv()
backend_url = os.getenv("BACKEND_URL")


# ---------------------------
# Pydantic MODELS
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


class AttendanceStartRequest(BaseModel):
    course: str
    semester: str


class AttendanceCreate(BaseModel):
    student_id: int
    class_id: int
    status: str = "present"


# Answer-key Pydantic models
class QAItem(BaseModel):
    q_no: int
    question: str
    answer: str


class AnswerKeyCreate(BaseModel):
    course: Optional[str] = None
    semester: str
    subject: str
    exam_type: Optional[str] = None
    qa_data: List[QAItem]


class AnswerKeyResponse(BaseModel):
    id: int
    course: Optional[str]
    semester: str
    subject: str
    exam_type: Optional[str]
    qa_data: List[QAItem]
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------
# PASSWORD HELPERS
# ---------------------------
def prepare_password_for_bcrypt(password: str) -> str:
    """Prepare password for bcrypt by truncating if necessary"""
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        return password_bytes[:72].decode("utf-8", errors="ignore")
    return password


# ---------------------------
# ANSWER-KEY TEXT PARSER
# ---------------------------
def parse_qa_from_text(text: str) -> List[dict]:
    """
    Simple parser expecting format like:

    1) Question text
    Ans: answer text

    2) Next question...
    Ans: ...
    """
    blocks = re.split(r"\n\s*\d+[\).\-]\s*", text)
    qa_list: List[dict] = []
    q_no = 1

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        parts = re.split(r"(Ans:|Answer:)", block, maxsplit=1, flags=re.IGNORECASE)
        if len(parts) >= 3:
            question_text = parts[0].strip()
            answer_text = parts[2].strip()
        else:
            question_text = block
            answer_text = ""

        qa_list.append(
            {
                "q_no": q_no,
                "question": question_text,
                "answer": answer_text,
            }
        )
        q_no += 1

    return qa_list


# ---------------------------
# HOME PAGE
# ---------------------------
@app.get("/")
def home():
    html_content = """
    <html>
        <body>
            <h2>AI Attendance System</h2>
            <form action="/start-attendance" method="post">
                <button type="submit" style="padding: 10px 20px; font-size: 16px;">Start Attendance</button>
            </form>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)


# ---------------------------
# START ATTENDANCE
# ---------------------------
@app.post("/start-attendance")
def start_attendance(payload: AttendanceStartRequest):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(base_dir, "Face_Recognition", "face_rec.py")

        if not os.path.exists(script_path):
            raise FileNotFoundError(f"Could not find: {script_path}")

        python_executable = sys.executable

        print(f"Running: {script_path}")
        print(f"Python path: {python_executable}")

        subprocess.Popen([python_executable, script_path, payload.course, payload.semester])
        return JSONResponse(content={"status": "started", "message": "Attendance system launched"})

    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


# ---------------------------
# MARK ATTENDANCE
# ---------------------------
@app.post("/attendance")
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    try:
        today = date.today()

        existing_entry = (
            db.query(Attendance)
            .filter(
                Attendance.student_id == data.student_id,
                Attendance.class_id == data.class_id,
                func.date(Attendance.marked_at) == today,
            )
            .first()
        )

        if existing_entry:
            return {
                "success": False,
                "message": "Attendance already marked for this student in this class today.",
            }

        entry = Attendance(
            student_id=data.student_id,
            class_id=data.class_id,
            status=data.status,
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
                "marked_at": entry.marked_at,
            },
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
            "class_name": r.class_.name if r.class_ else None,
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
        raise HTTPException(
            status_code=400,
            detail=f"This email is already registered as {existing.role}",
        )

    if user.role == "Student" and user.rollNumber and user.rollNumber != "N/A":
        existing_roll = db.query(User).filter(User.roll_number == user.rollNumber).first()
        if existing_roll:
            raise HTTPException(status_code=400, detail="Roll number already exists")

    prepared_password = prepare_password_for_bcrypt(user.password)
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(prepared_password.encode("utf-8"), salt).decode("utf-8")

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

    return {"message": "User registered successfully", "user": new_user}


# ---------------------------
# LOGIN
# ---------------------------
@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    existingUser = db.query(User).filter(User.email == user.email).first()
    if not existingUser:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    prepared_password = prepare_password_for_bcrypt(user.password)
    if not bcrypt.checkpw(prepared_password.encode("utf-8"), existingUser.password.encode("utf-8")):
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
            "department": getattr(existingUser, "department", None),
            "designation": getattr(existingUser, "designation", None),
        },
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
@app.get("/getclasses/{user_id}")
def get_current_class(user_id: int, db: Session = Depends(get_db)):
    teacher = db.query(User).filter(User.id == user_id, User.role == "Admin").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    teacher_name = teacher.full_name
    today = datetime.now().strftime("%A")

    schedule = (
        db.query(Schedule)
        .filter(Schedule.teacher == teacher_name, Schedule.day == today)
        .all()
    )

    if not schedule:
        return {"message": "No class right now", "current_class": None}

    classes = [
        {
            "id": s.id,
            "subject": s.subject,
            "teacher": s.teacher,
            "time": s.time,
            "day": s.day,
            "course": s.course,
            "semester": s.semester,
        }
        for s in schedule
    ]

    return {"classes": classes}


# ---------------------------
# UPLOAD SCHEDULE (Excel/CSV/Image)
# ---------------------------
@app.post("/upload-schedule")
async def upload_schedule(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()

        if file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(contents))
        elif file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image)
            return {
                "message": "Image uploaded successfully. Please manually enter the schedule data.",
                "extracted_text": text,
                "note": "Image-based schedule upload requires manual data entry. Please use Excel/CSV for automatic import.",
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Use Excel (.xlsx, .xls), CSV (.csv), or Images (.png, .jpg, .jpeg)",
            )

        required_columns = ["day", "time", "subject", "teacher"]
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400,
                detail=f"Excel/CSV must have columns: {', '.join(required_columns)}",
            )

        db.query(Schedule).delete()

        for _, row in df.iterrows():
            schedule_entry = Schedule(
                day=str(row["day"]).strip(),
                time=str(row["time"]).strip(),
                subject=str(row["subject"]).strip(),
                teacher=str(row["teacher"]).strip(),
                course=str(row.get("course", "")).strip() or None,
                semester=str(row.get("semester", "")).strip() or None,
            )
            db.add(schedule_entry)

        db.commit()

        return {
            "message": "Schedule uploaded successfully",
            "rows_processed": len(df),
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# ---------------------------
# GET SCHEDULE
# ---------------------------
@app.get("/schedule")
def get_schedule(
    course: str | None = None, semester: str | None = None, db: Session = Depends(get_db)
):
    all_schedules = db.query(Schedule).all()

    if course:
        search_term = course.replace(" ", "").replace("-", "").replace(".", "").lower()
        filtered_schedules = [
            s
            for s in all_schedules
            if s.course
            and search_term
            in s.course.replace(" ", "").replace("-", "").replace(".", "").lower()
        ]
    else:
        filtered_schedules = all_schedules

    if semester:
        filtered_schedules = [
            s
            for s in filtered_schedules
            if s.semester and str(s.semester) == str(semester)
        ]

    schedule_by_day: dict[str, list] = {}
    for item in filtered_schedules:
        day = item.day
        if day not in schedule_by_day:
            schedule_by_day[day] = []
        schedule_by_day[day].append(
            {
                "time": item.time,
                "subject": item.subject,
                "teacher": item.teacher,
                "course": item.course,
                "semester": item.semester,
            }
        )

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
                semester=item.semester,
            )
            db.add(schedule_entry)

        db.commit()
        return {"message": f"{len(schedules)} schedule entries added successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding schedule: {str(e)}")


# ---------------------------
# ANNOUNCEMENTS
# ---------------------------
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


@app.post("/announcements", response_model=AnnouncementResponse)
def create_announcement(announcement: AnnouncementCreate, db: Session = Depends(get_db)):
    try:
        current_date = datetime.utcnow().strftime("%Y-%m-%d")

        new_announcement = Announcement(
            title=announcement.title,
            content=announcement.content,
            date=current_date,
        )

        db.add(new_announcement)
        db.commit()
        db.refresh(new_announcement)

        return new_announcement

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating announcement: {str(e)}")


@app.get("/announcements", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    announcements = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    return announcements


@app.get("/announcements/{announcement_id}", response_model=AnnouncementResponse)
def get_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement


@app.delete("/announcements/{announcement_id}")
def delete_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()

    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    db.delete(announcement)
    db.commit()

    return {"message": "Announcement deleted successfully"}


@app.put("/announcements/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int, announcement: AnnouncementCreate, db: Session = Depends(get_db)
):
    existing = db.query(Announcement).filter(Announcement.id == announcement_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found")

    existing.title = announcement.title
    existing.content = announcement.content

    db.commit()
    db.refresh(existing)

    return existing


# ---------------------------
# LEAVE REQUESTS
# ---------------------------
class LeaveRequestCreate(BaseModel):
    from_date: str
    to_date: str
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


@app.post("/leave-requests")
def create_leave_request(
    request: LeaveRequestCreate,
    student_id: int,
    db: Session = Depends(get_db),
):
    try:
        student = db.query(User).filter(User.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        new_request = LeaveRequest(
            student_id=student_id,
            student_name=student.full_name,
            student_email=student.email,
            teacher_name=request.teacher_name,
            from_date=request.from_date,
            to_date=request.to_date,
            reason=request.reason,
            document=request.document,
            status="Pending",
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
                "status": new_request.status,
            },
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating leave request: {str(e)}")


@app.get("/leave-requests/student/{student_id}")
def get_student_leave_requests(student_id: int, db: Session = Depends(get_db)):
    requests = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.student_id == student_id)
        .order_by(LeaveRequest.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "from": str(r.from_date),
            "to": str(r.to_date),
            "reason": r.reason,
            "teacher_name": r.teacher_name,
            "document": r.document or "No document",
            "status": r.status,
            "created_at": r.created_at,
        }
        for r in requests
    ]


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
            "created_at": r.created_at,
        }
        for r in requests
    ]


@app.put("/leave-requests/{request_id}/status")
def update_leave_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    if status not in ["Pending", "Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave_request.status = status
    db.commit()

    return {"message": f"Leave request {status.lower()}", "status": status}


@app.delete("/leave-requests/{request_id}")
def delete_leave_request(request_id: int, db: Session = Depends(get_db)):
    leave_request = db.query(LeaveRequest).filter(LeaveRequest.id == request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    db.delete(leave_request)
    db.commit()

    return {"message": "Leave request deleted successfully"}


@app.get("/teachers")
def get_teachers(db: Session = Depends(get_db)):
    teachers = db.query(User).filter(User.role == "Admin").all()

    return [
        {
            "id": t.id,
            "name": t.full_name,
            "department": t.department,
            "designation": t.designation,
        }
        for t in teachers
    ]


# ---------------------------
# ANSWER KEYS: UPLOAD IMAGE (TEACHER)
# ---------------------------
@app.post("/answer-keys/upload-image", response_model=AnswerKeyResponse)
async def upload_answer_key_image(
    semester: str,
    subject: str,
    exam_type: str | None = None,
    course: str | None = None,
    teacher_id: int | None = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Teacher uploads an image of an answer key.
    Backend OCRs -> parses -> stores structured QA JSON.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        text = pytesseract.image_to_string(image)

        qa_list = parse_qa_from_text(text)
        if not qa_list:
            raise HTTPException(
                status_code=400,
                detail="Could not parse any Q/A from image. Please check the format.",
            )

        existing = (
            db.query(AnswerKey)
            .filter(
                AnswerKey.semester == semester,
                AnswerKey.subject == subject,
                AnswerKey.exam_type == exam_type,
            )
            .first()
        )

        if existing:
            existing.course = course
            existing.qa_data = qa_list
            existing.uploaded_by = teacher_id
        else:
            existing = AnswerKey(
                course=course,
                semester=semester,
                subject=subject,
                exam_type=exam_type,
                qa_data=qa_list,
                uploaded_by=teacher_id,
            )
            db.add(existing)

        db.commit()
        db.refresh(existing)
        return existing

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error processing answer key image: {str(e)}"
        )


# ---------------------------
# ANSWER KEYS: FETCH (STUDENT)
# ---------------------------
@app.get("/answer-keys", response_model=AnswerKeyResponse)
def get_answer_key(
    semester: str,
    subject: str,
    exam_type: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Student fetches answer key for given semester + subject (+ optional exam_type).
    """
    query = db.query(AnswerKey).filter(
        AnswerKey.semester == semester,
        AnswerKey.subject == subject,
    )
    if exam_type:
        query = query.filter(AnswerKey.exam_type == exam_type)

    answer_key = query.order_by(AnswerKey.created_at.desc()).first()
    if not answer_key:
        raise HTTPException(status_code=404, detail="Answer key not found")

    return answer_key




@app.post("/sessionals/upload-marks")
async def upload_sessional_marks(
    course: str,
    semester: str,
    sessional_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a CSV/XLSX with columns: roll_number, name, marks[, max_marks]
    Stores rows in sessional_marks.
    """
    try:
        contents = await file.read()

        # Read CSV/XLSX
        if file.filename.endswith(".xlsx") or file.filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(contents))
        elif file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Use Excel (.xlsx, .xls) or CSV (.csv)",
            )

        required_cols = ["roll_number", "name", "marks"]
        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required column: {col} (required: {', '.join(required_cols)})",
                )

        # Optional max_marks column
        has_max = "max_marks" in df.columns

        inserted = 0
        for _, row in df.iterrows():
            roll = str(row["roll_number"]).strip()
            name = str(row["name"]).strip()
            try:
                m = float(row["marks"])
            except Exception:
                continue

            max_m = None
            if has_max:
                try:
                    max_m = float(row["max_marks"])
                except Exception:
                    max_m = None

            # Try to link to User by roll_number
            student = (
                db.query(User)
                .filter(User.roll_number == roll)
                .first()
            )

            mark_entry = SessionalMarks(
                course=course,
                semester=str(semester),
                sessional_type=sessional_type,
                subject=None,
                student_id=student.id if student else None,
                roll_number=roll,
                student_name=name,
                marks=m,
                max_marks=max_m,
            )
            db.add(mark_entry)
            inserted += 1

        db.commit()
        return {"message": "Sessional marks uploaded", "rows_inserted": inserted}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing marks file: {str(e)}",
        )


@app.post("/sessionals/upload-solution")
async def upload_sessional_solution(
    course: str,
    semester: str,
    sessional_type: str,
    subject: str | None = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a PDF solution sheet for a sessional exam.
    Extracts text from PDF, parses to QA (optional), and stores in DB. No file path stored.
    """
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()

        # Extract text from PDF bytes
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text_pages = [page.extract_text() or "" for page in pdf.pages]
        full_text = "\n\n".join(text_pages).strip()

        if not full_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # OPTIONAL: parse into Q/A if your PDF format matches
        qa_list = parse_qa_from_text(full_text)
        if not qa_list:
            qa_list = None  # keep raw_text only

        # Upsert solution for this course+semester+sessional_type
        solution = (
            db.query(SessionalSolution)
            .filter(
                SessionalSolution.course == course,
                SessionalSolution.semester == str(semester),
                SessionalSolution.sessional_type == sessional_type,
            )
            .first()
        )

        if solution:
            solution.subject = subject
            solution.raw_text = full_text
            solution.qa_data = qa_list
        else:
            solution = SessionalSolution(
                course=course,
                semester=str(semester),
                sessional_type=sessional_type,
                subject=subject,
                raw_text=full_text,
                qa_data=qa_list,
            )
            db.add(solution)

        db.commit()
        db.refresh(solution)

        return {
            "message": "Solution PDF processed and stored",
            "has_qa": bool(qa_list),
            "chars": len(full_text),
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing solution PDF: {str(e)}",
        )




class SessionalSolutionResponse(BaseModel):
    course: str
    semester: str
    sessional_type: str
    subject: str | None = None
    raw_text: str | None = None
    qa_data: list[dict] | None = None

    class Config:
        from_attributes = True

@app.get("/sessionals/solution", response_model=SessionalSolutionResponse)
def get_sessional_solution(
    course: str,
    semester: str,
    sessional_type: str,
    db: Session = Depends(get_db),
):
    solution = (
        db.query(SessionalSolution)
        .filter(
            SessionalSolution.course == course,
            SessionalSolution.semester == str(semester),
            SessionalSolution.sessional_type == sessional_type,
        )
        .first()
    )
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")

    return solution



@app.get("/sessionals/marks")
def get_sessional_marks(
    course: str,
    semester: str,
    sessional_type: str,
    subject: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Returns all rows for given course + semester + sessional_type (optionally filtered by subject).
    """
    query = db.query(SessionalMarks).filter(
        SessionalMarks.course == course,
        SessionalMarks.semester == semester,
        SessionalMarks.sessional_type == sessional_type,
    )
    if subject:
        query = query.filter(SessionalMarks.subject == subject)

    rows = query.all()

    return [
        {
            "roll_number": r.roll_number,
            "student_name": r.student_name,
            "subject": r.subject,
            "marks": r.marks,
            "max_marks": r.max_marks,
            "course": r.course,
            "semester": r.semester,
            "sessional_type": r.sessional_type,
        }
        for r in rows
    ]







@app.get("/sessionals/solution")
def get_sessional_solution(
    course: str,
    semester: str,
    sessional_type: str,
    db: Session = Depends(get_db),
):
    assignment = (
        db.query(Assignment)
        .filter(
            Assignment.course == course,
            Assignment.semester == int(semester),
            Assignment.subject == sessional_type,  # stored like earlier
        )
        .first()
    )
    if not assignment or not assignment.answer_key_path:
        raise HTTPException(status_code=404, detail="Solution not found")

    # If you later serve it via /static, return URL instead of raw path
    return {"path": assignment.answer_key_path}



# ---------------------------
# SERVER START
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
