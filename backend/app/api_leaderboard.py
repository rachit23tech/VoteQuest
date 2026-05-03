"""Leaderboard API endpoints"""

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.models import User, Score
from app.schemas import LeaderboardResponse, LeaderboardEntry
from app.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("", response_model=LeaderboardResponse)
async def get_global_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get global leaderboard (all-time top scores)"""
    
    # Get top users by total score
    top_users = db.query(User).order_by(
        desc(User.total_score)
    ).limit(limit).all()
    
    entries = []
    for rank, user in enumerate(top_users, 1):
        # Count completed levels
        completed = db.query(Score).filter(
            Score.user_id == user.id
        ).count()
        
        entries.append(LeaderboardEntry(
            rank=rank,
            username=user.username,
            state=user.state,
            total_score=user.total_score,
            levels_completed=completed
        ))
    
    return LeaderboardResponse(
        entries=entries,
        period="all_time",
        total_entries=len(entries)
    )

@router.get("/weekly", response_model=LeaderboardResponse)
async def get_weekly_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get weekly leaderboard"""
    
    from datetime import datetime, timedelta
    
    # Get scores from last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Subquery to get sum of recent scores per user
    weekly_scores = db.query(
        User.id,
        User.username,
        User.state,
        func.sum(Score.points).label("weekly_score"),
        func.count(Score.id).label("levels_completed")
    ).join(Score).filter(
        Score.timestamp >= week_ago
    ).group_by(User.id, User.username, User.state).order_by(
        desc("weekly_score")
    ).limit(limit).all()
    
    entries = []
    for rank, (user_id, username, state, score, completed) in enumerate(weekly_scores, 1):
        entries.append(LeaderboardEntry(
            rank=rank,
            username=username,
            state=state,
            total_score=score or 0,
            levels_completed=completed or 0
        ))
    
    return LeaderboardResponse(
        entries=entries,
        period="weekly",
        total_entries=len(entries)
    )

@router.get("/state/{state_code}", response_model=LeaderboardResponse)
async def get_state_leaderboard(
    state_code: str,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get leaderboard for a specific state"""
    
    # Get top users from specific state
    top_users = db.query(User).filter(
        User.state == state_code.upper()
    ).order_by(
        desc(User.total_score)
    ).limit(limit).all()
    
    entries = []
    for rank, user in enumerate(top_users, 1):
        # Count completed levels
        completed = db.query(Score).filter(
            Score.user_id == user.id
        ).count()
        
        entries.append(LeaderboardEntry(
            rank=rank,
            username=user.username,
            state=user.state,
            total_score=user.total_score,
            levels_completed=completed
        ))
    
    return LeaderboardResponse(
        entries=entries,
        period=f"state_{state_code}",
        total_entries=len(entries)
    )

@router.get("/user/{username}")
async def get_user_rank(
    username: str,
    current_user = Depends(get_current_user),  # require auth to prevent user enumeration
    db: Session = Depends(get_db)
):
    """Get specific user's rank (requires authentication)"""
    
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Get rank globally
    rank = db.query(func.count(User.id)).filter(
        User.total_score > user.total_score
    ).scalar() + 1
    
    # Get completed levels
    completed = db.query(Score).filter(
        Score.user_id == user.id
    ).count()
    
    return {
        "username": user.username,
        "state": user.state,
        "global_rank": rank,
        "total_score": user.total_score,
        "levels_completed": completed
    }

@router.get("/nearby")
async def get_nearby_players(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get players nearby in ranking"""
    
    user = db.query(User).filter(User.id == current_user.user_id).first()
    
    # Get user's rank
    rank = db.query(func.count(User.id)).filter(
        User.total_score > user.total_score
    ).scalar() + 1
    
    # Get 2 above and 2 below
    nearby = db.query(User).order_by(
        desc(User.total_score)
    ).offset(max(0, rank - 3)).limit(5).all()
    
    entries = []
    for nearby_user in nearby:
        completed = db.query(Score).filter(
            Score.user_id == nearby_user.id
        ).count()
        
        nearby_rank = db.query(func.count(User.id)).filter(
            User.total_score > nearby_user.total_score
        ).scalar() + 1
        
        entries.append(LeaderboardEntry(
            rank=nearby_rank,
            username=nearby_user.username,
            state=nearby_user.state,
            total_score=nearby_user.total_score,
            levels_completed=completed
        ))
    
    return {
        "your_rank": rank,
        "nearby_players": entries
    }
