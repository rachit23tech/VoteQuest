import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, BookOpen, Clock, Trophy, MessageCircle, User, Menu, X, Sparkles } from "lucide-react";
import useGameStore from "./store/useGameStore";

import Home from "./pages/Home";
import Journey from "./pages/Journey";
import Timeline from "./pages/Timeline";
import QuizArena from "./pages/QuizArena";
import AiTutor from "./pages/AiTutor";
import Profile from "./pages/Profile";

const NAV_ITEMS = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/journey", icon: BookOpen, label: "Learn" },
  { to: "/timeline", icon: Clock, label: "Timeline" },
  { to: "/quiz", icon: Trophy, label: "Quiz" },
  { to: "/tutor", icon: MessageCircle, label: "AI Tutor" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function App() {
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const xp = useGameStore((s) => s.xp);
  const getLevel = useGameStore((s) => s.getLevel);
  const level = getLevel();

  return (
    <div className="app-layout">
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🗳️</span>
          <span className="brand-text">ElectoLearn</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-level">
            <span className="level-icon">{level.icon}</span>
            <div>
              <p className="level-name">{level.name}</p>
              <p className="level-xp">{xp} XP</p>
            </div>
          </div>
          <div className="sidebar-badge">
            <Sparkles size={12} />
            <span>Powered by Google Gemini</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ───────────────────────────────────── */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <span>🗳️</span>
          <span>ElectoLearn</span>
        </div>
        <div className="mobile-xp">{level.icon} {xp} XP</div>
        <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNav(false)}
          >
            <motion.nav
              className="mobile-nav"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => "mobile-nav-link" + (isActive ? " active" : "")}
                  onClick={() => setMobileNav(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/quiz" element={<QuizArena />} />
              <Route path="/tutor" element={<AiTutor />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
