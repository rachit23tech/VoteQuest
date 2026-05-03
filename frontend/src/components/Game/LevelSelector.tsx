'use client';

import Link from 'next/link';

interface Level {
  id: number;
  title: string;
  emoji: string;
  desc: string;
  duration: string;
  available: boolean;
  mechanics: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Voter Registration Challenge',
    emoji: '📋',
    desc: 'Route voter profiles to the correct registration method before time runs out.',
    duration: '3 min',
    available: true,
    mechanics: 'Drag & Drop · 10 voters',
  },
  {
    id: 2,
    title: 'Campaign Trail',
    emoji: '📣',
    desc: 'Manage budget and volunteers while navigating state-specific voting rules.',
    duration: '5 min',
    available: false,
    mechanics: 'Resource Management',
  },
  {
    id: 3,
    title: 'Get Out The Vote',
    emoji: '🚌',
    desc: 'Solve early voting logistics and polling place challenges on Election Day.',
    duration: '5 min',
    available: false,
    mechanics: 'Puzzle · Problem Solving',
  },
  {
    id: 4,
    title: 'Election Night',
    emoji: '📊',
    desc: 'Simulate vote counting and results calculation in real time.',
    duration: '4 min',
    available: false,
    mechanics: 'Simulation · Math',
  },
];

interface Props {
  selectedState: string;
  completedLevels: number[];
}

export function LevelSelector({ selectedState, completedLevels }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {LEVELS.map((level) => {
        const isCompleted = completedLevels.includes(level.id);

        return (
          <div
            key={level.id}
            className={`relative bg-white rounded-2xl border-2 p-5 transition-all ${
              level.available
                ? 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                : 'border-slate-100 opacity-60'
            }`}
          >
            {/* Completed badge */}
            {isCompleted && (
              <div className="absolute top-3 right-3 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                ✓ Completed
              </div>
            )}
            {!level.available && (
              <div className="absolute top-3 right-3 text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                🔒 Locked
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ backgroundColor: level.available ? '#EFF6FF' : '#f8fafc' }}
              >
                {level.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-0.5">Level {level.id}</div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{level.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{level.desc}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span>⏱️ {level.duration}</span>
                  <span>·</span>
                  <span>{level.mechanics}</span>
                </div>
              </div>
            </div>

            {level.available && (
              <Link
                href={`/game/level/${level.id}`}
                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: '#0066CC' }}
              >
                {isCompleted ? '🔁 Play Again' : '▶ Play Level'}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
