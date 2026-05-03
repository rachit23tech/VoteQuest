# 🚀 Quick Start Guide - VoteQuest

Get the project running in **5 minutes**!

---

## Option A: Docker (Easiest - Recommended) ⭐

### Prerequisites
- Docker & Docker Compose installed
- `docker --version` should work

### Steps

```bash
# 1. Navigate to project root
cd "c:\Users\arora\Desktop\Prompting 2"

# 2. Start all services
docker-compose up -d

# 3. Wait 30 seconds for database to initialize...

# 4. Done! Access:
#    Frontend:  http://localhost:3000
#    Backend:   http://localhost:8000
#    API Docs:  http://localhost:8000/docs
#    Database:  localhost:5432
```

**Stop everything:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f backend  # Backend logs
docker-compose logs -f frontend # Frontend logs
```

---

## Option B: Local Development (Manual)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup database (PostgreSQL must be running)
# Edit .env with your DATABASE_URL
copy .env.example .env

# 5. Start server
uvicorn app.main:app --reload --port 8000
# Visit: http://localhost:8000/docs
```

### Frontend Setup (New Terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

# 4. Start dev server
npm run dev
# Visit: http://localhost:3000
```

---

## 🎮 First Time User Experience

### Test the API
1. Go to http://localhost:8000/docs
2. Try "POST /api/auth/register"
3. Create account:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "state": "PA"
   }
   ```
4. Click "Execute"
5. You should get user data back!

### Test Frontend
1. Go to http://localhost:3000
2. You should see the homepage
3. (More UI coming in Phase 2)

---

## 📚 Project Structure at a Glance

```
election-game/
├── backend/        ← Python/FastAPI
│   ├── app/        ← Core application code
│   └── requirements.txt
├── frontend/       ← React/Next.js
│   └── src/        ← React components
├── docker-compose.yml
└── README.md
```

---

## 🔧 Common Commands

| Command | What it does |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs backend` | View backend logs |
| `npm run dev` (frontend) | Start Next.js dev server |
| `uvicorn app.main:app --reload` (backend) | Start FastAPI server |
| `npm run build` (frontend) | Build for production |

---

## 📊 What You Have

✅ **Backend (FastAPI)**
- User authentication
- Game session management
- Scoring system
- Leaderboard API
- 20+ endpoints ready

✅ **Frontend (Next.js)**
- State management (Zustand)
- Custom hooks
- UI components
- TypeScript setup

✅ **Database**
- PostgreSQL with models
- 5 main tables
- Ready for migrations

---

## ❓ Stuck?

### Port already in use?
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database connection error?
- PostgreSQL must be running
- Check DATABASE_URL in .env
- Verify credentials are correct

### npm install failed?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next: Build Level 1!

When you're ready, check Phase 2 of README.md to start building:
- The voter registration game
- Drag-and-drop mechanics
- Game timer UI

---

**Happy coding! 🎮**
