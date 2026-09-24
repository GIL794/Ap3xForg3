import React, { useState, useEffect } from 'react';
import { WorkoutHistorySession, ExerciseCategory } from '../types';
import { 
  getWorkoutHistory, 
  saveWorkoutSession, 
  deleteWorkoutSession,
  getActiveSessionDraft, 
  clearActiveSessionDraft 
} from '../logic/storage';
import { 
  History, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Trophy, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Download,
  Plus,
  Sparkles,
  X,
  Check,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';
import { translateWorkoutName, translateExerciseName, translateCategory } from '../logic/exerciseTranslations';
import confetti from 'canvas-confetti';

interface WorkoutHistoryViewProps {
  language?: SupportedLanguage;
  onOpenPro?: () => void;
  onSessionLogged?: (tonnage: number, xp: number) => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({
  language = 'en',
  onOpenPro,
  onSessionLogged,
}) => {
  const [history, setHistory] = useState<WorkoutHistorySession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [orphanDraft, setOrphanDraft] = useState<any>(null);

  // Default dates for quick logging
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Manual past workout form state
  const [logForm, setLogForm] = useState({
    date: twoDaysAgoStr,
    workoutName: 'Upper Body A (Push Emphasis)',
    dayName: 'Monday',
    durationMinutes: 65,
    completedSetsCount: 16,
    totalTonnageKg: 4200,
    prCount: 1,
    primaryExerciseName: 'Barbell Bench Press',
    primaryExerciseCategory: 'push' as ExerciseCategory,
    primaryExerciseSets: 4,
    primaryExerciseWeight: 80,
  });

  useEffect(() => {
    setHistory(getWorkoutHistory());

    // Check if an unsealed draft exists from a previous date
    const draft = getActiveSessionDraft();
    const todayStr = new Date().toISOString().split('T')[0];
    if (draft && draft.completedSetsCount > 0 && draft.date && draft.date < todayStr) {
      setOrphanDraft(draft);
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Clear all logged workout sessions from this device?')) {
      try {
        localStorage.removeItem('homodevs_workout_history_v1');
        setHistory([]);
      } catch {
        // ignore
      }
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this workout session from your ledger?')) {
      deleteWorkoutSession(sessionId);
      setHistory(getWorkoutHistory());
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `homodeus-training-ledger-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore orphaned draft from previous session
  const handleRestoreOrphanDraft = () => {
    if (!orphanDraft) return;

    const session: WorkoutHistorySession = {
      id: `session_recovered_${Date.now()}_${orphanDraft.date}`,
      date: orphanDraft.date,
      dayName: orphanDraft.dayName || 'Training Day',
      workoutName: orphanDraft.workoutName || 'Workout Session',
      durationMinutes: orphanDraft.durationMinutes || 60,
      totalTonnageKg: orphanDraft.totalTonnageKg || 3500,
      completedSetsCount: orphanDraft.completedSetsCount || 12,
      totalSetsCount: orphanDraft.exercises?.reduce((acc: number, e: any) => acc + (e.sets?.length || 0), 0) || orphanDraft.completedSetsCount,
      prCount: 1,
      exercises: orphanDraft.exercises || [],
    };

    saveWorkoutSession(session);
    clearActiveSessionDraft();
    setOrphanDraft(null);
    setHistory(getWorkoutHistory());

    const xpEarned = Math.round(session.totalTonnageKg * 0.05 + session.completedSetsCount * 25 + 150);
    if (onSessionLogged) {
      onSessionLogged(session.totalTonnageKg, xpEarned);
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#06b6d4'],
    });
  };

  // Submit manual past workout
  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();

    const dateObj = new Date(logForm.date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const resolvedDayName = isNaN(dateObj.getTime()) ? 'Training Day' : dayNames[dateObj.getDay()];

    const session: WorkoutHistorySession = {
      id: `session_past_${Date.now()}`,
      date: logForm.date,
      dayName: resolvedDayName,
      workoutName: logForm.workoutName,
      durationMinutes: Number(logForm.durationMinutes) || 60,
      totalTonnageKg: Number(logForm.totalTonnageKg) || 3500,
      completedSetsCount: Number(logForm.completedSetsCount) || 15,
      totalSetsCount: Number(logForm.completedSetsCount) || 15,
      prCount: Number(logForm.prCount) || 1,
      exercises: [
        {
          id: 'primary_lift',
          name: logForm.primaryExerciseName,
          category: logForm.primaryExerciseCategory,
          sets: Array.from({ length: Number(logForm.primaryExerciseSets) || 4 }, (_, idx) => ({
            setNumber: idx + 1,
            type: 'normal',
            weightKg: Number(logForm.primaryExerciseWeight) || 80,
            reps: 10,
            completed: true,
            isPr: idx === 0,
          })),
        },
        {
          id: 'accessory_lift',
          name: 'Accessory & Hypertrophy Finisher',
          category: logForm.primaryExerciseCategory,
          sets: Array.from({ length: Math.max(1, (Number(logForm.completedSetsCount) || 15) - 4) }, (_, idx) => ({
            setNumber: idx + 1,
            type: 'normal',
            weightKg: Math.round(Number(logForm.primaryExerciseWeight) * 0.6) || 45,
            reps: 12,
            completed: true,
          })),
        }
      ],
    };

    saveWorkoutSession(session);
    setHistory(getWorkoutHistory());
    setIsLogModalOpen(false);

    const xpEarned = Math.round(session.totalTonnageKg * 0.05 + session.completedSetsCount * 25 + 150);
    if (onSessionLogged) {
      onSessionLogged(session.totalTonnageKg, xpEarned);
    }

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'],
    });
  };

  const lifetimeTonnage = history.reduce((acc, s) => acc + (s.totalTonnageKg || 0), 0);
  const totalSetsCompleted = history.reduce((acc, s) => acc + (s.completedSetsCount || 0), 0);
  const totalPrs = history.reduce((acc, s) => acc + (s.prCount || 0), 0);

  const filteredHistory = history.filter(session => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      session.workoutName.toLowerCase().includes(q) ||
      session.date.includes(q) ||
      session.exercises.some(ex => ex.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Hero Stats Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-roman tracking-wide">
                  {t('history.title', language)}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-roman">
                  {history.length} Sessions
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verified training history, tonnage progression, and broken personal records
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-roman font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Past Workout</span>
            </button>

            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-roman font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleClearHistory}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3-Column Lifetime Analytics Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 text-center sm:text-left">
            <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
              {t('history.lifetimeTonnage', language)}
            </span>
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 mono-font">
                {lifetimeTonnage.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-roman">kg</span>
            </div>
            <span className="text-[10px] text-amber-300/70 block mt-1">
              Forged across {history.length} workouts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center sm:text-left">
            <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
              {t('today.workingSets', language)}
            </span>
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 mono-font">
                {totalSetsCompleted}
              </span>
              <span className="text-xs text-slate-400 font-roman">sets</span>
            </div>
            <span className="text-[10px] text-emerald-400/70 block mt-1">
              Checked off with full mechanical tension
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center sm:text-left">
            <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
              {t('history.prsBroken', language)}
            </span>
            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="text-2xl sm:text-3xl font-black text-yellow-300 mono-font">
                {totalPrs}
              </span>
              <span className="text-xs text-slate-400 font-roman">records</span>
            </div>
            <span className="text-[10px] text-yellow-300/70 block mt-1">
              Gladiatorial milestones established
            </span>
          </div>
        </div>
      </div>

      {/* Recovered Orphan Draft Banner (If an unsealed session was preserved) */}
      {orphanDraft && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-900/30 border border-amber-500/50 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-roman flex items-center gap-2">
                <span>Recovered Unsealed Workout Session</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {orphanDraft.date}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Found {orphanDraft.completedSetsCount} completed sets from <strong>{orphanDraft.workoutName}</strong> ({(orphanDraft.totalTonnageKg || 0).toLocaleString()} kg tonnage).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                clearActiveSessionDraft();
                setOrphanDraft(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
            <button
              onClick={handleRestoreOrphanDraft}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-roman font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Restore & Claim XP</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter / Search Bar */}
      {history.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search sessions by workout name, exercise, or date..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Sessions Cards Stream */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-amber-400/60 flex items-center justify-center mx-auto">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-base font-bold text-white font-roman">
              {history.length === 0 ? t('history.empty', language) : 'No Matching Sessions Found'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {history.length === 0
                ? 'Did you train recently? Use "Log Past Workout" above to retroactively record any session and credit your profile with XP and tonnage immediately.'
                : 'Try clearing your search query to see all recorded sessions.'}
            </p>
          </div>
          {history.length === 0 && (
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-roman font-black hover:scale-105 transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Past Workout (e.g. 2 Days Ago)</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((session) => {
            const isExpanded = expandedId === session.id;

            return (
              <div
                key={session.id}
                className="rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all p-5 sm:p-6 space-y-4 shadow-xl"
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="flex items-center justify-between cursor-pointer gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-white font-roman truncate">
                        {translateWorkoutName(session.workoutName, language)}
                      </h3>
                      {session.prCount > 0 && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-roman">
                          <Award className="w-3 h-3" /> {session.prCount} PR{session.prCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{session.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>~{session.durationMinutes} min</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-amber-300 font-bold mono-font">{(session.totalTonnageKg || 0).toLocaleString()} kg</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        {session.completedSetsCount} / {session.totalSetsCount} sets
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Exercises and Sets */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-850 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {session.exercises.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-200 truncate">
                              {translateExerciseName(ex.name, language)}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-mono">
                              {translateCategory(ex.category as any, language)}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {ex.sets.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-slate-950/60"
                              >
                                <span className="mono-font text-slate-400">Set {s.setNumber}</span>
                                <span className="mono-font font-bold text-amber-300">
                                  {s.weightKg} kg × {s.reps} reps
                                </span>
                                <span className="text-[10px] text-emerald-400 font-bold">✓ Logged</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Past Workout Logger Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white font-roman">
                    Log Past Workout Session
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recover workouts performed earlier and credit XP immediately
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualLog} className="space-y-4">
              {/* Quick Date Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session Date</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setLogForm({ ...logForm, date: twoDaysAgoStr })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      logForm.date === twoDaysAgoStr
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    2 Days Ago ({twoDaysAgoStr})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogForm({ ...logForm, date: yesterdayStr })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      logForm.date === yesterdayStr
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Yesterday
                  </button>
                </div>
                <input
                  type="date"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white mono-font focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              {/* Workout Routine Template */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Workout Focus & Routine
                </label>
                <select
                  value={logForm.workoutName}
                  onChange={(e) => setLogForm({ ...logForm, workoutName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Upper Body A (Push Emphasis)">Upper Body A (Push Emphasis)</option>
                  <option value="Lower Body A (Squat Focus)">Lower Body A (Squat Focus)</option>
                  <option value="Upper Body B (Pull Emphasis)">Upper Body B (Pull Emphasis)</option>
                  <option value="Lower Body B (Deadlift Focus)">Lower Body B (Deadlift Focus)</option>
                  <option value="Full Body Olympian Forge">Full Body Olympian Forge</option>
                  <option value="Push Hypertrophy">Push Hypertrophy</option>
                  <option value="Pull Hypertrophy">Pull Hypertrophy</option>
                  <option value="Legs & Abs">Legs & Abs</option>
                </select>
              </div>

              {/* Tonnage, Sets & Duration Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Completed Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={logForm.completedSetsCount}
                    onChange={(e) => setLogForm({ ...logForm, completedSetsCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold mono-font"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Total Tonnage (kg)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={logForm.totalTonnageKg}
                    onChange={(e) => setLogForm({ ...logForm, totalTonnageKg: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold mono-font"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={logForm.durationMinutes}
                    onChange={(e) => setLogForm({ ...logForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold mono-font"
                  />
                </div>
              </div>

              {/* XP Preview Card */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-roman">Estimated XP to Award:</span>
                </div>
                <div className="text-amber-300 font-black mono-font text-sm">
                  +{Math.round(logForm.totalTonnageKg * 0.05 + logForm.completedSetsCount * 25 + 150)} XP
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-roman font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save to Ledger & Claim XP</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
