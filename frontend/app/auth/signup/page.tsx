'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApi } from '@/src/hooks/useApi';
import { useGameStore } from '@/src/store/gameStore';
import { US_STATES } from '@/src/types';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const router = useRouter();
  const { register, login, getCurrentUser } = useApi();
  const { setUser } = useGameStore();

  const [form, setForm] = useState({ username: '', email: '', password: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Register
      await register(form.username, form.email, form.password, form.state || undefined);
      
      // Step 2: Login with registered credentials
      try {
        await login(form.username, form.password);
      } catch (loginErr: unknown) {
        const loginMsg = (loginErr as { response?: { data?: { detail?: string } } })?.response?.data?.detail
          ?? 'Login failed after registration. Please try logging in manually.';
        toast.error(loginMsg);
        throw loginErr;
      }
      
      // Step 3: Get user info and redirect
      const user = await getCurrentUser();
      setUser(user.id, user.username, user.state ?? '');
      toast.success(`Welcome to VoteQuest, ${user.username}! 🗳️`);
      router.push('/game');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? 'Registration failed. Please try again.';
      // Only show if we haven't already shown a login-specific error
      if (!(err as any)?._isLoginError) {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    '🗳️ Play all 50 US states',
    '🏆 Earn 6 achievement badges',
    '📊 Track your score history',
    '🏅 Compete on the leaderboard',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 text-white overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 starfield opacity-50"></div>
        <div className="relative z-10 max-w-lg">
          <Link href="/" className="inline-block text-4xl font-black mb-12 hover:scale-105 transition-transform drop-shadow-md">
            🗳️ Vote<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Quest</span>
          </Link>
          <h2 className="text-6xl font-black mb-8 leading-tight tracking-tight drop-shadow-lg">
            Become an<br />election strategist
          </h2>
          <div className="space-y-6">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-4 text-white/90 font-medium text-lg bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-inner"
                  style={{ background: 'rgba(255,184,28,0.2)', color: '#FFB81C', border: '1px solid rgba(255,184,28,0.3)' }}>✓</div>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="text-4xl font-black tracking-tight">
              <span className="text-blue-600">Vote</span><span className="text-red-600">Quest</span>
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-all shadow-sm ${
                    s === step ? 'text-white scale-110' : s < step ? 'text-white' : 'bg-slate-100 text-slate-400'
                  }`} style={s <= step ? { background: 'linear-gradient(135deg, #0066CC, #0052A3)' } : {}}>
                    {s < step ? '✓' : s}
                  </div>
                  {s < 2 && <div className="w-12 h-1 rounded-full transition-all" style={{ background: step > 1 ? '#0066CC' : '#E2E8F0' }} />}
                </div>
              ))}
              <span className="text-sm font-semibold text-slate-400 ml-2">{step === 1 ? 'Account info' : 'Your state'}</span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
              {step === 1 ? 'Create account' : 'One last thing'}
            </h2>
            <p className="text-slate-500 text-base mb-8 font-medium">
              {step === 1 ? 'Free forever · No credit card' : 'Pick your state to get started (optional)'}
            </p>

            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}
              className="space-y-6">

              {step === 1 ? (
                <>
                  {([
                    { id: 'username' as const, label: 'Username', type: 'text', placeholder: 'election_hero', min: 3, max: 30 },
                    { id: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com' },
                    { id: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••', min: 8 },
                  ]).map(({ id, label, type, placeholder, min, max }) => (
                    <div key={id}>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
                      <input
                        type={type}
                        value={form[id]}
                        onChange={set(id)}
                        placeholder={placeholder}
                        required
                        minLength={min}
                        maxLength={max}
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 text-base font-medium text-slate-900 placeholder-slate-400
                                   focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  ))}
                  <button type="submit"
                    className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:-translate-y-0.5 mt-4 shadow-lg hover:shadow-blue-500/30"
                    style={{ background: 'linear-gradient(135deg, #0066CC, #0052A3)' }}>
                    Continue →
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your State</label>
                    <div className="relative">
                      <select
                        value={form.state}
                        onChange={set('state')}
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 text-base font-medium text-slate-900 appearance-none
                                   focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                      >
                        <option value="">Skip for now…</option>
                        {US_STATES.map(({ code, name }) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 font-medium">
                      You can change this anytime. Used to show your state&apos;s real election rules.
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-4 shadow-lg hover:shadow-blue-500/30"
                    style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0066CC, #0052A3)' }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account…
                      </span>
                    ) : 'Start Playing 🗳️'}
                  </button>

                  <button type="button" onClick={() => setStep(1)}
                    className="w-full py-3 text-base font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    ← Back
                  </button>
                </>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center text-base text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Sign in</Link>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            <Link href="/" className="hover:text-slate-600 transition-colors">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
