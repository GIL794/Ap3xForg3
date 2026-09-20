import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, PrimaryGoal, EquipmentType, MythologicalArchetype } from '../types';
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

  const ARCHETYPES = [
    { id: 'hercules_mass', name: 'The Titan', god: 'Hercules', emoji: '🏛️', gender: 'Masc', focus: 'Colossal Mass' },
    { id: 'artemis_power', name: 'The Huntress', god: 'Artemis', emoji: '🏹', gender: 'Fem', focus: 'Glutes & Speed' },
    { id: 'adonis_aesthetic', name: 'The Olympian', god: 'Adonis', emoji: '⚡', gender: 'Masc', focus: 'Golden V-Taper' },
    { id: 'athena_sculpt', name: 'The War Goddess', god: 'Athena', emoji: '🛡️', gender: 'Fem', focus: 'Delts & Posture' },
    { id: 'ares_combat', name: 'The Centurion', god: 'Ares', emoji: '⚔️', gender: 'Masc', focus: 'Warrior Grit' },
    { id: 'aphrodite_curves', name: 'The Sovereign', god: 'Aphrodite', emoji: '👑', gender: 'Fem', focus: 'Hourglass Tone' },
  ];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c0e17] border-2 border-amber-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HOMO DEVS" className="w-8 h-8 rounded-xl object-cover border border-amber-500/30" />
            <span className="text-xs font-black font-roman tracking-wider uppercase text-amber-400">
              Olympian Calibration Protocol
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mono-font">
            <span className={step >= 1 ? 'text-amber-400' : ''}>1</span>
            <span>/</span>
            <span className={step >= 2 ? 'text-amber-400' : ''}>2</span>
            <span>/</span>
            <span className={step >= 3 ? 'text-amber-400' : ''}>3</span>
          </div>
        </div>

        {/* STEP 1: ATHLETE IDENTITY & ARCHETYPE */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black font-roman text-white mb-1">
                Choose Your Olympian Archetype
              </h3>
              <p className="text-xs text-slate-400">
                Calibrate your biological frame towards mythological perfection.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Athlete Codename</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                  placeholder="Enter your name or codename..."
                  required
                />
              </div>

              {/* Archetypes Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Mythological Physique Target (Men & Women)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ARCHETYPES.map((arch) => {
                    const isSelected = (profile.archetype || 'hercules_mass') === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, archetype: arch.id as MythologicalArchetype })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
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
                        <div className="font-roman font-bold text-xs text-white">
                          {arch.name}
                        </div>
                        <div className="text-[10px] text-amber-400 font-roman">
                          {arch.god}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {arch.focus}
                        </div>
                      </button>
                    );
                  })}
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
                      className={`py-2 rounded-xl text-xs font-bold font-roman transition-all ${
                        profile.experience === lvl
                          ? 'bg-amber-500 text-slate-950 shadow'
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
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
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
              <h3 className="text-xl font-black font-roman text-white mb-1">
                Calibrate Your Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Select your primary hypertrophy goal and weekly training days.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Primary Focus</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'upper_body_hypertrophy', label: 'Upper-Body Hypertrophy (V-Taper & Pec Mass)' },
                    { id: 'full_body_hypertrophy', label: 'Full-Body Hypertrophy & Athletic Speed' },
                    { id: 'strength', label: 'Raw Strength (Colosseum Heavy Overload)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, primaryGoal: g.id as PrimaryGoal })}
                      className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        profile.primaryGoal === g.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{g.label}</span>
                      {profile.primaryGoal === g.id && <Check className="w-4 h-4 text-amber-400" />}
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

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white font-roman"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SESSION TIME & LAUNCH */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black font-roman text-white mb-1">
                Final Olympian Calibration
              </h3>
              <p className="text-xs text-slate-400">
                Lock in your training hour today and session length.
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    e.g. 19:00 local time
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
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <span className="font-bold font-roman block mb-1">🏛️ Ready for Today at {profile.targetWorkoutTime}:</span>
                Your Olympian schedule will immediately generate today's session with set trackers, rest stopwatches, and plate loaders.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white font-roman"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Ascend to the Arena</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
