'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/src/hooks/useTimer';
import { usePoints } from '@/src/hooks/usePoints';
import { AchievementPopup } from '@/src/components/UI/AchievementPopup';
import type { LevelResult } from '@/src/types';

const PROBLEMS = [
  { id: 1, voter: 'Mr. Henderson', issue: 'Cannot drive and polling place is 5 miles away.', solution: 'transport', hint: 'Campaigns often organize volunteer rides to the polls for those without transit.' },
  { id: 2, voter: 'Sarah', issue: 'Working a 12-hour shift on Election Day from 7am to 7pm.', solution: 'early', hint: 'Early voting or mail-in voting is perfect for people with inflexible work schedules.' },
  { id: 3, voter: 'College Dorm', issue: '200 students want to vote but do not know where to go.', solution: 'info', hint: 'Distributing polling location info (like a campus flyer) solves this efficiently.' },
  { id: 4, voter: 'Ms. Garcia', issue: 'Arrived at the wrong polling place, her correct one is across town and closes in 10 mins.', solution: 'provisional', hint: 'If a voter cannot reach their correct precinct, they can cast a provisional ballot.' },
  { id: 5, voter: 'Disabled Veteran', issue: 'Polling place has broken wheelchair ramp.', solution: 'curbside', hint: 'ADA requires accessible voting. Curbside voting is a standard legal fallback.' },
];

const SOLUTIONS = [
  { id: 'transport', label: 'Dispatch Volunteer Ride', icon: '🚗' },
  { id: 'early', label: 'Recommend Early/Mail Voting', icon: '📬' },
  { id: 'info', label: 'Distribute Polling Info', icon: '📍' },
  { id: 'provisional', label: 'Request Provisional Ballot', icon: '📝' },
  { id: 'curbside', label: 'Request Curbside Voting', icon: '♿' },
];

const TOTAL_TIME = 120;
interface Props { state: string; onComplete: (r: LevelResult) => void; }

export function Level3_GOTV({ state, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<{ badge: string; description: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const startRef = useRef(Date.now());

  const { calculateScore, getScoreTier } = usePoints();

  const finishGame = useCallback((timeTaken: number) => {
    if (gameOver) return;
    setGameOver(true);
    const correctCount = answers.filter(a => a).length;
    const accuracy = correctCount / PROBLEMS.length;
    const points = calculateScore(300, timeTaken, correctCount, PROBLEMS.length, false);
    const tier = getScoreTier(points);

    const badges: string[] = [];
    if (correctCount === PROBLEMS.length) badges.push('gotv_champion');

    if (badges.length > 0) setAchievement({ badge: badges[0], description: 'Get Out The Vote Master!' });

    setTimeout(() => {
      onComplete({ level: 3, points, accuracy, time_taken: timeTaken, tier, correct: correctCount, total: PROBLEMS.length, new_achievements: badges });
    }, badges.length > 0 ? 3600 : 600);
  }, [gameOver, answers, calculateScore, getScoreTier, onComplete]);

  const { secondsLeft, formattedTime } = useTimer({
    initialSeconds: TOTAL_TIME,
    onTimeUp: () => finishGame(TOTAL_TIME),
  });

  const handleMatch = (solutionId: string) => {
    if (selectedSolution) return; // Prevent double clicks
    
    setSelectedSolution(solutionId);
    const isCorrect = PROBLEMS[currentIdx].solution === solutionId;
    const newAnswers = [...answers, isCorrect];
    
    setTimeout(() => {
      setAnswers(newAnswers);
      setActiveHint(null);
      setSelectedSolution(null);
      if (newAnswers.length === PROBLEMS.length) {
        finishGame(Math.round((Date.now() - startRef.current) / 1000));
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    }, 600); // Small delay to show result animation
  };

  const problem = PROBLEMS[currentIdx];
  const timerPct = secondsLeft / TOTAL_TIME;
  const timerColor = timerPct <= 0.2 ? '#EF4444' : timerPct <= 0.5 ? '#FFB81C' : '#3B9EFF';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E1A] overflow-hidden text-slate-100 font-sans">
      {achievement && <AchievementPopup badge={achievement.badge} description={achievement.description} onDone={() => setAchievement(null)} />}
      
      {/* HUD */}
      <div className="game-hud px-6 py-4 flex items-center justify-between gap-4 flex-wrap z-10 border-b border-[#1E2D40] bg-[#141824]/80 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Level 3 · {state}</div>
          <div className="font-black text-xl leading-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Get Out The Vote (GOTV)</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
            <span className="text-lg">{timerPct <= 0.2 ? '⚠️' : '⏱️'}</span>
            <div className="text-xl font-black font-mono" style={{ color: timerColor }}>
              {formattedTime}
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
             <span className="text-lg">👥</span>
             <div className="text-xl font-black font-mono text-white">
                {answers.length}<span className="text-sm text-slate-500">/{PROBLEMS.length}</span>
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
            className="px-6 py-3 text-sm flex items-center gap-3 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 z-10">
            <span className="text-xl">💡</span><span>{activeHint}</span>
            <button onClick={() => setActiveHint(null)} className="ml-auto text-emerald-400 hover:text-emerald-200 text-xl leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-0">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {currentIdx < PROBLEMS.length && !gameOver ? (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <div className="bg-[#141824] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#1E2D40] p-8 md:p-10 mb-10 text-center relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
                <button 
                  onClick={() => setActiveHint(activeHint === problem.hint ? null : problem.hint)} 
                  className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-xl transition-colors border border-slate-700"
                  title="Need a hint?"
                  aria-label="Show hint"
                >
                  💡
                </button>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold tracking-wide mb-6">
                  Voter {currentIdx + 1} of {PROBLEMS.length}
                </div>
                <h2 className="text-2xl font-bold text-slate-400 mb-3">{problem.voter}</h2>
                <p className="text-3xl md:text-4xl font-black text-white leading-tight">"{problem.issue}"</p>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full"
              >
                {SOLUTIONS.map(sol => {
                  const isSelected = selectedSolution === sol.id;
                  const isCorrect = problem.solution === sol.id;
                  const showResult = selectedSolution !== null;
                  
                  let bgColor = "bg-[#1A2235]";
                  let borderColor = "border-[#1E2D40]";
                  if (showResult) {
                    if (isSelected && isCorrect) {
                      bgColor = "bg-green-500/20";
                      borderColor = "border-green-500";
                    } else if (isSelected && !isCorrect) {
                      bgColor = "bg-red-500/20";
                      borderColor = "border-red-500";
                    } else if (isCorrect) {
                      bgColor = "bg-green-500/10";
                      borderColor = "border-green-500/50";
                    } else {
                      bgColor = "bg-[#1A2235]/50";
                      borderColor = "border-[#1E2D40]/50";
                    }
                  }

                  return (
                    <motion.button 
                      variants={itemVariants}
                      key={sol.id} 
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.5)" } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      onClick={() => handleMatch(sol.id)} 
                      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-colors ${bgColor} ${borderColor}`}
                    >
                      <span className="text-5xl">{sol.icon}</span>
                      <span className="font-bold text-slate-300 text-sm text-center leading-tight">{sol.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 bg-[#141824]/50 rounded-3xl border border-[#1E2D40] backdrop-blur-sm max-w-2xl w-full mx-auto"
            >
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">GOTV Complete!</h2>
              <p className="text-slate-400 mt-4 text-xl">Calculating your GOTV efficiency...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
