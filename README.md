# VoteQuest - Gamified Election Assistant

> An interactive, gamified platform to teach election processes, timelines, and civic engagement through gameplay. Transform voters into election strategists.

**Status**: Phase 2 Complete — Level 1 fully playable end-to-end | Auth system fixed | TypeScript types updated  
**Timeline**: 4-6 weeks for MVP  
**Tech Stack**: React 18+ (Next.js 14+) with TypeScript | FastAPI | PostgreSQL  
**Target Users**: High school students, first-time voters, civics classes  
**Last Updated**: May 2, 2026

---

## 🎮 Project Vision

Most election resources are dry, static, and forgettable. **VoteQuest** gamifies the learning experience—users progress through levels as virtual campaign managers, earning points and badges while mastering real election processes.

### Recent Fixes & Improvements (May 2, 2026)

✅ **TypeScript Type System**: Added `@types/react` and `@types/react-dom` for complete TypeScript support across all React components  
✅ **Authentication**: Fixed OAuth2PasswordRequestForm login credentials format - now sends properly formatted URLSearchParams  
✅ **Database**: Automatic table creation on server startup prevents registration/login failures  
✅ **Type Annotations**: All React hooks and callbacks now have explicit type annotations to eliminate implicit `any` types  
✅ **Frontend Components**: All four game levels (Level1-4) components created with proper TypeScript interfaces  

### What Makes It Stand Out

✅ **Interactive** - Drag-and-drop, puzzle-based learning  
✅ **Personalized** - State-specific rules embedded in gameplay  
✅ **Engaging** - Points, badges, leaderboards, time pressure  
✅ **Educational** - Master real deadlines, requirements, logistics  
✅ **Shareable** - Compete with friends, viral potential  
✅ **Mobile-First** - Works on any device  

---

## 📋 Feature Overview

### Core Gameplay (MVP)

#### **Level 1: Voter Registration Challenge** (Weeks 2-3)
- **Mechanics**: Drag voter profiles to correct registration centers
- **Duration**: 3-minute timer
- **Challenge**: 8/10 voters must be registered correctly
- **State Rules**: ID requirements, eligibility checks vary by state
- **Scoring**: Base 100 + time bonus + accuracy multiplier
- **Learning Outcome**: Understand registration deadlines and requirements

#### **Level 2: Campaign Trail** (Post-MVP)
- Resource management (budget, volunteers, time)
- Navigate state-specific voting rules
- Boss battle: Debate opponent with election trivia

#### **Level 3: Get Out The Vote (GOTV)** (Post-MVP)
- Early voting mechanics puzzle
- Polling place logistics challenges
- Day-of problem-solving scenarios

#### **Level 4: Election Night** (Post-MVP)
- Results calculation mechanics
- Vote counting process simulation
- Final scoring and achievements

---

## 🏆 Gamification Elements

| Feature | Implementation |
|---------|-----------------|
| **Points System** | +100 base per level, +time bonus, +accuracy multiplier |
| **Achievements** | 6 badges: "First Vote", "Early Bird", "Accessibility Champion", "On Fire", "All States Master", "Speed Racer" |
| **Leaderboard** | Global top 10, weekly rankings, state-by-state competition |
| **Progression** | 4 levels, unlock new content, save game state |
| **Streaks** | Consecutive level completions = bonus multiplier |
| **Narrative** | Unique storyline for each state (political lore) |
| **Time Pressure** | Countdown timers simulate real deadline urgency |
| **Consequences** | Wrong choices = time/point penalties (teaches real impact) |

### Achievement Badges

- 🏆 **"First Vote"** - Complete Level 1
- ⏰ **"Early Bird"** - Register 30+ days early  
- 👥 **"Accessibility Champion"** - Help all voters with accessibility needs
- 🔥 **"On Fire"** - 5-level streak without mistakes
- 🌍 **"All States Master"** - Complete levels in all 50 states
- ⚡ **"Speed Racer"** - Complete level in <2 minutes

---

## 📦 Tech Stack

### Frontend
```
Framework:        Next.js 14+ (React 18+)
Language:         TypeScript with full type support (@types/react @types/react-dom)
Styling:          Tailwind CSS + Framer Motion
State Management: Zustand (game state) + React Query (server state)
Game Mechanics:   Konva.js (drag-and-drop), react-beautiful-dnd
Testing:          Vitest + React Testing Library
Deployment:       Vercel
```

### Backend
```
Framework:        FastAPI (Python 3.10+) with automatic table creation on startup
Database:         PostgreSQL + SQLAlchemy ORM
Authentication:   JWT (stateless) with OAuth2PasswordRequestForm validation
Validation:       Pydantic
Testing:          pytest
Deployment:       Railway / Heroku / AWS
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
election-game/
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
│   ├── main.py                        # App entry point
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Environment variables
│   ├── .env.example
│   │
│   ├── app/
│   │   ├── main.py                    # FastAPI setup
│   │   ├── config.py                  # Configuration
│   │   ├── database.py                # Database connection
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                # Auth endpoints
│   │   │   ├── game.py                # Game logic endpoints
│   │   │   ├── leaderboard.py         # Leaderboard endpoints
│   │   │   └── states.py              # Election data endpoints
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                # User model
│   │   │   ├── game.py                # GameSession model
│   │   │   ├── score.py               # Score model
│   │   │   └── achievement.py         # Achievement model
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                # Pydantic schemas
│   │   │   ├── game.py
│   │   │   ├── score.py
│   │   │   └── achievement.py
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── scoring.py             # Scoring algorithm
│   │   │   ├── validation.py          # Game validation logic
│   │   │   └── auth.py                # JWT helpers
│   │   │
│   │   └── crud/
│   │       ├── __init__.py
│   │       ├── user.py                # User CRUD operations
│   │       ├── game.py                # Game CRUD operations
│   │       └── score.py               # Score CRUD operations
│   │
│   ├── migrations/
│   │   └── (Alembic migration files)
│   │
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_game.py
│   │   ├── test_scoring.py
│   │   └── conftest.py
│   │
│   └── data/
│       └── election_data.json         # Seed data for all 50 states
│
├── docker-compose.yml                 # Development environment
├── .gitignore
└── README.md                          # This file
```

---

## 🗄️ Database Schema

### Core Tables

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

### Phase 1: Project Setup & Infrastructure (Week 1) ✅ COMPLETED
**Frontend Setup**
- [x] Initialize Next.js with TypeScript
- [x] Configure Tailwind CSS + Prettier + ESLint
- [x] Setup Zustand store structure
- [x] Create API client wrapper
- [x] Configure environment variables
- [x] Install @types/react and @types/react-dom for full TypeScript support

**Backend Setup**
- [x] Initialize FastAPI project
- [x] Configure SQLAlchemy + PostgreSQL
- [x] Setup CORS, logging, error handling
- [x] Create Pydantic schemas
- [x] Configure JWT authentication with automatic table creation

**Database**
- [x] Define all models
- [x] Create Alembic migrations
- [x] Seed election data (50 states)
- [x] Create test database

### Phase 2: Core Game Engine (Weeks 2-3) ✅ COMPLETED
**Backend Game Logic**
- [x] Implement `/api/game/start` endpoint
- [x] Build scoring calculation engine
- [x] Create game validation logic
- [x] Implement achievement checking
- [x] Setup leaderboard queries
- [x] Fixed OAuth2PasswordRequestForm login credentials format

**Frontend Game Architecture**
- [x] Build GameContainer component
- [x] Create Level1_Registration component
- [x] Create Level2_Campaign component
- [x] Create Level3_GOTV component
- [x] Create Level4_ElectionNight component
- [x] Implement drag-and-drop mechanics
- [x] Build timer component with countdown
- [x] Create points tracking system
- [x] Build results screen
- [x] Fixed TypeScript type annotations for React hooks and callbacks

### Phase 3: Gamification Features (Weeks 3-4) 🔄 IN PROGRESS
**Points & Achievements**
- [x] Implement points calculation in backend
- [x] Create achievement unlock logic
- [x] Build achievement popup animations
- [ ] Create badge display system

**Leaderboard**
- [x] Implement global leaderboard API
- [x] Implement state-by-state rankings
- [ ] Create leaderboard UI components
- [ ] Add real-time score updates

**User Progression**
- [ ] Save/load game state to DB
- [ ] Implement resume functionality
- [ ] Create user stats page
- [ ] Track gameplay history

### Phase 4: Frontend UI & Polish (Weeks 4-5) 🔄 IN PROGRESS
**Design System**
- [x] Create Tailwind color palette
- [x] Build reusable component library
- [ ] Implement dark mode support
- [ ] Create typography system

**Pages & Navigation**
- [x] Home/splash page
- [x] Auth pages (login/signup)
- [ ] Game hub page
- [x] Level gameplay pages
- [x] Results screen
- [ ] Leaderboard page
- [ ] Profile/stats page
- [ ] About/rules page

**Animations & UX**
- [ ] Level transition animations
- [ ] Achievement unlock confetti
- [x] Smooth drag-and-drop feedback
- [ ] Loading skeletons
- [ ] Toast notifications

### Phase 5: State Data & Integration (Week 5-6)
**Election Data Population**
- [x] Populate 50 states with real data
- [ ] Create voter profile generator
- [x] Setup state-specific rule engine
- [ ] Create election trivia database

**API Endpoints**
- [x] GET /api/states - all states
- [x] GET /api/states/{state_code} - specific state
- [x] GET /api/voters - random voter profiles
- [ ] GET /api/election-facts - trivia questions

### Phase 6: Testing & Deployment (Week 6)
**Backend Testing**
- [ ] Unit tests for scoring logic
- [ ] Integration tests for game flow
- [ ] Database transaction tests
- [ ] API endpoint tests

**Frontend Testing**
- [ ] Component snapshot tests
- [ ] User interaction tests
- [ ] Game state transition tests
- [ ] Integration tests

**Deployment**
- [ ] Setup Vercel deployment for frontend
- [ ] Setup Railway/Heroku for backend
- [ ] Configure production environment
- [ ] Setup monitoring and logging
- [ ] Create CI/CD pipeline

---

## 📊 MVP Success Criteria

Before moving to post-MVP features, the following must be complete:

✅ **Level 1** fully playable end-to-end  
✅ **Level 2, 3, 4** component structure in place  
✅ **User authentication** (register/login/logout)  
✅ **Scoring system** accurate and fair  
✅ **TypeScript** full type coverage (no implicit `any`)  
⏳ **Leaderboard** shows top 10 scores (API ready, UI pending)  
⏳ **3+ achievements** unlockable (logic ready, UI pending)  
⏳ **Mobile responsive** (works on all screen sizes - needs testing)  
⏳ **Performance** (<2s initial load - needs optimization)  
✅ **All 50 states** have election data  
⏳ **Testing** (>80% code coverage - needs test suite)  
⏳ **Deployment** live on Vercel + Railway (pending)  

---

## 📈 API Endpoints (Backend)

### Authentication
```
POST   /api/auth/register          # Create new user
POST   /api/auth/login             # User login (returns JWT)
POST   /api/auth/logout            # User logout
GET    /api/auth/me                # Current user info (requires JWT)
```

### Game Management
```
POST   /api/game/start             # Start new game session
GET    /api/game/session/{id}      # Get game session details
POST   /api/game/level/{level}/submit   # Submit level completion
POST   /api/game/level/{level}/action   # Execute game action
GET    /api/game/history           # Get user's game history
```

### Scoring & Achievements
```
GET    /api/leaderboard            # Global top 10 scores
GET    /api/leaderboard/weekly     # Weekly rankings
GET    /api/leaderboard/state/{state}   # State rankings
GET    /api/achievements           # Get user's achievements
POST   /api/achievements/check     # Check achievement unlock
GET    /api/stats                  # Get user statistics
```

### Election Data
```
GET    /api/states                 # All states with election info
GET    /api/states/{state}         # Specific state details
GET    /api/voters/generate        # Generate random voter profiles
GET    /api/election-facts         # Trivia questions/facts
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
  ↓ level complete (time up or 10/10 placed)
/game/results             → Score tier (S/A/B/C/D/F), accuracy, time, achievements
  ↓ "Play Again" or "Game Hub"
/leaderboard              → Global / weekly rankings
/profile                  → Stats, achievement badges
```

---

## 📦 Voter Profile Data Structure (Level 1)

```typescript
interface VoterProfile {
  id: string;               // "v1" .. "v10"
  name: string;             // Display name
  age: number;              // Affects eligibility hints
  emoji: string;            // Avatar emoji
  situation: string;        // Short tag: "College student", "Elderly, homebound"
  detail: string;           // One-line context: "Has valid ID and internet access."
  answer: 'online' | 'mail' | 'in-person';  // Correct registration method
  hint: string;             // Educational explanation shown on click
}
```

### Registration Zone Decision Logic

| Situation | Correct Zone | Reason |
|-----------|-------------|--------|
| Has internet + valid ID | Online | Fast, standard path |
| Homebound / rural no internet | Mail-In | No alternative access |
| First-time voter (some states) | In-Person | State law requirement |
| Expired / lost ID | In-Person | Staff assistance needed |
| Language assistance needed | In-Person | Bilingual staff available |
| Overseas military (UOCAVA) | Mail-In | Federal provision |

---

## � Known Issues & Next Steps

### Current Blockers
1. **Leaderboard UI Components**: API endpoints exist but UI components need to be built
2. **Achievement Badge Display**: Logic complete but UI components pending  
3. **Game State Persistence**: Players cannot resume games after leaving
4. **Level 2-4 Gameplay Logic**: Components exist but game mechanics need implementation

### Immediate Next Steps (Priority Order)
1. [ ] Build LeaderboardTable UI component (HIGH)
2. [ ] Implement game state save/load to database (HIGH)
3. [ ] Add game-level UI components for Levels 2-4 (HIGH)
4. [ ] Create comprehensive test suite (MEDIUM)
5. [ ] Optimize frontend bundle size (MEDIUM)
6. [ ] Setup CI/CD pipeline (MEDIUM)
7. [ ] Add real-time leaderboard updates via WebSocket (LOW)

---

## �🔒 Security Notes

- **JWT tokens**: 24-hour expiry (`ACCESS_TOKEN_EXPIRE_MINUTES=1440`). Store in `localStorage` (acceptable for MVP; upgrade to `httpOnly` cookie for production).
- **Passwords**: bcrypt-hashed with cost factor 12 via `passlib`.
- **CORS**: Restricted to `CORS_ORIGINS` list. Never use `*` in production.
- **Rate limiting**: Not implemented in MVP. Add `slowapi` or API gateway rules before production.
- **Email hashing**: The `email` field stores the raw email in the `users` table. Hash it for GDPR compliance in production.
- **SQL injection**: SQLAlchemy ORM parameterizes all queries.

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
cp .env.example .env.local   # or create .env.local with NEXT_PUBLIC_API_URL
npm run dev
# http://localhost:3000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Copy and edit .env
cp .env.example .env
# Create tables and seed election data
python -m app.seed
# Start server
uvicorn app.main:app --reload
# http://localhost:8000/docs
```

### Docker Setup (Recommended)
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000/docs
# PostgreSQL: localhost:5432
# Then seed: docker-compose exec backend python -m app.seed
```

---

## 📱 Frontend Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage / Splash screen |
| `/auth/login` | Login page |
| `/auth/signup` | User registration |
| `/game` | Game hub (select level) |
| `/game/level/1` | Level 1 (Voter Registration) |
| `/game/results` | Post-level results screen |
| `/leaderboard` | Global + state rankings |
| `/profile` | User stats & achievements |
| `/about` | How elections work (reference) |

---

## 🧪 Testing Strategy

### Backend Tests (pytest)
- Unit tests for scoring algorithm
- Integration tests for game flow
- Database transaction tests
- API endpoint validation

### Frontend Tests (Vitest)
- Component snapshot tests
- User interaction simulations
- Game state transitions
- API integration mocks

### E2E Tests (Playwright)
- Full user journey (register → play → view leaderboard)
- State persistence
- Error handling

---

## 🚢 Deployment Strategy

### Frontend (Vercel)
```bash
npm install -g vercel
vercel link
vercel deploy --prod
```

### Backend (Railway)
```bash
# Connect GitHub repo to Railway
# Set environment variables
# Auto-deploy on push to main
```

### Database (Managed PostgreSQL)
- Railway managed PostgreSQL or
- AWS RDS PostgreSQL or
- Heroku Postgres

---

## 🎨 UI/UX Design System

### Color Palette
```
Primary:     #0066CC (Democratic Blue)
Secondary:  #E81B23 (Republican Red)
Accent:     #FFB81C (Warning/Election Gold)
Success:    #28A745
Error:      #DC3545
Neutral:    #6C757D
Background: #FFFFFF (Light) / #1A1A1A (Dark)
```

### Typography
- **Headings**: Inter Bold 32px/28px/24px/20px
- **Body**: Inter Regular 16px/14px
- **Buttons**: Inter Semibold 16px
- **Small**: Inter Regular 12px

### Component Library
- Button (primary, secondary, danger)
- Card (elevated, outlined)
- Modal (dialog, alert)
- Input (text, number, select)
- Progress (bar, circular)
- Toast (success, error, warning)
- Badge (achievement, status)

---

## 📚 Learning Outcomes

By playing VoteQuest, users will understand:

1. **Registration Process** - Deadlines, requirements, where to register
2. **Eligibility** - Age, citizenship, residency requirements
3. **Accessibility** - ADA accommodations, language assistance
4. **Voting Methods** - Early voting, mail-in, in-person
5. **State Variations** - Why each state has different rules
6. **Logistics** - Why counting takes time, how audits work
7. **Deadlines** - Why they matter and what happens if missed
8. **Civic Responsibility** - The work behind fair elections

---

## 🚀 Future Features (Post-MVP)

- [ ] Levels 2, 3, 4 fully implemented
- [ ] Multiplayer mode (real-time challenges)
- [ ] Teacher dashboard (organize classes, track student progress)
- [ ] Mobile app (iOS + Android via React Native)
- [ ] AI opponent (trivia battles, strategy)
- [ ] Internationalization (other countries' election processes)
- [ ] Accessibility features (screen readers, high contrast)
- [ ] Real-time notifications
- [ ] Social features (friend challenges, team mode)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines.

---

## 📞 Contact & Support

- **Email**: support@votequest.app
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

## 🙏 Acknowledgments

- Election Assistance Commission (EAC)
- Rock the Vote
- Common Cause
- Inspired by games like Civilization and Among Us

---

**Last Updated**: April 25, 2026  
**Version**: 1.0.0-alpha (Level 1 playable)
