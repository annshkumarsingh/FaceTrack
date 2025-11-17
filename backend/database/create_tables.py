from .database import Base, engine
from . import models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
