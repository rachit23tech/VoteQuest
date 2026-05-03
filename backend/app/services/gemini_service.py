"""
Gemini AI Election Tutor Service
──────────────────────────────────
Uses Google Gemini 1.5 Flash to act as an interactive election education
tutor. Provides contextual explanations, answers questions, generates
quiz questions, and explains election concepts in simple language.
"""

import json
import google.generativeai as genai
from app.config import settings

# ── Configure the SDK ────────────────────────────────────────────────────────
genai.configure(api_key=settings.GEMINI_API_KEY)
_MODEL_NAME = "gemini-1.5-flash"


SYSTEM_PROMPT = """You are "ElectoBot" — a friendly, knowledgeable AI tutor that teaches users about the election process, particularly the Indian democratic election system. Your personality is warm, encouraging, and slightly playful (using emojis occasionally).

Your expertise covers:
- Indian Election Commission and its role
- Types of elections (Lok Sabha, Vidhan Sabha, Local Body, Presidential, Rajya Sabha)
- Voter registration process and eligibility
- The complete election cycle: announcement → nomination → campaigning → polling → counting → results → government formation
- Electronic Voting Machines (EVMs) and VVPATs
- Model Code of Conduct
- Constitutional provisions related to elections (Articles 324-329)
- First Past the Post system vs Proportional Representation
- NOTA (None of the Above)
- Important electoral reforms
- Voter rights and responsibilities
- Election symbols and party registration
- Anti-defection law
- Delimitation process

Guidelines:
1. Keep explanations clear and concise, suitable for students and first-time voters
2. Use analogies and real-world examples to explain complex concepts
3. When asked about specific topics, provide structured responses with key points
4. Encourage civic participation and the importance of voting
5. Be factually accurate — cite constitutional articles and election laws where relevant
6. If asked to generate quiz questions, return them in a structured JSON format
7. If the user asks something outside elections/democracy, politely redirect to election topics
8. Use gamification language — "Great question! You've earned knowledge XP! 🎯"
"""


async def chat_with_tutor(message: str, history: list = None) -> dict:
    """
    Send a message to the Gemini election tutor and get a response.
    
    Parameters
    ----------
    message : str
        The user's question or message.
    history : list, optional
        Previous conversation turns for context.
    
    Returns
    -------
    dict – { "response": str, "model": str, "status": "ok" | "fallback" }
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key":
        return _fallback_response(message)

    try:
        model = genai.GenerativeModel(
            _MODEL_NAME,
            system_instruction=SYSTEM_PROMPT,
        )
        
        # Build conversation history for context
        chat_history = []
        if history:
            for turn in history[-10:]:  # Keep last 10 turns for context
                chat_history.append({
                    "role": turn.get("role", "user"),
                    "parts": [turn.get("content", "")]
                })
        
        chat = model.start_chat(history=chat_history)
        response = await chat.send_message_async(message)
        
        return {
            "response": response.text,
            "model": _MODEL_NAME,
            "status": "ok",
        }
    except Exception as e:
        print(f"[Gemini] API call failed: {e}")
        return _fallback_response(message)


async def generate_quiz_questions(topic: str, count: int = 5) -> dict:
    """
    Use Gemini to generate quiz questions about a specific election topic.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key":
        return _fallback_quiz(topic)

    try:
        model = genai.GenerativeModel(_MODEL_NAME)
        prompt = f"""Generate {count} multiple-choice quiz questions about "{topic}" related to the Indian election process. 

Return a valid JSON array with this exact structure:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of why this is correct.",
    "difficulty": "easy|medium|hard",
    "xp": 10
  }}
]
"""

        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        questions = json.loads(response.text)
        return {"questions": questions, "topic": topic, "status": "ok", "model": _MODEL_NAME}
    except Exception as e:
        print(f"[Gemini Quiz] Failed: {e}")
        return _fallback_quiz(topic)


async def explain_concept(concept: str) -> dict:
    """
    Use Gemini to provide a detailed, gamified explanation of an election concept.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key or api_key == "your-gemini-api-key":
        return _fallback_explain(concept)

    try:
        model = genai.GenerativeModel(
            _MODEL_NAME,
            system_instruction=SYSTEM_PROMPT,
        )
        prompt = f"""Explain the following election/democracy concept in a fun, engaging, educational way suitable for students and first-time voters. Use analogies, bullet points, and include a "Fun Fact" and a "Did You Know?" section.

Concept: {concept}

Format your response with clear sections using markdown headings."""

        response = await model.generate_content_async(prompt)
        return {
            "explanation": response.text,
            "concept": concept,
            "model": _MODEL_NAME,
            "status": "ok",
        }
    except Exception as e:
        print(f"[Gemini Explain] Failed: {e}")
        return _fallback_explain(concept)


# ── Fallback responses ────────────────────────────────────────────────────────

def _fallback_response(message: str) -> dict:
    """Rule-based fallback when Gemini is unavailable."""
    msg_lower = message.lower()
    
    responses = {
        "evm": "**Electronic Voting Machines (EVMs)** 🗳️\n\nEVMs were introduced in India to make voting faster, more accurate, and tamper-proof.\n\n**Key facts:**\n- First used in 1982 in Kerala's Parur Assembly constituency\n- A single EVM can record up to 3,840 votes\n- Each EVM runs on a battery, so no electricity needed\n- The machine has two units: Control Unit (with the officer) and Ballot Unit (for the voter)\n- Since 2017, VVPATs (paper trail) are used with every EVM\n\n**Fun Fact:** India is the largest democracy in the world, and EVMs help conduct elections for 900+ million voters! 🇮🇳",
        
        "vote": "**How to Vote in India** 🗳️\n\n**Eligibility:**\n- Indian citizen\n- At least 18 years old on January 1st of the revision year\n- Registered in the electoral roll\n- Must have a valid Voter ID (EPIC)\n\n**Steps on Polling Day:**\n1. Go to your assigned polling booth\n2. Show your Voter ID to the polling officer\n3. Get your finger inked (indelible ink on left index finger)\n4. Enter the voting compartment\n5. Press the button next to your chosen candidate on the EVM\n6. Check the VVPAT slip (visible for 7 seconds)\n7. Done! Your vote is secret and secure 🎉",
        
        "election commission": "**Election Commission of India (ECI)** ⚖️\n\nThe ECI is an autonomous constitutional body responsible for administering elections in India.\n\n**Key facts:**\n- Established on 25th January 1950 (celebrated as National Voters' Day)\n- Derives power from Article 324 of the Constitution\n- Headed by the Chief Election Commissioner (CEC)\n- Currently has 3 members: 1 CEC + 2 Election Commissioners\n- CEC can only be removed through impeachment (same process as a Supreme Court judge)\n\n**The ECI handles:**\n- Lok Sabha & Rajya Sabha elections\n- State Assembly elections\n- Presidential & Vice-Presidential elections",
        
        "nota": "**NOTA — None of the Above** ❌\n\nNOTA gives voters the right to reject all candidates!\n\n**Key facts:**\n- Introduced in 2013 after Supreme Court ruling (PUCL vs Union of India)\n- It's the last button on the EVM\n- NOTA votes are counted but don't affect results\n- Even if NOTA gets the most votes, the candidate with the most votes still wins\n- It's a way to register protest while still participating in democracy\n\n**Why it matters:** It sends a message to political parties about voter dissatisfaction! 📢",
    }
    
    # Find best matching response
    for key, response in responses.items():
        if key in msg_lower:
            return {"response": response, "model": "rule-based-fallback", "status": "fallback"}
    
    # Default response
    return {
        "response": "🗳️ **Welcome to Election Education!**\n\nI'm ElectoBot, your election tutor! I can help you learn about:\n\n- 🏛️ **Election Commission** — The body that runs elections\n- 📋 **Voter Registration** — How to become a registered voter\n- 🗳️ **EVMs & VVPATs** — How voting machines work\n- 📅 **Election Timeline** — From announcement to results\n- ⚖️ **Model Code of Conduct** — Rules during elections\n- 🎯 **NOTA** — Your right to reject candidates\n\nAsk me anything about elections and democracy! Every question earns you knowledge XP! 🎮",
        "model": "rule-based-fallback",
        "status": "fallback",
    }


def _fallback_quiz(topic: str) -> dict:
    """Return pre-built quiz questions when Gemini is unavailable."""
    questions = [
        {
            "question": "What is the minimum age to vote in Indian elections?",
            "options": ["16 years", "18 years", "21 years", "25 years"],
            "correct": 1,
            "explanation": "Article 326 of the Indian Constitution sets the minimum voting age at 18 years. It was reduced from 21 to 18 by the 61st Amendment Act of 1988.",
            "difficulty": "easy",
            "xp": 10
        },
        {
            "question": "Which article of the Indian Constitution establishes the Election Commission?",
            "options": ["Article 280", "Article 312", "Article 324", "Article 356"],
            "correct": 2,
            "explanation": "Article 324 vests the superintendence, direction, and control of elections in the Election Commission of India.",
            "difficulty": "medium",
            "xp": 20
        },
        {
            "question": "When was NOTA (None of the Above) introduced in Indian elections?",
            "options": ["2009", "2011", "2013", "2015"],
            "correct": 2,
            "explanation": "NOTA was introduced in 2013 following the Supreme Court's ruling in the PUCL vs Union of India case.",
            "difficulty": "medium",
            "xp": 20
        },
        {
            "question": "How many members does the Election Commission of India currently have?",
            "options": ["1", "2", "3", "5"],
            "correct": 2,
            "explanation": "The ECI has 3 members: the Chief Election Commissioner and two Election Commissioners.",
            "difficulty": "easy",
            "xp": 10
        },
        {
            "question": "Which of the following is NOT a type of election conducted by the ECI?",
            "options": ["Lok Sabha", "Rajya Sabha", "Panchayat", "Presidential"],
            "correct": 2,
            "explanation": "Panchayat (local body) elections are conducted by State Election Commissions, not the ECI. The ECI handles Lok Sabha, Rajya Sabha, State Assembly, and Presidential elections.",
            "difficulty": "hard",
            "xp": 30
        },
    ]
    return {"questions": questions, "topic": topic, "status": "fallback", "model": "rule-based-fallback"}


def _fallback_explain(concept: str) -> dict:
    """Return a basic explanation when Gemini is unavailable."""
    return {
        "explanation": f"## {concept}\n\nThis is an important concept in the Indian electoral system. To get a detailed AI-powered explanation, please configure the GEMINI_API_KEY environment variable.\n\nIn the meantime, try asking ElectoBot about this topic in the chat!",
        "concept": concept,
        "model": "rule-based-fallback",
        "status": "fallback",
    }
