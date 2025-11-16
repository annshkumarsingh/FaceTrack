import cv2
import os
import csv
import time
import numpy as np
from deepface import DeepFace
import requests


def main():
    # --- PATHS ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    faces_dir = os.path.join(BASE_DIR, "Faces")
    attendance_file = os.path.join(BASE_DIR, "attendance.csv")

    model_name = "Facenet"
    threshold = 10

    # --- SETUP ---
    if not os.path.exists(faces_dir):
        os.makedirs(faces_dir)
        print(f"Created {faces_dir}. Please add clear face images (1 per person).")

    if not os.path.exists(attendance_file):
        with open(attendance_file, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Status"])

    # --- HELPER ---
    def mark_attendance(name):
        # ---- CSV WRITE (local backup) ----
        with open(attendance_file, "r") as f:
            existing = f.read()
        if name not in existing:
            with open(attendance_file, "a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([name, "Present"])

        # ---- SEND TO SERVER ----
        try:
            user_res = requests.get(f"http://localhost:8000/getstudent/{name}")
            if user_res.status_code == 200:
                student_id = user_res.json()["id"]
                response = requests.post(
                    "http://localhost:8000/attendance",
                    json={"student_id": student_id, "class_id": 1, "status": "present"}
                )
                if response.status_code == 200:
                    print(f"✔ Attendance synced to server for {name}")
                else:
                    print(f"❌ Failed server sync: {response.text}")

        except Exception as e:
            print(f"❌ Error sending attendance to server: {e}")


    # --- LOAD MODEL ---
    print("Loading DeepFace model...")
    model = DeepFace.build_model(model_name)

    # --- ENCODE KNOWN FACES ---
    print("Encoding known faces...")
    known_embeddings = {}
    for img_name in os.listdir(faces_dir):
        img_path = os.path.join(faces_dir, img_name)
        try:
            reps = DeepFace.represent(img_path=img_path, model_name=model_name, enforce_detection=False)
            if len(reps) > 0:
                embedding = reps[0]["embedding"]
                person_name = os.path.splitext(img_name)[0]
                known_embeddings[person_name] = embedding
                print(f"Encoded: {person_name}")
        except Exception as e:
            print(f"Error encoding {img_name}: {e}")

    if not known_embeddings:
        print("⚠️ No valid faces found in the Faces folder!")
        return

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
        if (current_time - last_recognition_time) > 2:
            try:
                reps = DeepFace.represent(frame, model_name=model_name, enforce_detection=False)
                if len(reps) > 0:
                    embedding = np.array(reps[0]["embedding"])
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
                recognized_name = f"Error: {e}"

        # Display frame
        cv2.putText(frame, recognized_name, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Attendance System", frame)

        if cv2.waitKey(1) == 27:  # ESC key
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()