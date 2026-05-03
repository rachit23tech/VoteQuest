'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useTimer } from '@/src/hooks/useTimer';
import { usePoints } from '@/src/hooks/usePoints';
import { AchievementPopup } from '@/src/components/UI/AchievementPopup';
import type { VoterProfile, RegistrationZone, LevelResult } from '@/src/types';

/* ── Game data ──────────────────────────────────────────── */
const VOTERS: VoterProfile[] = [
  { id:'v1',  name:'Sarah Chen',       age:22, emoji:'👩‍🎓', situation:'College student',       detail:'Has valid photo ID and reliable broadband internet.', answer:'online',     hint:'Tech-savvy voters with ID and internet → online portal is fastest.' },
  { id:'v2',  name:'Robert Martinez',  age:78, emoji:'👴',   situation:'Elderly, homebound',      detail:'Severe mobility issues. No smartphone.',             answer:'mail',       hint:'Homebound elderly voters can request a mail-in registration form.' },
  { id:'v3',  name:'Emma Johnson',     age:19, emoji:'👩',   situation:'First-time voter',         detail:'Just turned 18. State requires in-person first time.', answer:'in-person', hint:'Some states require first-time voters to appear in person.' },
  { id:'v4',  name:'Michael Brown',    age:35, emoji:'🧑',   situation:'Recently moved address',   detail:'Has internet access and current state ID.',          answer:'online',     hint:'Address changes are typically processed online in minutes.' },
  { id:'v5',  name:'Lisa Davis',       age:45, emoji:'👩‍🌾', situation:'Rural, no broadband',      detail:'Nearest DMV is 90 miles away. No internet at home.',  answer:'mail',       hint:'Rural voters without internet access use mail-in registration.' },
  { id:'v6',  name:'James Wilson',     age:29, emoji:'🧔',   situation:'Expired photo ID',         detail:'ID expired 3 months ago, unsure of valid alternatives.', answer:'in-person', hint:'Voters with ID questions need in-person clerk assistance.' },
  { id:'v7',  name:'Maria Garcia',     age:31, emoji:'👩‍🦱', situation:'Language assistance',      detail:'Primary language Spanish. Needs bilingual staff.',    answer:'in-person',  hint:'Voters needing language assistance should register in-person.' },
  { id:'v8',  name:'David Lee',        age:26, emoji:'👨‍💻', situation:'Remote worker',            detail:'Has laptop, valid ID, stable 5G internet.',          answer:'online',     hint:'All requirements met → online is the fastest path.' },
  { id:'v9',  name:'Karen Williams',   age:67, emoji:'👩‍🦳', situation:'Physical disability',      detail:'Homebound wheelchair user confirmed by physician.',   answer:'mail',       hint:'Homebound voters with disabilities qualify for mail-in assistance.' },
  { id:'v10', name:'Tom Anderson',     age:42, emoji:'🪖',   situation:'Overseas military (UOCAVA)', detail:'Deployed abroad. Qualifies for UOCAVA provisions.', answer:'mail',       hint:'Overseas military voters use federal UOCAVA mail-in registration.' },
];

const ZONES: RegistrationZone[] = [
  { id:'online',    label:'Online Portal',     emoji:'🌐', description:'Internet access + valid ID',          color:'#3B9EFF' },
  { id:'mail',      label:'Mail-In Form',       emoji:'✉️', description:'Homebound, rural, or overseas voters', color:'#A78BFA' },
  { id:'in-person', label:'In-Person Office',   emoji:'🏛️', description:'First-timers, ID issues, language help', color:'#FB923C' },
];

const PASS_THRESHOLD = 8;
const TOTAL_TIME = 180;

/* ── Types ─────────────────────────────────────────────── */
interface Placement { voter: VoterProfile; zone: RegistrationZone['id']; correct: boolean; }
interface Props { state: string; onComplete: (r: LevelResult) => void; }

/* ── Component ──────────────────────────────────────────── */
export function Level1Registration({ state, onComplete }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverZone, setHoverZone] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<{ badge: string; description: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const startRef = useRef(Date.now());

  const { calculateScore, getScoreTier } = usePoints();

  const placedIds = useMemo(() => new Set(placements.map((p: Placement) => p.voter.id)), [placements]);
  const remaining = useMemo(() => VOTERS.filter(v => !placedIds.has(v.id)), [placedIds]);
  const correct = useMemo(() => placements.filter((p: Placement) => p.correct).length, [placements]);

  const finishGame = useCallback((timeTaken: number, finalPlacements: Placement[] = placements) => {
    if (gameOver) return;
    setGameOver(true);
    const finalCorrect = finalPlacements.filter(p => p.correct).length;
    const accuracy = finalCorrect / VOTERS.length;
    const accessBonus = finalPlacements.some(p => p.correct && ['v9','v7'].includes(p.voter.id));
    const points = calculateScore(100, timeTaken, finalCorrect, VOTERS.length, accessBonus);
    const tier = getScoreTier(points);

    const badges: string[] = [];
    if (finalCorrect >= PASS_THRESHOLD) badges.push('first_vote');
    if (timeTaken < 120)                badges.push('speed_racer');
    if (accessBonus && finalCorrect === VOTERS.length) badges.push('accessibility_champion');

    if (badges.length > 0) setAchievement({ badge: badges[0], description: 'You helped voters register correctly!' });

    setTimeout(() => {
      onComplete({ level:1, points, accuracy, time_taken:timeTaken, tier, correct:finalCorrect, total:VOTERS.length, new_achievements:badges });
    }, badges.length > 0 ? 3600 : 600);
  }, [gameOver, placements, calculateScore, getScoreTier, onComplete]);

  const { secondsLeft, formattedTime } = useTimer({
    initialSeconds: TOTAL_TIME,
    onTimeUp: () => finishGame(TOTAL_TIME),
  });

  const livePoints = calculateScore(100, TOTAL_TIME - secondsLeft, correct, VOTERS.length, false);
  const timerPct   = secondsLeft / TOTAL_TIME;
  const timerColor = timerPct <= 0.2 ? '#EF4444' : timerPct <= 0.5 ? '#FFB81C' : '#3B9EFF';

  /* ── Drag handlers ────────────────────────────────────── */
  const onDragStart = (e: React.DragEvent, id: string) => { 
    if (gameOver) { e.preventDefault(); return; }
    e.dataTransfer.setData('id', id); setDraggingId(id); 
  };
  const onDragEnd   = () => { setDraggingId(null); setHoverZone(null); };

  const onDrop = (e: React.DragEvent, zoneId: RegistrationZone['id']) => {
    e.preventDefault();
    if (gameOver) return;
    const voter = VOTERS.find(v => v.id === e.dataTransfer.getData('id'));
    if (!voter || placedIds.has(voter.id)) return;

    const newPlacements = [...placements, { voter, zone: zoneId, correct: voter.answer === zoneId }];
    setPlacements(newPlacements);
    setDraggingId(null);
    setHoverZone(null);
    setActiveHint(null);

    if (newPlacements.length === VOTERS.length) {
      finishGame(Math.round((Date.now() - startRef.current) / 1000), newPlacements);
    }
  };

  const submitEarly = () => finishGame(Math.round((Date.now() - startRef.current) / 1000));

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0A0E1A' }}>
      {achievement && (
        <AchievementPopup badge={achievement.badge} description={achievement.description} onDone={() => setAchievement(null)} />
      )}

      {/* HUD */}
      <div className="game-hud px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748B' }}>Level 1 · {state}</div>
          <div className="font-black text-white text-lg leading-tight">Voter Registration Challenge</div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border"
            style={{ background: '#141824', borderColor: timerColor + '40' }}>
            <span className="text-lg">{timerPct <= 0.2 ? '⚠️' : '⏱️'}</span>
            <div>
              <div className="text-2xl font-black font-mono leading-none" style={{ color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
                {formattedTime}
              </div>
              <div className="h-1 rounded-full mt-1 overflow-hidden" style={{ background: '#1E2D40', width: 64 }}>
                <div className="h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${timerPct * 100}%`, background: timerColor }} />
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border"
            style={{ background: '#141824', borderColor: 'rgba(255,184,28,0.25)' }}>
            <span className="text-lg">⭐</span>
            <div>
              <div className="text-2xl font-black font-mono leading-none" style={{ color: '#FFB81C' }}>
                {livePoints.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: '#64748B' }}>live pts</div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border"
            style={{ background: '#141824', borderColor: '#1E2D40' }}>
            <span className="text-lg">📋</span>
            <div>
              <div className="text-2xl font-black font-mono leading-none text-white">
                {placements.length}<span className="text-base text-slate-500">/{VOTERS.length}</span>
              </div>
              <div className="text-xs" style={{ color: '#64748B' }}>placed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint bar */}
      {activeHint && (
        <div className="px-4 py-2.5 text-sm flex items-center gap-2 animate-slide-up"
          style={{ background: 'rgba(59,158,255,0.08)', borderBottom: '1px solid rgba(59,158,255,0.15)', color: '#93C5FD' }}>
          <span className="text-base">💡</span>
          <span>{activeHint}</span>
          <button onClick={() => setActiveHint(null)} className="ml-auto text-white/30 hover:text-white/60 text-lg leading-none">×</button>
        </div>
      )}

      {/* Game board */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 grid lg:grid-cols-[1fr,1.1fr] gap-6">

        {/* ── Left: Voter cards ──────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Voter Profiles — {remaining.length} remaining
            </h2>
            <span className="text-xs text-slate-600">Click 💡 for hint · Drag to zone</span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin">
            {remaining.map(voter => (
              <div
                key={voter.id}
                draggable
                onDragStart={e => onDragStart(e, voter.id)}
                onDragEnd={onDragEnd}
                className={`voter-card flex items-start gap-3 p-3.5 select-none group ${draggingId === voter.id ? 'dragging' : ''}`}
              >
                {/* Avatar */}
                <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {voter.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{voter.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background:'rgba(255,255,255,0.06)', color:'#94A3B8' }}>
                      {voter.age}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: '#3B9EFF' }}>{voter.situation}</div>
                  <div className="text-xs mt-1 leading-relaxed" style={{ color: '#64748B' }}>{voter.detail}</div>
                </div>

                {/* Hint toggle */}
                <button
                  onClick={() => setActiveHint(activeHint === voter.hint ? null : voter.hint)}
                  className="text-xl opacity-30 group-hover:opacity-70 transition-opacity flex-shrink-0 leading-none mt-1"
                  title={`Show hint for ${voter.name}`}
                  aria-label={`Show hint for ${voter.name}`}>
                  💡
                </button>
              </div>
            ))}

            {remaining.length === 0 && (
              <div className="text-center py-12 text-slate-600">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-bold text-white">All voters placed!</div>
              </div>
            )}
          </div>

          {/* Early submit */}
          {placements.length >= PASS_THRESHOLD && (
            <button onClick={submitEarly} disabled={gameOver}
              className="w-full mt-4 py-3.5 rounded-xl font-black text-white transition-all hover:brightness-110 animate-slide-up"
              style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)', boxShadow: '0 4px 20px rgba(0,102,204,0.3)' }}>
              Submit Early ({placements.length}/{VOTERS.length}) →
            </button>
          )}
        </div>

        {/* ── Right: Drop zones ─────────────────────────── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#64748B' }}>
            Registration Zones — Drag voters here
          </h2>

          <div className="space-y-4">
            {ZONES.map(zone => {
              const zoneVoters = placements.filter(p => p.zone === zone.id);
              const isOver = hoverZone === zone.id;

              return (
                <div
                  key={zone.id}
                  onDragOver={e => { e.preventDefault(); setHoverZone(zone.id); }}
                  onDragLeave={() => setHoverZone(null)}
                  onDrop={e => onDrop(e, zone.id)}
                  className={`drop-zone p-4 transition-all ${isOver ? 'over' : draggingId ? 'ready' : 'idle'}`}
                  style={{ borderColor: isOver ? zone.color : zone.color + '30' }}
                >
                  {/* Zone header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: zone.color + '18' }}>
                      {zone.emoji}
                    </div>
                    <div>
                      <div className="font-black text-white text-sm">{zone.label}</div>
                      <div className="text-xs" style={{ color: '#64748B' }}>{zone.description}</div>
                    </div>
                    {zoneVoters.length > 0 && (
                      <div className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: zone.color + '18', color: zone.color, border: `1px solid ${zone.color}30` }}>
                        {zoneVoters.length}
                      </div>
                    )}
                  </div>

                  {/* Dropped voters */}
                  {zoneVoters.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {zoneVoters.map(({ voter, correct }) => (
                        <div key={voter.id}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-semibold border"
                          style={{
                            background: correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            borderColor: correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                            color: correct ? '#4ADE80' : '#F87171',
                          }}>
                          <span>{voter.emoji}</span>
                          <span>{voter.name.split(' ')[0]}</span>
                          <span className="font-black">{correct ? '✓' : '✗'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4 rounded-xl border border-dashed text-xs font-medium transition-all"
                      style={{
                        borderColor: isOver ? zone.color + '60' : '#1E2D40',
                        color: isOver ? zone.color : '#334155',
                        background: isOver ? zone.color + '08' : 'transparent',
                      }}>
                      {isOver ? `📥 Drop here!` : `Drop voters for ${zone.label}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Score preview */}
          <div className="mt-4 rounded-2xl p-4 border" style={{ background: '#141824', borderColor: '#1E2D40' }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Correct placements</span>
              <span className="font-black text-white">{correct} / {placements.length || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1.5">
              <span className="text-slate-500">Pass requirement</span>
              <span className="font-bold" style={{ color: correct >= PASS_THRESHOLD ? '#4ADE80' : '#FFB81C' }}>
                {PASS_THRESHOLD}/{VOTERS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 text-xs text-center" style={{ color: '#334155' }}>
        💡 Click the lightbulb on any card for an educational hint · ✓ green = correct · ✗ red = wrong
      </div>
    </div>
  );
}
