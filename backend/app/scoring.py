"""Scoring algorithm for VoteQuest"""

def calculate_score(
    base_points: int = 100,
    time_taken: int = 0,
    correct_answers: int = 0,
    total_answers: int = 1,
    accessibility_bonus: bool = False,
    perfect_streak: bool = False
) -> int:
    """
    Calculate final score based on multiple factors
    
    Args:
        base_points: Base points for completing the level (default 100)
        time_taken: Time taken in seconds
        correct_answers: Number of correct answers
        total_answers: Total number of questions
        accessibility_bonus: Whether user helped accessibility features
        perfect_streak: Whether user has a streak going
        
    Returns:
        Final calculated score (integer)
    """
    
    # Time bonus: Up to +100 points for finishing in under 3 minutes
    # Formula: max(0, (300 - time_taken) / 3)
    if time_taken > 0:
        time_bonus = max(0, (300 - time_taken) / 3)
    else:
        time_bonus = 100
    
    # Accuracy multiplier: 0 to 1.0
    if total_answers > 0:
        accuracy_multiplier = correct_answers / total_answers
    else:
        accuracy_multiplier = 1.0
    
    # Base calculation
    score = (base_points * accuracy_multiplier) + time_bonus
    
    # Accessibility bonus: +50 points for inclusive gameplay
    if accessibility_bonus:
        score += 50
    
    # Perfect streak bonus: +25% multiplier
    if perfect_streak:
        score *= 1.25
    
    return int(score)

def calculate_accuracy(correct_answers: int, total_answers: int) -> float:
    """Calculate accuracy percentage"""
    if total_answers == 0:
        return 0.0
    return (correct_answers / total_answers)

def get_score_tier(score: int) -> str:
    """Get tier/rank based on score"""
    if score >= 150:
        return "S"  # Super
    elif score >= 120:
        return "A"  # Excellent
    elif score >= 90:
        return "B"  # Good
    elif score >= 60:
        return "C"  # Fair
    elif score >= 30:
        return "D"  # Poor
    else:
        return "F"  # Failed

def check_achievement_unlock(
    user_scores: list,
    current_score: int,
    current_level: int,
    time_taken: int,
    accuracy: float,
    total_levels_completed: int
) -> list:
    """
    Check which achievements should be unlocked
    
    Returns:
        List of achievement badge names to unlock
    """
    achievements = []
    
    # First Vote - Complete Level 1
    if current_level == 1 and current_score > 0:
        achievements.append("first_vote")
    
    # Early Bird - Register 30+ days early (time_taken < 30 seconds on level 1)
    if current_level == 1 and time_taken < 30:
        achievements.append("early_bird")
    
    # Accessibility Champion - Perfect accuracy on level with accessibility
    if accuracy >= 1.0 and current_level == 3:  # GOTV level
        achievements.append("accessibility_champion")
    
    # Speed Racer - Complete level in under 2 minutes
    if time_taken < 120:
        achievements.append("speed_racer")
    
    # On Fire - 5-level streak without mistakes
    if total_levels_completed >= 5:
        recent_scores = user_scores[-5:] if len(user_scores) >= 5 else user_scores
        if all(s > 0 for s in recent_scores):
            achievements.append("on_fire")
    
    # All States Master - Complete all levels in all 50 states
    # (This would need to be checked at the user level)
    
    return achievements

def calculate_leaderboard_stats(scores: list) -> dict:
    """Calculate stats for leaderboard entry"""
    if not scores:
        return {
            "total_score": 0,
            "average_score": 0,
            "levels_completed": 0,
            "accuracy": 0,
            "best_score": 0
        }
    
    total = sum(s.points for s in scores)
    average = total / len(scores) if scores else 0
    best = max((s.points for s in scores), default=0)
    
    # Calculate overall accuracy
    accuracies = [s.accuracy for s in scores]
    overall_accuracy = sum(accuracies) / len(accuracies) if accuracies else 0
    
    return {
        "total_score": total,
        "average_score": int(average),
        "levels_completed": len(scores),
        "accuracy": round(overall_accuracy, 2),
        "best_score": best
    }
