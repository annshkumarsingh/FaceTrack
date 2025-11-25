# from fastapi import APIRouter, Form, File, UploadFile, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database.database import get_db
# from database.models import Assignment, StudentMarks
# import pandas as pd
# import os

# router = APIRouter(prefix="/student", tags=["student"])

# @router.get("/student/assignment")
# def get_assignment(
#     course: str,
#     semester: int,
#     subject: str,
#     current_user: User = Depends(auth_user),
#     db: Session = Depends(get_db),
# ):
#     assignment = db.query(Assignment).filter_by(
#         course=course,
#         semester=semester,
#         subject=subject
#     ).first()

#     if not assignment:
#         return {
#             "answer_key": "not uploaded",
#             "marks": "not uploaded"
#         }

#     # answer key
#     answer_key = assignment.answer_key_path if assignment.answer_key_path else "not uploaded"

#     # student's marks
#     mark_record = db.query(StudentMarks).filter_by(
#         assignment_id=assignment.id,
#         roll_number=current_user.roll_number
#     ).first()

#     marks = mark_record.marks if mark_record else "not uploaded"

#     return {
#         "answer_key": answer_key,
#         "marks": marks
#     }


# @router.get("/student/download/{assignment_id}")
# def download(assignment_id: int, db: Session = Depends(get_db)):
#     assignment = db.query(Assignment).filter_by(id=assignment_id).first()

#     if not assignment or not assignment.answer_key_path:
#         raise HTTPException(404, "Answer key not uploaded")

#     return FileResponse(assignment.answer_key_path)
