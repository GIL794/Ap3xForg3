import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  Shield, 
  Copy, 
  CheckCheck, 
  ExternalLink, 
  Send, 
  KeyRound,
  AlertCircle,
  Activity,
  Calculator,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount } from '../types';
import { isLifetimeVipUser, verifyEmperorPasscode } from '../logic/auth';
import { SupportedLanguage, t } from '../logic/i18n';

interface ImperivmProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
  currentUser?: UserAccount | null;
  isProSubscriber?: boolean;
  language?: SupportedLanguage;
}

const AIRTM_RECIPIENT_EMAIL = 'gella94@gmail.com';

export const ImperivmProModal: React.FC<ImperivmProModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  currentUser,
  isProSubscriber = false,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'airtm' | 'passcode'>('airtm');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isVip = isLifetimeVipUser(currentUser);
  const isAlreadyPro = isProSubscriber || isVip;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(AIRTM_RECIPIENT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const triggerCelebration = (msg: string) => {
    setSuccessMessage(msg);
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ffd700', '#f59e0b', '#ffffff']
    });

    if (onUpgradeSuccess) {
      onUpgradeSuccess();
    }

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2500);
  };

  const handleConfirmAirTM = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerCelebration(`AirTM transfer verified for ${AIRTM_RECIPIENT_EMAIL}! Welcome to Imperivm Pro.`);
    }, 1000);
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyEmperorPasscode(passcode)) {
      setPasscodeError(null);
      triggerCelebration('Emperor Passcode verified! Lifetime Emperor granted.');
    } else {
      setPasscodeError('Invalid Emperor Passcode. Please check the code or contact Gabriele.');
    }
  };


  const DEEP_PRO_PILLARS = [
    {
      emoji: '🔮',
      title: 'Live Oracle AI Exercise Physiologist (Gemini 2.0)',
      badge: 'Zero Setup • Managed by Platform',
      description: 'Consult our automated AI sport scientist for every single workout session. The Oracle dynamically critiques weekly volume, calculates exact RPE mechanical tension, suggests smart biomechanical injury substitutions, and provides pre-workout fueling timing calibrated to your target training hour without demanding any technical API keys.',
    },
    {
      emoji: '🧬',
      title: 'Full 3D Bio-Recovery & CNS Fatigue Heatmap',
      badge: 'Autoregulation • Overtraining Defense',
      description: 'Algorithmic readiness scoring across Pectorals, Deltoids, Lats, Quads, Glutes, and Core. Tracks central nervous system (CNS) systemic exhaustion and tells you exactly when each muscle is primed for progressive overload versus when fatigue demands a deload set.',
    },
    {
      emoji: '🏋️',
      title: 'Barbell 1RM Intensity Brackets & Warmup Ramp',
      badge: 'Heavy Compound Precision',
      description: 'Unlock heavy compound percentage target tables (80%, 85%, 90%, 95% of 1RM) across Brzycki and Epley equations. Includes the visual Olympic bumper plate loader and automated progressive warmup ramp schemes (50% → 70% → 85% → Working Weight) to prevent joint injury.',
    },
    {
      emoji: '👑',
      title: 'Divine Ascension Tiers XI — XIII (Living Deity)',
      badge: 'Poseidon, Jupiter & HOMO DEVS',
      description: 'Unlock the highest echelons of lifetime iron tonnage (100,000kg to 140,000kg+). Earn mythical golden laurel badges, imperial profile borders, and 4-note victory fanfares reserved strictly for lifters who surpass mortal boundaries.',
    },
    {
      emoji: '☁️',
      title: 'Encrypted Cloud Ledger & Multi-Device Sync',
      badge: 'Seamless Mobility',
      description: 'Synchronize your entire workout history, custom exercises, logged weights, and set tags (Warmup, Drop, Failure) across iPhone, Android, iPad, and desktop in real-time via encrypted cloud storage.',
    },
    {
      emoji: '📜',
      title: 'Imperial PDF Workout Scrolls & Certificates',
      badge: 'Proof of Strength',
      description: 'Export beautifully typeset Roman training scrolls and verified proof-of-strength milestone certificates to celebrate your personal records and share your achievements with your training partners.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0e17] border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Decorative Header */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-b from-amber-950/40 via-[#10131f] to-[#0c0e17] border-b border-amber-500/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 mb-3">
            <Crown className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h3 className="text-2xl font-black text-white font-roman tracking-wider uppercase">
            {t('pro.modalTitle', language)}
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 font-roman">
            {t('pro.subtitle', language)}
          </p>

          {/* Already Pro Banner */}
          {isAlreadyPro && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-roman font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isVip
                  ? '👑 Imperial Founder / VIP Status Active (Lifetime Access)'
                  : '✨ Imperivm Pro Active On This Account'}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Success Notification */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-center font-roman font-bold text-sm">
              ✨ {successMessage}
            </div>
          )}

          {/* Pricing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Pro Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg glow-gold'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-roman uppercase font-black text-slate-300 tracking-wider">
                  {t('pro.monthly', language)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase">
                  Monthly Pass
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mono-font flex items-baseline gap-1">
                <span className="text-amber-300">£4.99</span>
                <span className="text-xs text-slate-400 font-sans">($6.50 USD) {t('pro.perMonth', language)}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Full access to Live Oracle AI, 3D Bio-Recovery, Barbell 1RM calculators, and cloud synchronization. Cancel anytime.
              </p>
            </div>

            {/* Lifetime Emperor Plan */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                selectedPlan === 'lifetime'
                  ? 'border-amber-400 bg-amber-950/30 shadow-xl glow-gold'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Best Value • Lifetime
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-roman uppercase font-black text-amber-300 tracking-wider">
                  {t('pro.lifetime', language)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  One-Time
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mono-font flex items-baseline gap-1">
                <span className="text-amber-300">£99.99</span>
                <span className="text-xs text-emerald-400 font-sans font-bold">($130 USD) {t('pro.forever', language)}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                Eternal membership. Never pay another subscription fee. Includes all future expansions and divine perks.
              </p>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="space-y-3">
            <div className="text-xs font-roman uppercase font-bold text-slate-400">
              Select Payment Method:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('airtm')}
                className={`py-2.5 px-3 rounded-xl font-roman text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  activeTab === 'airtm'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('pro.airtm', language)}</span>
              </button>

              <button
                onClick={() => setActiveTab('passcode')}
                className={`py-2.5 px-3 rounded-xl font-roman text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  activeTab === 'passcode'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-lg'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t('pro.passcode', language)}</span>
              </button>
            </div>

            {/* TAB 1: AIRTM PAY */}
            {activeTab === 'airtm' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0d1222] to-slate-950 border border-cyan-500/30 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-roman flex items-center gap-2">
                        Pay with AirTM
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                          Direct P2P Transfer
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Send AirUSD or USD directly to the founder account
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://app.airtm.com/send"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-roman font-bold flex items-center gap-1 border border-cyan-500/40 transition-colors"
                  >
                    <span>Open AirTM</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Recipient Address Box */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-roman uppercase tracking-wider text-slate-400 font-bold block">
                    Recipient AirTM Email:
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-cyan-300 font-mono text-sm sm:text-base font-bold select-all break-all">
                      {AIRTM_RECIPIENT_EMAIL}
                    </code>
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-roman flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                    >
                      {copiedEmail ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[11px] text-slate-400 font-medium">
                    1. Send <strong className="text-amber-300">{selectedPlan === 'lifetime' ? '£99.99 (~$130 AirUSD)' : '£4.99 (~$6.50 AirUSD)'}</strong> to <strong className="text-cyan-300">{AIRTM_RECIPIENT_EMAIL}</strong>.
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    2. Include your athlete name <span className="text-white font-bold">({currentUser?.name || 'Your Name'})</span> in the transfer note.
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    3. Click the button below to confirm and activate your membership immediately.
                  </div>
                </div>

                <button
                  onClick={handleConfirmAirTM}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-roman font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t('pro.confirmAirtm', language)}</span>
                    </>
                  )}
                </button>
              </div>
            )}


            {/* TAB 3: VIP PASSCODE */}
            {activeTab === 'passcode' && (
              <form onSubmit={handlePasscodeSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white font-roman">
                      Emperor Secret Passcode
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Provided to founders, VIP athletes, and friends
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value.toUpperCase());
                      setPasscodeError(null);
                    }}
                    placeholder="Enter secret passcode"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-purple-500 tracking-widest placeholder:text-slate-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-roman font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm"
                  >
                    Unlock
                  </button>
                </div>

                {passcodeError && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passcodeError}</span>
                  </div>
                )}


              </form>
            )}
          </div>

          {/* DEEP PRO PILLARS BREAKDOWN */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-amber-400 font-roman tracking-wider">
                What Is Behind the Paywall (The 6 Imperivm Pro Pillars)
              </h4>
              <span className="text-[10px] text-slate-400 font-roman">Complete Breakdown</span>
            </div>

            <div className="space-y-3">
              {DEEP_PRO_PILLARS.map((pillar, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{pillar.emoji}</span>
                      <strong className="text-xs font-bold text-white font-roman">
                        {pillar.title}
                      </strong>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold font-roman">
                      {pillar.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-amber-500/20 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted payment • Instant access • 100% satisfaction</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-roman transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
