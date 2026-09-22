import React, { useState, useEffect } from 'react';
import { WorkoutDay, TodayWorkout, UserProfile, PlannedExercise, ExerciseDefinition, WorkoutHistorySession } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { RestTimerModal } from './RestTimerModal';
import { FloatingRestTimer } from './FloatingRestTimer';
import { GymToolsModal } from './GymToolsModal';
import { ExerciseSwapModal } from './ExerciseSwapModal';
import { WorkoutSummaryModal } from './WorkoutSummaryModal';
import { WorkoutHistoryModal } from './WorkoutHistoryModal';
import { OlympianEvolutionCard } from './OlympianEvolutionCard';
import { MuscleRecoveryGauge } from './MuscleRecoveryGauge';
import { copyWorkoutToClipboard, saveWorkoutSession } from '../logic/storage';
import { SupportedLanguage, t } from '../logic/i18n';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Clock, 
  Dumbbell, 
  Sparkles, 
  Copy, 
  CheckCheck, 
  Zap, 
  RotateCcw, 
  AlertCircle,
  Activity,
  Award,
  Calculator,
  Trophy,
  History,
  Check
} from 'lucide-react';

interface TodayWorkoutViewProps {
  todayWorkout: TodayWorkout;
  profile: UserProfile;
  completedSets: Record<string, boolean[]>;
  onUpdateCompletedSets: (updated: Record<string, boolean[]>) => void;
  onOverridePlan: (newDayPlan: WorkoutDay) => void;
  onOpenPro?: () => void;
  language?: SupportedLanguage;
  lifetimeTonnageKg?: number;
  onWorkoutFinished?: (sessionTonnage: number, xpEarned: number) => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  todayWorkout,
  profile,
  completedSets,
  onUpdateCompletedSets,
  onOverridePlan,
  onOpenPro,
  language = 'en',
  lifetimeTonnageKg = 0,
  onWorkoutFinished,
}) => {
  const [useCatchUp, setUseCatchUp] = useState(false);
  const [warmupDone, setWarmupDone] = useState(false);
  const [cooldownDone, setCooldownDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Exercise weight tracker for Tonnage & Plate Calculator
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, number>>({
    barbell_bench_press: 80,
    incline_db_press: 28,
    machine_chest_press: 70,
    overhead_press: 50,
    lat_pulldown: 65,
    seated_cable_row: 60,
    pull_ups: 80,
    db_lateral_raise: 12,
    cable_lateral_raise: 7.5,
    rear_delt_flyes: 10,
    face_pulls: 25,
    barbell_curl: 30,
    incline_db_curl: 14,
    hammer_curl: 16,
    triceps_rope_pushdown: 25,
    skull_crushers: 30,
    barbell_squat: 100,
    romanian_deadlift: 90,
    leg_press: 160,
    cable_crunch: 40,
    hanging_leg_raise: 75,
  });

  // Docked Floating Rest Timer & Expanded Modal
  const [activeTimer, setActiveTimer] = useState<{ isOpen: boolean; seconds: number; exerciseName: string }>({
    isOpen: false,
    seconds: 90,
    exerciseName: '',
  });

  const [isFullTimerOpen, setIsFullTimerOpen] = useState(false);

  // Gym Floor Modals
  const [gymTools, setGymTools] = useState<{ isOpen: boolean; weight: number }>({
    isOpen: false,
    weight: 80,
  });

  const [swapModal, setSwapModal] = useState<{
    isOpen: boolean;
    exerciseIndex: number;
    exercise: PlannedExercise | null;
  }>({
    isOpen: false,
    exerciseIndex: -1,
    exercise: null,
  });

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Real-time countdown calculation
  const [timeUntilString, setTimeUntilString] = useState<string>('');
  const [isPastTime, setIsPastTime] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const [targetHours, targetMins] = (profile.targetWorkoutTime || '19:00').split(':').map(Number);
      
      const targetDate = new Date(now);
      targetDate.setHours(targetHours || 19, targetMins || 0, 0, 0);

      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs > 0) {
        setIsPastTime(false);
        const totalSecs = Math.floor(diffMs / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        if (hrs > 0) {
          setTimeUntilString(`${hrs}h ${mins}m ${secs}s`);
        } else {
          setTimeUntilString(`${mins}m ${secs}s`);
        }
      } else {
        setIsPastTime(true);
        const pastSecs = Math.floor(Math.abs(diffMs) / 1000);
        const pastHrs = Math.floor(pastSecs / 3600);
        const pastMins = Math.floor((pastSecs % 3600) / 60);
        setTimeUntilString(`${pastHrs > 0 ? `${pastHrs}h ` : ''}${pastMins}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [profile.targetWorkoutTime]);

  const activePlan = (useCatchUp && todayWorkout.catchUpPlan) ? todayWorkout.catchUpPlan : todayWorkout.plan;
  const exercises = activePlan.exercises || [];

  // Calculate overall workout progress & total iron tonnage moved
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  let totalTonnageKg = 0;

  exercises.forEach(ex => {
    totalSetsCount += ex.sets;
    const sets = completedSets[ex.id] || [];
    const completedCountForEx = sets.filter(Boolean).length;
    completedSetsCount += completedCountForEx;

    // Parse average reps
    const repMatch = ex.reps.match(/\d+/g);
    const avgReps = repMatch ? (repMatch.length > 1 ? (Number(repMatch[0]) + Number(repMatch[1])) / 2 : Number(repMatch[0])) : 10;
    const weight = exerciseWeights[ex.id] || 40;

    // If sets completed, add verified tonnage; otherwise add planned portion
    if (completedCountForEx > 0) {
      totalTonnageKg += Math.round(completedCountForEx * weight * avgReps);
    }
  });

  const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  // Trigger celebration when reaching 100%
  useEffect(() => {
    if (progressPercent === 100 && totalSetsCount > 0) {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b']
      });
    }
  }, [progressPercent, totalSetsCount]);

  const handleToggleSet = (exerciseId: string, setIndex: number, totalSets: number) => {
    const current = completedSets[exerciseId] ? [...completedSets[exerciseId]] : new Array(totalSets).fill(false);
    while (current.length < totalSets) {
      current.push(false);
    }
    const isNowComplete = !current[setIndex];
    current[setIndex] = isNowComplete;
    onUpdateCompletedSets({
      ...completedSets,
      [exerciseId]: current,
    });

    // Auto-start rest timer on set completion (Hevy & Strong style)
    if (isNowComplete) {
      const targetEx = exercises.find(e => e.id === exerciseId);
      const restSeconds = targetEx?.restSeconds || 90;
      setActiveTimer({
        isOpen: true,
        seconds: restSeconds,
        exerciseName: targetEx?.name || 'Rest Interval',
      });
    }
  };

  const handleAddSet = (exerciseIndex: number) => {
    const ex = exercises[exerciseIndex];
    if (!ex) return;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = {
      ...ex,
      sets: ex.sets + 1,
    };
    onOverridePlan({
      ...activePlan,
      exercises: updatedExercises,
    });
  };

  const handleRemoveSet = (exerciseIndex: number) => {
    const ex = exercises[exerciseIndex];
    if (!ex || ex.sets <= 1) return;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = {
      ...ex,
      sets: ex.sets - 1,
    };
    onOverridePlan({
      ...activePlan,
      exercises: updatedExercises,
    });
  };

  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= exercises.length) return;
    const updated = [...exercises];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onOverridePlan({
      ...activePlan,
      exercises: updated,
    });
  };

  // Exercise Swap implementation
  const handleSwapMovement = (substitute: ExerciseDefinition) => {
    if (swapModal.exerciseIndex < 0) return;
    const targetEx = exercises[swapModal.exerciseIndex];
    if (!targetEx) return;

    const swapped: PlannedExercise = {
      id: substitute.id,
      name: substitute.name,
      category: substitute.category,
      tier: substitute.tier,
      sets: targetEx.sets || substitute.defaultSets,
      reps: substitute.defaultReps || targetEx.reps,
      restSeconds: substitute.defaultRestSec || targetEx.restSeconds,
      targetRpe: substitute.targetRpe || targetEx.targetRpe,
      notes: substitute.techniqueCues[0] || targetEx.notes,
      techniqueCues: substitute.techniqueCues,
      tempo: substitute.tempo,
      equipment: substitute.equipment,
      primaryMuscles: substitute.primaryMuscles,
      progressionRule: substitute.progressionRule,
    };

    const updatedExercises = [...exercises];
    updatedExercises[swapModal.exerciseIndex] = swapped;

    onOverridePlan({
      ...activePlan,
      exercises: updatedExercises,
    });

    setSwapModal({ isOpen: false, exerciseIndex: -1, exercise: null });
  };

  const handleResetWorkout = () => {
    if (window.confirm('Reset all logged sets and warm-up checks for today?')) {
      onUpdateCompletedSets({});
      setWarmupDone(false);
      setCooldownDone(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyWorkoutToClipboard(todayWorkout);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenPlateCalc = (weight: number) => {
    setGymTools({
      isOpen: true,
      weight,
    });
  };

  const handleSaveToHistory = () => {
    const session: WorkoutHistorySession = {
      id: `session_${Date.now()}`,
      date: todayWorkout.date,
      dayName: activePlan.dayName,
      workoutName: activePlan.name,
      durationMinutes: activePlan.estimatedDurationMinutes,
      totalTonnageKg: totalTonnageKg,
      completedSetsCount: completedSetsCount,
      totalSetsCount: totalSetsCount,
      prCount: 1,
      exercises: exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        sets: (completedSets[ex.id] || []).map((c, idx) => ({
          setNumber: idx + 1,
          type: 'normal',
          weightKg: exerciseWeights[ex.id] || 50,
          reps: 10,
          completed: c,
        })),
      })),
    };
    saveWorkoutSession(session);
    const xpEarned = Math.round(totalTonnageKg * 0.05 + completedSetsCount * 25 + 150);
    if (onWorkoutFinished) {
      onWorkoutFinished(totalTonnageKg, xpEarned);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Workout Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400 mono-font">
                {t('today.arena', language)} • {todayWorkout.scheduledTime}
              </span>
            </div>

            {/* Top Right: Countdown Badge & Finish Workout Trigger */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isPastTime ? (
                  <span className="text-amber-300 mono-font">
                    {t('today.scheduledAgo', language).replace('{time}', timeUntilString)}
                  </span>
                ) : (
                  <span className="text-slate-200">
                    {t('today.startsIn', language)} <strong className="text-emerald-400 mono-font">{timeUntilString}</strong>
                  </span>
                )}
              </div>

              {completedSetsCount > 0 && (
                <button
                  onClick={() => setIsSummaryOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-roman font-black tracking-wide shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('today.finishWorkout', language)}</span>
                </button>
              )}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
            {activePlan.name}
          </h2>

          <p className="text-sm text-slate-300 max-w-2xl mb-6">
            {t('today.readySubtitle', language)}
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {t('today.duration', language)}
              </div>
              <div className="text-lg font-bold text-white mono-font">
                ~{activePlan.estimatedDurationMinutes} <span className="text-xs text-slate-400 font-normal">{t('today.min', language)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> {t('today.movements', language)}
              </div>
              <div className="text-lg font-bold text-white mono-font">
                {exercises.length} <span className="text-xs text-slate-400 font-normal">{t('today.stations', language)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> {t('today.workingSets', language)}
              </div>
              <div className="text-lg font-bold text-white mono-font">
                {totalSetsCount} <span className="text-xs text-slate-400 font-normal">{t('today.setsUnit', language)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-pink-400" /> {t('today.focus', language)}
              </div>
              <div className="text-xs font-semibold text-slate-200 capitalize truncate mt-1">
                {activePlan.focus.slice(0, 3).join(', ')}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 shadow-sm"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('today.copiedPlan', language)}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>{t('today.copyNotes', language)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setGymTools({ isOpen: true, weight: 80 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/30 shadow-sm"
              >
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>{t('today.plateCalcBtn', language)}</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-amber-500/30 shadow-sm"
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>{t('today.ledgerBtn', language)}</span>
              </button>

              {todayWorkout.catchUpPlan && (
                <button
                  onClick={() => setUseCatchUp(!useCatchUp)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    useCatchUp
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{useCatchUp ? t('today.standardBtn', language) : t('today.expressBtn', language)}</span>
                </button>
              )}
            </div>

            {completedSetsCount > 0 && (
              <button
                onClick={handleResetWorkout}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                title="Reset completion progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('today.reset', language)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OLYMPIAN ASCENSION CARD */}
      <OlympianEvolutionCard
        totalTonnageKg={(lifetimeTonnageKg || 0) + totalTonnageKg}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        onOpenGymTools={() => setGymTools({ isOpen: true, weight: 80 })}
        language={language}
      />

      {/* BIO-RECOVERY & FATIGUE GAUGE (Fitbod Calibre) */}
      <MuscleRecoveryGauge
        primaryMuscles={activePlan.focus || []}
        totalSetsToday={totalSetsCount}
        onOpenPro={onOpenPro || (() => {})}
        language={language}
      />

      {/* Live Gym Completion Progress Bar */}
      {totalSetsCount > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {t('today.sessionProgress', language)}: <span className="mono-font text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="text-xs text-slate-400">
                {completedSetsCount} / {totalSetsCount} {t('today.setsCheckedOff', language)}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Warm-Up Section */}
      {activePlan.warmup && (
        <div className={`rounded-2xl transition-all p-5 border ${
          warmupDone 
            ? 'bg-slate-900/50 border-emerald-500/30' 
            : 'bg-slate-900/90 border-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {t('today.warmupProtocol', language)}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal mono-font">
                    {activePlan.warmup.durationMinutes} {t('today.min', language)}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{t('today.warmupSub', language)}</p>
              </div>
            </div>

            <button
              onClick={() => setWarmupDone(!warmupDone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                warmupDone 
                  ? 'bg-emerald-500 text-slate-950 shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {warmupDone ? t('today.warmupFinished', language) : t('today.markComplete', language)}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                {t('today.warmupGeneral', language)}
              </span>
              <ul className="space-y-1 text-slate-300">
                {activePlan.warmup.general.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                {t('today.warmupSpecific', language)}
              </span>
              <ul className="space-y-1 text-slate-300">
                {activePlan.warmup.specificActivation.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Working Exercises (Hevy & Strong Calibre) or Rest Day View */}
      {exercises.length === 0 ? (
        <div className="rounded-3xl bg-slate-900/80 border border-amber-500/30 p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-roman text-white">
            {t('today.restProtocol', language)}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {t('today.restProtocolDesc', language)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-xs text-slate-300 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1 font-roman">{t('today.hydration', language)}</span>
              {t('today.hydrationDesc', language)}
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1 font-roman">{t('today.activeRecovery', language)}</span>
              {t('today.activeRecoveryDesc', language)}
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1 font-roman">{t('today.deepSleep', language)}</span>
              {t('today.deepSleepDesc', language)}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
              {t('today.workingExercises', language)} ({exercises.length})
            </h3>
            <span className="text-xs text-slate-400">
              {t('today.neuralOrder', language)}
            </span>
          </div>

          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              completedSets={completedSets[exercise.id] || []}
              weightKg={exerciseWeights[exercise.id] || 50}
              onUpdateWeight={(newW) => {
                setExerciseWeights(prev => ({ ...prev, [exercise.id]: newW }));
              }}
              onToggleSet={(setIdx) => handleToggleSet(exercise.id, setIdx, exercise.sets)}
              onOpenRestTimer={(seconds, name) => {
                setActiveTimer({
                  isOpen: true,
                  seconds,
                  exerciseName: name,
                });
              }}
              onOpenPlateCalc={handleOpenPlateCalc}
              onOpenSwapModal={() => {
                setSwapModal({
                  isOpen: true,
                  exerciseIndex: index,
                  exercise,
                });
              }}
              onAddSet={() => handleAddSet(index)}
              onRemoveSet={() => handleRemoveSet(index)}
              onMoveUp={() => handleMoveExercise(index, index - 1)}
              onMoveDown={() => handleMoveExercise(index, index + 1)}
              isFirst={index === 0}
              isLast={index === exercises.length - 1}
              language={language}
            />
          ))}
        </div>
      )}

      {/* Cool-down Section */}
      {activePlan.cooldown && (
        <div className={`rounded-2xl transition-all p-5 border ${
          cooldownDone 
            ? 'bg-slate-900/50 border-emerald-500/30' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                {t('today.cooldownProtocol', language)} ({activePlan.cooldown.durationMinutes} {t('today.min', language)})
              </h3>
            </div>
            <button
              onClick={() => setCooldownDone(!cooldownDone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                cooldownDone 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {cooldownDone ? t('today.cooldownFinished', language) : t('today.cooldownMark', language)}
            </button>
          </div>
          <ul className="space-y-1 text-xs text-slate-300 mt-2">
            {activePlan.cooldown.activities.map((act, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progression Rule Card */}
      {activePlan.progressionRule && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">{t('today.progressionTitle', language)}</strong>
            {activePlan.progressionRule}
          </div>
        </div>
      )}

      {/* Bottom Finish Workout Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-bold text-white font-roman flex items-center justify-center sm:justify-start gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            {t('today.conqueredMovements', language)}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('today.conqueredSub', language)}
          </p>
        </div>

        <button
          onClick={() => setIsSummaryOpen(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-sm font-black font-roman tracking-wider transition-all shadow-lg shadow-amber-500/20 hover:scale-105 flex items-center justify-center gap-2 shrink-0"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{t('today.finishWorkout', language)}</span>
        </button>
      </div>

      {/* Docked Floating Rest Timer (Non-intrusive Hevy & Strong style) */}
      <FloatingRestTimer
        isOpen={activeTimer.isOpen}
        initialSeconds={activeTimer.seconds}
        exerciseName={activeTimer.exerciseName}
        onClose={() => setActiveTimer({ ...activeTimer, isOpen: false })}
        onExpand={() => setIsFullTimerOpen(true)}
        language={language}
      />

      {/* Fullscreen Rest Timer Stopwatch Modal */}
      <RestTimerModal
        isOpen={isFullTimerOpen}
        initialSeconds={activeTimer.seconds}
        exerciseName={activeTimer.exerciseName}
        onClose={() => setIsFullTimerOpen(false)}
        language={language}
      />

      {/* Barbell Plate & 1RM Calculator Modal */}
      <GymToolsModal
        isOpen={gymTools.isOpen}
        initialWeight={gymTools.weight}
        onClose={() => setGymTools({ ...gymTools, isOpen: false })}
        language={language}
      />

      {/* Exercise Swap Movement Modal */}
      {swapModal.isOpen && swapModal.exercise && (
        <ExerciseSwapModal
          isOpen={swapModal.isOpen}
          currentExercise={swapModal.exercise}
          onClose={() => setSwapModal({ isOpen: false, exerciseIndex: -1, exercise: null })}
          onSelectSubstitute={handleSwapMovement}
          language={language}
        />
      )}

      {/* Workout Completion Summary Celebration Modal */}
      <WorkoutSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        workoutPlan={activePlan}
        profile={profile}
        totalTonnageKg={totalTonnageKg}
        durationMinutes={activePlan.estimatedDurationMinutes}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        prCount={1}
        onSaveToHistory={handleSaveToHistory}
        language={language}
      />

      {/* Workout History Ledger Modal */}
      <WorkoutHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        language={language}
      />
    </div>
  );
};
