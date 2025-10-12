import cv2
import os
import csv
import time
import numpy as np
from deepface import DeepFace

# --- CONFIG ---

# --- PATH FIX ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
faces_dir = os.path.join(BASE_DIR, "Faces")
attendance_file = os.path.join(BASE_DIR, "attendance.csv")

model_name = "Facenet" 
threshold = 10

# --- SETUP FOLDERS AND FILES ---
if not os.path.exists(faces_dir):
    os.makedirs(faces_dir)
    print(f"Created {faces_dir}. Please add clear face images (1 per person).")

if not os.path.exists(attendance_file):
    with open(attendance_file, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Status"])

# --- MARK ATTENDANCE ---
def mark_attendance(name):
    with open(attendance_file, "r") as f:
        existing = f.read()
    if name not in existing:
        with open(attendance_file, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([name, "Present"])

# --- LOAD MODEL ONCE ---
print("Loading DeepFace model...")
model = DeepFace.build_model(model_name)

# --- PRECOMPUTE EMBEDDINGS ---
print("Encoding known faces...")
known_embeddings = {}

for img_name in os.listdir(faces_dir):
    img_path = os.path.join(faces_dir, img_name)
    try:
        reps = DeepFace.represent(
            img_path=img_path,
            model_name=model_name,
            enforce_detection=False
        )
        if len(reps) > 0:
            embedding = reps[0]["embedding"]
            person_name = os.path.splitext(img_name)[0]
            known_embeddings[person_name] = embedding
            print(f"Encoded: {person_name}")
    except Exception as e:
        print(f"Error encoding {img_name}: {e}")

if not known_embeddings:
    print("⚠️ No valid faces found in the Faces folder!")
    exit()

print("All known faces encoded successfully.")

# --- START WEBCAM ---
cap = cv2.VideoCapture(0)
print("Press ESC to exit...")

last_recognition_time = 0
recognized_name = "Ready..."

while True:
    ret, frame = cap.read()
    if not ret:
        break

    current_time = time.time()
    if (current_time - last_recognition_time) > 2:  # only process every 2 seconds
        try:
            reps = DeepFace.represent(frame, model_name=model_name, enforce_detection=False)
            if len(reps) > 0:
                embedding = np.array(reps[0]["embedding"])

                # Compare with known faces
                min_dist = float("inf")
                identity = "Unknown"

                for name, known_emb in known_embeddings.items():
                    dist = np.linalg.norm(embedding - np.array(known_emb))
                    if dist < min_dist:
                        min_dist = dist
                        identity = name

                if min_dist < threshold:
                    recognized_name = f"{identity} (Present)"
                    mark_attendance(identity)
                else:
                    recognized_name = "Unknown"
            else:
                recognized_name = "No face detected"

            last_recognition_time = current_time

        except Exception as e:
            recognized_name = "Error"

    # Display
    cv2.putText(frame, recognized_name, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Attendance System", frame)

    key = cv2.waitKey(1)
    if key == 27:  # ESC
        break

cap.release()
cv2.destroyAllWindows()
