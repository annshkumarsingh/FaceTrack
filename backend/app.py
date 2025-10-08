from fastapi import FastAPI , Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database.database import get_db
import uvicorn
import subprocess
import os
import bcrypt
from pydantic import BaseModel, EmailStr
from database.database import get_db
from database.models import User
from sqlalchemy.orm import Session
from fastapi import HTTPException


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



# //base models
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


# helper function use it during both registeration and login
def prepare_password_for_bcrypt(password: str) -> str:
    """Prepare password for bcrypt by truncating if necessary"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        return password_bytes[:72].decode('utf-8', errors='ignore')
    return password




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
@app.post("/start-attendance")
def start_attendance():
    try:
        face_recognition_dir = os.path.join(os.getcwd(), "Face_Recognition")
        script_path = os.path.join(face_recognition_dir, "face_rec.py")
        
        # Fix: Use Scripts instead of bin for Windows
        python_path = os.path.join(os.getcwd(), ".venv", "Scripts", "python.exe")
        
        print("Running:", script_path)
        print("Python path:", python_path)
        
        # Fix: Use full script path
        subprocess.Popen([python_path, script_path], shell=True)
        return JSONResponse(content={"status": "started", "message": "Attendance system launched"})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

    try:
        face_recognition_dir = os.path.join(os.getcwd(), "Face_Recognition")
        script_path = os.path.join(face_recognition_dir, "face_rec.py")
        python_path = os.path.join(os.getcwd(), ".venv", "Scripts", "python.exe")
        print("Running:", script_path)
        
        subprocess.Popen([python_path, "face_rec.py"], cwd=face_recognition_dir, shell=True)
        return JSONResponse(content={"status": "started", "message": "Attendance system launched"})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


@app.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    # check if email or roll number exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered")

    # Check roll number only for Students
    if user.role == "Student" and user.rollNumber and user.rollNumber != "N/A":
        existing_roll = db.query(User).filter(User.roll_number == user.rollNumber).first()
        if existing_roll:
            raise HTTPException(status_code=400, detail="Roll number already exists")

    prepared_password = prepare_password_for_bcrypt(user.password)
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(prepared_password.encode('utf-8'), salt).decode('utf-8')

    # Set roll_number to None for non-students or "N/A" values
    roll_number_value = None
    if user.role == "Student" and user.rollNumber and user.rollNumber != "N/A":
        roll_number_value = user.rollNumber

    new_user = User(
        full_name=user.fullName,
        roll_number=roll_number_value,  # This will be NULL in database
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


@app.post("/login")
def login_user(user:UserLogin , db: Session = Depends(get_db)):
    existingUser = db.query(User).filter(User.email == user.email).first()
    if not existingUser:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    prepared_password = prepare_password_for_bcrypt(user.password)
    
    # Verify password
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
            "department": existingUser.department if hasattr(existingUser, 'department') else None,
            "designation": existingUser.designation if hasattr(existingUser, 'designation') else None
        }
    }



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
