import React, { useState, useEffect } from 'react';
import { UserProfile, ExperienceLevel, PrimaryGoal, MythologicalArchetype } from '../types';
import { DAY_NAMES_SHORT } from '../data/defaultProfile';
import { ArrowRight, Check, Sparkles, Smartphone, Monitor, Apple, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportedLanguage, t } from '../logic/i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: UserProfile;
  onComplete: (completedProfile: UserProfile) => void;
  language?: SupportedLanguage;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
  language = 'en',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));
  }, []);

  if (!isOpen) return null;

  const daysOrder = [1, 2, 3, 4, 5, 6, 0];

  const ARCHETYPES = [
    { id: 'hercules_mass', name: 'The Titan', god: 'Hercules', emoji: '🏛️', gender: 'Masc', focus: 'Colossal Mass' },
    { id: 'artemis_power', name: 'The Huntress', god: 'Artemis', emoji: '🏹', gender: 'Fem', focus: 'Glutes & Speed' },
    { id: 'adonis_aesthetic', name: 'The Olympian', god: 'Adonis', emoji: '⚡', gender: 'Masc', focus: 'Golden V-Taper' },
    { id: 'athena_sculpt', name: 'The War Goddess', god: 'Athena', emoji: '🛡️', gender: 'Fem', focus: 'Delts & Posture' },
    { id: 'ares_combat', name: 'The Centurion', god: 'Ares', emoji: '⚔️', gender: 'Masc', focus: 'Warrior Grit' },
    { id: 'aphrodite_curves', name: 'The Sovereign', god: 'Aphrodite', emoji: '👑', gender: 'Fem', focus: 'Hourglass Tone' },
  ];

  const GOALS = [
    { id: 'upper_body_hypertrophy', label: language === 'en' ? 'Upper-Body Hypertrophy (V-Taper & Pec Mass)' : t('onboarding.goal', language) + ' — Upper Body' },
    { id: 'full_body_hypertrophy', label: language === 'en' ? 'Full-Body Hypertrophy & Athletic Speed' : t('onboarding.goal', language) + ' — Full Body' },
    { id: 'strength', label: language === 'en' ? 'Raw Strength (Colosseum Heavy Overload)' : t('onboarding.goal', language) + ' — Strength' },
  ] as const;

  const EXPERIENCE_LABELS: Record<string, string> = {
    Beginner: language === 'en' ? 'Beginner' : language === 'it' ? 'Principiante' : language === 'es' ? 'Principiante' : language === 'fr' ? 'Débutant' : language === 'de' ? 'Anfänger' : 'Tirocinium',
    Intermediate: language === 'en' ? 'Intermediate' : language === 'it' ? 'Intermedio' : language === 'es' ? 'Intermedio' : language === 'fr' ? 'Intermédiaire' : language === 'de' ? 'Fortgeschritten' : 'Mediocris',
    Advanced: language === 'en' ? 'Advanced' : language === 'it' ? 'Avanzato' : language === 'es' ? 'Avanzado' : language === 'fr' ? 'Avancé' : language === 'de' ? 'Erfahren' : 'Expertus',
  };

  const handleToggleDay = (dayIdx: number) => {
    const exists = profile.availableDays.includes(dayIdx);
    const updated = exists
      ? profile.availableDays.filter(d => d !== dayIdx)
      : [...profile.availableDays, dayIdx];
    setProfile({ ...profile, availableDays: updated });
  };

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f59e0b', '#eab308', '#10b981']
    });
    onComplete(profile);
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#0c0e17] border border-amber-500/30 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HOMO DEUS" className="w-7 h-7 rounded-xl object-cover border border-amber-500/30" />
            <span className="text-[11px] font-black font-roman tracking-wider uppercase text-amber-400">
              Olympian Calibration
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mono-font">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                  step === s ? 'border-amber-400 text-amber-400 bg-amber-500/10' :
                  step > s ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' :
                  'border-slate-700 text-slate-600'
                }`}>
                  {step > s ? '✓' : s}
                </span>
                {s < 4 && <span className="text-slate-700">—</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">

          {/* STEP 1: ARCHETYPE & IDENTITY */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black font-roman text-white mb-1">
                  {t('onboarding.step1Title', language)}
                </h3>
                <p className="text-xs text-slate-400">{t('onboarding.step1Sub', language)}</p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {t('onboarding.codename', language)}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder={t('onboarding.codename.placeholder', language)}
                    required
                  />
                </div>

                {/* Archetypes Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    {t('onboarding.archetype', language)} ♂ ♀
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ARCHETYPES.map((arch) => {
                      const isSelected = (profile.archetype || 'hercules_mass') === arch.id;
                      return (
                        <button
                          key={arch.id}
                          type="button"
                          onClick={() => setProfile({ ...profile, archetype: arch.id as MythologicalArchetype })}
                          className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/10'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl">{arch.emoji}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-900 text-slate-400">
                              {arch.gender}
                            </span>
                          </div>
                          <div className="font-roman font-bold text-xs text-white">{arch.name}</div>
                          <div className="text-[10px] text-amber-400 font-roman">{arch.god}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{arch.focus}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {t('onboarding.experience', language)}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setProfile({ ...profile, experience: lvl })}
                        className={`py-3 rounded-xl text-xs font-bold font-roman transition-all active:scale-95 ${
                          profile.experience === lvl
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {EXPERIENCE_LABELS[lvl]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!profile.name.trim()}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>{t('onboarding.continue', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GOALS & TRAINING SPLIT */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black font-roman text-white mb-1">
                  {t('onboarding.step2Title', language)}
                </h3>
                <p className="text-xs text-slate-400">{t('onboarding.step2Sub', language)}</p>
              </div>

              <div className="space-y-4">
                {/* Primary Goal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    {t('onboarding.goal', language)}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'upper_body_hypertrophy', en: 'Upper-Body Hypertrophy (V-Taper & Pec Mass)' },
                      { id: 'full_body_hypertrophy', en: 'Full-Body Hypertrophy & Athletic Speed' },
                      { id: 'strength', en: 'Raw Strength (Colosseum Heavy Overload)' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, primaryGoal: g.id as PrimaryGoal })}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between active:scale-[0.98] ${
                          profile.primaryGoal === g.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{g.en}</span>
                        {profile.primaryGoal === g.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Training Days */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    {t('onboarding.days', language)} ({profile.availableDays.length} selected)
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {daysOrder.map((dayIdx) => {
                      const isSelected = profile.availableDays.includes(dayIdx);
                      return (
                        <button
                          key={dayIdx}
                          type="button"
                          onClick={() => handleToggleDay(dayIdx)}
                          className={`py-3 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 shadow'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {DAY_NAMES_SHORT[dayIdx]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white font-roman transition-colors"
                >
                  {t('onboarding.back', language)}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>{t('onboarding.continue', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SESSION TIME, INJURIES & LAUNCH PREVIEW */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black font-roman text-white mb-1">
                  {t('onboarding.step3Title', language)}
                </h3>
                <p className="text-xs text-slate-400">{t('onboarding.step3Sub', language)}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Gym Time */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      {t('onboarding.gymTime', language)}
                    </label>
                    <input
                      type="time"
                      value={profile.targetWorkoutTime}
                      onChange={(e) => setProfile({ ...profile, targetWorkoutTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Session Length */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      {t('onboarding.sessionLen', language)}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[60, 75].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setProfile({ ...profile, sessionLengthMinutes: mins })}
                          className={`py-3 rounded-xl text-xs font-bold mono-font transition-all active:scale-95 ${
                            profile.sessionLengthMinutes === mins
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Injuries Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {t('onboarding.injuries', language)}
                  </label>
                  <textarea
                    value={profile.injuries || ''}
                    onChange={(e) => setProfile({ ...profile, injuries: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-500/60 transition-colors resize-none"
                    rows={2}
                    placeholder={t('onboarding.injuries.placeholder', language)}
                  />
                  <p className="text-[10px] text-rose-400/70 mt-1 flex items-center gap-1">
                    <span>🛡️</span>
                    <span>Oracle AI will automatically adapt your exercises around any limitation</span>
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <span className="font-bold font-roman block mb-1">
                    🏛️ Ready for Today at {profile.targetWorkoutTime}:
                  </span>
                  Your Olympian schedule will immediately generate today's session with set trackers, rest stopwatches, and plate loaders.
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white font-roman transition-colors"
                >
                  {t('onboarding.back', language)}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>{t('onboarding.continue', language)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADD TO HOME SCREEN (PWA INSTALL) */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black font-roman text-white mb-1">
                  {t('onboarding.step4Title', language)}
                </h3>
                <p className="text-xs text-slate-400">{t('onboarding.step4Sub', language)}</p>
              </div>

              {/* PWA Install Steps */}
              <div className="space-y-3">
                {/* iOS */}
                {(isIOS || !isAndroid) && (
                  <div className={`p-4 rounded-2xl border transition-all ${isIOS ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Apple className="w-4 h-4 text-slate-300" />
                      </div>
                      <span className="text-xs font-bold text-white font-roman">iPhone / iPad (Safari)</span>
                      {isIOS && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Your Device</span>}
                    </div>
                    <ol className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Tap the <strong className="text-white">Share button</strong> <span className="font-mono text-amber-300 bg-slate-800 px-1 rounded">□↑</span> at the bottom of Safari</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Tap <strong className="text-white">"Add"</strong> — HOMO DEUS appears on your home screen like a native app</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Android */}
                {(isAndroid || !isIOS) && (
                  <div className={`p-4 rounded-2xl border transition-all ${isAndroid ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-slate-300" />
                      </div>
                      <span className="text-xs font-bold text-white font-roman">Android (Chrome)</span>
                      {isAndroid && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Your Device</span>}
                    </div>
                    <ol className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span>Tap the <strong className="text-white">3-dot menu</strong> <span className="font-mono text-amber-300 bg-slate-800 px-1 rounded">⋮</span> in Chrome's top-right</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span>Tap <strong className="text-white">"Add to Home Screen"</strong> or <strong className="text-white">"Install App"</strong> if shown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span>Tap <strong className="text-white">"Install"</strong> to confirm</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Desktop */}
                {(!isIOS && !isAndroid) && (
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-slate-300" />
                      </div>
                      <span className="text-xs font-bold text-white font-roman">Desktop (Chrome / Edge)</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Click the <strong className="text-white">install icon</strong> <span className="font-mono text-amber-300 bg-slate-800 px-1 rounded">⊕</span> in your browser address bar, then click <strong className="text-white">"Install"</strong>.
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <div className="font-roman font-bold mb-1">✅ Why install it?</div>
                  <div className="text-emerald-400/80 space-y-0.5">
                    <div>• Full-screen at the gym — no browser chrome</div>
                    <div>• Faster loading — assets cached locally</div>
                    <div>• Works offline for viewing your current plan</div>
                    <div>• Feels like a native app — no app store needed</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white font-roman transition-colors"
                >
                  {t('onboarding.back', language)}
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{t('onboarding.launch', language)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
