'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementPopupProps {
  badge: string;
  description: string;
  onDone?: () => void;
}

const BADGE_EMOJIS: Record<string, string> = {
  first_vote: '🏆',
  early_bird: '⏰',
  accessibility_champion: '👥',
  on_fire: '🔥',
  all_states_master: '🌍',
  speed_racer: '⚡',
  campaign_trail: '📊',
  gotv_champion: '🚙',
  election_night_hero: '🗳️'
};

const BADGE_LABELS: Record<string, string> = {
  first_vote: 'First Vote',
  early_bird: 'Early Bird',
  accessibility_champion: 'Accessibility Champion',
  on_fire: 'On Fire',
  all_states_master: 'All States Master',
  speed_racer: 'Speed Racer',
  campaign_trail: 'Campaign Master',
  gotv_champion: 'GOTV Champion',
  election_night_hero: 'Election Night Hero'
};

export function AchievementPopup({ badge, description, onDone }: AchievementPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 500); // Wait for exit animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-24 right-4 z-[100]"
        >
          <div className="flex items-center gap-4 bg-[#1A2235] rounded-2xl px-5 py-4 shadow-[0_10px_40px_rgba(255,184,28,0.2)] border border-[#FFB81C]/30 max-w-sm relative overflow-hidden backdrop-blur-xl">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0 bg-gradient-to-br from-[#FFB81C]/20 to-[#D97706]/20 border border-[#FFB81C]/40 shadow-inner">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {BADGE_EMOJIS[badge] ?? '🏅'}
              </motion.div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FFB81C] mb-1">
                Achievement Unlocked
              </div>
              <div className="font-bold text-white text-base leading-tight truncate">
                {BADGE_LABELS[badge] ?? badge}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {description}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
