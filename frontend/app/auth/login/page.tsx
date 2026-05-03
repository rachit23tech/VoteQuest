'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApi } from '@/src/hooks/useApi';
import { useGameStore } from '@/src/store/gameStore';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const router = useRouter();
  const { login, getCurrentUser } = useApi();
  const { setUser } = useGameStore();

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      const user = await getCurrentUser();
      setUser(user.id, user.username, user.state ?? '');
      toast.success(`Welcome back, ${user.username}! 🗳️`);
      router.push('/game');
    } catch {
      toast.error('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 text-white overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 starfield opacity-50"></div>
        <div className="relative z-10 max-w-lg text-center">
          <div className="text-8xl mb-8 animate-float drop-shadow-2xl">🗳️</div>
          <h1 className="text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
            Vote<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Quest</span>
          </h1>
          <p className="text-white/80 text-xl leading-relaxed font-medium">
            Master real election processes through gameplay. Become a virtual campaign manager.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[['50', 'States'], ['6', 'Badges'], ['4', 'Levels']].map(([v, l]) => (
              <div key={l} className="rounded-2xl py-6 text-center backdrop-blur-md transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div className="text-3xl font-black text-amber-400 drop-shadow-md">{v}</div>
                <div className="text-sm font-semibold text-white/60 mt-2 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="text-4xl font-black tracking-tight">
              <span className="text-blue-600">Vote</span><span className="text-red-600">Quest</span>
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-base mb-10 font-medium">Sign in to continue your journey</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {([
                { id: 'username', label: 'Username', type: 'text', placeholder: 'your_username', autoComplete: 'username' },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'current-password' },
              ] as const).map(({ id, label, type, placeholder, autoComplete }) => (
                <div key={id}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[id]}
                    onChange={set(id)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 text-base font-medium text-slate-900 placeholder-slate-400
                               focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-4 shadow-lg hover:shadow-blue-500/30"
                style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0066CC, #0052A3)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign In →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ username: 'demo', password: 'demo123' });
                  handleSubmit(new Event('submit') as any);
                }}
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-blue-600 border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all text-sm uppercase tracking-wider"
              >
                Try Demo Account
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <div className="bg-amber-50 rounded-xl p-3 mb-6 inline-block border border-amber-100">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-tighter mb-1">Developer Bypass</p>
                <p className="text-sm font-medium text-amber-900">
                  User: <code className="font-bold bg-white/50 px-1 rounded">demo</code> | Pass: <code className="font-bold bg-white/50 px-1 rounded">demo123</code>
                </p>
              </div>
              
              <div className="text-base text-slate-500 font-medium">
                No account?{' '}
                <Link href="/auth/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Sign up free
                </Link>
              </div>
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
