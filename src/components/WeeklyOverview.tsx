import React, { useState } from 'react';
import { WorkoutDay, TodayWorkout, UserProfile } from '../types';
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  Power, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  X 
} from 'lucide-react';
import { DAY_NAMES, DAY_NAMES_SHORT } from '../data/defaultProfile';
import { SupportedLanguage, t } from '../logic/i18n';
import { 
  translateWorkoutName, 
  translateMuscle, 
  translateExerciseName, 
  translateGoal,
  translateDayName 
} from '../logic/exerciseTranslations';

interface WeeklyOverviewProps {
  weeklyPlan: WorkoutDay[];
  todayWorkout: TodayWorkout;
  profile: UserProfile;
  onToggleDayActive: (dayIndex: number) => void;
  onUpdateDayFocus: (dayIndex: number, newName: string, newFocus: string[]) => void;
  language?: SupportedLanguage;
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  weeklyPlan,
  todayWorkout,
  profile,
  onToggleDayActive,
  onUpdateDayFocus,
  language = 'en',
}) => {
  const [inspectDay, setInspectDay] = useState<WorkoutDay | null>(null);

  // Focus presets for easy custom adjustments
  const focusPresets = [
    { label: 'Upper A (Push Focus)', name: 'Upper A (Push Emphasis & Upper Pecs)', focus: ['chest', 'shoulders', 'triceps', 'lats'] },
    { label: 'Lower A (Squat Focus)', name: 'Lower A (Squat Focus & Posterior Chain)', focus: ['quads', 'hamstrings', 'glutes', 'core'] },
    { label: 'Upper B (Pull Focus)', name: 'Upper B (Pull Emphasis & V-Taper)', focus: ['back', 'lats', 'biceps', 'chest', 'rear delts'] },
    { label: 'Lower B (Hinge Focus)', name: 'Lower B (Hinge Focus & Leg Density)', focus: ['hamstrings', 'quads', 'glutes', 'calves'] },
    { label: 'Upper C (Hypertrophy Volume)', name: 'Upper C (Hypertrophy Pump: Delts, Arms & Upper Pecs)', focus: ['shoulders', 'chest', 'arms', 'upper back', 'core'] },
    { label: 'Full Body', name: 'Full Body Compound Session', focus: ['quads', 'chest', 'back', 'hamstrings', 'core'] },
    { label: 'Active Rest / Mobility', name: 'Rest & Recovery Protocol', focus: ['mobility', 'recovery'] },
  ];

  // Map 0..6: European/standard display starting Monday (1) to Sunday (0)
  const orderedIndices = [1, 2, 3, 4, 5, 6, 0];

  const totalTrainingDays = weeklyPlan.filter(d => !d.isRestDay).length;

  return (
    <div className="space-y-4">
      {/* Header and summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            {t('weekly.title', language)}
          </h2>
          <p className="text-xs text-slate-400">
            {totalTrainingDays} {t('weekly.subtitle', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Split: <strong className="text-cyan-400 capitalize">{translateGoal(profile.primaryGoal, language)}</strong>
          </span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {orderedIndices.map((dayIdx) => {
          const day = weeklyPlan.find(d => d.dayIndex === dayIdx) || {
            dayIndex: dayIdx,
            dayName: DAY_NAMES[dayIdx],
            isRestDay: true,
            name: 'Rest Day',
            focus: ['recovery'],
            estimatedDurationMinutes: 0,
            exercises: [],
          };

          const isToday = todayWorkout.dayOfWeek === dayIdx;
          const isActive = !day.isRestDay;

          return (
            <div
              key={dayIdx}
              className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
                isToday
                  ? 'bg-slate-900/95 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 glow-emerald'
                  : isActive
                  ? 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border border-slate-900 opacity-60 hover:opacity-90'
              }`}
            >
              {/* Top day label & today badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white mono-font">
                      {translateDayName(dayIdx, language, true)}
                    </span>
                    {isToday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider animate-pulse">
                        {t('weekly.today', language)}
                      </span>
                    )}
                  </div>

                  {/* On / Off Power Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDayActive(dayIdx);
                    }}
                    title={isActive ? 'Deactivate day (set to Rest)' : 'Activate day as workout'}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day name / routine */}
                <h4 className={`text-xs font-bold mb-2 leading-tight ${isActive ? 'text-slate-100' : 'text-slate-500'}`}>
                  {translateWorkoutName(day.name, language)}
                </h4>

                {/* Focus Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {day.focus.slice(0, 3).map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md capitalize font-medium ${
                        isActive 
                          ? 'bg-slate-800 text-cyan-300' 
                          : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      {translateMuscle(f, language)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom stats & details */}
              <div className="pt-2 border-t border-slate-800/80 mt-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  {isActive ? (
                    <>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3 text-slate-500" />
                        {day.exercises.length} ex
                      </span>
                      <span className="flex items-center gap-1 mono-font">
                        <Clock className="w-3 h-3 text-slate-500" />
                        ~{day.estimatedDurationMinutes}m
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-500 italic">{t('weekly.rest', language)}</span>
                  )}
                </div>

                {/* Quick preview button or custom select */}
                <div className="flex items-center gap-1">
                  {isActive ? (
                    <button
                      onClick={() => setInspectDay(day)}
                      className="w-full py-1.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="capitalize">{t('weekly.exercises', language)}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleDayActive(dayIdx)}
                      className="w-full py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-medium transition-colors"
                    >
                      + Enable Day
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect / Edit Day Modal */}
      {inspectDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setInspectDay(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              {translateDayName(inspectDay.dayIndex, language)} Routine
            </div>

            <h3 className="text-xl font-black text-white mb-2">{translateWorkoutName(inspectDay.name, language)}</h3>

            {/* Quick Focus Switcher */}
            <div className="my-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Change Focus for {translateDayName(inspectDay.dayIndex, language)}:
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                value={focusPresets.find(p => p.name === inspectDay.name)?.name || ''}
                onChange={(e) => {
                  const preset = focusPresets.find(p => p.name === e.target.value);
                  if (preset) {
                    onUpdateDayFocus(inspectDay.dayIndex, preset.name, preset.focus);
                    setInspectDay({
                      ...inspectDay,
                      name: preset.name,
                      focus: preset.focus,
                    });
                  }
                }}
              >
                <option value="">Custom Focus ({translateWorkoutName(inspectDay.name, language)})</option>
                {focusPresets.map((preset, pIdx) => (
                  <option key={pIdx} value={preset.name}>
                    {translateWorkoutName(preset.name, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Exercises List Preview */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Planned Movements ({inspectDay.exercises.length})
              </h4>
              {inspectDay.exercises.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200">{translateExerciseName(ex.id || ex.name, language)}</span>
                    <span className="block text-[11px] text-slate-400">{ex.notes}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-cyan-400 mono-font">{ex.sets} × {ex.reps}</span>
                    <span className="block text-[10px] text-slate-500">{ex.restSeconds}s rest</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectDay(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
