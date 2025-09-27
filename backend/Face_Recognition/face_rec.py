import cv2
import os
import csv
from deepface import DeepFace

# Folder with known faces
faces_dir = "Faces"

# Attendance log file
attendance_file = "attendance.csv"

# Create attendance file if it doesn't exist
if not os.path.exists(attendance_file):
    with open(attendance_file, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Status"])

# Mark attendance
def mark_attendance(name):
    with open(attendance_file, "r") as f:
        existing = f.read()
    if name not in existing:  # Prevent duplicate entries
        with open(attendance_file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([name, "Present"])

# Get known faces
known_faces = {img: os.path.join(faces_dir, img) for img in os.listdir(faces_dir)}

# Start webcam
cap = cv2.VideoCapture(0)

print("Press ESC to exit...")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Try to recognize face in the frame
    try:
        for name, path in known_faces.items():
            result = DeepFace.verify(frame, path, model_name="ArcFace", enforce_detection=False)

            if result["verified"]:
                person_name = os.path.splitext(name)[0]
                text = f"{person_name} (Present)"
                mark_attendance(person_name)
                break
            else:
                text = "Unknown"
    except:
        text = "No face detected"

    # Display result
    cv2.putText(frame, text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Attendance System", frame)

    key = cv2.waitKey(1)
    if key == 27:  # ESC to quit
        break

cap.release()
cv2.destroyAllWindows()
