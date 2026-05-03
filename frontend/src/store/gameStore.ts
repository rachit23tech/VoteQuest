import { create } from 'zustand';

interface GameState {
  // User data
  userId: number | null;
  username: string | null;
  userState: string | null;
  totalScore: number;

  // Game session data
  currentSessionId: number | null;
  currentLevel: number;
  currentGameState: string | null;
  selectedState: string | null;

  // Progress tracking
  levelsCompleted: number[];
  achievements: string[];
  currentPoints: number;

  // UI state
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  setUser: (userId: number, username: string, state: string) => void;
  setSession: (sessionId: number, state: string) => void;
  setCurrentLevel: (level: number) => void;
  addLevelCompletion: (level: number, points: number) => void;
  unlockAchievement: (badge: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (message: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  userId: null,
  username: null,
  userState: null,
  totalScore: 0,
  currentSessionId: null,
  currentLevel: 1,
  currentGameState: null,
  selectedState: null,
  levelsCompleted: [],
  achievements: [],
  currentPoints: 0,
  isLoading: false,
  error: null,
  successMessage: null,

  // Actions
  setUser: (userId, username, state) =>
    set({
      userId,
      username,
      userState: state,
    }),

  setSession: (sessionId, state) =>
    set({
      currentSessionId: sessionId,
      selectedState: state,
    }),

  setCurrentLevel: (level) =>
    set({
      currentLevel: level,
    }),

  addLevelCompletion: (level, points) =>
    set((state) => ({
      levelsCompleted: [...state.levelsCompleted, level],
      currentPoints: points,
      totalScore: state.totalScore + points,
    })),

  unlockAchievement: (badge) =>
    set((state) => ({
      achievements: [...state.achievements, badge],
    })),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  setSuccess: (message) =>
    set({
      successMessage: message,
    }),

  reset: () =>
    set({
      userId: null,
      username: null,
      userState: null,
      totalScore: 0,
      currentSessionId: null,
      currentLevel: 1,
      currentGameState: null,
      selectedState: null,
      levelsCompleted: [],
      achievements: [],
      currentPoints: 0,
      isLoading: false,
      error: null,
      successMessage: null,
    }),
}));
