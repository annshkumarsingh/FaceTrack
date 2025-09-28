from flask import Flask, jsonify, render_template_string
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template_string('''
    <html>
        <body>
            <h2>AI Attendance System</h2>
            <form action="/start-attendance" method="post">
                <button type="submit" style="padding: 10px 20px; font-size: 16px;">Start Attendance</button>
            </form>
        </body>
    </html>
    ''')
@app.route("/start-attendance", methods=["POST"])
def start_attendance():
    try:
        face_recognition_dir = os.path.join(os.getcwd(), "Face_Recognition")
        script_path = os.path.join(face_recognition_dir, "face_rec.py")
        python_path = os.path.join(os.getcwd(), ".venv", "Scripts", "python.exe")
        print("Running:", script_path)
        
        # Run from Face_Recognition directory
        subprocess.Popen([python_path, "face_rec.py"], cwd=face_recognition_dir, shell=True)
        return jsonify({"status": "started", "message": "Attendance system launched"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
