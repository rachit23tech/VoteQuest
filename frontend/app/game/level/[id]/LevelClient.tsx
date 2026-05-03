'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/src/components/Layout/Header';
import { Level1Registration } from '@/src/components/Game/Level1_Registration';
import { Level2_Campaign } from '@/src/components/Game/Level2_Campaign';
import { Level3_GOTV } from '@/src/components/Game/Level3_GOTV';
import { Level4_ElectionNight } from '@/src/components/Game/Level4_ElectionNight';
import { useGameStore } from '@/src/store/gameStore';
import { useApi } from '@/src/hooks/useApi';
import type { LevelResult } from '@/src/types';

export function LevelClient({ id }: { id: string }) {
  const router = useRouter();
  const levelId = Number(id);

  const { selectedState, userId, addLevelCompletion } = useGameStore();
  const { submitLevel } = useApi();
  const [authChecked, setAuthChecked] = useState(false);
  const [state, setState] = useState(selectedState ?? 'CA');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (!userId) {
      router.push('/game');
      return;
    }
    setState(selectedState ?? 'CA');
    setAuthChecked(true);
  }, [userId, selectedState, router]);

  const handleComplete = async (result: LevelResult) => {
    try {
      await submitLevel(result.level, [{ level_completed: true }], result.time_taken);
    } catch {
      // Best-effort — store result locally regardless
    }
    addLevelCompletion(result.level, result.points);

    const params = new URLSearchParams({
      points: String(result.points),
      tier: result.tier,
      accuracy: String(result.accuracy),
      time: String(result.time_taken),
      correct: String(result.correct),
      total: String(result.total),
      achievements: result.new_achievements.join(','),
    });
    router.push(`/game/results?${params.toString()}`);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
        <div className="text-slate-400 text-lg">Loading level…</div>
      </div>
    );
  }

  if (levelId < 1 || levelId > 4 || isNaN(levelId)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A0E1A]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-black text-white">Level {levelId} is coming soon</h1>
          <p className="text-slate-400 text-lg">More content is being added!</p>
          <button onClick={() => router.push('/game')} className="mt-6 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)', boxShadow: '0 4px 20px rgba(0,102,204,0.4)' }}>
            ← Back to Game Hub
          </button>
        </div>
      </div>
    );
  }

  let LevelComponent = null;
  if (levelId === 1) LevelComponent = <Level1Registration state={state} onComplete={handleComplete} />;
  else if (levelId === 2) LevelComponent = <Level2_Campaign state={state} onComplete={handleComplete} />;
  else if (levelId === 3) LevelComponent = <Level3_GOTV state={state} onComplete={handleComplete} />;
  else if (levelId === 4) LevelComponent = <Level4_ElectionNight state={state} onComplete={handleComplete} />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A]">
      <Header />
      <main className="flex-1">
        {LevelComponent}
      </main>
    </div>
  );
}
