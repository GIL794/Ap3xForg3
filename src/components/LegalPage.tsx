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
                  <Lock className="w-4 h-4 text-amber-400" /> 1. Commitment to Athlete Privacy
                </h3>
                <p>
                  HOMO DEVS ("we", "our", or "the Service") is built to deliver world-class Olympian fitness programming while maintaining absolute privacy. This policy outlines how your information is handled across our mobile and web applications.
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

              <section className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Contact & Inquiries: <strong className="text-slate-200">privacy@homodevs.app</strong></span>
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
                  The HOMO DEVS Mythos: The Silverback Paradox & Divine Ascension
                </h2>
                <p className="text-xs text-slate-400">The Philosophy of the Romanvm Impervm Engine</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p className="text-amber-200 font-roman italic text-sm">
                "In nature, an adult male gorilla possesses colossal mass, terrifying muscle fibers, and the raw strength to snap saplings like twigs. Yet in the African night, even the mighty silverback can fall prey to the swift, calculated ambush of a solitary leopard or the coordinated strike of lions."
              </p>

              <p>
                Why? Because <strong>raw primal muscle without adaptive intelligence is limited</strong>.
              </p>

              <p>
                Human beings were not gifted with the natural fangs of tigers or the natural bone density of apes. Instead, humans were endowed with the ultimate biological weapon: <strong>the prefrontal cortex</strong> — the capacity for strategic thought, science, progressive overload, mathematics, and iron forging.
              </p>

              <p>
                When a human athlete applies systematic exercise physiology — calculated mechanical tension, recovery autoregulation, structured nutrition, and disciplined compound lifting — they do not merely equal the animal kingdom. They surpass it.
              </p>

              <p className="text-white font-roman font-bold text-base">
                They become the only true living god on Earth: <span className="text-amber-400">HOMO DEVS</span>.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-roman">
        HOMO DEVS • Romanvm Impervm • Built for Immortals
      </footer>
    </div>
  );
};
