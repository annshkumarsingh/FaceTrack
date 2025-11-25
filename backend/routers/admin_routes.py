from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Assignment, StudentMarks
import pandas as pd
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/upload-answer-key")
async def upload_answer_key(
    course: str = Form(...),
    semester: int = Form(...),
    subject: str = Form(...),
    answerKey: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check existing entry
    assignment = db.query(Assignment).filter_by(
        course=course,
        semester=semester,
        subject=subject
    ).first()

    if not assignment:
        assignment = Assignment(
            course=course,
            semester=semester,
            subject=subject
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)

    # Save file
    file_location = f"uploads/answer_keys/{assignment.id}_{answerKey.filename}"
    with open(file_location, "wb") as f:
        f.write(await answerKey.read())

    assignment.answer_key_path = file_location
    db.commit()

    return {"message": "Answer key uploaded successfully"}

import hashlib

@router.post("/upload-assignment-marks")
async def upload_marks(
    course: str = Form(...),
    semester: int = Form(...),
    subject: str = Form(...),
    marksFile: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # STEP 1: Save marks file to backend
    file_location = f"uploads/marks/{course}_{semester}_{subject}_{marksFile.filename}"

    file_bytes = await marksFile.read()

    with open(file_location, "wb") as f:
        f.write(file_bytes)

    # STEP 2: Save file info in MarksUpload table
    marks_upload = MarksUpload(
        course=course,
        semester=semester,
        subject=subject,
        file_path=file_location
    )

    db.add(marks_upload)
    db.commit()
    db.refresh(marks_upload)

    # STEP 3: Load file using pandas
    df = (
        pd.read_csv(file_location)
        if marksFile.filename.endswith(".csv")
        else pd.read_excel(file_location)
    )

    # STEP 4: Validate columns
    required_cols = ["Name", "Roll No", "Marks"]
    for col in required_cols:
        if col not in df.columns:
            raise HTTPException(
                400,
                f"Missing column '{col}'. Required: Name, Roll No, Marks"
            )

    # STEP 5: Save each row in StudentMarks table
    count = 0
    for _, row in df.iterrows():
        mark_entry = StudentMarks(
            course=course,
            semester=semester,
            subject=subject,
            name=row["Name"],
            roll_number=row["Roll No"],
            marks=row["Marks"]
        )
        db.add(mark_entry)
        count += 1

    db.commit()

    return {
        "message": "Marks uploaded successfully",
        "records": count,
        "file_saved_as": file_location
    }
