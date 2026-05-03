"""Election Data API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ElectionData
from app.schemas import ElectionDataResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["election-data"])

@router.get("/states", response_model=list[ElectionDataResponse])
async def get_all_states(db: Session = Depends(get_db)):
    """Get election data for all states"""
    
    states = db.query(ElectionData).all()
    
    if not states:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No election data found"
        )
    
    return states

@router.get("/states/{state_code}", response_model=ElectionDataResponse)
async def get_state_data(
    state_code: str,
    db: Session = Depends(get_db)
):
    """Get election data for a specific state"""
    
    state = db.query(ElectionData).filter(
        ElectionData.state_code == state_code.upper()
    ).first()
    
    if not state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Election data for state {state_code} not found"
        )
    
    return state

@router.get("/voters/generate")
async def generate_random_voters(
    state: str = "PA",
    count: int = 10,
    db: Session = Depends(get_db)
):
    """Generate random voter profiles for a state (max 50)"""
    
    import random
    from datetime import datetime

    # Cap count to prevent abuse
    count = max(1, min(count, 50))
    state = state.upper()[:2]  # Sanitise state input
    # Sample voter data
    first_names = ["John", "Emma", "Michael", "Sarah", "David", "Emily", 
                   "James", "Jessica", "Robert", "Lisa"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia",
                  "Miller", "Davis", "Rodriguez", "Martinez"]
    
    # Generate random voters
    voters = []
    for i in range(count):
        age = random.randint(18, 85)
        voter = {
            "id": i + 1,
            "first_name": random.choice(first_names),
            "last_name": random.choice(last_names),
            "age": age,
            "state": state.upper(),
            "has_id": random.choice([True, True, True, False]),  # 75% have ID
            "needs_accommodation": random.choice([True, False, False, False]),  # 25%
            "has_registered": random.choice([True, True, False]),  # 67% registered
        }
        voters.append(voter)
    
    return {
        "state": state.upper(),
        "voters": voters,
        "count": len(voters)
    }

@router.get("/election-facts")
async def get_election_facts(db: Session = Depends(get_db)):
    """Get election facts/trivia"""
    
    facts = [
        {
            "id": 1,
            "question": "What is the minimum age to vote in US elections?",
            "options": ["16", "18", "21", "25"],
            "correct": "18",
            "fact": "Citizens must be at least 18 years old to vote in federal elections."
        },
        {
            "id": 2,
            "question": "How many Electoral College votes are there in total?",
            "options": ["435", "100", "538", "270"],
            "correct": "538",
            "fact": "There are 538 electoral votes: one for each member of Congress (535) plus 3 for DC."
        },
        {
            "id": 3,
            "question": "What is required to win the presidency?",
            "options": ["Plurality of votes", "Simple majority", "270 Electoral votes", "50% + 1"],
            "correct": "270 Electoral votes",
            "fact": "A candidate needs 270 out of 538 Electoral College votes to become president."
        },
        {
            "id": 4,
            "question": "How many years between presidential elections?",
            "options": ["2", "3", "4", "6"],
            "correct": "4",
            "fact": "US Presidential elections occur every 4 years."
        },
        {
            "id": 5,
            "question": "What is early voting?",
            "options": [
                "Voting before election day at designated locations",
                "Voting by mail only",
                "Voting the day before election",
                "Primary voting"
            ],
            "correct": "Voting before election day at designated locations",
            "fact": "Early voting allows citizens to cast ballots in person before Election Day."
        }
    ]
    
    return {
        "facts": facts,
        "total": len(facts)
    }

@router.get("/poll-locations/{state_code}")
async def get_poll_locations(
    state_code: str,
    db: Session = Depends(get_db),
    limit: int = Query(5, ge=1, le=20),
):
    """Get polling locations for a state"""
    
    import random
    
    # Sample polling locations
    locations = [
        "Community Center",
        "Public Library",
        "High School",
        "Fire Department",
        "VFW Hall",
        "Church",
        "Town Hall",
        "School District Office"
    ]
    
    poll_locations = []
    for i in range(limit):
        poll_locations.append({
            "id": i + 1,
            "name": f"{random.choice(locations)} #{i+1}",
            "address": f"{random.randint(100, 9999)} Main St, {state_code}",
            "hours": "7:00 AM - 8:00 PM",
            "accessible": random.choice([True, True, True, False]),
            "wait_time": random.randint(5, 45)  # minutes
        })
    
    return {
        "state": state_code.upper(),
        "locations": poll_locations,
        "total": len(poll_locations)
    }
