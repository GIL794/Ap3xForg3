import React, { useState, useEffect } from 'react';
import { PlannedExercise, SetType, LoggedSetRecord } from '../types';
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
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  ArrowUp,
  ArrowDown,
  Trophy,
  Award
} from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';
import { getExerciseNote, saveExerciseNote } from '../logic/storage';

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
  onOpenSwapModal?: () => void;
  onAddSet?: () => void;
  onRemoveSet?: (setIndex: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  language?: SupportedLanguage;
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
  onOpenSwapModal,
  onAddSet,
  onRemoveSet,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  language = 'en',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(() => getExerciseNote(exercise.id));
  
  // Parse initial reps from string like "8-10" -> 8
  const defaultRepsNumber = (() => {
    const match = exercise.reps.match(/\d+/);
    return match ? Number(match[0]) : 10;
  })();

  // Granular set state for Hevy & Strong calibre logging
  const [rows, setRows] = useState<LoggedSetRecord[]>(() => {
    return Array.from({ length: exercise.sets }).map((_, i) => ({
      setNumber: i + 1,
      type: setTypes[i] || 'normal',
      weightKg: weightKg,
      reps: defaultRepsNumber,
      targetWeightKg: weightKg,
      targetReps: exercise.reps,
      completed: !!completedSets[i],
      isPr: false,
    }));
  });

  // Keep rows in sync if exercise.sets or completedSets change
  useEffect(() => {
    setRows(prev => {
      const updated = Array.from({ length: exercise.sets }).map((_, i) => {
        const existing = prev[i];
        return {
          setNumber: i + 1,
          type: (setTypes && setTypes[i]) || existing?.type || 'normal',
          weightKg: existing?.weightKg !== undefined ? existing.weightKg : weightKg,
          reps: existing?.reps !== undefined ? existing.reps : defaultRepsNumber,
          targetWeightKg: weightKg,
          targetReps: exercise.reps,
          completed: !!completedSets[i],
          isPr: existing?.isPr || false,
        };
      });
      return updated;
    });
  }, [exercise.sets, completedSets, weightKg, setTypes, defaultRepsNumber]);

  const completedCount = completedSets.filter(Boolean).length;
  const isAllComplete = completedCount >= exercise.sets && exercise.sets > 0;

  const handleSetRowChange = (idx: number, field: 'weightKg' | 'reps', val: number) => {
    const updated = [...rows];
    updated[idx] = {
      ...updated[idx],
      [field]: val,
    };

    // Calculate estimated 1RM: if set achieves high volume, mark PR
    const est1rm = val > 0 && updated[idx].weightKg > 0 
      ? Math.round(updated[idx].weightKg * (1 + updated[idx].reps / 30))
      : 0;
    const baseline1rm = Math.round(weightKg * (1 + defaultRepsNumber / 30));
    updated[idx].isPr = est1rm > baseline1rm;

    setRows(updated);

    if (field === 'weightKg' && onUpdateWeight && idx === 0) {
      onUpdateWeight(val);
    }
  };

  const handleCycleSetType = (idx: number) => {
    const cycle: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    const current = rows[idx]?.type || 'normal';
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    
    const updated = [...rows];
    updated[idx] = { ...updated[idx], type: next };
    setRows(updated);

    if (onUpdateSetType) {
      onUpdateSetType(idx, next);
    }
  };

  const handleRowCheck = (idx: number) => {
    const isNowChecked = !rows[idx]?.completed;
    onToggleSet(idx);

    if (isNowChecked) {
      onOpenRestTimer(exercise.restSeconds, exercise.name);
    }
  };

  const handleNoteSave = (text: string) => {
    setNoteText(text);
    saveExerciseNote(exercise.id, text);
  };

  const getSetTypeBadge = (type: SetType, setNumber: number) => {
    switch (type) {
      case 'warmup':
        return { label: 'W', text: 'Warmup', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'drop':
        return { label: 'D', text: 'Drop Set', style: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'failure':
        return { label: 'F', text: 'Failure', style: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: `${setNumber}`, text: 'Normal', style: 'bg-slate-800 text-slate-300 border-slate-700' };
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
          ? 'bg-[#0b0d14]/90 border border-emerald-500/40 shadow-emerald-500/5' 
          : 'bg-[#0c0e17] border border-amber-500/20 hover:border-amber-500/40 shadow-xl'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-roman font-bold shrink-0 mt-0.5 shadow-sm">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className={`text-base sm:text-lg font-black font-roman tracking-wide ${isAllComplete ? 'text-emerald-200' : 'text-white'}`}>
                  {exercise.name}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${categoryColors[exercise.category] || 'bg-slate-800 text-slate-300'}`}>
                  {exercise.category}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${tierColors[exercise.tier]}`}>
                  {exercise.tier}
                </span>

                {/* Swap Movement Action Button */}
                {onOpenSwapModal && (
                  <button
                    onClick={onOpenSwapModal}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-amber-500/30"
                    title="Swap exercise (Equipment busy or variation preference)"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Move Up */}
                {onMoveUp && !isFirst && (
                  <button
                    onClick={onMoveUp}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-amber-500/30"
                    title="Move movement earlier in session"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Move Down */}
                {onMoveDown && !isLast && (
                  <button
                    onClick={onMoveDown}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-amber-500/30"
                    title="Move movement later in session"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}
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
                <span>•</span>
                <span className="text-rose-300 font-bold mono-font">RPE {exercise.targetRpe}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions: Plate Calc + Rest Timer */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenPlateCalc && (
              <button
                onClick={() => onOpenPlateCalc(rows[0]?.weightKg || weightKg)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-roman font-bold transition-colors border border-amber-500/30"
                title="Open Roman Plate Loader & 1RM Percentages"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">{t('exercise.plateCalc', language)}</span>
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

        {/* HEVY & STRONG CALIBRE INTERACTIVE SET TABLE */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/80">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-slate-900/70 border-b border-slate-800 text-[10px] font-roman uppercase font-bold text-slate-400 text-center items-center">
            <div className="col-span-2 text-left pl-1">{t('table.set', language)}</div>
            <div className="col-span-3 text-slate-500">{t('table.prevTarget', language)}</div>
            <div className="col-span-3">{t('table.kg', language)}</div>
            <div className="col-span-2">{t('table.reps', language)}</div>
            <div className="col-span-2">{t('table.log', language)}</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-850">
            {rows.map((row, rowIdx) => {
              const badge = getSetTypeBadge(row.type, row.setNumber);
              const isChecked = !!row.completed;

              return (
                <div
                  key={rowIdx}
                  className={`grid grid-cols-12 gap-1 px-3 py-2 items-center text-center transition-all ${
                    isChecked 
                      ? 'bg-emerald-950/20' 
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* Set Number & Type Toggle */}
                  <div className="col-span-2 flex items-center gap-1.5 text-left">
                    <button
                      onClick={() => handleCycleSetType(rowIdx)}
                      className={`w-6 h-6 rounded-lg text-[10px] font-black border flex items-center justify-center transition-all ${badge.style}`}
                      title={`Current: ${badge.text}. Tap to cycle: Normal, Warmup (W), Drop (D), Failure (F)`}
                    >
                      {badge.label}
                    </button>
                    {row.isPr && (
                      <span title="Estimated Personal Record!">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                      </span>
                    )}
                  </div>

                  {/* Previous / Target Ghost Reference */}
                  <div className="col-span-3 text-[11px] mono-font text-slate-400 truncate">
                    {row.targetWeightKg}kg × {row.targetReps}
                  </div>

                  {/* Weight Input (KG) */}
                  <div className="col-span-3 flex items-center justify-center">
                    <input
                      type="number"
                      step="2.5"
                      min="0"
                      value={row.weightKg || ''}
                      placeholder={`${row.targetWeightKg || 60}`}
                      onChange={(e) => handleSetRowChange(rowIdx, 'weightKg', Number(e.target.value) || 0)}
                      className="w-16 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg py-1 text-center text-xs font-bold text-amber-300 mono-font focus:outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Reps Input */}
                  <div className="col-span-2 flex items-center justify-center">
                    <input
                      type="number"
                      min="0"
                      value={row.reps || ''}
                      placeholder={`${defaultRepsNumber}`}
                      onChange={(e) => handleSetRowChange(rowIdx, 'reps', Number(e.target.value) || 0)}
                      className="w-12 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg py-1 text-center text-xs font-bold text-white mono-font focus:outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Checkmark Completion Button */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleRowCheck(rowIdx)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-105'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                      }`}
                      title={isChecked ? 'Set completed! Tap to uncheck' : 'Log set and start rest timer'}
                    >
                      <Check className={`w-4 h-4 ${isChecked ? 'stroke-[3]' : 'stroke-[2]'}`} />
                    </button>

                    {/* Delete Set Button (if rows > 1 and optional callback provided) */}
                    {rows.length > 1 && onRemoveSet && (
                      <button
                        onClick={() => onRemoveSet(rowIdx)}
                        className="p-1 text-slate-600 hover:text-rose-400 transition-colors hidden sm:inline-block"
                        title="Remove set"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer: Add Set Button */}
          {onAddSet && (
            <div className="p-2 border-t border-slate-850 bg-slate-950/40 flex items-center justify-between">
              <button
                onClick={onAddSet}
                className="w-full py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-amber-500/40 text-amber-300 text-xs font-roman font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('exercise.addSet', language)}</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Tray: Notes Drawer & Technique Details */}
        <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-slate-850">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-300 font-roman font-bold transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('exercise.formCues', language)}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center gap-1 font-roman font-bold transition-colors ${
                noteText ? 'text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{noteText ? t('exercise.noteActive', language) : t('exercise.addNote', language)}</span>
            </button>
          </div>

          {isAllComplete ? (
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-roman">
              <Sparkles className="w-3.5 h-3.5" /> {t('exercise.complete', language)}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 mono-font">
              {completedCount}/{exercise.sets} {t('exercise.setsLogged', language)}
            </span>
          )}
        </div>

        {/* Personal Exercise Notes Drawer */}
        {showNotes && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 animate-in fade-in duration-150">
            <label className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1.5">
              {t('exercise.personalNotesTitle', language)}
            </label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => handleNoteSave(e.target.value)}
              placeholder={t('exercise.personalNotesPlaceholder', language)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        )}

        {/* Expanded Form Cues & Progression Details */}
        {showDetails && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
            {exercise.techniqueCues && exercise.techniqueCues.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-roman block mb-1">
                  {t('exercise.bioExecution', language)}
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
                <span><strong className="text-amber-200 font-roman">{t('exercise.progressionRule', language)}</strong> {exercise.progressionRule}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
