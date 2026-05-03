/**
 * useGameStore — Zustand store for the gamification system
 * 
 * Tracks XP, level, completed modules, quiz scores, badges, streaks,
 * and persists everything to localStorage.
 */
import { create } from "zustand";

// ── Level definitions ────────────────────────────────────────────────────────
const LEVELS = [
  { name: "New Citizen",            minXp: 0,    icon: "🌱", color: "#6b7280" },
  { name: "Informed Voter",         minXp: 200,  icon: "📖", color: "#3b82f6" },
  { name: "Civic Advocate",         minXp: 500,  icon: "🎯", color: "#8b5cf6" },
  { name: "Democracy Champion",     minXp: 1000, icon: "🏆", color: "#f59e0b" },
  { name: "Election Commissioner",  minXp: 2000, icon: "👑", color: "#ef4444" },
];

// ── Badge definitions ────────────────────────────────────────────────────────
const ALL_BADGES = [
  { id: "first_module",    name: "First Step",       icon: "👣", desc: "Complete your first learning module",          condition: (s) => s.completedModules.length >= 1 },
  { id: "five_modules",    name: "Knowledge Seeker", icon: "📚", desc: "Complete 5 learning modules",                 condition: (s) => s.completedModules.length >= 5 },
  { id: "all_modules",     name: "Module Master",    icon: "🎓", desc: "Complete all 12 learning modules",            condition: (s) => s.completedModules.length >= 12 },
  { id: "first_quiz",      name: "Quiz Rookie",      icon: "❓", desc: "Complete your first quiz",                    condition: (s) => s.quizzesCompleted >= 1 },
  { id: "five_quizzes",    name: "Quiz Warrior",     icon: "⚔️", desc: "Complete 5 quizzes",                          condition: (s) => s.quizzesCompleted >= 5 },
  { id: "perfect_score",   name: "Perfect Score",    icon: "💯", desc: "Get 100% on any quiz",                        condition: (s) => s.perfectScores >= 1 },
  { id: "ai_explorer",     name: "AI Explorer",      icon: "🤖", desc: "Ask ElectoBot 5 questions",                   condition: (s) => s.chatMessages >= 5 },
  { id: "ai_master",       name: "AI Master",        icon: "🧠", desc: "Ask ElectoBot 20 questions",                  condition: (s) => s.chatMessages >= 20 },
  { id: "xp_100",          name: "Rising Star",      icon: "⭐", desc: "Earn 100 XP",                                condition: (s) => s.xp >= 100 },
  { id: "xp_500",          name: "XP Hunter",        icon: "🌟", desc: "Earn 500 XP",                                condition: (s) => s.xp >= 500 },
  { id: "xp_1000",         name: "XP Legend",        icon: "💫", desc: "Earn 1000 XP",                               condition: (s) => s.xp >= 1000 },
  { id: "streak_3",        name: "On Fire",          icon: "🔥", desc: "Maintain a 3-day learning streak",            condition: (s) => s.streak >= 3 },
  { id: "streak_7",        name: "Week Warrior",     icon: "🗓️", desc: "Maintain a 7-day learning streak",            condition: (s) => s.streak >= 7 },
  { id: "timeline_viewer", name: "Time Traveler",    icon: "⏳", desc: "View the complete election timeline",         condition: (s) => s.timelineViewed },
];

// ── Persistence ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "electolearn_game_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try {
    const toSave = { ...state };
    // Remove functions
    delete toSave.addXp;
    delete toSave.completeModule;
    delete toSave.completeQuiz;
    delete toSave.addChatMessage;
    delete toSave.viewTimeline;
    delete toSave.checkBadges;
    delete toSave.resetProgress;
    delete toSave.getLevel;
    delete toSave.getLevelProgress;
    delete toSave.updateStreak;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

const saved = loadState();
const defaults = {
  xp: 0,
  completedModules: [],
  quizzesCompleted: 0,
  perfectScores: 0,
  totalCorrectAnswers: 0,
  totalQuestionsAttempted: 0,
  chatMessages: 0,
  earnedBadges: [],
  streak: 0,
  lastActiveDate: null,
  timelineViewed: false,
  xpLog: [], // { amount, reason, timestamp }
};

const initial = saved ? { ...defaults, ...saved } : defaults;

// ── Store ────────────────────────────────────────────────────────────────────
const useGameStore = create((set, get) => ({
  ...initial,

  addXp(amount, reason = "") {
    set((s) => {
      const newState = {
        xp: s.xp + amount,
        xpLog: [...s.xpLog.slice(-50), { amount, reason, timestamp: Date.now() }],
      };
      saveState({ ...s, ...newState });
      return newState;
    });
    // Check for new badges after XP change
    setTimeout(() => get().checkBadges(), 100);
  },

  completeModule(moduleId) {
    set((s) => {
      if (s.completedModules.includes(moduleId)) return {};
      const newState = {
        completedModules: [...s.completedModules, moduleId],
      };
      saveState({ ...s, ...newState });
      return newState;
    });
    get().addXp(50, `Completed module: ${moduleId}`);
    get().updateStreak();
  },

  completeQuiz(correctCount, totalCount) {
    const isPerfect = correctCount === totalCount;
    set((s) => {
      const newState = {
        quizzesCompleted: s.quizzesCompleted + 1,
        perfectScores: isPerfect ? s.perfectScores + 1 : s.perfectScores,
        totalCorrectAnswers: s.totalCorrectAnswers + correctCount,
        totalQuestionsAttempted: s.totalQuestionsAttempted + totalCount,
      };
      saveState({ ...s, ...newState });
      return newState;
    });
    const xpEarned = correctCount * 20 + (isPerfect ? 50 : 0);
    get().addXp(xpEarned, `Quiz: ${correctCount}/${totalCount}${isPerfect ? " (Perfect!)" : ""}`);
    get().updateStreak();
  },

  addChatMessage() {
    set((s) => {
      const newState = { chatMessages: s.chatMessages + 1 };
      saveState({ ...s, ...newState });
      return newState;
    });
    if (get().chatMessages % 5 === 0) {
      get().addXp(15, "Active learner — chatting with ElectoBot");
    }
    setTimeout(() => get().checkBadges(), 100);
  },

  viewTimeline() {
    set((s) => {
      if (s.timelineViewed) return {};
      const newState = { timelineViewed: true };
      saveState({ ...s, ...newState });
      return newState;
    });
    if (!get().timelineViewed) {
      get().addXp(30, "Explored the election timeline");
    }
  },

  updateStreak() {
    const today = new Date().toDateString();
    set((s) => {
      if (s.lastActiveDate === today) return {};
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = s.lastActiveDate === yesterday ? s.streak + 1 : 1;
      const newState = { streak: newStreak, lastActiveDate: today };
      saveState({ ...s, ...newState });
      return newState;
    });
    setTimeout(() => get().checkBadges(), 100);
  },

  checkBadges() {
    const state = get();
    const newBadges = [];
    for (const badge of ALL_BADGES) {
      if (!state.earnedBadges.includes(badge.id) && badge.condition(state)) {
        newBadges.push(badge.id);
      }
    }
    if (newBadges.length > 0) {
      set((s) => {
        const newState = { earnedBadges: [...s.earnedBadges, ...newBadges] };
        saveState({ ...s, ...newState });
        return newState;
      });
    }
    return newBadges;
  },

  getLevel() {
    const { xp } = get();
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (xp >= l.minXp) level = l;
    }
    return level;
  },

  getLevelProgress() {
    const { xp } = get();
    const currentIdx = LEVELS.findIndex((l, i) => i === LEVELS.length - 1 || xp < LEVELS[i + 1].minXp);
    const current = LEVELS[currentIdx];
    const next = LEVELS[currentIdx + 1];
    if (!next) return { progress: 100, current, next: null, xpNeeded: 0 };
    const xpInLevel = xp - current.minXp;
    const xpForLevel = next.minXp - current.minXp;
    return {
      progress: Math.min(100, Math.round((xpInLevel / xpForLevel) * 100)),
      current,
      next,
      xpNeeded: next.minXp - xp,
    };
  },

  resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    set(defaults);
  },
}));

export { LEVELS, ALL_BADGES };
export default useGameStore;
