from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, DateTime, Text, text ,Date
from sqlalchemy.orm import relationship
from .database import Base

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
    profile_pic = Column(String, nullable=True)  # store file URL
    role = Column(String, nullable=False, default="Student")
    # for teachers
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

    # Relationships
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
    status = Column(String, default="absent")  # present/absent/late
    marked_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    # Relationships
    student = relationship("User", back_populates="attendance_records")
    class_ = relationship("Class", back_populates="attendance_records")

# ... your existing models ...

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

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    date = Column(String, nullable=False)  # Stored as YYYY-MM-DD string for simplicity
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))    


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    teacher_name = Column(String, nullable=True)  # Teacher assigned to approve
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    document = Column(String, nullable=True)  # File path or name
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    # Relationship
    student = relationship("User", foreign_keys=[student_id])    