import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Zap, 
  Lock, 
  Award,
  ChevronRight,
  Map,
  Activity,
  Calculator,
  Timer
} from 'lucide-react';
import { UserAccount, MythologicalArchetype } from '../types';
import { signInWithGoogle, loginAthleteByName, enterGuestMode, getAllUserAccounts } from '../logic/auth';

interface LandingPageProps {
  onAthleteAuthenticated: (user: UserAccount) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCreed: () => void;
  onOpenRoadmap: () => void;
  onOpenPro: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAthleteAuthenticated,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCreed,
  onOpenRoadmap,
  onOpenPro,
}) => {
  const [codenameInput, setCodenameInput] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const existingAccounts = getAllUserAccounts();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      const { error, user } = await signInWithGoogle();
      if (error) {
        setAuthError(error.message);
      } else if (user) {
        onAthleteAuthenticated(user);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleNameLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codenameInput.trim()) return;
    const account = loginAthleteByName(codenameInput.trim());
    onAthleteAuthenticated(account);
  };

  const handleGuestEnter = () => {
    const guest = enterGuestMode();
    onAthleteAuthenticated(guest);
  };

  const ARCHETYPES = [
    {
      id: 'hercules_mass',
      title: 'The Titan (Hercules)',
      badge: 'Colossal Mass & Power',
      emoji: '🏛️',
      gender: 'Masculine',
      desc: 'Heavy compound volume, wide back, rock-solid quads, and demigod strength.',
    },
    {
      id: 'artemis_power',
      title: 'The Huntress (Artemis / Atalanta)',
      badge: 'Glute & Athletic Power',
      emoji: '🏹',
      gender: 'Feminine',
      desc: 'Hip thrusts, powerful posterior chain, swift athletic speed, and conditioned strength.',
    },
    {
      id: 'adonis_aesthetic',
      title: 'The Olympian (Adonis / Apollo)',
      badge: 'Golden Ratio V-Taper',
      emoji: '⚡',
      gender: 'Masculine',
      desc: 'Sculpted shoulders, razor-sharp core symmetry, and chiseled classical proportion.',
    },
    {
      id: 'athena_sculpt',
      title: 'The War Goddess (Athena)',
      badge: 'Sculpted Delts & Symmetry',
      emoji: '🛡️',
      gender: 'Feminine',
      desc: 'Capped deltoids, defined posture, graceful back taper, and athletic elegance.',
    },
    {
      id: 'ares_combat',
      title: 'The Centurion (Ares)',
      badge: 'Warrior Stamina & Grit',
      emoji: '⚔️',
      gender: 'Masculine',
      desc: 'Battle-hardened physical stamina, explosive compound sets, and unbreakable will.',
    },
    {
      id: 'aphrodite_curves',
      title: 'The Sovereign (Aphrodite)',
      badge: 'Hourglass Vitality',
      emoji: '👑',
      gender: 'Feminine',
      desc: 'Golden ratio waistline, aesthetic lower body curves, and full-body athletic tone.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#0c0e17]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="HOMO DEVS Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border border-amber-500/40 shadow-lg shadow-amber-500/20"
            />
            <div>
              <h1 className="text-base sm:text-xl font-black font-roman tracking-wider text-white flex items-center gap-1.5">
                HOMO <span className="text-amber-400">DEVS</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-roman tracking-wider uppercase hidden sm:block">
                Romanvm Impervm • Olympian Strength Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-roman">
            <button
              onClick={onOpenCreed}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors"
            >
              <span>The Mythos</span>
            </button>
            <button
              onClick={onOpenRoadmap}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors"
            >
              <span>XIII Tiers</span>
            </button>
            <button
              onClick={onOpenPro}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Imperivm Pro</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-800/80">
        {/* Ambient Gold Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Vision & Headline */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-roman font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>The Romanvm Impervm Strength Engine</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-roman text-white tracking-tight leading-none uppercase">
              ASCEND FROM MORTAL FLESH TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">HOMO DEVS</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Fusing cutting-edge sport science with the immortal aesthetics of Mount Olympus and the Colosseum. Progressive overload splits, Greco-Roman archetypes for men and women, bio-recovery gauges, and XIII Tiers of Divine Ascension.
            </p>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400 font-roman">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Paywall Core Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                XIII Mythological Tiers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Bio-Recovery Gauge
              </span>
            </div>
          </div>

          {/* Right Column: The Authentication Portal Card */}
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl bg-[#0c0e17] border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black font-roman text-white tracking-wide uppercase">
                  Enter The Imperivm
                </h3>
                <p className="text-xs text-slate-400 font-roman">
                  Sign in or forge a fresh athlete identity
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center">
                  {authError}
                </div>
              )}

              {/* Action 1: Google OAuth Sign-in Button */}
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs font-sans transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {/* Google G SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-roman uppercase">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span>Or Enter by Codename</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Action 2: Name Input / Quick Registration */}
                <form onSubmit={handleNameLogin} className="space-y-2">
                  <input
                    type="text"
                    required
                    value={codenameInput}
                    onChange={(e) => setCodenameInput(e.target.value)}
                    placeholder="Enter athlete codename or name..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
                  >
                    Enter HOMO DEVS
                  </button>
                </form>

                {/* Action 3: Guest Sandbox Button */}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleGuestEnter}
                    className="text-xs text-slate-400 hover:text-amber-300 font-roman transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Try as Guest Gladiator (Instant Sandbox)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Saved Accounts on this Device (1-Click Resume) */}
                {existingAccounts.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <span className="block text-[10px] font-roman uppercase text-slate-500 mb-2">
                      Athletes on this device:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {existingAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => onAthleteAuthenticated(acc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-amber-300 text-xs font-bold font-roman flex items-center gap-1"
                        >
                          <span>🏛️</span>
                          <span>{acc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Greco-Roman Mythological Archetypes (Male & Female Inclusive) */}
      <section className="py-16 bg-[#0a0b12] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black font-roman uppercase text-amber-400 tracking-wider">
              Personalized Mythological Calibration
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-roman text-white uppercase tracking-tight">
              CHOOSE YOUR OLYMPIAN PHYSIQUE
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Sculpt your body to match the legendary figures of antiquity. Designed equally for men and women pursuing elite athletic hypertrophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARCHETYPES.map((arch) => (
              <div
                key={arch.id}
                className="p-5 rounded-3xl bg-[#0c0e17] border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3 group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                    {arch.emoji}
                  </span>
                  <span className="text-[10px] font-roman uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                    {arch.gender}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black font-roman text-white group-hover:text-amber-300 transition-colors">
                    {arch.title}
                  </h4>
                  <span className="text-[10px] text-amber-400/90 font-roman font-bold uppercase tracking-wider block mt-0.5">
                    {arch.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {arch.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Built-in Olympian Arsenal */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black font-roman uppercase text-amber-400 tracking-wider">
              Zero-Paywall Core Features
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-roman text-white uppercase tracking-tight">
              THE OLYMPIAN GYM ARSENAL
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-roman text-white">Barbell Plate Loader</h4>
              <p className="text-xs text-slate-400">
                Visual Olympic bumper plates (25kg red down to 1.25kg microplates) with 1RM intensity brackets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-roman text-white">Primal Rest Stopwatch</h4>
              <p className="text-xs text-slate-400">
                Web Audio 4-note ascending power fanfare and psychological focus quotes to ignite your next set.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-roman text-white">Bio-Recovery Gauge</h4>
              <p className="text-xs text-slate-400">
                Dynamic muscle readiness and central nervous system fatigue scores to eliminate guesswork.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold font-roman text-white">XIII Tiers of Ascension</h4>
              <p className="text-xs text-slate-400">
                Track lifetime iron volume from Plebeian Recruit to HOMO DEVS across 140,000+ kg of iron moved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer with Google Compliance Links */}
      <footer className="border-t border-slate-800 bg-[#06070a] py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HOMO DEVS" className="w-6 h-6 rounded-md object-cover" />
            <span className="font-roman font-bold text-slate-300">HOMO DEVS Engine</span>
            <span>•</span>
            <span className="text-amber-400 font-roman">Romanvm Impervm</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-roman">
            <button onClick={onOpenPrivacy} className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-amber-300 transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={onOpenCreed} className="hover:text-amber-300 transition-colors">
              The Mythos
            </button>
            <span>•</span>
            <a
              href="https://github.com/GIL794/Ap3xForg3"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              GitHub Repository
            </a>
          </div>

          <div className="text-slate-500 text-[11px] font-roman">
            Built by Athletes for Athletes • Google OAuth Compliant
          </div>
        </div>
      </footer>
    </div>
  );
};
