'use client';

import { useGameStore } from '@/src/store/gameStore';

export const usePoints = () => {
  const { currentPoints, totalScore, addLevelCompletion } = useGameStore();

  const calculateScore = (
    basePoints: number = 100,
    timeTaken: number,
    correctAnswers: number,
    totalAnswers: number,
    accessibilityBonus: boolean = false
  ): number => {
    const timeBonus = Math.max(0, (300 - timeTaken) / 3);
    const accuracyMultiplier =
      totalAnswers > 0 ? correctAnswers / totalAnswers : 1;
    let score = basePoints * accuracyMultiplier + timeBonus;

    if (accessibilityBonus) {
      score += 50;
    }

    return Math.floor(score);
  };

  const submitLevel = (level: number, points: number) => {
    addLevelCompletion(level, points);
  };

  const getScoreTier = (score: number): string => {
    if (score >= 150) return 'S';
    if (score >= 120) return 'A';
    if (score >= 90) return 'B';
    if (score >= 60) return 'C';
    if (score >= 30) return 'D';
    return 'F';
  };

  return {
    currentPoints,
    totalScore,
    calculateScore,
    submitLevel,
    getScoreTier,
  };
};
