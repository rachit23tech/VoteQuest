from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

# ============ User Schemas ============
class UserRegister(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    state: Optional[str] = Field(None, max_length=2)

class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    username: str
    email: str
    state: Optional[str]
    total_score: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    """Schema for token data"""
    username: Optional[str] = None
    user_id: Optional[int] = None

# ============ Score Schemas ============
class ScoreCreate(BaseModel):
    """Schema for score creation"""
    level: int = Field(..., ge=1, le=4)
    points: int = Field(..., ge=0)
    accuracy: float = Field(..., ge=0.0, le=1.0)
    time_taken: int = Field(..., ge=0)

class ScoreResponse(BaseModel):
    """Schema for score response"""
    id: int
    user_id: int
    level: int
    points: int
    accuracy: float
    time_taken: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# ============ Achievement Schemas ============
class AchievementResponse(BaseModel):
    """Schema for achievement response"""
    id: int
    badge_name: str
    description: Optional[str]
    unlocked_at: datetime
    
    class Config:
        from_attributes = True

# ============ Game Session Schemas ============
class GameSessionCreate(BaseModel):
    """Schema for game session creation"""
    state: str = Field(..., max_length=2)

class GameSessionResponse(BaseModel):
    """Schema for game session response"""
    id: int
    user_id: int
    state: str
    current_level: int
    progress_json: Dict[str, Any]
    started_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class LevelSubmit(BaseModel):
    """Schema for level submission"""
    level: int = Field(..., ge=1, le=4)
    answers: List[Dict[str, Any]]  # Varies by level
    time_taken: int  # seconds

# ============ Election Data Schemas ============
class ElectionDataResponse(BaseModel):
    """Schema for election data response"""
    state_code: str
    state_name: str
    registration_deadline: date
    early_voting_start: date
    early_voting_end: date
    election_day: date
    polling_info: Dict[str, Any]
    id_requirements: Dict[str, Any]
    accessibility_rules: Dict[str, Any]
    
    class Config:
        from_attributes = True

# ============ Leaderboard Schemas ============
class LeaderboardEntry(BaseModel):
    """Schema for leaderboard entry"""
    rank: int
    username: str
    state: Optional[str]
    total_score: int
    levels_completed: int

class LeaderboardResponse(BaseModel):
    """Schema for leaderboard response"""
    entries: List[LeaderboardEntry]
    period: str  # "all_time", "weekly", "state"
    total_entries: int

# ============ Tutor Schemas ============
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str
    model: str
    status: str

class QuizRequest(BaseModel):
    topic: str
    count: Optional[int] = 5

class ExplainRequest(BaseModel):
    concept: str
