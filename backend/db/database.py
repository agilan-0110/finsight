"""
FinSight — Database Engine & Session Setup

engine       -> the connection pool to Postgres
SessionLocal -> factory that creates a new DB session per request
init_db()    -> creates all tables from models.py if they don't exist yet
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.db.models import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/finsight")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    """Creates all tables defined in models.py. Safe to run repeatedly — won't duplicate existing tables."""
    Base.metadata.create_all(bind=engine)
    print(f"Database ready at {DATABASE_URL.split('@')[-1]}")  # hide credentials in the printout


def get_db():
    """
    FastAPI dependency — yields a session, closes it automatically after the request.
    Usage in main.py: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
