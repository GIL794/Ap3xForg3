import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, PrimaryGoal, EquipmentType } from '../types';
import { DAY_NAMES_SHORT } from '../data/defaultProfile';
import { ArrowRight, Check, Sparkles, User, Dumbbell, Clock, Flame, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: UserProfile;
  onComplete: (completedProfile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  if (!isOpen) return null;

  const daysOrder = [1, 2, 3, 4, 5, 6, 0];

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
      colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b']
    });
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Ap3xF0rg3" className="w-8 h-8 rounded-xl object-cover" />
            <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
              Onboarding Protocol
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mono-font">
            <span className={step >= 1 ? 'text-emerald-400' : ''}>1</span>
            <span>/</span>
            <span className={step >= 2 ? 'text-emerald-400' : ''}>2</span>
            <span>/</span>
            <span className={step >= 3 ? 'text-emerald-400' : ''}>3</span>
          </div>
        </div>

        {/* STEP 1: ATHLETE IDENTITY */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black text-white mb-1">
                Welcome to the Forge, Athlete.
              </h3>
              <p className="text-xs text-slate-400">
                Name your athlete codename and location to calibrate your biological rhythm.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Athlete Codename</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Gabriele"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. London, UK"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Experience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProfile({ ...profile, experience: lvl })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        profile.experience === lvl
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GOALS & SPLIT */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black text-white mb-1">
                Choose Your Evolutionary Focus
              </h3>
              <p className="text-xs text-slate-400">
                Select your primary hypertrophy goal and training schedule.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Goal</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'upper_body_hypertrophy', label: 'Upper-Body Hypertrophy (V-Taper & Pec Mass)' },
                    { id: 'full_body_hypertrophy', label: 'Full-Body Hypertrophy & Athletic Power' },
                    { id: 'strength', label: 'Raw Strength (Heavy Compound Overload)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, primaryGoal: g.id as PrimaryGoal })}
                      className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        profile.primaryGoal === g.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{g.label}</span>
                      {profile.primaryGoal === g.id && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Available Days per Week ({profile.availableDays.length} Selected)
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {daysOrder.map((dayIdx) => {
                    const isSelected = profile.availableDays.includes(dayIdx);
                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => handleToggleDay(dayIdx)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow'
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

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GYM HOUR & ASCENSION */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black text-white mb-1">
                Calibrate Today's Session
              </h3>
              <p className="text-xs text-slate-400">
                Lock in your target gym time today and session length.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Target Gym Hour Today
                  </label>
                  <input
                    type="time"
                    value={profile.targetWorkoutTime}
                    onChange={(e) => setProfile({ ...profile, targetWorkoutTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    e.g. 19:00 London time
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Session Length
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[60, 75].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setProfile({ ...profile, sessionLengthMinutes: mins })}
                        className={`py-2 rounded-xl text-xs font-bold mono-font transition-all ${
                          profile.sessionLengthMinutes === mins
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <span className="font-bold block mb-1">🦍 Ready for Today at {profile.targetWorkoutTime}:</span>
                Your plan will immediately assign an Upper-Body Hypertrophy workout today with set tracking, rest timers, and plate calculators.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Forge My Plan & Ascend</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
