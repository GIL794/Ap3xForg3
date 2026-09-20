import React from 'react';
import { Crown, Flame, Zap, Shield, Sparkles } from 'lucide-react';

interface ApexEvolutionCardProps {
  totalTonnageKg: number;
  completedSetsCount: number;
  totalSetsCount: number;
  onOpenGymTools: () => void;
}

export const ApexEvolutionCard: React.FC<ApexEvolutionCardProps> = ({
  totalTonnageKg,
  completedSetsCount,
  totalSetsCount,
  onOpenGymTools,
}) => {
  // Evolution Ranks
  const ranks = [
    {
      name: 'Chimp Cadet',
      emoji: '🐒',
      minKg: 0,
      maxKg: 1500,
      lore: 'Still learning barbell bar paths and swinging from pull-up bars. Eat a banana and keep lifting.',
      color: 'from-amber-600 to-amber-700 text-amber-200 border-amber-500/30',
      badge: 'Primate in Training',
    },
    {
      name: 'Silverback Gorilla',
      emoji: '🦍',
      minKg: 1500,
      maxKg: 4000,
      lore: 'Raw primate power unlocked. You crush compound sets, but remember: in the wild, lions still hunt gorillas.',
      color: 'from-cyan-600 to-blue-700 text-cyan-200 border-cyan-500/30',
      badge: 'Silverback Strength',
    },
    {
      name: 'Primal Hunter',
      emoji: '🐅',
      minKg: 4000,
      maxKg: 7500,
      lore: 'Ferocious, conditioned, and ruthless. You out-lift and out-endure the dangerous beasts.',
      color: 'from-emerald-600 to-teal-700 text-emerald-200 border-emerald-500/30',
      badge: 'Savannah Stalker',
    },
    {
      name: 'True Apex Predator',
      emoji: '👑',
      minKg: 7500,
      maxKg: Infinity,
      lore: 'AT THE TOP OF THE FOOD CHAIN. Beaten by no animal in the kingdom. You rule the iron jungle.',
      color: 'from-purple-600 to-pink-600 text-purple-200 border-purple-500/30',
      badge: 'Apex Dominance',
    },
  ];

  const currentRank = ranks.find(r => totalTonnageKg >= r.minKg && totalTonnageKg < r.maxKg) || ranks[0];
  const nextRank = ranks[ranks.indexOf(currentRank) + 1] || null;

  const progressToNext = nextRank 
    ? Math.min(100, Math.round(((totalTonnageKg - currentRank.minKg) / (nextRank.minKg - currentRank.minKg)) * 100))
    : 100;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl transition-all">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Avatar & Rank */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-800 border-2 border-slate-700 shadow-inner text-3xl shrink-0">
            <span>{currentRank.emoji}</span>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-700">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-white flex items-center gap-1.5 tracking-tight">
                {currentRank.name}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${currentRank.color}`}>
                {currentRank.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md italic">
              "{currentRank.lore}"
            </p>
          </div>
        </div>

        {/* Right: Tonnage metric & Quick Gym Tools trigger */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div className="text-left md:text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Total Iron Moved Today
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mono-font flex items-baseline md:justify-end gap-1">
              <span>{totalTonnageKg.toLocaleString()}</span>
              <span className="text-xs font-normal text-emerald-400">kg volume</span>
            </div>
          </div>

          <button
            onClick={onOpenGymTools}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Plate & 1RM Tools</span>
          </button>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {nextRank && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <span>Next Evolution:</span>
              <strong className="text-slate-200">{nextRank.name} {nextRank.emoji}</strong>
            </span>
            <span className="mono-font text-emerald-400 font-bold">
              {(nextRank.minKg - totalTonnageKg).toLocaleString()} kg to advance
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
