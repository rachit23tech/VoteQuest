"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserResponse, Token
from app.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    
    try:
        # Normalize username and email for consistency
        username_normalized = user_data.username.lower().strip()
        email_normalized = user_data.email.lower().strip()
        
        logger.info(f"Registration attempt: username={username_normalized}, email={email_normalized}")
        
        # Check if user already exists (case-insensitive)
        existing_user = db.query(User).filter(
            (User.username.ilike(username_normalized)) | (User.email.ilike(email_normalized))
        ).first()
        
        if existing_user:
            logger.warning(f"User already exists: {username_normalized}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )
        
        # Create new user with normalized credentials
        new_user = User(
            username=username_normalized,
            email=email_normalized,
            password_hash=get_password_hash(user_data.password),
            state=user_data.state
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user registered: {username_normalized}")
        
        return new_user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """User login - returns access token"""
    
    # Normalize username for consistent lookup
    username_normalized = form_data.username.lower().strip()
    
    # FIND OR CREATE DEMO USER BYPASS
    if username_normalized == "demo" and form_data.password == "demo123":
        user = db.query(User).filter(User.username == "demo").first()
        if not user:
            user = User(
                username="demo",
                email="demo@votequest.app",
                password_hash=get_password_hash("demo123"),
                state="DC" # Default to DC for demo
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        # Proceed with token creation for this user
    else:
        # Find user by username
        user = db.query(User).filter(User.username == username_normalized).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password
        if not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # Create access token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in: {user.username}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current authenticated user info"""
    
    user = db.query(User).filter(User.id == current_user.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """User logout (client-side token removal)"""
    logger.info(f"User logged out: {current_user.username}")
    return {"message": "Successfully logged out"}
