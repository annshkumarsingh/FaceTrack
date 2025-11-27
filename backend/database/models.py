from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, DateTime, Text, text, Date, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
from sqlalchemy.dialects.postgresql import JSONB  


# ---------------------
# USERS TABLE
# ---------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, nullable=True)
    course = Column(String, nullable=True)
    semester = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    profile_pic = Column(String, nullable=True)
    role = Column(String, nullable=False, default="Student")

    # teacher fields
    designation = Column(String, nullable=True)
    department = Column(String, nullable=True)

    # Relationships
    classes = relationship("Class", back_populates="teacher")
    attendance_records = relationship("Attendance", back_populates="student")


# ---------------------
# CLASSES TABLE
# ---------------------
class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    subject_code = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))

    teacher = relationship("User", back_populates="classes")
    attendance_records = relationship("Attendance", back_populates="class_")


# ---------------------
# ATTENDANCE TABLE
# ---------------------
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))
    status = Column(String, default="absent")
    marked_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    student = relationship("User", back_populates="attendance_records")
    class_ = relationship("Class", back_populates="attendance_records")


# ---------------------
# SCHEDULE TABLE
# ---------------------
class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, nullable=False)
    time = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    teacher = Column(String, nullable=False)
    course = Column(String, nullable=True)
    semester = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))


# ---------------------
# ANNOUNCEMENTS TABLE
# ---------------------
class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))


# ---------------------
# LEAVE REQUESTS TABLE
# ---------------------
class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    teacher_name = Column(String, nullable=True)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    document = Column(String, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    student = relationship("User", foreign_keys=[student_id])


# ---------------------
# ASSIGNMENTS TABLE
# ---------------------
class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    subject = Column(String, nullable=False)

    answer_key_path = Column(String, nullable=True)
    marks_file_path = Column(String, nullable=True)
    # marks_file_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ---------------------
# STUDENT MARKS TABLE
# ---------------------
class StudentMarks(Base):
    __tablename__ = "student_marks"

   
    id = Column(Integer, primary_key=True, index=True)
    course = Column(String)
    semester = Column(Integer)
    subject = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)




class AnswerKey(Base):
    __tablename__ = "answer_keys"

    id = Column(Integer, primary_key=True, index=True)

    # Link to context
    course = Column(String, nullable=True)       # e.g. "B.Tech - ECE"
    semester = Column(String, nullable=False)    # e.g. "3"
    subject = Column(String, nullable=False)     # e.g. "DBMS" or "ECE-401: VLSI"

    exam_type = Column(String, nullable=True)    # e.g. "Sessional 1", "Assignment 2"

    # Raw structured data: list of questions
    # [
    #   { "q_no": 1, "question": "....", "answer": "...." },
    #   ...
    # ]
    qa_data = Column(JSONB, nullable=False)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # teacher id
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    teacher = relationship("User", foreign_keys=[uploaded_by])





class SessionalMarks(Base):
    __tablename__ = "sessional_marks"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    sessional_type = Column(String, nullable=False)  # e.g. "Sessional 1"
    subject = Column(String, nullable=True)          # optional if you later add subject

    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    roll_number = Column(String, nullable=False)
    student_name = Column(String, nullable=True)
    marks = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    student = relationship("User", foreign_keys=[student_id])



class SessionalSolution(Base):
    __tablename__ = "sessional_solutions"

    id = Column(Integer, primary_key=True, index=True)
    course = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    sessional_type = Column(String, nullable=False)  # "Sessional 1"
    subject = Column(String, nullable=True)

    # Either full raw text or structured Q/A
    raw_text = Column(Text, nullable=True)
    qa_data = Column(JSONB, nullable=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))