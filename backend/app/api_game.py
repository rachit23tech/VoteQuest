"""Game API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from app.database import get_db
from app.models import User, GameSession, Score, Achievement, ElectionData
from app.schemas import (
    GameSessionResponse,
    LevelSubmit,
    ScoreResponse,
    AchievementResponse
)
from app.auth import get_current_user
from app.scoring import (
    calculate_score,
    calculate_accuracy,
    check_achievement_unlock
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/game", tags=["game"])

@router.post("/start", response_model=GameSessionResponse)
async def start_game(
    state: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new game session"""
    
    # Verify state exists in election data
    election_data = db.query(ElectionData).filter(
        ElectionData.state_code == state.upper()
    ).first()
    
    if not election_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"State {state} not found"
        )
    
    # Create new game session
    game_session = GameSession(
        user_id=current_user.user_id,
        state=state.upper(),
        current_level=1,
        progress_json={"level_1_started": True}
    )
    
    db.add(game_session)
    db.commit()
    db.refresh(game_session)
    
    logger.info(f"Game session started for user {current_user.username} in {state}")
    
    return game_session

@router.get("/session/{session_id}", response_model=GameSessionResponse)
async def get_game_session(
    session_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get game session details"""
    
    game_session = db.query(GameSession).filter(
        and_(
            GameSession.id == session_id,
            GameSession.user_id == current_user.user_id
        )
    ).first()
    
    if not game_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game session not found"
        )
    
    return game_session

@router.post("/level/{level_id}/submit", response_model=ScoreResponse)
async def submit_level(
    level_id: int,
    submission: LevelSubmit,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit level completion with answers"""
    
    if level_id != submission.level or level_id < 1 or level_id > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid level"
        )
    
    # SECURITY: Never trust the client to report which answers are "correct".
    # The client sends answers; the server only uses count for participation scoring.
    # Actual correct-answer validation would require server-side answer keys.
    total_answers = len(submission.answers)
    
    if total_answers == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers provided"
        )
    
    # Use a server-side participation score (all answers count equally)
    # Replace with server-side answer key validation if you store questions server-side
    correct_answers = total_answers  # participation credit only; extend with real answer keys
    # Calculate score
    accuracy = calculate_accuracy(correct_answers, total_answers)
    points = calculate_score(
        base_points=100,
        time_taken=submission.time_taken,
        correct_answers=correct_answers,
        total_answers=total_answers,
        accessibility_bonus=False  # Could be determined from submission
    )
    
    # Create score record
    score = Score(
        user_id=current_user.user_id,
        level=level_id,
        points=points,
        accuracy=accuracy,
        time_taken=submission.time_taken
    )
    
    # Update user total score
    user = db.query(User).filter(User.id == current_user.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.total_score += points
    
    # Check for achievement unlocks
    user_scores = db.query(Score).filter(
        Score.user_id == current_user.user_id
    ).all()
    
    achievements_to_unlock = check_achievement_unlock(
        user_scores=[s.points for s in user_scores],
        current_score=points,
        current_level=level_id,
        time_taken=submission.time_taken,
        accuracy=accuracy,
        total_levels_completed=len(user_scores)
    )
    
    # Save new achievements
    for badge_name in achievements_to_unlock:
        # Check if already unlocked
        existing = db.query(Achievement).filter(
            and_(
                Achievement.user_id == current_user.user_id,
                Achievement.badge_name == badge_name
            )
        ).first()
        
        if not existing:
            achievement = Achievement(
                user_id=current_user.user_id,
                badge_name=badge_name
            )
            db.add(achievement)
            logger.info(f"Achievement unlocked: {badge_name} for user {current_user.username}")
    
    db.add(score)
    db.commit()
    db.refresh(score)
    
    logger.info(f"Level {level_id} submitted by {current_user.username} - Score: {points}")
    
    return score

@router.get("/history", response_model=list[ScoreResponse])
async def get_game_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's game history"""
    
    scores = db.query(Score).filter(
        Score.user_id == current_user.user_id
    ).order_by(desc(Score.timestamp)).all()
    
    return scores

@router.get("/achievements", response_model=list[AchievementResponse])
async def get_user_achievements(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's achievements"""
    
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.user_id
    ).all()
    
    return achievements

@router.get("/stats")
async def get_user_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    
    user = db.query(User).filter(User.id == current_user.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    scores = db.query(Score).filter(Score.user_id == current_user.user_id).all()
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.user_id
    ).all()
    
    avg_score = sum(s.points for s in scores) / len(scores) if scores else 0
    avg_accuracy = sum(s.accuracy for s in scores) / len(scores) if scores else 0
    
    return {
        "user": {
            "username": user.username,
            "state": user.state,
            "total_score": user.total_score
        },
        "statistics": {
            "levels_completed": len(scores),
            "average_score": int(avg_score),
            "average_accuracy": round(avg_accuracy, 2),
            "best_score": max((s.points for s in scores), default=0),
            "achievements_unlocked": len(achievements)
        }
    }
