from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app import schemas
from app.services import gemini_service

# ── Input validation models ───────────────────────────────────────────────────
class SafeChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[dict] = Field(default_factory=list, max_length=20)

class SafeQuizRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=100)
    count: int = Field(default=5, ge=1, le=10)

class SafeExplainRequest(BaseModel):
    concept: str = Field(..., min_length=1, max_length=200)

# ── Router ────────────────────────────────────────────────────────────────────
router = APIRouter(
    prefix="/api",
    tags=["Tutor"],
)


@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_tutor(request: SafeChatRequest):
    """Chat with the AI Election Tutor. No auth required — public endpoint."""
    # Sanitise history: keep only role + content, cap per-entry content length
    safe_history = []
    for turn in request.history[-10:]:  # max 10 turns of context
        if isinstance(turn, dict) and "role" in turn and "content" in turn:
            safe_history.append({
                "role": str(turn["role"])[:10],
                "content": str(turn["content"])[:1000],
            })

    try:
        response = await gemini_service.chat_with_tutor(request.message, safe_history)
        return schemas.ChatResponse(**response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service temporarily unavailable",   # never expose internal error
        )


@router.post("/tutor/quiz")
async def generate_quiz(request: SafeQuizRequest):
    """Generate a quiz (AI or fallback). No auth required."""
    try:
        response = await gemini_service.generate_quiz_questions(request.topic, request.count)
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Quiz generation temporarily unavailable",
        )


@router.post("/tutor/explain")
async def explain_concept(request: SafeExplainRequest):
    """Explain an election concept. No auth required."""
    try:
        response = await gemini_service.explain_concept(request.concept)
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Explanation service temporarily unavailable",
        )
