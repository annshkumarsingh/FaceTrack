import cv2
import os
import csv
import time
import sys
import numpy as np
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.environ["DEEPFACE_HOME"] = os.path.join(BASE_DIR, "deepface_storage")
from deepface import DeepFace
import requests

backend_url = os.getenv("BACKEND_URL")
HEADLESS = os.environ.get("HEADLESS", "False") == "True"


def main():
    # --- PATHS ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    if len(sys.argv) < 3:
        print("❌ Course & Semester not provided!")
        return

    course = sys.argv[1]
    semester = sys.argv[2]
    faces_dir = os.path.join(BASE_DIR, "Faces", course, semester)
    if not os.path.exists(faces_dir):
        os.makedirs(faces_dir)
        print(f"Created folder: {faces_dir}. Please add student images here.")

    embeddings_file = os.path.join(faces_dir, "embeddings.npy")
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
    def mark_attendance(roll_no):
        if not roll_no:
            return

        try:
            # Get student by roll number
            user_res = requests.get(f"{backend_url}/getstudent/rollnum/{roll_no}")
            if user_res.status_code == 200:
                student = user_res.json()
                student_id = student["id"]
                student_name = student["name"]

                # CSV write (local backup)
                with open(attendance_file, "r") as f:
                    existing = f.read()
                if student_name not in existing:
                    with open(attendance_file, "a", newline="") as f:
                        writer = csv.writer(f)
                        writer.writerow([student_name, "Present"])

                # Send attendance to server
                response = requests.post(
                    f"{backend_url}/attendance",
                    json={"student_id": student_id, "class_id": 1, "status": "present"}
                )
                if response.status_code == 200:
                    print(f"✔ Attendance synced to server for {student_name}")
                else:
                    print(f"❌ Failed server sync: {response.text}")
            else:
                print(f"❌ Student not found for roll number {roll_no}")

        except Exception as e:
            print(f"❌ Error sending attendance to server: {e}")


    # --- EXTRACT ROLL NO FROM FILENAME ---
    def extract_roll_number(filename):
        start = filename.find("(")
        end = filename.rfind(")")
        if start != -1 and end != -1:
            return filename[start+1:end]
        return None

    # --- LOAD MODEL ---
    print("Loading DeepFace model...")
    model = DeepFace.build_model(model_name)

    # --- ENCODE KNOWN FACES OR LOAD CACHE ---
    image_files = [f for f in os.listdir(faces_dir) if f.lower().endswith((".jpg", ".png"))]

    if os.path.exists(embeddings_file):
        cached_embeddings = np.load(embeddings_file, allow_pickle=True).item()
        cached_names = set(cached_embeddings.keys())
        current_names = set([os.path.splitext(f)[0] for f in image_files])

        if cached_names != current_names:
            print("Detected changes in face images. Re-encoding embeddings...")
            known_embeddings = {}
            for img_name in image_files:
                img_path = os.path.join(faces_dir, img_name)
                try:
                    reps = DeepFace.represent(img_path=img_path, model_name=model_name, enforce_detection=False)
                    if reps:
                        embedding = reps[0]["embedding"]
                        person_name = os.path.splitext(img_name)[0]
                        known_embeddings[person_name] = embedding
                        print(f"Encoded: {person_name}")
                except Exception as e:
                    print(f"Error encoding {img_name}: {e}")
            # Save updated embeddings
            np.save(embeddings_file, known_embeddings)
            print(f"Saved embeddings to {embeddings_file}")
        else:
            print("Loading cached embeddings...")
            known_embeddings = cached_embeddings
    else:
        print("No cached embeddings found. Encoding known faces...")
        known_embeddings = {}
        for img_name in image_files:
            img_path = os.path.join(faces_dir, img_name)
            try:
                reps = DeepFace.represent(img_path=img_path, model_name=model_name, enforce_detection=False)
                if reps:
                    embedding = reps[0]["embedding"]
                    person_name = os.path.splitext(img_name)[0]
                    known_embeddings[person_name] = embedding
                    print(f"Encoded: {person_name}")
            except Exception as e:
                print(f"Error encoding {img_name}: {e}")
        # Save embeddings
        np.save(embeddings_file, known_embeddings)
        print(f"Saved embeddings to {embeddings_file}")


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
                small_frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5)  # 50% size
                reps = DeepFace.represent(small_frame, model_name=model_name, enforce_detection=False)
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
                        roll_no = extract_roll_number(identity)
                        mark_attendance(roll_no)
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


if HEADLESS:
    print("Running in server mode: attendance marking disabled.")
else:
    if __name__ == "__main__":
        main()