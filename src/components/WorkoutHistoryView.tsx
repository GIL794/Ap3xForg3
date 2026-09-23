import React, { useState, useEffect } from 'react';
import { WorkoutHistorySession } from '../types';
import { getWorkoutHistory } from '../logic/storage';
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
  Download
} from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';
import { translateWorkoutName, translateExerciseName, translateCategory } from '../logic/exerciseTranslations';

interface WorkoutHistoryViewProps {
  language?: SupportedLanguage;
  onOpenPro?: () => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({
  language = 'en',
  onOpenPro,
}) => {
  const [history, setHistory] = useState<WorkoutHistorySession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setHistory(getWorkoutHistory());
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

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `homodeus-training-ledger-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-roman font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={handleClearHistory}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
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
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-amber-400/60 flex items-center justify-center mx-auto mb-3">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white font-roman mb-1">
            {history.length === 0 ? t('history.empty', language) : 'No Matching Sessions Found'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {history.length === 0
              ? 'Complete and seal your first workout in Today\'s Arena to etch your achievements into the permanent ledger.'
              : 'Try clearing your search query to see all recorded sessions.'}
          </p>
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
                    <span className="text-xs text-slate-400 font-roman hidden sm:inline">
                      {isExpanded ? 'Hide Details' : 'View Exercises'}
                    </span>
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
    </div>
  );
};
