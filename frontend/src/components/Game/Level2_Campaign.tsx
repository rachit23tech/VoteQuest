'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/src/hooks/useTimer';
import { usePoints } from '@/src/hooks/usePoints';
import { AchievementPopup } from '@/src/components/UI/AchievementPopup';
import type { LevelResult } from '@/src/types';

const SCENARIOS = [
  { id: 1, title: 'Youth Outreach', desc: 'You need to reach voters aged 18-25. Which platform is most cost-effective?', options: [{ text: 'Primetime TV Ads', correct: false }, { text: 'TikTok & Instagram', correct: true }, { text: 'Direct Mailers', correct: false }], hint: 'Younger demographics primarily consume digital and social media.' },
  { id: 2, title: 'Debate Prep', desc: 'Your candidate was asked about a complex state law. How do they respond?', options: [{ text: 'Give a 5-minute technical answer', correct: false }, { text: 'Pivot to a generic talking point', correct: false }, { text: 'Give a clear 30-sec summary + personal story', correct: true }], hint: 'Voters respond best to clear, relatable messaging rather than jargon.' },
  { id: 3, title: 'GOTV Budget', desc: 'It is the weekend before election day. Where do you allocate your remaining $10,000?', options: [{ text: 'Door-to-door canvassing (Field)', correct: true }, { text: 'New Billboard', correct: false }, { text: 'Radio Ads', correct: false }], hint: 'Field organizing and direct voter contact is the most effective GOTV strategy.' },
  { id: 4, title: 'Negative Attack', desc: 'Your opponent just launched an unfair attack ad. What is the standard campaign response?', options: [{ text: 'Ignore it completely', correct: false }, { text: 'Respond with facts quickly (Rapid Response)', correct: true }, { text: 'Launch a worse attack', correct: false }], hint: 'Unanswered attacks can stick. Rapid response with truth is standard.' },
  { id: 5, title: 'Endorsement', desc: 'A major local union wants to endorse you but wants a promise you cant keep. Do you:', options: [{ text: 'Lie and make the promise', correct: false }, { text: 'Politely decline but keep dialogue open', correct: true }, { text: 'Publicly attack them', correct: false }], hint: 'Honesty builds long-term coalitions. Lying destroys credibility.' },
];

const TOTAL_TIME = 150;

interface Props { state: string; onComplete: (r: LevelResult) => void; }

export function Level2_Campaign({ state, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<{ badge: string; description: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const startRef = useRef(Date.now());

  const { calculateScore, getScoreTier } = usePoints();

  const finishGame = useCallback((timeTaken: number) => {
    if (gameOver) return;
    setGameOver(true);
    const correctCount = answers.filter(a => a).length;
    const accuracy = correctCount / SCENARIOS.length;
    const points = calculateScore(200, timeTaken, correctCount, SCENARIOS.length, false);
    const tier = getScoreTier(points);

    const badges: string[] = [];
    if (correctCount === SCENARIOS.length) badges.push('campaign_trail');
    if (timeTaken < 60) badges.push('speed_racer');

    if (badges.length > 0) setAchievement({ badge: badges[0], description: 'Campaign Strategy Master!' });

    setTimeout(() => {
      onComplete({ level: 2, points, accuracy, time_taken: timeTaken, tier, correct: correctCount, total: SCENARIOS.length, new_achievements: badges });
    }, badges.length > 0 ? 3600 : 600);
  }, [gameOver, answers, calculateScore, getScoreTier, onComplete]);

  const { secondsLeft, formattedTime } = useTimer({
    initialSeconds: TOTAL_TIME,
    onTimeUp: () => finishGame(TOTAL_TIME),
  });

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setActiveHint(null);
    if (newAnswers.length === SCENARIOS.length) {
      finishGame(Math.round((Date.now() - startRef.current) / 1000));
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const scenario = SCENARIOS[currentIdx];
  const timerPct = secondsLeft / TOTAL_TIME;
  const timerColor = timerPct <= 0.2 ? '#EF4444' : timerPct <= 0.5 ? '#FFB81C' : '#3B9EFF';

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E1A] overflow-hidden text-slate-100 font-sans">
      {achievement && <AchievementPopup badge={achievement.badge} description={achievement.description} onDone={() => setAchievement(null)} />}
      
      {/* HUD */}
      <div className="game-hud px-6 py-4 flex items-center justify-between gap-4 flex-wrap z-10 border-b border-[#1E2D40] bg-[#141824]/80 backdrop-blur-md">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Level 2 · {state}</div>
          <div className="font-black text-xl leading-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Campaign Strategy</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
            <span className="text-lg">{timerPct <= 0.2 ? '⚠️' : '⏱️'}</span>
            <div className="text-xl font-black font-mono" style={{ color: timerColor }}>
              {formattedTime}
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-[#1E2D40] bg-[#141824]">
             <span className="text-lg">📊</span>
             <div className="text-xl font-black font-mono text-white">
                {answers.length}<span className="text-sm text-slate-500">/{SCENARIOS.length}</span>
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
            className="px-6 py-3 text-sm flex items-center gap-3 bg-blue-500/10 border-b border-blue-500/20 text-blue-300 z-10">
            <span className="text-xl">💡</span><span>{activeHint}</span>
            <button onClick={() => setActiveHint(null)} className="ml-auto text-blue-400 hover:text-blue-200 text-xl leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center relative z-0">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {currentIdx < SCENARIOS.length && !gameOver ? (
            <motion.div 
              key={scenario.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#141824] rounded-3xl shadow-2xl border border-[#1E2D40] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold uppercase tracking-wide mb-4">
                  Scenario {currentIdx + 1}
                </div>
                <button 
                  onClick={() => setActiveHint(activeHint === scenario.hint ? null : scenario.hint)} 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-xl transition-colors border border-slate-700"
                  title="Need a hint?"
                  aria-label="Show hint"
                >
                  💡
                </button>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{scenario.title}</h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">{scenario.desc}</p>
              
              <div className="space-y-4">
                {scenario.options.map((opt, i) => (
                  <motion.button 
                    key={i}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt.correct)} 
                    className="w-full text-left p-5 rounded-2xl border-2 border-[#1E2D40] bg-[#1A2235] transition-all font-semibold text-lg text-slate-200 hover:text-white flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">→</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 bg-[#141824]/50 rounded-3xl border border-[#1E2D40] backdrop-blur-sm"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Campaign Complete!</h2>
              <p className="text-slate-400 mt-4 text-xl">Calculating your campaign results...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
