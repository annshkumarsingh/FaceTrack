# database/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("POSTGRE_DATABASE_URL")

<<<<<<< HEAD
if not DATABASE_URL:
    raise RuntimeError("POSTGRE_DATABASE_URL is not set in .env")

# Ensure sslmode=require is present
if "sslmode=" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL += f"{separator}sslmode=require"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # good for serverless Neon
    pool_size=5,
    max_overflow=0,
)

=======
engine = create_engine(DATABASE_URL)
>>>>>>> f3442f2 (my changes)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
