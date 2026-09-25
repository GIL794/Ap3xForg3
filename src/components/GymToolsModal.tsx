import React, { useState } from 'react';
import { X, Dumbbell, Calculator, ArrowRight, Check, Award } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

interface GymToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  language?: SupportedLanguage;
}

export const GymToolsModal: React.FC<GymToolsModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 80,
  language = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'plates' | 'one_rm'>('plates');

  // Plate Calculator State
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg standard Olympic bar

  // 1RM Calculator State
  const [rmWeight, setRmWeight] = useState<number>(initialWeight);
  const [rmReps, setRmReps] = useState<number>(8);

  if (!isOpen) return null;

  // Calculate plates per side
  const calculatePlates = (target: number, bar: number) => {
    const weightToLoad = Math.max(0, target - bar);
    const weightPerSide = weightToLoad / 2;

    const availablePlates = [
      { weight: 25, color: 'bg-red-600 border-red-400 text-white', label: '25kg' },
      { weight: 20, color: 'bg-blue-600 border-blue-400 text-white', label: '20kg' },
      { weight: 15, color: 'bg-yellow-500 border-yellow-300 text-slate-950', label: '15kg' },
      { weight: 10, color: 'bg-emerald-600 border-emerald-400 text-white', label: '10kg' },
      { weight: 5, color: 'bg-slate-200 border-white text-slate-950', label: '5kg' },
      { weight: 2.5, color: 'bg-slate-700 border-slate-500 text-white', label: '2.5kg' },
      { weight: 1.25, color: 'bg-amber-600 border-amber-400 text-white', label: '1.25kg' },
    ];

    let remaining = weightPerSide;
    const loadedPlates: { weight: number; color: string; label: string; count: number }[] = [];

    for (const plate of availablePlates) {
      const count = Math.floor(remaining / plate.weight);
      if (count > 0) {
        loadedPlates.push({ ...plate, count });
        remaining = Math.round((remaining - count * plate.weight) * 100) / 100;
      }
    }

    const actualPerSide = weightPerSide - remaining;
    const totalAchieved = bar + actualPerSide * 2;

    return {
      loadedPlates,
      weightPerSide,
      actualPerSide,
      totalAchieved,
      remainingPerSide: remaining,
    };
  };

  const plateResult = calculatePlates(targetWeight, barWeight);

  // 1RM calculation: Epley formula = W * (1 + r/30), Brzycki = W * (36 / (37 - r))
  const calculate1RM = (weight: number, reps: number) => {
    let estimated = weight;
    if (reps > 1) {
      const epley = Math.round(weight * (1 + reps / 30));
      const brzycki = Math.round(weight * (36 / (37 - Math.min(36, reps))));
      estimated = Math.round((epley + brzycki) / 2);
    }

    const percentages = [
      { pct: 95, reps: '1-2 reps', intensity: 'Near Max' },
      { pct: 90, reps: '3-4 reps', intensity: 'Heavy Strength' },
      { pct: 85, reps: '5-6 reps', intensity: 'Strength/Hypertrophy' },
      { pct: 80, reps: '7-8 reps', intensity: 'Ideal Hypertrophy' },
      { pct: 75, reps: '9-10 reps', intensity: 'Volume Overload' },
      { pct: 70, reps: '11-12 reps', intensity: 'Endurance Pump' },
      { pct: 65, reps: '13-15 reps', intensity: 'Deload / Dynamic' },
    ].map(p => ({
      ...p,
      weight: Math.round((estimated * (p.pct / 100)) * 2) / 2, // Round to nearest 0.5kg
    }));

    return { estimated, percentages };
  };

  const rmResult = calculate1RM(rmWeight, rmReps);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {t('tools.plateCalc', language)} & {t('tools.oneRm', language)}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {t('tools.zeroPaywall', language)}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{t('tools.essential', language)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('plates')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'plates'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" /> {t('tools.plateCalc', language)}
          </button>

          <button
            onClick={() => setActiveTab('one_rm')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'one_rm'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> {t('tools.oneRm', language)}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'plates' ? (
            <div className="space-y-5">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {t('tools.targetWeight', language)}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="2.5"
                      min="20"
                      max="400"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(Number(e.target.value) || 20)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-white mono-font focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {t('tools.barbellType', language)}
                  </label>
                  <select
                    value={barWeight}
                    onChange={(e) => setBarWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={20}>{t('tools.barbellStandard', language)}</option>
                    <option value={15}>{t('tools.barbellWomen', language)}</option>
                    <option value={10}>{t('tools.barbellJunior', language)}</option>
                  </select>
                </div>
              </div>

              {/* Quick weight adjust chips */}
              <div className="flex flex-wrap gap-1.5">
                {[60, 70, 80, 90, 100, 120, 140].map((w) => (
                  <button
                    key={w}
                    onClick={() => setTargetWeight(w)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold mono-font transition-all ${
                      targetWeight === w
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>

              {/* Visual Barbell Sleeve */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-3">
                  Barbell Sleeve Layout (One Side: {plateResult.actualPerSide} kg)
                </span>

                <div className="flex items-center justify-center gap-1.5 py-4 overflow-x-auto min-h-[90px]">
                  {/* Collar / Bar */}
                  <div className="w-8 h-4 bg-slate-600 rounded-l border-y border-l border-slate-500 flex items-center justify-center text-[9px] text-slate-400 font-mono">
                    Bar
                  </div>

                  {/* Plates rendered from heaviest to lightest */}
                  {plateResult.loadedPlates.flatMap((p) =>
                    Array.from({ length: p.count }).map((_, idx) => (
                      <div
                        key={`${p.weight}-${idx}`}
                        className={`px-2 py-6 rounded-md font-bold text-xs mono-font border shadow-md flex items-center justify-center shrink-0 ${p.color}`}
                        style={{
                          height: `${Math.min(84, 52 + p.weight * 1.2)}px`,
                          width: `${Math.max(26, 20 + p.weight * 0.4)}px`,
                        }}
                        title={`${p.weight} kg Plate`}
                      >
                        <span className="transform -rotate-90 whitespace-nowrap text-[10px]">
                          {p.weight}
                        </span>
                      </div>
                    ))
                  )}

                  {/* Empty sleeve tip */}
                  <div className="w-12 h-3 bg-slate-700 rounded-r border-y border-r border-slate-600" />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Load <strong>{plateResult.actualPerSide} kg</strong> per side
                  </span>
                  <span className="mono-font text-emerald-400 font-bold">
                    Total: {plateResult.totalAchieved} kg
                  </span>
                </div>
              </div>

              {/* Exact Plates Checklist */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Plates to grab per side:
                </span>
                {plateResult.loadedPlates.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {plateResult.loadedPlates.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300 font-medium">{p.label} plate:</span>
                        <span className="font-bold text-cyan-400 mono-font">
                          {p.count}x <span className="text-[10px] text-slate-500">({p.count * 2} total)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No plates needed—empty bar.</p>
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: 1RM ESTIMATOR */
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Lifted Weight (kg)</label>
                  <input
                    type="number"
                    value={rmWeight}
                    onChange={(e) => setRmWeight(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-white mono-font focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Reps Performed</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rmReps}
                    onChange={(e) => setRmReps(Number(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-cyan-400 mono-font focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 1RM Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 text-center">
                <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                  Estimated One-Rep Maximum (1RM)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mono-font">
                  {rmResult.estimated} <span className="text-base text-slate-400 font-normal">kg</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Based on Epley & Brzycki strength algorithms.
                </p>
              </div>

              {/* Percentage Breakdown Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Percentage</th>
                      <th className="py-2.5 px-3">Target Weight</th>
                      <th className="py-2.5 px-3">Rep Range</th>
                      <th className="py-2.5 px-3">Focus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                    {rmResult.percentages.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-bold text-cyan-400 mono-font">{row.pct}%</td>
                        <td className="py-2 px-3 font-bold text-white mono-font">{row.weight} kg</td>
                        <td className="py-2 px-3 text-slate-300 mono-font">{row.reps}</td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">{row.intensity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Tools
          </button>
        </div>
      </div>
    </div>
  );
};
