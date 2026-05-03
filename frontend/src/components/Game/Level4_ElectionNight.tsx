'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/src/hooks/useTimer';
import { usePoints } from '@/src/hooks/usePoints';
import { AchievementPopup } from '@/src/components/UI/AchievementPopup';
import type { LevelResult } from '@/src/types';

const BALLOTS = [
  { id: 1, type: 'Mail-in Ballot', status: 'Postmarked on Election Day, received 2 days later.', valid: true, hint: 'Most states accept mail-in ballots postmarked on or before Election Day, even if received shortly after.' },
  { id: 2, type: 'Provisional Ballot', status: 'Voter lacked ID at polls. Returned 3 days later with valid photo ID.', valid: true, hint: 'Provisional ballots are counted if the voter cures the issue (like showing ID) within the state deadline (usually 3-5 days).' },
  { id: 3, type: 'Mail-in Ballot', status: 'Signature on envelope completely mismatched from registry.', valid: false, hint: 'Signature mismatches require the voter to "cure" the ballot. If uncured, it is rejected.' },
  { id: 4, type: 'In-Person Ballot', status: 'Voter is 17 but turns 18 on Election Day. Registered early.', valid: true, hint: 'If a voter is 18 by Election Day, their ballot is perfectly valid.' },
  { id: 5, type: 'Mail-in Ballot', status: 'Not sealed in the required inner privacy sleeve ("naked ballot").', valid: false, hint: 'Some states reject "naked ballots" that lack the mandatory secrecy envelope.' },
];

const TOTAL_TIME = 90;

interface Props { state: string; onComplete: (r: LevelResult) => void; }

export function Level4_ElectionNight({ state, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<{ badge: string; description: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const startRef = useRef(Date.now());

  const { calculateScore, getScoreTier } = usePoints();

  const finishGame = useCallback((timeTaken: number) => {
    if (gameOver) return;
    setGameOver(true);
    const correctCount = answers.filter(a => a).length;
    const accuracy = correctCount / BALLOTS.length;
    const points = calculateScore(400, timeTaken, correctCount, BALLOTS.length, false);
    const tier = getScoreTier(points);

    const badges: string[] = [];
    if (correctCount === BALLOTS.length) badges.push('election_night_hero');
    if (timeTaken < 40) badges.push('speed_racer');

    if (badges.length > 0) setAchievement({ badge: badges[0], description: 'Ballot Processing Expert!' });

    setTimeout(() => {
      onComplete({ level: 4, points, accuracy, time_taken: timeTaken, tier, correct: correctCount, total: BALLOTS.length, new_achievements: badges });
    }, badges.length > 0 ? 3600 : 600);
  }, [gameOver, answers, calculateScore, getScoreTier, onComplete]);

  const { secondsLeft, formattedTime } = useTimer({
    initialSeconds: TOTAL_TIME,
    onTimeUp: () => finishGame(TOTAL_TIME),
  });

  const handleDecision = (decision: boolean) => {
    if (swipeDirection) return; // wait for animation
    
    setSwipeDirection(decision ? 'right' : 'left');
    const isCorrect = BALLOTS[currentIdx].valid === decision;
    const newAnswers = [...answers, isCorrect];
    
    setTimeout(() => {
      setAnswers(newAnswers);
      setActiveHint(null);
      setSwipeDirection(null);
      if (newAnswers.length === BALLOTS.length) {
        finishGame(Math.round((Date.now() - startRef.current) / 1000));
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    }, 400); // Wait for card to exit
  };

  const ballot = BALLOTS[currentIdx];
  const timerPct = secondsLeft / TOTAL_TIME;
  const timerColor = timerPct <= 0.2 ? '#EF4444' : timerPct <= 0.5 ? '#FFB81C' : '#3B9EFF';

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E1A] overflow-hidden text-slate-100 font-sans">
      {achievement && <AchievementPopup badge={achievement.badge} description={achievement.description} onDone={() => setAchievement(null)} />}
      
      <div className="game-hud px-6 py-4 flex items-center justify-between gap-4 flex-wrap z-10 border-b border-[#1E2D40] bg-[#141824]/80 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Level 4 · {state}</div>
          <div className="font-black text-xl leading-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Election Night Audits</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
            <span className="text-lg">{timerPct <= 0.2 ? '⚠️' : '⏱️'}</span>
            <div className={`text-xl font-black font-mono ${secondsLeft < 30 ? "animate-pulse" : ""}`} style={{ color: timerColor }}>
              {formattedTime}
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
             <span className="text-lg">🗳️</span>
             <div className="text-xl font-black font-mono text-white">
                {answers.length}<span className="text-sm text-slate-500">/{BALLOTS.length}</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeHint && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="px-6 py-3 text-sm flex items-center gap-3 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-300 z-10">
            <span className="text-xl">💡</span><span>{activeHint}</span>
            <button onClick={() => setActiveHint(null)} className="ml-auto text-yellow-400 hover:text-yellow-200 text-xl leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-0">
        <div className="absolute inset-0 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {currentIdx < BALLOTS.length && !gameOver ? (
            <motion.div
              key={ballot.id}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={
                swipeDirection === 'left' ? { x: -300, opacity: 0, rotate: -20 } :
                swipeDirection === 'right' ? { x: 300, opacity: 0, rotate: 20 } :
                { scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full flex flex-col items-center"
            >
              <div className="bg-[#141824] w-full rounded-3xl shadow-2xl border border-[#1E2D40] p-8 md:p-12 mb-8 text-center relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
                <button 
                  onClick={() => setActiveHint(activeHint === ballot.hint ? null : ballot.hint)} 
                  className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-xl transition-colors border border-slate-700"
                  title="Need a hint?"
                  aria-label="Show hint"
                >
                  💡
                </button>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold tracking-widest uppercase mb-8 border border-yellow-500/20">
                  {ballot.type}
                </div>
                <p className="text-3xl md:text-4xl font-black text-white leading-relaxed">"{ballot.status}"</p>
              </div>
              
              <div className="flex gap-6 w-full">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDecision(false)} 
                  className="flex-1 py-6 rounded-2xl font-black text-2xl border-2 border-red-500/30 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                  <span className="mr-2">❌</span> REJECT
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDecision(true)} 
                  className="flex-1 py-6 rounded-2xl font-black text-2xl border-2 border-green-500/30 hover:border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <span className="mr-2">✅</span> ACCEPT
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 bg-[#141824]/50 rounded-3xl border border-[#1E2D40] backdrop-blur-sm"
            >
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-6"
              >
                🏆
              </motion.div>
              <h2 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Election Certified!</h2>
              <p className="text-slate-400 mt-4 text-xl">Calculating your audit accuracy...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
