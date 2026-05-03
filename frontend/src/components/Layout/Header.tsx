'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGameStore } from '@/src/store/gameStore';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { username, totalScore, reset } = useGameStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (p: string) => pathname === p || pathname?.startsWith(p + '/');

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    reset();
    router.push('/');
  };

  const navLinks = [
    { href: '/game',        label: 'Play',        icon: '🎮' },
    { href: '/leaderboard', label: 'Leaderboard',  icon: '🏆' },
    { href: '/tutor',       label: 'AI Tutor',    icon: '🤖' },
    { href: '/about',       label: 'How It Works', icon: '📖' },
  ];

  return (
    <header className="bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-4" style={{ height: 70 }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tight flex-shrink-0 group">
          <span className="text-3xl group-hover:animate-float drop-shadow-md">🗳️</span>
          <span className="text-white drop-shadow-md">Vote<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Quest</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {navLinks.map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive(href)
                  ? 'text-white shadow-[0_4px_20px_rgba(0,102,204,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              style={isActive(href) ? { background: 'linear-gradient(135deg, #0066CC, #0052A3)' } : {}}>
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {username ? (
            <>
              {/* Score pill */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border border-amber-500/20 shadow-[0_0_15px_rgba(255,184,28,0.15)]"
                style={{ background: 'linear-gradient(135deg, rgba(255,184,28,0.1), rgba(255,184,28,0.05))', color: '#FFB81C' }}>
                ⭐ {totalScore.toLocaleString()}
              </div>

              {/* Avatar + username */}
              <Link href="/profile"
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0066CC, #3B9EFF)' }}>
                  {username[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-bold text-white">{username}</span>
              </Link>

              <button onClick={handleLogout}
                className="hidden sm:block text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all">
                Sign out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login"
                className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all">
                Sign in
              </Link>
              <Link href="/auth/signup"
                className="text-sm font-black text-slate-900 px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,184,28,0.4)]"
                style={{ background: 'linear-gradient(135deg, #FFB81C, #FFA500)' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-0.5 bg-current rounded-full transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0E1A]/95 backdrop-blur-xl px-4 pb-6 pt-2 animate-slide-up absolute w-full shadow-2xl">
          {navLinks.map(({ href, label, icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl my-2 text-base font-bold transition-all ${
                isActive(href) ? 'text-white shadow-[0_4px_20px_rgba(0,102,204,0.3)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              style={isActive(href) ? { background: 'linear-gradient(135deg, #0066CC, #0052A3)' } : {}}>
              <span className="text-2xl">{icon}</span>{label}
            </Link>
          ))}
          {username && (
            <button onClick={handleLogout}
              className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl text-base font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4 border border-red-500/20">
              <span className="text-2xl">🚪</span> Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
