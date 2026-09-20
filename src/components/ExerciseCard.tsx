import React, { useState } from 'react';
import { PlannedExercise } from '../types';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Timer, 
  Info, 
  TrendingUp, 
  Dumbbell, 
  Sparkles,
  Calculator
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: PlannedExercise;
  index: number;
  completedSets: boolean[];
  weightKg?: number;
  onUpdateWeight?: (weight: number) => void;
  onToggleSet: (setIndex: number) => void;
  onOpenRestTimer: (seconds: number, exerciseName: string) => void;
  onOpenPlateCalc?: (weight: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  completedSets,
  weightKg = 60,
  onUpdateWeight,
  onToggleSet,
  onOpenRestTimer,
  onOpenPlateCalc,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loggedWeight, setLoggedWeight] = useState<number>(weightKg);

  const completedCount = completedSets.filter(Boolean).length;
  const isAllComplete = completedCount === exercise.sets;

  const handleWeightChange = (newVal: number) => {
    setLoggedWeight(newVal);
    if (onUpdateWeight) {
      onUpdateWeight(newVal);
    }
  };

  const categoryColors: Record<string, string> = {
    push: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pull: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    legs: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    shoulders: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    arms: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    core: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };

  const tierColors: Record<string, string> = {
    compound: 'text-amber-300 bg-amber-950/60 border border-amber-800/40',
    accessory: 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40',
    isolation: 'text-slate-300 bg-slate-800/80 border border-slate-700/50',
  };

  const isBarbellExercise = exercise.name.toLowerCase().includes('barbell') || 
                            exercise.name.toLowerCase().includes('squat') || 
                            exercise.name.toLowerCase().includes('bench') ||
                            exercise.name.toLowerCase().includes('deadlift');

  return (
    <div 
      className={`rounded-2xl transition-all duration-300 ${
        isAllComplete 
          ? 'bg-slate-900/60 border border-emerald-500/40 opacity-80' 
          : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-lg'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold mono-font shrink-0 mt-0.5">
              {index + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className={`text-base sm:text-lg font-bold ${isAllComplete ? 'text-emerald-300 line-through' : 'text-white'}`}>
                  {exercise.name}
                </h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${categoryColors[exercise.category] || 'bg-slate-800 text-slate-300'}`}>
                  {exercise.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tierColors[exercise.tier]}`}>
                  {exercise.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
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
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
                title="Open Plate Loader / 1RM Calc"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">Plates</span>
              </button>
            )}

            <button
              onClick={() => onOpenRestTimer(exercise.restSeconds, exercise.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold transition-colors border border-cyan-500/20"
              title="Start Rest Timer"
            >
              <Timer className="w-3.5 h-3.5" />
              <span className="mono-font">{exercise.restSeconds}s</span>
            </button>
          </div>
        </div>

        {/* Metrics Bar with interactive Working Weight */}
        <div className="grid grid-cols-4 gap-2 mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center items-center">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-500">Working Load</span>
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                step="2.5"
                min="0"
                value={loggedWeight}
                onChange={(e) => handleWeightChange(Number(e.target.value) || 0)}
                className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-center text-xs sm:text-sm font-bold text-white mono-font focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-400">kg</span>
            </div>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-semibold text-slate-500">Volume</span>
            <span className="text-sm sm:text-base font-bold text-white mono-font">
              {exercise.sets} <span className="text-xs font-normal text-slate-400">sets</span>
            </span>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-semibold text-slate-500">Target Reps</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400 mono-font">
              {exercise.reps}
            </span>
          </div>

          <div className="border-l border-slate-800">
            <span className="block text-[10px] uppercase font-semibold text-slate-500">Effort</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mono-font">
              RPE {exercise.targetRpe}
            </span>
          </div>
        </div>

        {/* Sets Check-off Interactive Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Set Tracker ({completedCount}/{exercise.sets})
            </span>
            <span className="text-[11px] text-slate-400">
              Tap a set to log & rest
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: exercise.sets }).map((_, setIdx) => {
              const isChecked = !!completedSets[setIdx];
              return (
                <button
                  key={setIdx}
                  onClick={() => {
                    onToggleSet(setIdx);
                    if (!isChecked) {
                      onOpenRestTimer(exercise.restSeconds, exercise.name);
                    }
                  }}
                  className={`flex-1 min-w-[64px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                    isChecked
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {isChecked ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Set {setIdx + 1}</span>
                    </>
                  ) : (
                    <span>Set {setIdx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technique Notes / Progression Toggle */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Form Cues & Progression</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {isAllComplete && (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Exercise Finished
            </span>
          )}
        </div>

        {/* Expanded Form Cues & Progression Details */}
        {showDetails && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
            {exercise.techniqueCues && exercise.techniqueCues.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Technique Execution
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {exercise.techniqueCues.map((cue, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {exercise.progressionRule && (
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-amber-300/90">
                <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span><strong className="text-amber-200">Progression:</strong> {exercise.progressionRule}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
