import Link from 'next/link';

const LEVELS = [
  { id: 1, emoji: '📋', title: 'Voter Registration', desc: 'Route 10 voter profiles to the correct registration method before the clock hits zero.', tag: 'Available', tagColor: '#22C55E', duration: '3 min' },
  { id: 2, emoji: '📣', title: 'Campaign Trail', desc: 'Manage budget and volunteers while navigating state-specific voting laws.', tag: 'Available', tagColor: '#22C55E', duration: '3 min' },
  { id: 3, emoji: '🚌', title: 'Get Out The Vote', desc: 'Solve election-day logistics: polling places, early voting, and accessibility.', tag: 'Available', tagColor: '#22C55E', duration: '2 min' },
  { id: 4, emoji: '📊', title: 'Election Night', desc: 'Simulate vote counting, audits, and results certification in real time.', tag: 'Available', tagColor: '#22C55E', duration: '2 min' },
];

const BADGES = [
  { emoji: '🏆', name: 'First Vote', desc: 'Complete Level 1' },
  { emoji: '⏰', name: 'Early Bird', desc: 'Finish in under 30s' },
  { emoji: '👥', name: 'Champion', desc: 'Help every voter' },
  { emoji: '🔥', name: 'On Fire', desc: '5-level streak' },
  { emoji: '⚡', name: 'Speed Racer', desc: 'Under 2 minutes' },
  { emoji: '🌍', name: 'All States', desc: 'Play 50 states' },
];

const HOW = [
  { num: '01', title: 'Pick Your State', desc: 'Each of the 50 states has unique election rules, deadlines, and ID requirements.' },
  { num: '02', title: 'Play Levels', desc: 'Drag, drop, and decide your way through the full election lifecycle.' },
  { num: '03', title: 'Earn Badges', desc: 'Unlock achievements for speed, accuracy, and inclusive decision-making.' },
  { num: '04', title: 'Climb the Board', desc: 'Compete globally and by state. Weekly rankings reset every Monday.' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-12 py-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight drop-shadow-md">
          <span className="text-3xl">🗳️</span>
          <span>Vote<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Quest</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-semibold text-white/80 hover:text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm">Sign in</Link>
          <Link href="/auth/signup" className="text-sm font-bold text-slate-900 px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,184,28,0.4)]"
            style={{ background: 'linear-gradient(135deg, #FFB81C, #FFA500)' }}>
            Play Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="starfield pt-32 pb-28 px-6 text-center text-white min-h-[92vh] flex flex-col items-center justify-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
            style={{ background: 'rgba(255,184,28,0.12)', borderColor: 'rgba(255,184,28,0.3)', color: '#FFB81C' }}>
            🎮 Level 1 Now Live — Start Playing
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tight mb-8">
            <span className="block text-white drop-shadow-2xl">Vote</span>
            <span className="shimmer-text">Quest</span>
          </h1>

          <p className="text-xl md:text-3xl text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed font-medium drop-shadow-md">
            Become a <span className="text-amber-400 font-bold">virtual campaign manager</span> and master real
            election processes through gameplay.
          </p>
          <p className="text-white/40 text-sm mb-12">
            Used in civics classrooms across 12 states · Covers all 50 US states
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-6 justify-center mb-20">
            <Link href="/auth/signup"
              className="group px-10 py-5 rounded-2xl font-black text-xl text-slate-900 transition-all hover:scale-105 hover:brightness-110 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #FFB81C 0%, #FFA500 100%)', boxShadow: '0 0 40px rgba(255,184,28,0.5)' }}>
              Start Playing Free
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
            <Link href="/about"
              className="px-10 py-5 rounded-2xl font-bold text-xl text-white border-2 border-white/30 hover:bg-white/20 transition-all backdrop-blur-md">
              How It Works
            </Link>
          </div>

          {/* Mini stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-white/40">
            {[['50', 'States'], ['6', 'Achievements'], ['4', 'Levels'], ['3 min', 'Per Level']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-white/90">{v}</div>
                <div>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-float">
          <div className="flex flex-col items-center gap-1 text-xs">
            <span>scroll</span>
            <span>↓</span>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4">How it works</div>
            <h2 className="text-5xl font-black text-white">Master elections in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {HOW.map(({ num, title, desc }) => (
              <div key={num} className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:-translate-y-2 transition-all hover:border-blue-500/50 group">
                <div className="text-7xl font-black mb-6 transition-all group-hover:scale-110 origin-left" style={{ color: '#3B9EFF', opacity: 0.3 }}>{num}</div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-base text-slate-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Levels ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">Game Levels</div>
            <h2 className="text-5xl font-black text-slate-900">Progress through the lifecycle</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {LEVELS.map((l, i) => (
              <div key={l.id}
                className={`group relative bg-white rounded-3xl p-8 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,102,204,0.2)] hover:-translate-y-1`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500"
                  style={{ background: 'radial-gradient(circle at top right, rgba(0,102,204,0.08) 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl bg-slate-50 w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner">{l.emoji}</div>
                      <div>
                        <div className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Level {l.id}</div>
                        <h3 className="text-2xl font-bold text-slate-900">{l.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: l.tagColor }}>{l.tag}</span>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">⏱ {l.duration}</span>
                    </div>
                  </div>
                  <p className="text-base text-slate-600 mb-8 leading-relaxed h-12">{l.desc}</p>
                  <Link href={`/game/level/${l.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl text-base font-bold text-white transition-all hover:gap-3 hover:brightness-110 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)' }}>
                    Play Level {l.id} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Achievements ────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#0A0E1A' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FFB81C' }}>Achievements</div>
          <h2 className="text-4xl font-black text-white mb-4">Earn badges as you learn</h2>
          <p className="text-white/40 mb-12">Unlock these through gameplay — each one teaches a real civic concept.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map(({ emoji, name, desc }) => (
              <div key={name}
                className="flex items-center gap-4 rounded-2xl p-4 text-left border transition-all hover:border-yellow-500/30"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(255,184,28,0.1)' }}>{emoji}</div>
                <div>
                  <div className="font-bold text-white text-sm">{name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0041A3 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🗳️</div>
          <h2 className="text-4xl font-black text-white mb-4">Ready to become an election strategist?</h2>
          <p className="text-blue-200 text-lg mb-10">Free to play · No download · Learn while you compete</p>
          <Link href="/auth/signup"
            className="inline-block px-12 py-5 rounded-2xl font-black text-xl text-slate-900 transition-all hover:scale-105 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #FFB81C 0%, #FFA500 100%)', boxShadow: '0 0 60px rgba(255,184,28,0.3)' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ background: '#050810' }} className="py-10 px-6 text-center">
        <div className="text-white/20 text-sm">
          <span className="text-white/60 font-bold">🗳️ VoteQuest</span>
          {' · '}Data from the Election Assistance Commission (EAC) · Rock the Vote · MIT License
        </div>
      </footer>
    </div>
  );
}
