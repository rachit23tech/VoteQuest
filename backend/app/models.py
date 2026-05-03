from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Date, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    state = Column(String(2), nullable=True)  # Two-letter state code
    total_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    game_sessions = relationship("GameSession", back_populates="user")
    scores = relationship("Score", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    
    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"

class GameSession(Base):
    """Game session model"""
    __tablename__ = "game_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    state = Column(String(2), nullable=False)  # Which state's election
    current_level = Column(Integer, default=1)  # 1, 2, 3, or 4
    progress_json = Column(JSON, default={})  # Stores level-specific progress
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="game_sessions")
    
    def __repr__(self):
        return f"<GameSession(user_id={self.user_id}, state='{self.state}', level={self.current_level})>"

class Score(Base):
    """Score model - tracks level completions"""
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    level = Column(Integer, nullable=False)  # 1-4
    points = Column(Integer, nullable=False)
    accuracy = Column(Float, default=0.0)  # 0-1
    time_taken = Column(Integer, nullable=False)  # seconds
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="scores")
    
    def __repr__(self):
        return f"<Score(user_id={self.user_id}, level={self.level}, points={self.points})>"

class Achievement(Base):
    """Achievement/Badge model"""
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    badge_name = Column(String, nullable=False)  # "first_vote", "early_bird", etc
    description = Column(Text, nullable=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    
    def __repr__(self):
        return f"<Achievement(user_id={self.user_id}, badge='{self.badge_name}')>"

class ElectionData(Base):
    """Election data for each state"""
    __tablename__ = "election_data"
    
    id = Column(Integer, primary_key=True, index=True)
    state_code = Column(String(2), unique=True, index=True, nullable=False)
    state_name = Column(String, nullable=False)
    registration_deadline = Column(Date, nullable=False)
    early_voting_start = Column(Date, nullable=False)
    early_voting_end = Column(Date, nullable=False)
    election_day = Column(Date, nullable=False)
    polling_info = Column(JSON, default={})  # Random polling location info
    id_requirements = Column(JSON, default={})  # ID requirement rules
    accessibility_rules = Column(JSON, default={})  # ADA accommodations
    
    def __repr__(self):
        return f"<ElectionData(state='{self.state_code}', state_name='{self.state_name}')>"
