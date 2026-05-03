'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/src/components/Layout/Header';
import { useApi } from '@/src/hooks/useApi';
import { useGameStore } from '@/src/store/gameStore';
import type { LeaderboardEntry } from '@/src/types';

const RANK_DISPLAY: Record<number, { emoji: string; bg: string; text: string }> = {
  1: { emoji: '🥇', bg: 'rgba(255,184,28,0.12)', text: '#FFB81C' },
  2: { emoji: '🥈', bg: 'rgba(148,163,184,0.12)', text: '#94A3B8' },
  3: { emoji: '🥉', bg: 'rgba(251,146,60,0.12)',  text: '#FB923C' },
};

export default function LeaderboardPage() {
  const { getLeaderboard } = useApi();
  const { username } = useGameStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  useEffect(() => {
    setLoading(true);
    getLeaderboard(20)
      .then(d => setEntries(Array.isArray(d) ? d : d.leaderboard ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [tab, getLeaderboard]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0E1A' }}>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none" />
        
        {/* Hero */}
        <div className="text-center mb-12 relative z-10">
          <div className="text-7xl mb-6 animate-float drop-shadow-2xl">🏆</div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Leaderboard</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Top election strategists from across the country</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-[2rem] p-2 mb-12 w-fit mx-auto relative z-10 backdrop-blur-xl border border-white/10 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          {(['global', 'weekly'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-8 py-3.5 rounded-full text-sm font-black capitalize transition-all ${
                tab === t ? 'text-white shadow-[0_4px_20px_rgba(0,102,204,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              style={tab === t ? { background: 'linear-gradient(135deg, #0066CC, #0052A3)' } : {}}>
              {t === 'global' ? '🌍 Global Rankings' : '📅 Weekly Top'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-bold animate-pulse">Loading scores…</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="text-6xl mb-6 drop-shadow-lg">🏆</div>
            <div className="text-white font-black text-2xl mb-3">No scores yet</div>
            <div className="text-slate-400 text-base mb-10 font-medium">Be the first to make the board!</div>
            <a href="/game"
              className="inline-block px-10 py-4 rounded-xl font-black text-white transition-all hover:scale-105 shadow-[0_4px_20px_rgba(0,102,204,0.3)]"
              style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)' }}>
              Play Now →
            </a>
          </div>
        ) : (
          <div className="rounded-[2rem] overflow-hidden border backdrop-blur-xl shadow-2xl relative z-10" style={{ background: 'rgba(20,24,36,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}>
            {/* Table header */}
            <div className="grid grid-cols-[60px,1fr,100px,120px] gap-0 px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-white/5 bg-black/20">
              <span className="text-center">#</span>
              <span>Player</span>
              <span className="hidden sm:block">State</span>
              <span className="text-right">Score</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
              {entries.map((entry, i) => {
                const rank = entry.rank ?? i + 1;
                const isMe = entry.username === username;
                const r = RANK_DISPLAY[rank];

                return (
                  <div key={entry.username + i}
                    className={`grid grid-cols-[60px,1fr,100px,120px] gap-0 px-6 py-5 items-center border-b border-white/5 transition-all hover:bg-white/5 ${isMe ? 'bg-blue-900/20' : ''}`}>
                    {/* Rank */}
                    <div className="text-center">
                      {r ? (
                        <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-2xl shadow-inner border border-white/10"
                          style={{ background: r.bg }}>
                          {r.emoji}
                        </div>
                      ) : (
                        <span className="text-base font-black text-slate-500">{rank}</span>
                      )}
                    </div>

                    {/* Player */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base flex-shrink-0 text-white shadow-md border border-white/10"
                        style={{ background: isMe ? 'linear-gradient(135deg,#0066CC,#3B9EFF)' : 'rgba(255,255,255,0.05)' }}>
                        {entry.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-black text-base ${isMe ? 'text-blue-400 drop-shadow-sm' : 'text-white'}`}>
                          {entry.username}
                          {isMe && <span className="ml-2 text-xs text-blue-500 font-bold px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">YOU</span>}
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5 sm:hidden">{entry.state ?? '—'}</div>
                      </div>
                    </div>

                    {/* State */}
                    <div className="hidden sm:block text-sm font-medium text-slate-400">{entry.state ?? '—'}</div>

                    {/* Score */}
                    <div className="text-right font-black font-mono text-lg tracking-tight"
                      style={{ color: rank <= 3 ? (RANK_DISPLAY[rank]?.text ?? 'white') : '#94A3B8' }}>
                      {entry.total_score.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
