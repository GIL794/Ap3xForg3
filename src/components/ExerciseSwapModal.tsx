import React, { useState, useMemo } from 'react';
import { PlannedExercise, ExerciseDefinition, ExerciseCategory, EquipmentType } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { X, Search, RefreshCw, Dumbbell, Sparkles, Check, Plus } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: PlannedExercise;
  onSelectSubstitute: (replacement: ExerciseDefinition) => void;
  language?: SupportedLanguage;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  isOpen,
  onClose,
  currentExercise,
  onSelectSubstitute,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'recommended' | 'all' | 'machines' | 'dumbbells' | 'cables' | 'custom'>('recommended');

  // Custom Movement Form State
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<ExerciseCategory>(currentExercise.category || 'push');
  const [customEquipment, setCustomEquipment] = useState<EquipmentType>('free_weights');
  const [customSets, setCustomSets] = useState(3);
  const [customReps, setCustomReps] = useState('8-12');

  const candidates = useMemo(() => {
    return EXERCISE_LIBRARY.filter(ex => ex.id !== currentExercise.id);
  }, [currentExercise.id]);

  const filteredCandidates = useMemo(() => {
    let list = candidates;

    // Default recommendation: same category or overlapping primary muscles
    if (selectedFilter === 'recommended') {
      list = list.filter(ex => 
        ex.category === currentExercise.category ||
        ex.primaryMuscles.some(m => currentExercise.primaryMuscles?.includes(m))
      );
    } else if (selectedFilter === 'machines') {
      list = list.filter(ex => ex.equipment.includes('machines'));
    } else if (selectedFilter === 'dumbbells') {
      list = list.filter(ex => ex.equipment.includes('free_weights'));
    } else if (selectedFilter === 'cables') {
      list = list.filter(ex => ex.equipment.includes('cables'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(ex => 
        ex.name.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.primaryMuscles.some(m => m.toLowerCase().includes(q))
      );
    }

    return list;
  }, [candidates, currentExercise, selectedFilter, searchQuery]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const customDef: ExerciseDefinition = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      primaryMuscles: currentExercise.primaryMuscles || ['chest'],
      secondaryMuscles: [],
      equipment: [customEquipment],
      tier: 'accessory',
      defaultSets: customSets,
      defaultReps: customReps,
      defaultRestSec: 90,
      targetRpe: '8',
      techniqueCues: ['Execute with controlled eccentric tempo and full active range of motion.'],
      progressionRule: 'Progress load once hitting top rep threshold.',
    };

    onSelectSubstitute(customDef);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-roman tracking-wide flex items-center gap-2">
                {t('swap.title', language)}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Gym Floor Instant
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Replacing <strong className="text-amber-300">{currentExercise.name}</strong> • Equipment taken or tweaking joints?
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

        {/* Search & Filter bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movement name, muscle, or equipment..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('recommended')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border ${
                selectedFilter === 'recommended'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Recommended (Same Category)
            </button>

            <button
              onClick={() => setSelectedFilter('machines')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border ${
                selectedFilter === 'machines'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Machines
            </button>

            <button
              onClick={() => setSelectedFilter('dumbbells')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border ${
                selectedFilter === 'dumbbells'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Free Weights
            </button>

            <button
              onClick={() => setSelectedFilter('cables')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border ${
                selectedFilter === 'cables'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Cables
            </button>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border ${
                selectedFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Movements
            </button>

            <button
              onClick={() => setSelectedFilter('custom')}
              className={`px-3 py-1 rounded-lg font-roman font-bold transition-all shrink-0 border flex items-center gap-1 ${
                selectedFilter === 'custom'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-amber-300 border-amber-500/30 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Movement</span>
            </button>
          </div>
        </div>

        {/* Content Body: Either Custom Creator or Movements List */}
        {selectedFilter === 'custom' ? (
          <form onSubmit={handleCreateCustom} className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
            <div>
              <label className="text-xs font-roman font-bold uppercase text-slate-300 block mb-1">
                Movement Name
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Pendulum Squat, Seal Row, Belt Squat..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-roman font-bold uppercase text-slate-300 block mb-1">
                  Movement Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as ExerciseCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="push">Push (Chest & Triceps)</option>
                  <option value="pull">Pull (Back & Biceps)</option>
                  <option value="legs">Legs (Quads & Glutes)</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="arms">Arms</option>
                  <option value="core">Core & Abs</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-roman font-bold uppercase text-slate-300 block mb-1">
                  Equipment
                </label>
                <select
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value as EquipmentType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="free_weights">Barbell / Dumbbell</option>
                  <option value="machines">Plate-Loaded Machine</option>
                  <option value="cables">Cable Station</option>
                  <option value="bodyweight">Bodyweight / Calisthenics</option>
                  <option value="bands">Resistance Bands</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-roman font-bold uppercase text-slate-300 block mb-1">
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customSets}
                  onChange={(e) => setCustomSets(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-roman font-bold uppercase text-slate-300 block mb-1">
                  Target Reps
                </label>
                <input
                  type="text"
                  value={customReps}
                  onChange={(e) => setCustomReps(e.target.value)}
                  placeholder="e.g. 8-10, 12, Failure"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-roman font-black tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Custom Movement to Session</span>
            </button>
          </form>
        ) : (
          /* Movements List */
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No matching exercises found. Try clearing your search query or create a Custom Movement above.
              </div>
            ) : (
              filteredCandidates.map((exercise) => {
                const isSameCategory = exercise.category === currentExercise.category;

                return (
                  <div
                    key={exercise.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 font-roman transition-colors">
                          {exercise.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                          {exercise.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          {exercise.tier}
                        </span>
                        {isSameCategory && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Biomechanical Match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Dumbbell className="w-3.5 h-3.5 text-amber-400/80" />
                        <span>{exercise.equipment.map(e => e.replace('_', ' ')).join(', ')}</span>
                        <span>•</span>
                        <span>Targets: {exercise.primaryMuscles.join(', ')}</span>
                      </p>

                      {exercise.techniqueCues && exercise.techniqueCues.length > 0 && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                          Tip: {exercise.techniqueCues[0]}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectSubstitute(exercise);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black font-roman tracking-wide transition-all shadow-md shrink-0 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Swap</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
