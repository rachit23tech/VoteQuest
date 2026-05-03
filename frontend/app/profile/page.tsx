'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/src/components/Layout/Header';
import { useApi } from '@/src/hooks/useApi';
import { useGameStore } from '@/src/store/gameStore';

const BADGES = [
  { id:'first_vote',             emoji:'🏆', name:'First Vote',             desc:'Completed Level 1',             color:'#FFB81C' },
  { id:'early_bird',             emoji:'⏰', name:'Early Bird',             desc:'Finished in under 30 seconds',  color:'#3B9EFF' },
  { id:'accessibility_champion', emoji:'👥', name:'Accessibility Champion', desc:'Helped all accessibility voters', color:'#A78BFA' },
  { id:'on_fire',                emoji:'🔥', name:'On Fire',                desc:'5-level no-mistake streak',     color:'#FB923C' },
  { id:'speed_racer',            emoji:'⚡', name:'Speed Racer',            desc:'Completed in under 2 minutes',  color:'#22C55E' },
  { id:'all_states_master',      emoji:'🌍', name:'All States Master',      desc:'Played all 50 states',          color:'#E81B23' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { getUserStats, getAchievements } = useApi();
  const { username, userState, totalScore, levelsCompleted, achievements: storeAchievements } = useGameStore();

  const [stats, setStats] = useState<Record<string, number>>({});
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([getUserStats().catch(() => ({})), getAchievements().catch(() => [])])
      .then(([s, a]) => {
        setStats(s as Record<string, number>);
        const names = Array.isArray(a)
          ? a.map((x: { badge_name?: string } | string) => typeof x === 'string' ? x : x.badge_name ?? '')
          : [];
        setEarned(new Set([...names, ...storeAchievements]));
      })
      .finally(() => setLoading(false));
  }, [router, getUserStats, getAchievements, storeAchievements]);

  const earnedCount = BADGES.filter(b => earned.has(b.id)).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] pointer-events-none" />

        {/* Profile header */}
        <div className="rounded-[2rem] p-10 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 border bg-white/5 backdrop-blur-xl shadow-2xl relative z-10"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white flex-shrink-0 shadow-lg border border-white/10 relative"
            style={{ background: 'linear-gradient(135deg, #0066CC, #3B9EFF)', boxShadow: '0 0 40px rgba(0,102,204,0.4)' }}>
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 pointer-events-none" />
            {(username ?? '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-5xl font-black text-white leading-tight drop-shadow-md mb-3">{username ?? 'Strategist'}</h1>
            <div className="text-slate-400 text-base font-bold flex items-center justify-center md:justify-start gap-4 flex-wrap">
              {userState && <span className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">📍 {userState}</span>}
              <span className="bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-inner" style={{ color: '#FFB81C' }}>⭐ {totalScore.toLocaleString()} pts</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">🏅 {earnedCount}/{BADGES.length} badges</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-600">Loading profile…</div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
              {[
                { emoji:'🎮', label:'Games Played', value: stats.games_played ?? levelsCompleted.length },
                { emoji:'⭐', label:'Best Score',   value: (stats.best_score ?? totalScore).toLocaleString() },
                { emoji:'✅', label:'Levels Done',  value: stats.levels_completed ?? levelsCompleted.length },
                { emoji:'🎯', label:'Avg Accuracy', value: stats.average_accuracy != null ? `${Math.round((stats.average_accuracy as number)*100)}%` : '—' },
              ].map(({ emoji, label, value }) => (
                <div key={label} className="rounded-[2rem] p-6 text-center border bg-white/5 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/10 shadow-lg"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="text-4xl mb-4 drop-shadow-md">{emoji}</div>
                  <div className="text-3xl font-black text-white drop-shadow-sm mb-1">{value}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">
              Achievements — {earnedCount}/{BADGES.length} earned
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {BADGES.map(b => {
                const isEarned = earned.has(b.id);
                return (
                  <div key={b.id}
                    className={`flex items-center gap-5 rounded-[2rem] p-6 border transition-all ${
                      isEarned ? 'hover:-translate-y-1 hover:shadow-xl' : 'opacity-40 grayscale'
                    }`}
                    style={{
                      background: isEarned ? `linear-gradient(135deg, ${b.color}15, rgba(255,255,255,0.02))` : 'rgba(255,255,255,0.02)',
                      borderColor: isEarned ? `${b.color}40` : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(10px)',
                    }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-inner border"
                      style={{ background: isEarned ? `${b.color}20` : 'rgba(255,255,255,0.04)', borderColor: isEarned ? `${b.color}30` : 'transparent' }}>
                      {b.emoji}
                    </div>
                    <div>
                      <div className="font-black text-white text-lg mb-1">{b.name}</div>
                      <div className="text-sm font-medium text-slate-400 leading-relaxed">{b.desc}</div>
                      {isEarned && (
                        <div className="text-xs font-black mt-2 uppercase tracking-widest" style={{ color: b.color }}>✓ Earned</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
