import React, { useState, useEffect } from 'react';
import { WorkoutDay, TodayWorkout, UserProfile } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { RestTimerModal } from './RestTimerModal';
import { GymToolsModal } from './GymToolsModal';
import { OlympianEvolutionCard } from './OlympianEvolutionCard';
import { MuscleRecoveryGauge } from './MuscleRecoveryGauge';
import { copyWorkoutToClipboard } from '../logic/storage';
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
  Calculator
} from 'lucide-react';

interface TodayWorkoutViewProps {
  todayWorkout: TodayWorkout;
  profile: UserProfile;
  completedSets: Record<string, boolean[]>;
  onUpdateCompletedSets: (updated: Record<string, boolean[]>) => void;
  onOverridePlan: (newDayPlan: WorkoutDay) => void;
  onOpenPro?: () => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  todayWorkout,
  profile,
  completedSets,
  onUpdateCompletedSets,
  onOpenPro,
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
    pull_ups: 80, // bodyweight default
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

  const [activeTimer, setActiveTimer] = useState<{ isOpen: boolean; seconds: number; exerciseName: string }>({
    isOpen: false,
    seconds: 90,
    exerciseName: '',
  });

  const [gymTools, setGymTools] = useState<{ isOpen: boolean; weight: number }>({
    isOpen: false,
    weight: 80,
  });

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
        setTimeUntilString(`Session was scheduled ${pastHrs > 0 ? `${pastHrs}h ` : ''}${pastMins}m ago`);
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
    current[setIndex] = !current[setIndex];
    onUpdateCompletedSets({
      ...completedSets,
      [exerciseId]: current,
    });
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
                TODAY'S WORKOUT • {todayWorkout.scheduledTime} BST
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {isPastTime ? (
                <span className="text-amber-300 mono-font">{timeUntilString}</span>
              ) : (
                <span className="text-slate-200">
                  Starts in <strong className="text-emerald-400 mono-font">{timeUntilString}</strong>
                </span>
              )}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
            {activePlan.name}
          </h2>

          <p className="text-sm text-slate-300 max-w-2xl mb-6">
            Personalized for <strong className="text-white">{profile.name}</strong> • London gym session ready with compound overload, hypertrophy volume, and active rest pacing.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Duration
              </div>
              <div className="text-lg font-bold text-white mono-font">
                ~{activePlan.estimatedDurationMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Movements
              </div>
              <div className="text-lg font-bold text-white mono-font">
                {exercises.length} <span className="text-xs text-slate-400 font-normal">stations</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Working Sets
              </div>
              <div className="text-lg font-bold text-white mono-font">
                {totalSetsCount} <span className="text-xs text-slate-400 font-normal">sets</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-pink-400" /> Focus
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
                    <span>Copied Plan!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy to Notes</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setGymTools({ isOpen: true, weight: 80 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/30 shadow-sm"
              >
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Plate & 1RM Calculator</span>
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
                  <span>{useCatchUp ? 'Express Plan Active (35m)' : 'Switch to Express (35m)'}</span>
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
                <span>Reset sets</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OLYMPIAN ASCENSION CARD (Pantheon & 13 Tiers of Ascension) */}
      <OlympianEvolutionCard
        totalTonnageKg={totalTonnageKg}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        onOpenGymTools={() => setGymTools({ isOpen: true, weight: 80 })}
      />

      {/* BIO-RECOVERY & FATIGUE GAUGE */}
      <MuscleRecoveryGauge
        primaryMuscles={activePlan.focus || []}
        totalSetsToday={totalSetsCount}
        onOpenPro={onOpenPro || (() => {})}
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
                Session Progress: <span className="mono-font text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="text-xs text-slate-400">
                {completedSetsCount} of {totalSetsCount} working sets checked off
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
                  Warm-Up Protocol
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal mono-font">
                    {activePlan.warmup.durationMinutes} min
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Cardiovascular prep & joint lubrication</p>
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
              {warmupDone ? 'Warm-up Done' : 'Mark Complete'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                1. General Prep (3-5 min)
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
                2. Specific Muscle Activation
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

      {/* Main Working Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            Working Exercises ({exercises.length})
          </h3>
          <span className="text-xs text-slate-400">
            Follow listed order for optimal neural drive
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
          />
        ))}
      </div>

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
                Cool-Down & Mobility ({activePlan.cooldown.durationMinutes} min)
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
              {cooldownDone ? 'Finished' : 'Mark Done'}
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
            <strong className="text-amber-300 block mb-0.5">Progression Principle for Today:</strong>
            {activePlan.progressionRule}
          </div>
        </div>
      )}

      {/* Floating / Interactive Rest Timer Modal */}
      <RestTimerModal
        isOpen={activeTimer.isOpen}
        initialSeconds={activeTimer.seconds}
        exerciseName={activeTimer.exerciseName}
        onClose={() => setActiveTimer({ ...activeTimer, isOpen: false })}
      />

      {/* Barbell Plate & 1RM Calculator Modal */}
      <GymToolsModal
        isOpen={gymTools.isOpen}
        initialWeight={gymTools.weight}
        onClose={() => setGymTools({ ...gymTools, isOpen: false })}
      />
    </div>
  );
};
