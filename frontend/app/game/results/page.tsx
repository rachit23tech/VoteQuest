'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

/* ── Confetti piece ─────────────────────────────────────── */
const CONFETTI_COLORS = ['#FFB81C','#0066CC','#E81B23','#22C55E','#A78BFA','#FB923C'];
function Confetti({ count = 60 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          top: '-20px',
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          transform: `rotate(${p.rotate}deg)`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }} />
      ))}
    </div>
  );
}

/* ── Tier metadata ──────────────────────────────────────── */
const TIER_META: Record<string, { label: string; sub: string; emoji: string; gradient: string; glow: string }> = {
  S: { label:'Perfect Run!',    sub:'Flawless execution. You\'re a registration expert.', emoji:'🏆', gradient:'linear-gradient(135deg,#FFB81C,#FFA500)', glow:'rgba(255,184,28,0.4)' },
  A: { label:'Excellent!',      sub:'Outstanding work! Nearly perfect performance.',        emoji:'🥇', gradient:'linear-gradient(135deg,#22C55E,#16A34A)', glow:'rgba(34,197,94,0.4)' },
  B: { label:'Great Job!',      sub:'Solid performance. A few more practice runs will do.', emoji:'🥈', gradient:'linear-gradient(135deg,#3B9EFF,#0066CC)', glow:'rgba(59,158,255,0.4)' },
  C: { label:'Good Effort',     sub:'On the right track! Review the hints and retry.',      emoji:'🥉', gradient:'linear-gradient(135deg,#FB923C,#EA580C)', glow:'rgba(249,115,22,0.4)' },
  D: { label:'Keep Practicing', sub:'Some correct choices — study the registration rules.',  emoji:'📚', gradient:'linear-gradient(135deg,#EF4444,#DC2626)', glow:'rgba(239,68,68,0.4)' },
  F: { label:'Try Again',       sub:'Don\'t give up! Each attempt teaches you more.',         emoji:'💪', gradient:'linear-gradient(135deg,#64748B,#475569)', glow:'rgba(100,116,139,0.3)' },
};

const BADGE_META: Record<string, { emoji:string; name:string }> = {
  first_vote:             { emoji:'🏆', name:'First Vote' },
  early_bird:             { emoji:'⏰', name:'Early Bird' },
  accessibility_champion: { emoji:'👥', name:'Accessibility Champion' },
  on_fire:                { emoji:'🔥', name:'On Fire' },
  all_states_master:      { emoji:'🌍', name:'All States Master' },
  speed_racer:            { emoji:'⚡', name:'Speed Racer' },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  const points   = Number(searchParams?.get('points') ?? 0);
  const tier     = searchParams?.get('tier') ?? 'F';
  const accuracy = Number(searchParams?.get('accuracy') ?? 0);
  const time     = Number(searchParams?.get('time') ?? 0);
  const correct  = Number(searchParams?.get('correct') ?? 0);
  const total    = Number(searchParams?.get('total') ?? 10);
  const badges   = (searchParams?.get('achievements') ?? '').split(',').filter(Boolean);

  const meta = TIER_META[tier] ?? TIER_META['F'];
  const passed = correct >= 8;
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{ background: '#0A0E1A' }}>

      {passed && show && <Confetti count={80} />}

      <div className={`w-full max-w-lg transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Tier card */}
        <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl" style={{ boxShadow: `0 0 80px ${meta.glow}` }}>
          <div className="p-10 text-center" style={{ background: meta.gradient }}>
            <div className="text-6xl mb-2">{meta.emoji}</div>
            <div className={`text-9xl font-black mb-2 animate-tier-pop tier-${tier}`}
              style={{ color: 'white', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              {tier}
            </div>
            <div className="text-2xl font-black text-white/90">{meta.label}</div>
            <div className="text-white/70 text-sm mt-2">{meta.sub}</div>
          </div>

          <div className="px-8 py-6" style={{ background: '#141824' }}>
            <div className="text-center mb-6">
              <div className="text-5xl font-black" style={{ color: '#FFB81C' }}>
                {points.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 mt-1">points earned</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon:'🎯', val:`${Math.round(accuracy * 100)}%`, label:'Accuracy' },
                { icon:'⏱️', val:`${mins}:${secs.toString().padStart(2,'0')}`, label:'Time' },
                { icon:'✅', val:`${correct}/${total}`, label:'Correct' },
              ].map(({ icon, val, label }) => (
                <div key={label} className="text-center rounded-2xl py-4 border"
                  style={{ background: '#0A0E1A', borderColor: '#1E2D40' }}>
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-black text-white text-lg">{val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        {badges.length > 0 && (
          <div className="rounded-2xl p-5 mb-6 border animate-slide-up"
            style={{ background: 'rgba(255,184,28,0.05)', borderColor: 'rgba(255,184,28,0.2)' }}>
            <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#FFB81C' }}>
              🏅 Achievements Unlocked!
            </div>
            <div className="space-y-2">
              {badges.map(b => (
                <div key={b} className="flex items-center gap-3">
                  <span className="text-2xl">{BADGE_META[b]?.emoji ?? '🏅'}</span>
                  <span className="font-bold text-white text-sm">{BADGE_META[b]?.name ?? b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={() => router.push('/game/level/1')}
            className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)', boxShadow: '0 4px 20px rgba(0,102,204,0.3)' }}>
            🔁 Play Again
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/game"
              className="py-3.5 rounded-2xl font-bold text-sm text-center transition-all hover:border-blue-700/40 border"
              style={{ background: '#141824', borderColor: '#1E2D40', color: '#94A3B8' }}>
              ← Game Hub
            </Link>
            <Link href="/leaderboard"
              className="py-3.5 rounded-2xl font-bold text-white text-sm text-center transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #E81B23, #C41019)' }}>
              🏆 Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0E1A' }}>
        <div className="text-white/40">Loading results…</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
