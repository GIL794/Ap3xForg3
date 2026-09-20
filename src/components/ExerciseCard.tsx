import React, { useState } from 'react';
import { PlannedExercise, SetType } from '../types';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Timer, 
  Info, 
  TrendingUp, 
  Dumbbell, 
  Sparkles,
  Calculator,
  Flame
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: PlannedExercise;
  index: number;
  completedSets: boolean[];
  setTypes?: SetType[];
  weightKg?: number;
  onUpdateWeight?: (weight: number) => void;
  onToggleSet: (setIndex: number) => void;
  onUpdateSetType?: (setIndex: number, type: SetType) => void;
  onOpenRestTimer: (seconds: number, exerciseName: string) => void;
  onOpenPlateCalc?: (weight: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  completedSets,
  setTypes = [],
  weightKg = 60,
  onUpdateWeight,
  onToggleSet,
  onUpdateSetType,
  onOpenRestTimer,
  onOpenPlateCalc,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loggedWeight, setLoggedWeight] = useState<number>(weightKg);
  const [localSetTypes, setLocalSetTypes] = useState<SetType[]>(() => {
    return Array.from({ length: exercise.sets }, (_, i) => setTypes[i] || 'normal');
  });

  const completedCount = completedSets.filter(Boolean).length;
  const isAllComplete = completedCount === exercise.sets;

  const handleWeightChange = (newVal: number) => {
    setLoggedWeight(newVal);
    if (onUpdateWeight) {
      onUpdateWeight(newVal);
    }
  };

  const handleCycleSetType = (setIdx: number) => {
    const cycle: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    const current = localSetTypes[setIdx] || 'normal';
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    const updated = [...localSetTypes];
    updated[setIdx] = next;
    setLocalSetTypes(updated);
    if (onUpdateSetType) {
      onUpdateSetType(setIdx, next);
    }
  };

  const getSetTypeBadge = (type: SetType, setIdx: number) => {
    switch (type) {
      case 'warmup':
        return { label: 'W', text: 'Warmup', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'drop':
        return { label: 'D', text: 'Drop Set', style: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'failure':
        return { label: 'F', text: 'Failure', style: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: `${setIdx + 1}`, text: 'Normal', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const categoryColors: Record<string, string> = {
    push: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    pull: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    legs: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    shoulders: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    arms: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    core: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };

  const tierColors: Record<string, string> = {
    compound: 'text-amber-300 bg-amber-950/60 border border-amber-700/40 font-roman',
    accessory: 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40',
    isolation: 'text-slate-300 bg-slate-800/80 border border-slate-700/50',
  };

  return (
    <div 
      className={`rounded-3xl transition-all duration-300 ${
        isAllComplete 
          ? 'bg-[#0b0d14]/80 border border-amber-500/40 opacity-85' 
          : 'bg-[#0c0e17] border border-amber-500/20 hover:border-amber-500/40 shadow-xl'
      }`}
    >
      <div className="p-4 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-roman font-bold shrink-0 mt-0.5 shadow-sm">
              {index + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className={`text-base sm:text-lg font-black font-roman tracking-wide ${isAllComplete ? 'text-amber-200 line-through' : 'text-white'}`}>
                  {exercise.name}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${categoryColors[exercise.category] || 'bg-slate-800 text-slate-300'}`}>
                  {exercise.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${tierColors[exercise.tier]}`}>
                  {exercise.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                <Dumbbell className="w-3.5 h-3.5 text-amber-500/70" />
                <span>{exercise.equipment.map(e => e.replace('_', ' ')).join(', ')}</span>
                {exercise.tempo && (
                  <>
                    <span>•</span>
                    <span className="mono-font text-slate-300">Tempo: {exercise.tempo}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions: Plate Calc + Rest Timer */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenPlateCalc && (
              <button
                onClick={() => onOpenPlateCalc(loggedWeight)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-roman font-bold transition-colors border border-amber-500/30"
                title="Open Roman Plate Loader & 1RM Percentages"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Plates</span>
              </button>
            )}

            <button
              onClick={() => onOpenRestTimer(exercise.restSeconds, exercise.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-200 hover:text-white text-xs font-roman font-bold transition-colors border border-amber-500/30"
              title="Start Rest Timer"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span className="mono-font">{exercise.restSeconds}s</span>
            </button>
          </div>
        </div>

        {/* Metrics Bar with interactive Working Weight and Ghost Target Placeholder */}
        <div className="grid grid-cols-4 gap-2 mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center items-center">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 font-roman">Working Load</span>
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                step="2.5"
                min="0"
                value={loggedWeight || ''}
                placeholder={`${weightKg || 60}`}
                onChange={(e) => handleWeightChange(Number(e.target.value) || 0)}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-center text-xs sm:text-sm font-bold text-amber-300 mono-font focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                title="Logged weight (Ghost placeholder represents target/previous session weight)"
              />
              <span className="text-[11px] text-slate-400">kg</span>
            </div>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400 font-roman">Volume</span>
            <span className="text-sm sm:text-base font-bold text-white mono-font">
              {exercise.sets} <span className="text-xs font-normal text-slate-400">sets</span>
            </span>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400 font-roman">Target Reps</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mono-font">
              {exercise.reps}
            </span>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400 font-roman">Effort</span>
            <span className="text-sm sm:text-base font-bold text-rose-400 mono-font">
              RPE {exercise.targetRpe}
            </span>
          </div>
        </div>

        {/* Sets Check-off Interactive Controls with Set-Type Badges */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-roman">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              Set Logger ({completedCount}/{exercise.sets})
            </span>
            <span className="text-[10px] text-slate-400 italic">
              Tap tag to cycle: Normal • Warmup (W) • Drop (D) • Failure (F)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: exercise.sets }).map((_, setIdx) => {
              const isChecked = !!completedSets[setIdx];
              const currentType = localSetTypes[setIdx] || 'normal';
              const typeBadge = getSetTypeBadge(currentType, setIdx);

              return (
                <div
                  key={setIdx}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 transition-all ${
                    isChecked
                      ? 'bg-amber-500/20 border-amber-500/50 shadow-md glow-gold'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Set Type Tag Button */}
                  <button
                    onClick={() => handleCycleSetType(setIdx)}
                    className={`w-6 h-6 rounded-lg text-[10px] font-black border flex items-center justify-center transition-all ${typeBadge.style}`}
                    title={`Current: ${typeBadge.text}. Tap to change set type.`}
                  >
                    {typeBadge.label}
                  </button>

                  {/* Complete Set Button */}
                  <button
                    onClick={() => {
                      onToggleSet(setIdx);
                      if (!isChecked) {
                        onOpenRestTimer(exercise.restSeconds, exercise.name);
                      }
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold font-roman flex items-center justify-center gap-1 transition-all ${
                      isChecked
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isChecked ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Done</span>
                      </>
                    ) : (
                      <span>Log Set</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technique Notes / Progression Toggle */}
        <div className="mt-3 flex items-center justify-between text-xs pt-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 font-roman font-bold transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Form Cues & Progression</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {isAllComplete && (
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 font-roman">
              <Sparkles className="w-3.5 h-3.5" /> Exercise Complete
            </span>
          )}
        </div>

        {/* Expanded Form Cues & Progression Details */}
        {showDetails && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
            {exercise.techniqueCues && exercise.techniqueCues.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-roman block mb-1">
                  Biomechanical Execution
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {exercise.techniqueCues.map((cue, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {exercise.progressionRule && (
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-amber-300">
                <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span><strong className="text-amber-200 font-roman">Progression Rule:</strong> {exercise.progressionRule}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
