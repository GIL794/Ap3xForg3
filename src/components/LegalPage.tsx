import React from 'react';
import { ShieldCheck, FileText, ArrowLeft, Lock, Server, Mail, AlertTriangle, Crown } from 'lucide-react';

interface LegalPageProps {
  pageType: 'privacy' | 'terms' | 'creed';
  onBackToHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType, onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#0c0e17]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HOMO DEVS" className="w-10 h-10 rounded-2xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/20" />
            <div>
              <h1 className="text-base sm:text-lg font-black font-roman tracking-wider text-white">
                HOMO <span className="text-amber-400">DEVS</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-roman">Romanvm Impervm • Official Documentation</p>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-roman font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portal</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {pageType === 'privacy' && (
          <div className="rounded-3xl bg-[#0c0e17] border border-amber-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-roman text-white tracking-wide">
                  Privacy Policy & Google Limited Use Disclosure
                </h2>
                <p className="text-xs text-slate-400">HOMO DEVS • Effective Date: September 2026</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" /> 1. Commitment to Athlete Privacy & Ownership
                </h3>
                <p>
                  HOMO DEUS ("we", "our", or "the Service") is a proprietary fitness engineering and progressive overload platform engineered, owned, and operated by <strong>Kyrvyn Ltd</strong> (Company No. 17246800, registered in England & Wales, <a href="https://kyrvynltd.co.uk" target="_blank" rel="noreferrer" className="text-amber-400 underline">kyrvynltd.co.uk</a>). This policy outlines how athlete data is securely handled across our applications in full compliance with the UK GDPR and international data standards.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" /> 2. Information Handled
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
                  <li><strong className="text-slate-200">Athlete Profile & Calibration:</strong> Chosen mythological archetype, experience tier, primary goal, available training days, and session duration.</li>
                  <li><strong className="text-slate-200">Training Ledger:</strong> Logged set weights, repetitions completed, set types (warmup, drop set, failure), and lifetime iron tonnage.</li>
                  <li><strong className="text-slate-200">Google Authentication Data:</strong> If you choose to sign in via Google OAuth, we receive only your public profile details (name, email address, profile avatar) strictly for athlete account authentication.</li>
                </ul>
              </section>

              <section className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-amber-300 font-roman">
                  3. Google API Services User Data Policy & Limited Use Disclosure
                </h3>
                <p className="text-slate-300">
                  HOMO DEVS' use and transfer to any other app of information received from Google APIs adheres strictly to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements.
                </p>
                <p className="text-slate-400 text-xs">
                  We do NOT sell, lease, transfer, or disclose user data to advertisers, data brokers, or marketing networks. All authentication information is strictly utilized to provide your personal workout profile and cloud ledger.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">
                  4. Data Security & Storage Isolation
                </h3>
                <p>
                  Your training state is strictly partitioned per user ID. Workouts are cached in high-performance local storage and, when cloud sync is activated, encrypted in our Supabase PostgreSQL architecture protected by strict Row Level Security (RLS) policies.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">
                  5. User Rights & Data Deletion
                </h3>
                <p>
                  You retain complete sovereignty over your data. You may reset your profile, switch accounts, or purge all records at any time. For full account deletion from our cloud database, please contact our Data Protection Officer below.
                </p>
              </section>

              <section className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Contact & Data Officer: <strong className="text-slate-200">contact@kyrvynltd.co.uk</strong></span>
                </div>
                <div>
                  Corporate: <strong className="text-slate-300">Kyrvyn Ltd</strong> (kyrvynltd.co.uk)
                </div>
              </section>
            </div>
          </div>
        )}

        {pageType === 'terms' && (
          <div className="rounded-3xl bg-[#0c0e17] border border-amber-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-roman text-white tracking-wide">
                  Terms of Service & Gym Safety Agreement
                </h2>
                <p className="text-xs text-slate-400">HOMO DEVS • Last Revised: September 2026</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-roman mb-1">Health & Physical Exercise Disclaimer:</strong>
                  Weightlifting and physical conditioning carry inherent risk of injury. Always perform warm-up sets, maintain proper technique, and consult with a licensed medical professional before undertaking any rigorous exercise program.
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">1. Scope of Service</h3>
                <p>
                  HOMO DEVS provides algorithmic training split design, barbell plate mathematics, rest timing protocols, and bio-recovery analytics for physical development.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">2. Athlete Responsibility</h3>
                <p>
                  The user assumes full responsibility for inspecting exercise equipment, selecting appropriate barbell loads, respecting fatigue signals, and training in safe environments.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">3. Subscriptions & Imperivm Pro</h3>
                <p>
                  Imperivm Pro passes (£4.99/month or £99.99 Lifetime) grant premium access to Live Oracle AI, 3D bio-recovery heatmaps, and cloud sync. Monthly passes may be canceled at any time prior to the next billing cycle.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-roman">4. Corporate Ownership & Governing Law</h3>
                <p>
                  HOMO DEUS is a proprietary software product engineered and owned by <strong>Kyrvyn Ltd</strong> (Company No. 17246800, England & Wales, <a href="https://kyrvynltd.co.uk" target="_blank" rel="noreferrer" className="text-amber-400 underline">kyrvynltd.co.uk</a>). These Terms are governed by and construed in accordance with the laws of England and Wales. For business inquiries or support, contact <strong className="text-slate-200">contact@kyrvynltd.co.uk</strong>.
                </p>
              </section>
            </div>
          </div>
        )}

        {pageType === 'creed' && (
          <div className="rounded-3xl bg-[#0c0e17] border border-amber-500/20 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-roman text-white tracking-wide">
                  The HOMO DEUS Mythos: The Colosseum Crucible & Divine Ascension
                </h2>
                <p className="text-xs text-slate-400">The Philosophy of the Romanvm Impervm Engine</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p className="text-amber-200 font-roman italic text-sm">
                "In ancient Rome, mortals entered the Colosseum arena bound by human fragility, fatigue, and self-doubt. The Caesars knew that glory is not inherited—it is carved into stone and sinew through relentless discipline, mathematical precision, and the sacred law of progressive overload."
              </p>

              <p>
                Mortal flesh was never destined to remain stagnant. While brute physical force without methodology crumbles under exhaustion, the human intellect commands the ultimate transformative power: <strong>strategic sport science, calculated mechanical tension, structured recovery, and the disciplined forge of iron</strong>.
              </p>

              <p>
                When an athlete dedicates their daily training to systematic progressive overload and autoregulated recovery, they do not merely build muscle. They transcend mortal limits to embody the eternal Olympian archetypes: Hercules, Adonis, Athena, Artemis, and Ares.
              </p>

              <p className="text-white font-roman font-bold text-base">
                They ascend to stand as the living sovereign of their own body: <span className="text-amber-400">HOMO DEUS</span>.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-roman space-y-1">
        <div>HOMO DEUS • Romanvm Impervm • Built for Immortals</div>
        <div>
          Proprietary Engineering Product of <a href="https://kyrvynltd.co.uk" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-300 underline font-semibold">Kyrvyn Ltd</a> (Company No. 17246800, England & Wales)
        </div>
      </footer>
    </div>
  );
};
