import Link from 'next/link';
import { Header } from '@/src/components/Layout/Header';

const FACTS = [
  {
    q: 'Why does registration exist?',
    a: 'Voter registration helps governments manage voter rolls, verify eligibility, and assign voters to the correct polling place. Each state manages its own rules under federal law.',
  },
  {
    q: 'What ID do I need to vote?',
    a: 'It depends on your state. Strict photo ID states require government-issued photo ID. Others accept utility bills, bank statements, or allow affidavits. Knowing your state\'s rules matters!',
  },
  {
    q: 'What is early voting?',
    a: 'Early voting allows eligible voters to cast ballots before Election Day. Most states offer in-person early voting; dates and locations vary by county.',
  },
  {
    q: 'How does mail-in voting work?',
    a: 'Voters can request a ballot by mail, complete it at home, and return it by mail or drop box. Deadlines for requesting and returning ballots vary by state.',
  },
  {
    q: 'Why does vote counting take time?',
    a: 'Election officials must verify signatures, check registrations, count physical ballots, and run security audits. This careful process ensures accuracy and prevents fraud.',
  },
];

const METHODS = [
  { emoji: '🌐', label: 'Online Registration', desc: 'Most states offer online registration via state DMV or Secretary of State website. Requires a valid state ID or driver\'s license.' },
  { emoji: '✉️', label: 'Mail-In Registration', desc: 'Download or request a paper form, complete it, and mail it to your local election office. Postmark deadlines apply.' },
  { emoji: '🏛️', label: 'In-Person Registration', desc: 'Visit your county election office, DMV, or designated registration sites. Required for first-time voters in some states.' },
  { emoji: '📅', label: 'Same-Day Registration', desc: 'Some states allow you to register on Election Day itself at your polling place. Check if your state participates!' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {/* Hero */}
        <div
          className="rounded-2xl text-white px-8 py-10 mb-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)' }}
        >
          <div className="text-5xl mb-4">🗳️</div>
          <h1 className="text-3xl font-extrabold mb-2">How Elections Work</h1>
          <p className="text-blue-200 text-lg">
            The civic knowledge behind every VoteQuest level
          </p>
        </div>

        {/* Registration methods */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ways to Register</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {METHODS.map(({ emoji, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-bold text-slate-900 mb-1">{label}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Questions</h2>
        <div className="space-y-4 mb-10">
          {FACTS.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">❓ {q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        {/* Level breakdown */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Learn in Each Level</h2>
        <div className="space-y-3 mb-10">
          {[
            { level: 1, emoji: '📋', title: 'Registration Challenge', learns: 'Voter eligibility, registration methods, deadlines, accessibility accommodations, UOCAVA provisions' },
            { level: 2, emoji: '📣', title: 'Campaign Trail', learns: 'Campaign finance, volunteer management, state voting rule navigation, opposition research' },
            { level: 3, emoji: '🚌', title: 'Get Out The Vote', learns: 'Early voting windows, polling place logistics, ADA accommodations, provisional ballots' },
            { level: 4, emoji: '📊', title: 'Election Night', learns: 'Vote counting procedures, audit processes, canvassing, certification timelines, recounts' },
          ].map(({ level, emoji, title, learns }) => (
            <div key={level} className="flex gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-3xl flex-shrink-0">{emoji}</div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Level {level}</div>
                <div className="font-bold text-slate-900">{title}</div>
                <div className="text-sm text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">You&apos;ll learn: </span>{learns}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-slate-100 rounded-2xl py-10 px-6">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to test your knowledge?</h2>
          <p className="text-slate-500 mb-6">Apply what you just read in a 3-minute challenge.</p>
          <Link
            href="/game"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
            style={{ backgroundColor: '#0066CC' }}
          >
            Start Playing →
          </Link>
        </div>
      </main>
    </div>
  );
}
