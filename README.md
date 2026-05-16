# VoteQuest — Gamified Election Assistant

> An interactive, gamified platform to teach election processes, timelines, and civic engagement through gameplay. Transform voters into election strategists.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Frontend-blue?style=for-the-badge)](https://willowy-pie-72be93.netlify.app/)
[![API Status](https://img.shields.io/badge/API-Live_on_Cloud_Run-green?style=for-the-badge)](https://votequest-api-393608700696.us-central1.run.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

**Tech Stack**: Next.js 15+ | FastAPI | PostgreSQL | Google Cloud Run

---

## 🎮 Project Vision

Most election resources are dry, static, and forgettable. **VoteQuest** gamifies the learning experience — users progress through levels as virtual campaign managers, earning points and badges while mastering real election processes.

### What Makes It Stand Out

- **Interactive** — Drag-and-drop, puzzle-based learning
- **Personalized** — State-specific rules embedded in gameplay
- **Engaging** — Points, badges, leaderboards, time pressure
- **Educational** — Master real deadlines, requirements, logistics
- **Shareable** — Compete with friends, viral potential
- **Mobile-First** — Works on any device

---

## 🔗 Live Deployments

- **Frontend**: [https://willowy-pie-72be93.netlify.app/](https://willowy-pie-72be93.netlify.app/)
- **Backend API**: [https://votequest-api-393608700696.us-central1.run.app](https://votequest-api-393608700696.us-central1.run.app)

---

## 📋 Feature Overview

### Core Gameplay (MVP)

#### **Level 1: Voter Registration Challenge**
- **Mechanics**: Drag voter profiles to correct registration centers
- **Duration**: 3-minute timer
- **Challenge**: 8/10 voters must be registered correctly
- **State Rules**: ID requirements, eligibility checks vary by state
- **Scoring**: Base 100 + time bonus + accuracy multiplier
- **Learning Outcome**: Understand registration deadlines and requirements

#### **Level 2: Campaign Trail** *(Post-MVP)*
- Resource management (budget, volunteers, time)
- Navigate state-specific voting rules
- Boss battle: Debate opponent with election trivia

#### **Level 3: Get Out The Vote (GOTV)** *(Post-MVP)*
- Early voting mechanics puzzle
- Polling place logistics challenges
- Day-of problem-solving scenarios

#### **Level 4: Election Night** *(Post-MVP)*
- Results calculation mechanics
- Vote counting process simulation
- Final scoring and achievements

---

## 🏆 Gamification Elements

| Feature | Implementation |
|---------|----------------|
| **Points System** | +100 base per level, +time bonus, +accuracy multiplier |
| **Achievements** | 6 badges: "First Vote", "Early Bird", "Accessibility Champion", "On Fire", "All States Master", "Speed Racer" |
| **Leaderboard** | Global top 10, weekly rankings, state-by-state competition |
| **Progression** | 4 levels, unlock new content, save game state |
| **Streaks** | Consecutive level completions = bonus multiplier |
| **Narrative** | Unique storyline for each state (political lore) |
| **Time Pressure** | Countdown timers simulate real deadline urgency |
| **Consequences** | Wrong choices = time/point penalties (teaches real impact) |

### Achievement Badges

- 🏆 **"First Vote"** — Complete Level 1
- ⏰ **"Early Bird"** — Register 30+ days early
- 👥 **"Accessibility Champion"** — Help all voters with accessibility needs
- 🔥 **"On Fire"** — 5-level streak without mistakes
- 🌍 **"All States Master"** — Complete levels in all 50 states
- ⚡ **"Speed Racer"** — Complete level in under 2 minutes

---

## 📦 Tech Stack

### Frontend
```
Framework:        Next.js 15+ (React 18+)
Language:         TypeScript
Styling:          Tailwind CSS + Framer Motion
State Management: Zustand (game state) + React Query (server state)
Game Mechanics:   Konva.js (drag-and-drop), react-beautiful-dnd
Testing:          Vitest + React Testing Library
Deployment:       Netlify
```

### Backend
```
Framework:        FastAPI (Python 3.10+)
Database:         PostgreSQL + SQLAlchemy ORM
Authentication:   JWT (stateless) with OAuth2PasswordRequestForm
Validation:       Pydantic
Testing:          pytest
Deployment:       Google Cloud Run
```

### Database
```
Primary:          PostgreSQL
ORM:              SQLAlchemy
Migrations:       Alembic
```

---

## 🗂️ Project Structure

```
votequest/
│
├── frontend/                          # Next.js App
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── package.json
│   ├── public/
│   │   └── assets/
│   │       ├── flags/                # State flags
│   │       ├── avatars/              # Voter avatars
│   │       └── icons/                # UI icons
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.tsx            # Root layout
│       │   ├── page.tsx              # Homepage
│       │   ├── auth/
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   ├── game/
│       │   │   ├── page.tsx          # Game hub
│       │   │   ├── level/[id]/page.tsx
│       │   │   └── results/page.tsx
│       │   ├── leaderboard/page.tsx
│       │   ├── profile/page.tsx
│       │   └── about/page.tsx
│       │
│       ├── components/
│       │   ├── Game/
│       │   │   ├── GameContainer.tsx
│       │   │   ├── LevelSelector.tsx
│       │   │   ├── Level1_Registration.tsx
│       │   │   ├── Level2_Campaign.tsx
│       │   │   ├── Level3_GOTV.tsx
│       │   │   └── Level4_Results.tsx
│       │   ├── UI/
│       │   │   ├── PointsDisplay.tsx
│       │   │   ├── ProgressBar.tsx
│       │   │   ├── TimerWidget.tsx
│       │   │   ├── AchievementPopup.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   └── Modal.tsx
│       │   ├── Leaderboard/
│       │   │   ├── LeaderboardTable.tsx
│       │   │   └── StateRanking.tsx
│       │   └── Layout/
│       │       ├── Header.tsx
│       │       └── Sidebar.tsx
│       │
│       ├── hooks/
│       │   ├── useGameState.ts
│       │   ├── useTimer.ts
│       │   ├── usePoints.ts
│       │   ├── useLeaderboard.ts
│       │   └── useAchievements.ts
│       │
│       ├── store/
│       │   └── gameStore.ts          # Zustand store
│       │
│       ├── lib/
│       │   ├── api.ts                # API client
│       │   └── utils.ts              # Helper functions
│       │
│       ├── types/
│       │   └── index.ts              # TypeScript interfaces
│       │
│       └── styles/
│           └── globals.css
│
├── backend/                           # FastAPI App
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── game.py
│   │   │   ├── leaderboard.py
│   │   │   └── states.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── game.py
│   │   │   ├── score.py
│   │   │   └── achievement.py
│   │   ├── schemas/
│   │   ├── utils/
│   │   │   ├── scoring.py
│   │   │   ├── validation.py
│   │   │   └── auth.py
│   │   └── crud/
│   │
│   ├── migrations/
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_game.py
│   │   ├── test_scoring.py
│   │   └── conftest.py
│   │
│   └── data/
│       └── election_data.json        # Seed data for all 50 states
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

#### `users`
```sql
- id (PK)
- username (UNIQUE, VARCHAR)
- email_hash (VARCHAR)
- password_hash (VARCHAR)
- state (CHAR(2), Foreign Key)
- total_score (INT, default 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `game_sessions`
```sql
- id (PK)
- user_id (FK -> users)
- state (CHAR(2))
- current_level (INT)
- progress_json (JSONB)
- started_at (TIMESTAMP)
- completed_at (TIMESTAMP, nullable)
```

#### `scores`
```sql
- id (PK)
- user_id (FK -> users)
- level (INT)
- points (INT)
- accuracy (FLOAT)
- time_taken (INT, seconds)
- timestamp (TIMESTAMP)
```

#### `achievements`
```sql
- id (PK)
- user_id (FK -> users)
- badge_name (VARCHAR)
- unlocked_at (TIMESTAMP)
```

#### `election_data`
```sql
- id (PK)
- state_code (CHAR(2), UNIQUE)
- state_name (VARCHAR)
- registration_deadline (DATE)
- early_voting_start (DATE)
- early_voting_end (DATE)
- election_day (DATE)
- polling_info (JSONB)
- id_requirements (JSONB)
- accessibility_rules (JSONB)
```

---

## 🎯 Scoring Algorithm

```python
def calculate_score(
    base_points: int = 100,
    time_taken: int,  # seconds
    correct_answers: int,
    total_answers: int,
    accessibility_bonus: bool = False
) -> int:

    # Time bonus: Up to +100 points for finishing under 3 minutes
    time_bonus = max(0, (300 - time_taken) / 3)

    # Accuracy multiplier (0 to 1)
    accuracy_multiplier = correct_answers / total_answers

    # Base calculation
    score = (base_points * accuracy_multiplier) + time_bonus

    # Accessibility bonus: +50 points for inclusive gameplay
    if accessibility_bonus:
        score += 50

    return int(score)
```

### Example Scoring Scenarios

| Scenario | Base | Time Bonus | Accuracy | Accessibility | **Total** |
|----------|------|-----------|----------|---------------|-----------|
| Perfect run (2:30) | 100 | +23.3 | ×1.0 | +50 | **173** |
| Good run (3:00) | 100 | +0 | ×0.9 | - | **90** |
| Moderate run (3:30) | 100 | -10 | ×0.8 | - | **70** |

---

## 🚀 Development Phases

### Phase 1: Project Setup & Infrastructure ✅ COMPLETED
- [x] Initialize Next.js with TypeScript
- [x] Configure Tailwind CSS + Prettier + ESLint
- [x] Setup Zustand store structure
- [x] Initialize FastAPI project with SQLAlchemy + PostgreSQL
- [x] Configure JWT authentication with automatic table creation
- [x] Seed election data (50 states)

### Phase 2: Core Game Engine ✅ COMPLETED
- [x] Implement `/api/game/start` endpoint
- [x] Build scoring calculation engine
- [x] Implement achievement checking and leaderboard queries
- [x] Build GameContainer and all four Level components
- [x] Implement drag-and-drop mechanics, timer, and results screen
- [x] Full TypeScript type coverage across all React components

### Phase 3: Gamification Features 🔄 IN PROGRESS
- [x] Points calculation and achievement unlock logic
- [x] Global and state-by-state leaderboard API
- [ ] Leaderboard UI components
- [ ] Badge display system
- [ ] Game state save/load to database

### Phase 4: Frontend UI & Polish 🔄 IN PROGRESS
- [x] Home/splash page, auth pages, level gameplay pages, results screen
- [x] Reusable component library
- [ ] Game hub page, leaderboard page, profile/stats page
- [ ] Dark mode, level transition animations, toast notifications

### Phase 5: State Data & Integration
- [x] All 50 states populated with real election data
- [x] State-specific rule engine
- [ ] Voter profile generator, election trivia database

### Phase 6: Testing & Deployment
- [ ] Unit + integration tests (backend: pytest, frontend: Vitest)
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline

---

## 📊 MVP Status

| Milestone | Status |
|-----------|--------|
| Level 1 fully playable | ✅ Done |
| Level 2–4 component structure | ✅ Done |
| User authentication | ✅ Done |
| Scoring system | ✅ Done |
| Full TypeScript coverage | ✅ Done |
| All 50 states with election data | ✅ Done |
| Frontend deployed | ✅ Live |
| Backend deployed | ✅ Live |
| Leaderboard UI | ⏳ Pending |
| Achievement badge display | ⏳ Pending |
| Mobile responsiveness testing | ⏳ Pending |
| Test suite (>80% coverage) | ⏳ Pending |

---

## 📈 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Game Management
```
POST   /api/game/start
GET    /api/game/session/{id}
POST   /api/game/level/{level}/submit
POST   /api/game/level/{level}/action
GET    /api/game/history
```

### Scoring & Achievements
```
GET    /api/leaderboard
GET    /api/leaderboard/weekly
GET    /api/leaderboard/state/{state}
GET    /api/achievements
GET    /api/stats
```

### Election Data
```
GET    /api/states
GET    /api/states/{state}
GET    /api/voters/generate
GET    /api/election-facts
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://votequest_user:password123@localhost:5432/votequest_db
SECRET_KEY=your-secret-key-min-32-chars-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000"]
ENVIRONMENT=development
DEBUG=true
```

---

## 🎮 Game State Flow

```
User lands on /           → Splash page
  ↓ clicks "Start Playing"
/auth/signup              → Creates account (username, email, password, state)
  ↓ auto-login
/game                     → Game Hub
  ↓ selects state + clicks "Play Level"
/game/level/1             → Level 1: Voter Registration Challenge
  │  ┌──────────────────────────────────────────────────────┐
  │  │ PLAYING: drag voter cards → registration zones        │
  │  │ Timer counts down from 3:00                          │
  │  │ Feedback: ✓ green / ✗ red per placement              │
  │  │ Submit early after 8+ placements OR wait for timer   │
  │  └──────────────────────────────────────────────────────┘
  ↓ level complete
/game/results             → Score tier (S/A/B/C/D/F), accuracy, time, achievements
  ↓
/leaderboard              → Global / weekly rankings
/profile                  → Stats, achievement badges
```

---

## 📦 Voter Profile Data Structure (Level 1)

```typescript
interface VoterProfile {
  id: string;
  name: string;
  age: number;
  emoji: string;
  situation: string;
  detail: string;
  answer: 'online' | 'mail' | 'in-person';
  hint: string;
}
```

| Situation | Correct Zone | Reason |
|-----------|-------------|--------|
| Has internet + valid ID | Online | Fast, standard path |
| Homebound / rural no internet | Mail-In | No alternative access |
| First-time voter (some states) | In-Person | State law requirement |
| Expired / lost ID | In-Person | Staff assistance needed |
| Language assistance needed | In-Person | Bilingual staff available |
| Overseas military (UOCAVA) | Mail-In | Federal provision |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 13+
- Git

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m app.seed
uvicorn app.main:app --reload
# http://localhost:8000/docs
```

### Docker Setup (Recommended)
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000/docs
# PostgreSQL: localhost:5432
docker-compose exec backend python -m app.seed
```

---

## 📱 Frontend Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage / Splash screen |
| `/auth/login` | Login page |
| `/auth/signup` | User registration |
| `/game` | Game hub |
| `/game/level/1` | Level 1 (Voter Registration) |
| `/game/results` | Post-level results screen |
| `/leaderboard` | Global + state rankings |
| `/profile` | User stats & achievements |
| `/about` | How elections work |

---

## 🔒 Security Notes

- **JWT tokens**: 24-hour expiry. Currently stored in `localStorage` (acceptable for MVP; switch to `httpOnly` cookies for production).
- **Passwords**: bcrypt-hashed via `passlib`.
- **CORS**: Restricted to `CORS_ORIGINS` list — never use `*` in production.
- **Rate limiting**: Not implemented in MVP. Add `slowapi` before production.
- **SQL injection**: SQLAlchemy ORM parameterizes all queries.

---

## 📚 Learning Outcomes

By playing VoteQuest, users will understand:

1. **Registration Process** — Deadlines, requirements, where to register
2. **Eligibility** — Age, citizenship, residency requirements
3. **Accessibility** — ADA accommodations, language assistance
4. **Voting Methods** — Early voting, mail-in, in-person
5. **State Variations** — Why each state has different rules
6. **Logistics** — Why counting takes time, how audits work
7. **Deadlines** — Why they matter and what happens if missed
8. **Civic Responsibility** — The work behind fair elections

---

## 🚀 Future Features

- [ ] Levels 2, 3, 4 fully implemented
- [ ] Multiplayer mode (real-time challenges)
- [ ] Teacher dashboard
- [ ] Mobile app (React Native)
- [ ] AI opponent (trivia battles, strategy)
- [ ] Internationalization (other countries' election processes)
- [ ] Social features (friend challenges, team mode)

---

## 🙏 Acknowledgments

- [Election Assistance Commission (EAC)](https://www.eac.gov)
- [Rock the Vote](https://www.rockthevote.org)
- [Common Cause](https://www.commoncause.org)
- Inspired by Civilization and Among Us

---

## 📝 License

MIT License — see [LICENSE](./LICENSE) for details.

---

**Version**: 1.0.0
