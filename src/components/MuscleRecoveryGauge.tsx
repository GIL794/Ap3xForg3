import React from 'react';
import { Activity, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { MuscleGroup } from '../types';

interface MuscleRecoveryGaugeProps {
  primaryMuscles: string[];
  totalSetsToday: number;
  onOpenPro: () => void;
  isPro?: boolean;
}

interface MuscleStatus {
  name: string;
  recoveryPercentage: number;
  status: 'optimal' | 'recovering' | 'fatigued';
  recommendation: string;
}

export const MuscleRecoveryGauge: React.FC<MuscleRecoveryGaugeProps> = ({
  primaryMuscles,
  totalSetsToday,
  onOpenPro,
  isPro = false,
}) => {
  // Compute contextual muscle recovery scores
  const muscleScores: MuscleStatus[] = [
    {
      name: 'Pectorals (Chest)',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('chest')) ? 92 : 100,
      status: 'optimal',
      recommendation: 'Primed for high mechanical tension and compound presses.',
    },
    {
      name: 'Deltoids & Shoulders',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('shoulder')) ? 88 : 96,
      status: 'optimal',
      recommendation: 'Full scapular stability available. Target overhead volume.',
    },
    {
      name: 'Triceps Brachii',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('tricep') || m.toLowerCase().includes('push')) ? 84 : 98,
      status: 'recovering',
      recommendation: 'Moderate neural fatigue. Focus on controlled eccentric tempo.',
    },
    {
      name: 'Latissimus & Upper Back',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('back') || m.toLowerCase().includes('pull')) ? 95 : 100,
      status: 'optimal',
      recommendation: 'Grip and lat motor recruitment fully regenerated.',
    },
    {
      name: 'Quadriceps & Glutes',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('quad') || m.toLowerCase().includes('leg')) ? 78 : 95,
      status: 'recovering',
      recommendation: 'Deep tissue recovery underway from preceding session.',
    },
    {
      name: 'Core & Abdominals',
      recoveryPercentage: 96,
      status: 'optimal',
      recommendation: 'Intra-abdominal bracing at peak capacity.',
    },
  ];

  return (
    <div className="rounded-3xl bg-[#0c0e17] border border-amber-500/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle gold accent glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-roman tracking-wide flex items-center gap-2">
              BIO-RECOVERY & FATIGUE GAUGE
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-bold uppercase">
                Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Algorithmic muscle readiness and central nervous system recovery estimates
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPro}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-roman font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Full 3D Heatmap</span>
        </button>
      </div>

      {/* Muscle Readiness Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {muscleScores.map((muscle) => {
          const isHigh = muscle.recoveryPercentage >= 90;
          const isMid = muscle.recoveryPercentage >= 80 && muscle.recoveryPercentage < 90;

          return (
            <div
              key={muscle.name}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{muscle.name}</span>
                <span
                  className={`font-black mono-font text-xs ${
                    isHigh
                      ? 'text-emerald-400'
                      : isMid
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {muscle.recoveryPercentage}% Ready
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHigh
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : isMid
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${muscle.recoveryPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                {muscle.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
