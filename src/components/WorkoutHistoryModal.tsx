import React, { useState, useEffect } from 'react';
import { WorkoutHistorySession } from '../types';
import { getWorkoutHistory } from '../logic/storage';
import { History, X, Dumbbell, Calendar, Clock, Trophy, Trash2, ChevronDown, ChevronUp, Award } from 'lucide-react';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [history, setHistory] = useState<WorkoutHistorySession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getWorkoutHistory());
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  const lifetimeTonnage = history.reduce((acc, s) => acc + (s.totalTonnageKg || 0), 0);
  const totalSetsCompleted = history.reduce((acc, s) => acc + (s.completedSetsCount || 0), 0);
  const totalPrs = history.reduce((acc, s) => acc + (s.prCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-roman tracking-wide flex items-center gap-2">
                OLYMPIAN TRAINING LEDGER
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {history.length} Sessions
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Verified training history, tonnage progression, and personal records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lifetime Volume & Analytics Strip */}
        {history.length > 0 && (
          <div className="p-4 border-b border-slate-850 bg-slate-950/60 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-0.5">
                Lifetime Tonnage
              </span>
              <span className="text-sm sm:text-base font-black text-amber-400 mono-font">
                {lifetimeTonnage.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">kg</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-0.5">
                Sets Conquered
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400 mono-font">
                {totalSetsCompleted} <span className="text-[10px] font-normal text-slate-400">sets</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-0.5">
                Personal Records
              </span>
              <span className="text-sm sm:text-base font-black text-yellow-300 mono-font">
                {totalPrs} <span className="text-[10px] font-normal text-slate-400">PRs</span>
              </span>
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400/60 flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white font-roman mb-1">No Completed Sessions Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check off your working sets in Today's Workout and tap 'Finish Workout' to etch your first session into the Olympian Ledger.
              </p>
            </div>
          ) : (
            history.map((session) => {
              const isExpanded = expandedId === session.id;

              return (
                <div
                  key={session.id}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition-all p-4 space-y-3"
                >
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : session.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-white font-roman">
                          {session.workoutName}
                        </h4>
                        {session.prCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
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
                          <span className="text-amber-300 font-bold mono-font">{session.totalTonnageKg.toLocaleString()} kg</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 mono-font">
                        {session.completedSetsCount}/{session.totalSetsCount} sets
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded exercise details */}
                  {isExpanded && session.exercises && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
                      <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1">
                        Movements Performed
                      </span>
                      <div className="space-y-1.5">
                        {session.exercises.map((ex, exIdx) => (
                          <div 
                            key={exIdx}
                            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-between text-xs"
                          >
                            <span className="font-bold text-slate-200">{ex.name}</span>
                            <div className="flex items-center gap-2 text-slate-400 mono-font text-[11px]">
                              <span>{ex.sets?.length || 0} sets</span>
                              {ex.sets && ex.sets.length > 0 && (
                                <span className="text-amber-300">
                                  {Math.max(...ex.sets.map(s => s.weightKg || 0))} kg max
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Total Recorded Volume: <strong className="text-amber-400 mono-font">{history.reduce((acc, s) => acc + (s.totalTonnageKg || 0), 0).toLocaleString()} kg</strong>
            </span>

            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Ledger</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
