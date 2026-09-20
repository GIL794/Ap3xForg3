import React, { useState } from 'react';
import { Crown, Sparkles, Map } from 'lucide-react';
import { ASCENSION_TIERS, EvolutionRoadmapModal } from './EvolutionRoadmapModal';

export interface OlympianEvolutionCardProps {
  totalTonnageKg: number;
  completedSetsCount: number;
  totalSetsCount: number;
  onOpenGymTools: () => void;
}

export const OlympianEvolutionCard: React.FC<OlympianEvolutionCardProps> = ({
  totalTonnageKg,
  completedSetsCount: _completedSetsCount,
  totalSetsCount: _totalSetsCount,
  onOpenGymTools,
}) => {
  const [showRoadmap, setShowRoadmap] = useState(false);

  const currentRank = ASCENSION_TIERS.find(
    r => totalTonnageKg >= r.minKg && totalTonnageKg < r.maxKg
  ) || ASCENSION_TIERS[0];

  const nextRank = ASCENSION_TIERS[ASCENSION_TIERS.indexOf(currentRank) + 1] || null;

  const progressToNext = nextRank 
    ? Math.min(100, Math.round(((totalTonnageKg - currentRank.minKg) / (nextRank.minKg - currentRank.minKg)) * 100))
    : 100;

  const amphoraeCount = Math.round(totalTonnageKg / 26);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-[#0c0e17] border border-amber-500/25 p-5 sm:p-6 shadow-2xl transition-all">
        {/* Background Roman gold glow */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left: Avatar & Rank */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 shadow-inner text-3xl shrink-0">
              <span>{currentRank.emoji}</span>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-amber-500/40">
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-500 font-roman tracking-wider">
                  Tier {currentRank.romanNumeral} / XIII
                </span>
                <h3 className="text-lg font-black text-white font-roman flex items-center gap-1.5 tracking-wide">
                  {currentRank.name}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 font-roman">
                  {currentRank.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md italic">
                "{currentRank.lore}"
              </p>
            </div>
          </div>

          {/* Right: Tonnage metric & Action buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="text-left md:text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400 font-roman tracking-wider">
                Total Iron Forged
              </span>
              <div className="text-xl sm:text-2xl font-black text-white mono-font flex items-baseline md:justify-end gap-1.5">
                <span className="text-amber-300">{totalTonnageKg.toLocaleString()}</span>
                <span className="text-xs font-normal text-slate-400">kg volume</span>
              </div>
              <span className="text-[11px] text-amber-400/80 mono-font">
                🏺 {amphoraeCount.toLocaleString()} Amphorae
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRoadmap(true)}
                className="px-3.5 py-2 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-200 text-xs font-roman font-bold transition-all flex items-center gap-1.5 border border-amber-500/30 shadow-sm"
                title="View Full XIII Tiers of Ascension"
              >
                <Map className="w-3.5 h-3.5 text-amber-400" />
                <span>Pantheon</span>
              </button>

              <button
                onClick={onOpenGymTools}
                className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-200 hover:text-white border border-amber-500/40 text-xs font-roman font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Plate & 1RM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextRank && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-roman">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <span>Next Ascension:</span>
                <strong className="text-amber-200">{nextRank.name} ({nextRank.romanNumeral}) {nextRank.emoji}</strong>
              </span>
              <span className="mono-font text-amber-400 font-bold">
                {(nextRank.minKg - totalTonnageKg).toLocaleString()} kg to advance
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Evolution Roadmap Modal */}
      <EvolutionRoadmapModal
        isOpen={showRoadmap}
        onClose={() => setShowRoadmap(false)}
        totalTonnageKg={totalTonnageKg}
      />
    </>
  );
};

// Aliases for backwards compatibility
export const ApexEvolutionCard = OlympianEvolutionCard;
export type ApexEvolutionCardProps = OlympianEvolutionCardProps;
