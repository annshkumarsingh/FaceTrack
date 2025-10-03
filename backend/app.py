from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import subprocess
import os

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
