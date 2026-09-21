import React, { useEffect, useState } from 'react';
import { WorkoutDay, UserProfile, LoggedSetRecord } from '../types';
import { Award, Trophy, Clock, Dumbbell, Sparkles, Check, Share2, Flame, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutPlan: WorkoutDay;
  profile: UserProfile;
  totalTonnageKg: number;
  durationMinutes: number;
  completedSetsCount: number;
  totalSetsCount: number;
  prCount?: number;
  onSaveToHistory: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  onClose,
  workoutPlan,
  profile,
  totalTonnageKg,
  durationMinutes,
  completedSetsCount,
  totalSetsCount,
  prCount = 1,
  onSaveToHistory,
}) => {
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Confetti burst
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#eab308']
      });
      onSaveToHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Fun Roman mythological volume equivalencies
  const getVolumeMythology = (kg: number) => {
    if (kg > 20000) return 'Heavier than 15 Roman War Chariots & 3 Battering Rams!';
    if (kg > 15000) return 'Equivalent to hoisting 10 Roman War Chariots into battle!';
    if (kg > 10000) return 'Heavier than the Colosseum gladiatorial portcullis!';
    if (kg > 5000) return 'Equivalent to moving 4 Centurion stone boundary pillars!';
    return 'A valiant offering of blood and iron to the Pantheon!';
  };

  const xpEarned = Math.round(completedSetsCount * 25 + totalTonnageKg * 0.02 + 100);

  const handleShare = async () => {
    const text = `🏛️ HOMO DEUS — Arena Session Completed!
Athlete: ${profile.name}
Workout: ${workoutPlan.name}
🔥 Tonnage Moved: ${totalTonnageKg.toLocaleString()} kg
⏱️ Duration: ${durationMinutes} min
⚡ Sets Conquered: ${completedSetsCount}/${totalSetsCount}
🏆 Personal Records: ${prCount} PRs
⚔️ Olympian XP: +${xpEarned} XP
"Pain is fleeting, Olympian glory is eternal."`;

    try {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0e17] border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 p-6 text-center overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown & Trophy badge */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4 animate-bounce duration-1000">
            <Trophy className="w-8 h-8 stroke-[2.5]" />
          </div>

          <span className="text-xs font-roman font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> ARENA VICTORY CONQUERED
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-roman tracking-tight mb-2">
            GLORIA IN EXCELSIS
          </h2>

          <p className="text-xs text-slate-300 max-w-xs mb-6">
            Congratulations, <strong className="text-amber-300">{profile.name}</strong>. Your session has been permanently sealed into your Olympian Ledger.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                Total Iron Tonnage
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 mono-font">
                {totalTonnageKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
              </span>
              <span className="text-[10px] text-amber-300/80 block mt-1 italic leading-tight">
                {getVolumeMythology(totalTonnageKg)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                Session Time
              </span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 mono-font">
                {durationMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Active heart & neural output
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                Working Sets
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mono-font">
                {completedSetsCount}/{totalSetsCount}
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-1">
                100% Target Met
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                Olympian Ascension
              </span>
              <span className="text-xl sm:text-2xl font-black text-yellow-300 mono-font">
                +{xpEarned} <span className="text-xs font-normal text-slate-400">XP</span>
              </span>
              <span className="text-[10px] text-amber-300 block mt-1 font-roman font-bold">
                Centurion Tier III Rank
              </span>
            </div>
          </div>

          {/* PR Laurel Banner */}
          {prCount > 0 && (
            <div className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 mb-6 flex items-center justify-center gap-2 text-xs text-amber-300 font-roman font-bold">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{prCount} Personal Record{prCount > 1 ? 's' : ''} established in this workout!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-roman font-bold transition-all flex items-center justify-center gap-1.5"
            >
              {shared ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Share Glory</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-roman font-black tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Seal Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
