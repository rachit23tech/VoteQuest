'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/src/components/Layout/Header';
import { useGameStore } from '@/src/store/gameStore';
import { useApi } from '@/src/hooks/useApi';
import { US_STATES } from '@/src/types';
import { toast } from 'react-toastify';

const LEVELS = [
  {
    id: 1, emoji: '📋', title: 'Voter Registration', tag: 'PLAYABLE',
    desc: 'Drag 10 voter profiles to the correct registration zone before the 3-minute timer expires.',
    stats: ['10 voters', '3 min', 'Drag & Drop'],
    available: true,
    gradient: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)',
  },
  {
    id: 2, emoji: '📣', title: 'Campaign Trail', tag: 'PLAYABLE',
    desc: 'Manage budget, volunteers, and strategy while navigating state-specific rules.',
    stats: ['5 scenarios', '2 min', 'Strategy'],
    available: true,
    gradient: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)',
  },
  {
    id: 3, emoji: '🚌', title: 'Get Out The Vote', tag: 'PLAYABLE',
    desc: 'Solve early voting and polling place logistics on Election Day.',
    stats: ['5 puzzles', '2 min', 'Puzzle'],
    available: true,
    gradient: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)',
  },
  {
    id: 4, emoji: '📊', title: 'Election Night', tag: 'PLAYABLE',
    desc: 'Simulate vote counting, audits, and results certification.',
    stats: ['5 ballots', '1 min', 'Simulation'],
    available: true,
    gradient: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)',
  },
];

export default function GamePage() {
  const router = useRouter();
  const { username, userId, userState, selectedState, levelsCompleted, totalScore, setSession, setUser } = useGameStore();
  const { getCurrentUser, startGame } = useApi();

  const [state, setState] = useState(selectedState ?? userState ?? 'CA');
  const [starting, setStarting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { router.push('/auth/login'); return; }
    if (!userId) {
      getCurrentUser()
        .then(u => { setUser(u.id, u.username, u.state ?? ''); if (u.state) setState(u.state); })
        .catch(() => { localStorage.removeItem('token'); router.push('/auth/login'); })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, [userId, getCurrentUser, setUser, router]);

  const handlePlay = async (levelId: number) => {
    if (!state) { toast.error('Please select a state first.'); return; }
    setStarting(true);
    try {
      const session = await startGame(state);
      setSession(session.id, state);
    } catch { /* session may already exist */ }
    finally { setStarting(false); }
    router.push(`/game/level/${levelId}`);
  };

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E1A' }}>
      <div className="text-white/40">Loading…</div>
    </div>
  );

  const stateName = US_STATES.find(s => s.code === state)?.name ?? state;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        {/* Welcome card */}
        <div className="rounded-[2rem] p-8 mb-10 flex items-center justify-between overflow-hidden relative border border-white/10"
          style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)', boxShadow: '0 20px 40px -10px rgba(0,102,204,0.4)' }}>
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-blue-200 text-sm mb-2 font-medium tracking-wide uppercase">Welcome back, <span className="text-white font-black">{username ?? 'Strategist'}</span></div>
            <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">Game Hub</h1>
            <div className="flex items-center gap-4 mt-4 text-sm font-bold">
              <span className="bg-white/10 px-4 py-2 rounded-xl text-green-300 border border-white/10 shadow-inner">✅ {levelsCompleted.length} completed</span>
              <span className="bg-white/10 px-4 py-2 rounded-xl text-amber-300 border border-white/10 shadow-inner">⭐ {totalScore.toLocaleString()} pts</span>
            </div>
          </div>
          <div className="text-8xl opacity-80 relative z-10 animate-float drop-shadow-2xl">🗳️</div>
        </div>

        {/* State selector */}
        <div className="rounded-[2rem] p-6 mb-12 border bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-400">
                Playing as State
              </label>
              <div className="relative">
                <select value={state} onChange={e => setState(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl text-base font-bold text-white border transition-all appearance-none
                             focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  style={{ background: '#0A0E1A', borderColor: 'rgba(255,255,255,0.1)' }}>
                  {US_STATES.map(({ code, name }) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>
            <div className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">
              Each state has unique election rules, deadlines, and ID requirements. Pick yours for personalized gameplay and leaderboard rankings.
            </div>
          </div>
        </div>

        {/* Level grid */}
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-400">Choose a Level</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {LEVELS.map(level => {
            const completed = levelsCompleted.includes(level.id);
            return (
              <div key={level.id}
                className={`group relative rounded-[2rem] overflow-hidden border transition-all duration-300 ${
                  level.available ? 'hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,102,204,0.3)] hover:border-blue-500/50 cursor-pointer' : 'opacity-60'
                }`}
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', borderColor: level.available ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)' }}>

                {/* Glow effect on hover */}
                {level.available && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500"
                    style={{ background: 'radial-gradient(circle at top right, rgba(0,102,204,0.15) 0%, transparent 60%)' }} />
                )}

                <div className="p-8 relative z-10">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5"
                      style={{ background: level.available ? 'rgba(0,102,204,0.2)' : 'rgba(255,255,255,0.04)' }}>
                      {level.emoji}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-black px-3 py-1.5 rounded-full shadow-sm ${
                        level.available ? 'text-green-400' : 'text-slate-500'
                      }`}
                        style={{ background: level.available ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                                 border: `1px solid ${level.available ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                        {completed ? '✓ COMPLETED' : level.tag}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-bold mb-2 uppercase tracking-widest" style={{ color: '#3B9EFF' }}>Level {level.id}</div>
                  <h3 className="text-2xl font-black text-white mb-3 drop-shadow-sm">{level.title}</h3>
                  <p className="text-base leading-relaxed mb-6 font-medium text-slate-400 h-12">{level.desc}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-8">
                    {level.stats.map((s, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full font-bold"
                        style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {level.available ? (
                    <button
                      onClick={() => handlePlay(level.id)}
                      disabled={starting}
                      className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:brightness-110 disabled:opacity-60 shadow-lg"
                      style={{ background: level.gradient, boxShadow: '0 4px 20px rgba(0,102,204,0.3)' }}>
                      {starting ? 'Loading…' : completed ? '🔁 Play Again' : `▶ Play — ${stateName}`}
                    </button>
                  ) : (
                    <div className="w-full py-4 rounded-xl font-bold text-center text-base"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', border: '1px solid rgba(255,255,255,0.1)' }}>
                      🔒 Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-6 mt-10">
          {[
            { href: '/leaderboard', icon: '🏆', label: 'Leaderboard', sub: 'See top players globally' },
            { href: '/profile',     icon: '🎖️', label: 'Your Profile',   sub: 'Track your stats & badges' },
          ].map(({ href, icon, label, sub }) => (
            <Link key={href} href={href}
              className="flex items-center gap-6 rounded-[2rem] p-6 border transition-all hover:border-blue-500/40 hover:-translate-y-1 hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-4xl drop-shadow-md">{icon}</div>
              <div>
                <div className="font-black text-white text-lg mb-1">{label}</div>
                <div className="text-sm font-medium text-slate-400">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}


