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

    frame_count += 1
    current_time = time.time()
    
    # Only process every 30th frame (1 second at 30fps) instead of every frame
    if frame_count % 30 == 0 and (current_time - last_recognition_time) > 2:
        text = "Processing..."
        
        try:
            # Use faster model and lower resolution
            small_frame = cv2.resize(frame, (320, 240))
            
            for name, path in known_faces.items():
                # Use faster model
                result = DeepFace.verify(small_frame, path, 
                                       model_name="Facenet",  # Faster than ArcFace
                                       enforce_detection=False,
                                       distance_metric="euclidean")
                
                if result["verified"]:
                    person_name = os.path.splitext(name)[0]
                    text = f"{person_name} (Present)"
                    mark_attendance(person_name)
                    last_recognition_time = current_time
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
