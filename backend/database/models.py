from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from database import Base

# ---------------------
# USERS TABLE
# ---------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # "student" or "teacher"
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

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
