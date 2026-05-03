"""
Database seeding script. Run once after running alembic migrations:
    python -m app.seed
"""

import json
import os
from pathlib import Path
from datetime import datetime

from app.database import engine, SessionLocal
from app.models import Base, ElectionData


def seed_election_data(db) -> int:
    data_path = Path(__file__).parent.parent / "data" / "election_data.json"
    if not data_path.exists():
        print(f"[seed] Data file not found: {data_path}")
        return 0

    with open(data_path, "r") as f:
        states = json.load(f)

    inserted = 0
    for s in states:
        exists = db.query(ElectionData).filter_by(state_code=s["state_code"]).first()
        if exists:
            continue

        record = ElectionData(
            state_code=s["state_code"],
            state_name=s["state_name"],
            registration_deadline=datetime.strptime(s["registration_deadline"], "%Y-%m-%d").date(),
            early_voting_start=datetime.strptime(s["early_voting_start"], "%Y-%m-%d").date(),
            early_voting_end=datetime.strptime(s["early_voting_end"], "%Y-%m-%d").date(),
            election_day=datetime.strptime(s["election_day"], "%Y-%m-%d").date(),
            id_requirements=s.get("id_requirements", {}),
            accessibility_rules=s.get("accessibility_rules", {}),
            polling_info={},
        )
        db.add(record)
        inserted += 1

    db.commit()
    return inserted


from app.auth import get_password_hash
from app.models import User

def seed_demo_user(db):
    demo_email = "demo@votequest.com"
    exists = db.query(User).filter_by(email=demo_email).first()
    if exists:
        return
    
    demo_user = User(
        username="demouser",
        email=demo_email,
        password_hash=get_password_hash("demo123"),
        state="CA",
        total_score=0
    )
    db.add(demo_user)
    db.commit()
    print("[seed] Created demo user (demouser / demo123)")

def run():
    print("[seed] Creating tables if they don't exist…")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_demo_user(db)
        count = seed_election_data(db)
        print(f"[seed] Inserted {count} election data records.")
    finally:
        db.close()

    print("[seed] Done.")

if __name__ == "__main__":
    run()
