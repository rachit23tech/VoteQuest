'use client';

import type { LeaderboardEntry } from '@/src/types';

interface Props {
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

const RANK_EMOJIS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardTable({ entries, currentUsername }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-4xl mb-3">🏆</div>
        <div>No scores yet — be the first to play!</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="px-4 py-3 text-left font-semibold text-slate-500 w-12">Rank</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">Player</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500 hidden sm:table-cell">State</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-500">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const rank = entry.rank ?? i + 1;
            const isCurrentUser = entry.username === currentUsername;

            return (
              <tr
                key={entry.username + i}
                className={`border-b border-slate-50 transition-colors ${
                  isCurrentUser ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-4 py-3 text-center">
                  {RANK_EMOJIS[rank] ?? (
                    <span className="text-slate-500 font-mono text-xs">{rank}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                      {entry.username[0].toUpperCase()}
                    </div>
                    <span className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-slate-900'}`}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-1 text-xs text-blue-500">(you)</span>}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">
                  {entry.state ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">
                  {entry.total_score.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
