import React, { useState } from 'react';
import { Activity, Sparkles, Layers, UserCheck, ShieldCheck, Flame } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

interface MuscleRecoveryGaugeProps {
  primaryMuscles: string[];
  totalSetsToday: number;
  onOpenPro: () => void;
  isPro?: boolean;
  language?: SupportedLanguage;
}

interface MuscleStatus {
  id: string;
  name: string;
  recoveryPercentage: number;
  status: 'optimal' | 'recovering' | 'fatigued';
  recommendation: string;
  hoursToFullRecovery: number;
  bestMovements: string[];
}

export const MuscleRecoveryGauge: React.FC<MuscleRecoveryGaugeProps> = ({
  primaryMuscles,
  totalSetsToday,
  onOpenPro,
  isPro = false,
  language = 'en',
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');
  const [bodyOrientation, setBodyOrientation] = useState<'front' | 'back'>('front');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');

  // Compute contextual muscle recovery scores
  const muscleScores: Record<string, MuscleStatus> = {
    chest: {
      id: 'chest',
      name: 'Pectorals (Chest)',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('chest')) ? 92 : 100,
      status: 'optimal',
      recommendation: 'Primed for high mechanical tension and compound barbell presses.',
      hoursToFullRecovery: 0,
      bestMovements: ['Barbell Bench Press', 'Incline DB Press', 'Dips'],
    },
    deltoids: {
      id: 'deltoids',
      name: 'Deltoids & Shoulders',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('shoulder')) ? 88 : 96,
      status: 'optimal',
      recommendation: 'Full scapular stability available. Target overhead volume & lateral head.',
      hoursToFullRecovery: 6,
      bestMovements: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
    },
    triceps: {
      id: 'triceps',
      name: 'Triceps Brachii',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('tricep') || m.toLowerCase().includes('push')) ? 82 : 98,
      status: 'recovering',
      recommendation: 'Moderate neural fatigue. Focus on controlled eccentric tempo.',
      hoursToFullRecovery: 14,
      bestMovements: ['Rope Pushdowns', 'Skull Crushers', 'Dips'],
    },
    biceps: {
      id: 'biceps',
      name: 'Biceps Brachii & Forearms',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('bicep') || m.toLowerCase().includes('pull')) ? 86 : 98,
      status: 'optimal',
      recommendation: 'Full elbow flexion power ready for Supinated Curls.',
      hoursToFullRecovery: 8,
      bestMovements: ['Incline DB Curls', 'Barbell Curls', 'Hammer Curls'],
    },
    back: {
      id: 'back',
      name: 'Latissimus & Upper Back',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('back') || m.toLowerCase().includes('pull')) ? 95 : 100,
      status: 'optimal',
      recommendation: 'Grip and lat motor recruitment fully regenerated for heavy pulls.',
      hoursToFullRecovery: 0,
      bestMovements: ['Lat Pulldown', 'Barbell Rows', 'Pull-ups'],
    },
    quads: {
      id: 'quads',
      name: 'Quadriceps',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('quad') || m.toLowerCase().includes('leg')) ? 78 : 95,
      status: 'recovering',
      recommendation: 'Deep tissue recovery underway from preceding squat session.',
      hoursToFullRecovery: 18,
      bestMovements: ['Barbell Squat', 'Leg Press', 'Bulgarian Split Squat'],
    },
    hamstrings: {
      id: 'hamstrings',
      name: 'Hamstrings & Glutes',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('ham') || m.toLowerCase().includes('glute')) ? 80 : 94,
      status: 'recovering',
      recommendation: 'Posterior chain primed for hinge patterns and controlled extension.',
      hoursToFullRecovery: 12,
      bestMovements: ['Romanian Deadlift', 'Leg Curls', 'Hip Thrusts'],
    },
    core: {
      id: 'core',
      name: 'Abdominals & Core',
      recoveryPercentage: 96,
      status: 'optimal',
      recommendation: 'Intra-abdominal bracing at peak capacity.',
      hoursToFullRecovery: 0,
      bestMovements: ['Cable Crunches', 'Hanging Leg Raises', 'Planks'],
    },
    calves: {
      id: 'calves',
      name: 'Calves (Gastrocnemius)',
      recoveryPercentage: 98,
      status: 'optimal',
      recommendation: 'High-frequency endurance tissue ready for explosive loads.',
      hoursToFullRecovery: 0,
      bestMovements: ['Standing Calf Raises', 'Seated Calf Raises'],
    },
  };

  const selectedMuscle = muscleScores[selectedMuscleId] || muscleScores['chest'];

  const getHeatColor = (pct: number) => {
    if (pct >= 90) return '#10b981'; // emerald
    if (pct >= 80) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="rounded-3xl bg-[#0c0e17] border border-amber-500/20 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle gold accent glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-roman tracking-wide flex items-center gap-2">
              {t('recovery.title', language)}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-bold uppercase">
                {t('recovery.calibre', language)}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {t('recovery.subtitle', language)}
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-roman font-bold">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('recovery.anatomicalMap', language)}
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('recovery.scorecard', language)}
            </button>
          </div>

          <button
            onClick={onOpenPro}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-roman font-bold transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{t('recovery.proInsights', language)}</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Anatomical SVG Silhouette (Fitbod Style) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            {/* Front / Back Toggle */}
            <div className="flex items-center gap-2 mb-3 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-[11px] font-roman font-bold">
              <button
                onClick={() => setBodyOrientation('front')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  bodyOrientation === 'front'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('recovery.anterior', language)}
              </button>
              <button
                onClick={() => setBodyOrientation('back')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  bodyOrientation === 'back'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('recovery.posterior', language)}
              </button>
            </div>

            {/* Interactive Anatomical SVG Silhouette */}
            <div className="relative w-48 h-72 flex items-center justify-center">
              <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-md">
                {/* Head / Neck */}
                <circle cx="100" cy="28" r="16" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                <rect x="94" y="44" width="12" height="12" rx="3" fill="#1e293b" />

                {bodyOrientation === 'front' ? (
                  <>
                    {/* Deltoids (Shoulders) */}
                    <path
                      d="M62 58 Q72 52 82 56 L80 78 Q68 76 62 58 Z M138 58 Q128 52 118 56 L120 78 Q132 76 138 58 Z"
                      fill={getHeatColor(muscleScores.deltoids.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'deltoids' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'deltoids' ? '#ffffff' : '#f59e0b'}
                      strokeWidth={selectedMuscleId === 'deltoids' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('deltoids')}
                    />

                    {/* Pectorals (Chest) */}
                    <path
                      d="M82 58 L118 58 L116 92 Q100 98 84 92 Z"
                      fill={getHeatColor(muscleScores.chest.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'chest' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'chest' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'chest' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('chest')}
                    />

                    {/* Biceps & Arms */}
                    <path
                      d="M58 78 Q66 78 64 116 Q54 112 56 82 Z M142 78 Q134 78 136 116 Q146 112 144 82 Z"
                      fill={getHeatColor(muscleScores.biceps.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'biceps' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'biceps' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'biceps' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('biceps')}
                    />

                    {/* Abdominals (Core) */}
                    <path
                      d="M85 96 L115 96 L113 148 Q100 152 87 148 Z"
                      fill={getHeatColor(muscleScores.core.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'core' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'core' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'core' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('core')}
                    />

                    {/* Quadriceps */}
                    <path
                      d="M74 154 L98 154 L94 228 Q78 226 72 158 Z M126 154 L102 154 L106 228 Q122 226 128 158 Z"
                      fill={getHeatColor(muscleScores.quads.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'quads' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'quads' ? '#ffffff' : '#f43f5e'}
                      strokeWidth={selectedMuscleId === 'quads' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('quads')}
                    />

                    {/* Calves (Front Tibialis / Gastrocnemius) */}
                    <path
                      d="M74 236 L92 236 L88 296 L76 296 Z M126 236 L108 236 L112 296 L124 296 Z"
                      fill={getHeatColor(muscleScores.calves.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'calves' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'calves' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'calves' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('calves')}
                    />
                  </>
                ) : (
                  <>
                    {/* Traps & Upper Back */}
                    <path
                      d="M80 50 Q100 46 120 50 L114 84 Q100 88 86 84 Z"
                      fill={getHeatColor(muscleScores.back.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'back' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'back' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'back' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('back')}
                    />

                    {/* Latissimus Dorsi */}
                    <path
                      d="M72 84 Q100 88 128 84 L118 136 Q100 144 82 136 Z"
                      fill={getHeatColor(muscleScores.back.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'back' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'back' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'back' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('back')}
                    />

                    {/* Triceps (Posterior Arm) */}
                    <path
                      d="M56 78 Q64 78 62 116 Q52 112 54 82 Z M144 78 Q136 78 138 116 Q148 112 146 82 Z"
                      fill={getHeatColor(muscleScores.triceps.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'triceps' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'triceps' ? '#ffffff' : '#f59e0b'}
                      strokeWidth={selectedMuscleId === 'triceps' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('triceps')}
                    />

                    {/* Glutes & Hamstrings */}
                    <path
                      d="M72 144 L128 144 L122 228 Q100 234 78 228 Z"
                      fill={getHeatColor(muscleScores.hamstrings.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'hamstrings' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'hamstrings' ? '#ffffff' : '#f59e0b'}
                      strokeWidth={selectedMuscleId === 'hamstrings' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('hamstrings')}
                    />

                    {/* Posterior Calves (Gastrocnemius) */}
                    <path
                      d="M74 236 L92 236 L88 296 L76 296 Z M126 236 L108 236 L112 296 L124 296 Z"
                      fill={getHeatColor(muscleScores.calves.recoveryPercentage)}
                      fillOpacity={selectedMuscleId === 'calves' ? '0.9' : '0.6'}
                      stroke={selectedMuscleId === 'calves' ? '#ffffff' : '#10b981'}
                      strokeWidth={selectedMuscleId === 'calves' ? '2' : '1'}
                      className="cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setSelectedMuscleId('calves')}
                    />
                  </>
                )}
              </svg>
            </div>

            <p className="text-[10px] text-slate-500 mt-2 italic">
              {t('recovery.tapTip', language)}
            </p>
          </div>

          {/* Selected Muscle Inspector (Right Side) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-roman uppercase font-bold text-slate-400">
                    {t('recovery.selected', language)}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white font-roman">
                    {selectedMuscle.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {t('recovery.readiness', language)}
                  </span>
                  <span className={`text-lg font-black mono-font ${
                    selectedMuscle.recoveryPercentage >= 90
                      ? 'text-emerald-400'
                      : selectedMuscle.recoveryPercentage >= 80
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {selectedMuscle.recoveryPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress meter */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedMuscle.recoveryPercentage >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : selectedMuscle.recoveryPercentage >= 80
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${selectedMuscle.recoveryPercentage}%` }}
                />
              </div>

              <div className="text-xs text-slate-300">
                <strong className="text-amber-300 font-roman">{t('recovery.status', language)}:</strong>{' '}
                {selectedMuscle.recommendation}
              </div>

              {selectedMuscle.hoursToFullRecovery > 0 ? (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Estimated ~{selectedMuscle.hoursToFullRecovery}h until full structural supercompensation</span>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Fully regenerated. Maximum neural recruitment threshold available</span>
                </div>
              )}

              {/* Suggested movements */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                  {t('recovery.targetExercises', language)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMuscle.bestMovements.map((move, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-roman font-bold"
                    >
                      {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('recovery.fresh', language)}</span>
                <span className="text-sm font-black text-emerald-400 mono-font">6 / 9</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('recovery.recovering', language)}</span>
                <span className="text-sm font-black text-amber-400 mono-font">3 / 9</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('recovery.fatigued', language)}</span>
                <span className="text-sm font-black text-slate-400 mono-font">0 / 9</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scorecards List View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(muscleScores).map((muscle) => {
            const isHigh = muscle.recoveryPercentage >= 90;
            const isMid = muscle.recoveryPercentage >= 80 && muscle.recoveryPercentage < 90;

            return (
              <div
                key={muscle.id}
                onClick={() => {
                  setSelectedMuscleId(muscle.id);
                  setViewMode('map');
                }}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{muscle.name}</span>
                  <span
                    className={`font-black mono-font text-xs ${
                      isHigh ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {muscle.recoveryPercentage}%
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
      )}
    </div>
  );
};
