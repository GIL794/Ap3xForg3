import React, { useState } from 'react';
import { UserProfile, PhysiqueGoalMode } from '../types';
import { calculateNutritionTarget } from '../logic/nutritionCalculator';
import { SupportedLanguage } from '../logic/i18n';
import { 
  Scale, 
  Flame, 
  Sparkles, 
  Target, 
  Crown, 
  Droplet, 
  Dumbbell, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Check, 
  Zap,
  TrendingDown,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface PhysiqueTargetCardProps {
  profile: UserProfile;
  isProSubscriber?: boolean;
  onOpenPro?: () => void;
  language?: SupportedLanguage;
  onUpdateBiometrics?: (updated: Partial<UserProfile>) => void;
}

export const PhysiqueTargetCard: React.FC<PhysiqueTargetCardProps> = ({
  profile,
  isProSubscriber = false,
  onOpenPro,
  language = 'en',
  onUpdateBiometrics,
}) => {
  const [selectedMode, setSelectedMode] = useState<PhysiqueGoalMode | undefined>(undefined);
  const [activeStrategyTab, setActiveStrategyTab] = useState<'timing' | 'lifting' | 'cardio' | 'recovery'>('timing');
  const [tempBiometrics, setTempBiometrics] = useState({
    currentWeightKg: profile.currentWeightKg || '',
    goalWeightKg: profile.goalWeightKg || '',
    heightCm: profile.heightCm || '',
    ageYears: profile.ageYears || '',
  });

  const nutrition = calculateNutritionTarget(profile, selectedMode, language);

  // If biometrics are unconfigured, render ISO 8000 Compliant Data Configuration panel
  if (!nutrition.isConfigured) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border border-amber-500/40 p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-roman tracking-wide">
                {language === 'it' ? 'Dati Biometrici Richiesti' : 'Biometric Metrics Required'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-roman">
                ISO 8000
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'it'
                ? 'Per garantire calcoli scientifici senza assunzioni fittizie, inserisci il tuo peso attuale, altezza ed età.'
                : 'To calculate genuine BMR, TDEE, and macronutrient targets without arbitrary assumptions, enter your verified biometric data.'}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onUpdateBiometrics) {
              onUpdateBiometrics({
                currentWeightKg: tempBiometrics.currentWeightKg ? Number(tempBiometrics.currentWeightKg) : undefined,
                goalWeightKg: tempBiometrics.goalWeightKg ? Number(tempBiometrics.goalWeightKg) : undefined,
                heightCm: tempBiometrics.heightCm ? Number(tempBiometrics.heightCm) : undefined,
                ageYears: tempBiometrics.ageYears ? Number(tempBiometrics.ageYears) : undefined,
              });
            }
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
        >
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Current Weight (kg) *
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="300"
              required
              placeholder="e.g. 78"
              value={tempBiometrics.currentWeightKg}
              onChange={(e) => setTempBiometrics({ ...tempBiometrics, currentWeightKg: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold mono-font focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Target Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="300"
              placeholder="e.g. 82"
              value={tempBiometrics.goalWeightKg}
              onChange={(e) => setTempBiometrics({ ...tempBiometrics, goalWeightKg: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold mono-font focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Height (cm) *
            </label>
            <input
              type="number"
              min="100"
              max="250"
              required
              placeholder="e.g. 178"
              value={tempBiometrics.heightCm}
              onChange={(e) => setTempBiometrics({ ...tempBiometrics, heightCm: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold mono-font focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Age (years) *
            </label>
            <input
              type="number"
              min="14"
              max="100"
              required
              placeholder="e.g. 28"
              value={tempBiometrics.ageYears}
              onChange={(e) => setTempBiometrics({ ...tempBiometrics, ageYears: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold mono-font focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="col-span-2 sm:col-span-4 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-roman font-black tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Calibrate Scientific Biometrics</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  const currWeight = profile.currentWeightKg!;
  const goalWeight = profile.goalWeightKg ?? currWeight;
  const deltaWeight = Number((goalWeight - currWeight).toFixed(1));

  // Mode Options for Interactive Selection
  const modeOptions: { mode: PhysiqueGoalMode; label: string; icon: string }[] = [
    { 
      mode: 'fat_loss_aggressive', 
      label: language === 'it' ? 'Deficit Rapido (-600)' : language === 'es' ? 'Déficit Rápido (-600)' : language === 'fr' ? 'Déficit Agressif (-600)' : language === 'de' ? 'Schnell (-600)' : 'Rapid Cut (-600)',
      icon: '⚡'
    },
    { 
      mode: 'fat_loss_moderate', 
      label: language === 'it' ? 'Definizione (-400)' : language === 'es' ? 'Definición (-400)' : language === 'fr' ? 'Sèche Optimale (-400)' : language === 'de' ? 'Defizit (-400)' : 'Lean Cut (-400)',
      icon: '⚔️'
    },
    { 
      mode: 'recomp', 
      label: language === 'it' ? 'Ricomposizione (±0)' : language === 'es' ? 'Recomposición (±0)' : language === 'fr' ? 'Recomposition (±0)' : language === 'de' ? 'Erhaltung (±0)' : 'Recomp (±0)',
      icon: '⚖️'
    },
    { 
      mode: 'lean_bulk', 
      label: language === 'it' ? 'Massa Pulita (+300)' : language === 'es' ? 'Volumen Limpio (+300)' : language === 'fr' ? 'Masse Sèche (+300)' : language === 'de' ? 'Sauber (+300)' : 'Lean Bulk (+300)',
      icon: '🏛️'
    },
    { 
      mode: 'hypertrophy_aggressive', 
      label: language === 'it' ? 'Massa Max (+500)' : language === 'es' ? 'Masa Máx (+500)' : language === 'fr' ? 'Masse Max (+500)' : language === 'de' ? 'Maximal (+500)' : 'Max Bulk (+500)',
      icon: '🔥'
    },
  ];

  // Percentages for macro bar
  const totalKcal = Math.max(1, nutrition.targetCalories);
  const proteinPercent = Math.round((nutrition.proteinKcal / totalKcal) * 100);
  const carbsPercent = Math.round((nutrition.carbsKcal / totalKcal) * 100);
  const fatsPercent = Math.max(0, 100 - (proteinPercent + carbsPercent));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border border-amber-500/30 p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Title & Target Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white font-roman tracking-wide">
                {language === 'it' ? 'Calibrazione Peso & Nutrizione Target' : language === 'es' ? 'Calibración de Peso y Nutrición Objetivo' : language === 'fr' ? 'Objectif Poids & Nutrition Cible' : language === 'de' ? 'Zielgewicht & Ernährungs-Kalibrierung' : language === 'la' ? 'Calibratio Ponderis & Nutritionis' : 'Target Weight & Nutrition Engine'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-roman">
                {nutrition.modeLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'it' 
                ? 'Calibrazione bioenergetica personalizzata per accelerare la tua trasformazione fisica'
                : 'Sports-science metabolic calibration configured for your target weight trajectory'}
            </p>
          </div>
        </div>

        {/* Delta weight badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2">
          {deltaWeight < 0 ? (
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          ) : deltaWeight > 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : (
            <Target className="w-4 h-4 text-amber-400" />
          )}
          <div className="text-right">
            <div className="text-xs font-bold text-white mono-font">
              {currWeight} kg → <span className={deltaWeight < 0 ? 'text-cyan-400' : deltaWeight > 0 ? 'text-emerald-400' : 'text-amber-400'}>{goalWeight} kg</span>
            </div>
            <div className="text-[10px] text-slate-400 font-roman">
              {deltaWeight === 0 
                ? 'Recomposition' 
                : `${deltaWeight > 0 ? `+${deltaWeight}` : deltaWeight} kg (${nutrition.estimatedWeeks}w)`}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Pillar Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Daily Calorie Target */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-inner">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-1 font-roman">
            <span className="flex items-center gap-1.5 font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{language === 'it' ? 'Calorie Giornaliere' : 'Daily Calories'}</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 mono-font">
              {nutrition.calorieDelta >= 0 ? `+${nutrition.calorieDelta}` : nutrition.calorieDelta} kcal
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mono-font">
            {nutrition.targetCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>BMR: {nutrition.bmr}</span>
            <span>TDEE: {nutrition.tdee}</span>
          </div>
        </div>

        {/* 2. Protein Target */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-inner">
          <div className="flex items-center justify-between text-cyan-400 text-xs mb-1 font-roman">
            <span className="flex items-center gap-1.5 font-bold">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{language === 'it' ? 'Proteine' : 'Protein Target'}</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 mono-font">
              {nutrition.proteinPerKg} g/kg
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 mono-font">
            {nutrition.proteinGrams} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {nutrition.proteinKcal} kcal ({proteinPercent}% of daily total)
          </div>
        </div>

        {/* 3. Carbohydrates */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-inner">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1 font-roman">
            <span className="flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'it' ? 'Carboidrati' : 'Carbohydrates'}</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 mono-font">
              Glycogen
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mono-font">
            {nutrition.carbsGrams} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {nutrition.carbsKcal} kcal ({carbsPercent}% of daily total)
          </div>
        </div>

        {/* 4. Healthy Fats & Hydration */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 shadow-inner">
          <div className="flex items-center justify-between text-purple-400 text-xs mb-1 font-roman">
            <span className="flex items-center gap-1.5 font-bold">
              <Droplet className="w-3.5 h-3.5" />
              <span>{language === 'it' ? 'Grassi & Idratazione' : 'Fats & Water'}</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 mono-font">
              {nutrition.waterLiters}L/day
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 mono-font">
            {nutrition.fatsGrams} <span className="text-xs font-normal text-slate-400">g fats</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {nutrition.fatsKcal} kcal ({fatsPercent}%) • {nutrition.waterLiters} L water
          </div>
        </div>
      </div>

      {/* Visual Macro Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-roman">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            {language === 'it' ? 'Ripartizione Macronutrienti' : 'Macronutrient Split'}
          </span>
          <div className="flex items-center gap-3 text-slate-300 mono-font">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              {proteinPercent}% Pro
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {carbsPercent}% Carb
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              {fatsPercent}% Fat
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
          <div 
            style={{ width: `${proteinPercent}%` }} 
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500" 
            title={`Protein: ${proteinPercent}%`}
          />
          <div 
            style={{ width: `${carbsPercent}%` }} 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" 
            title={`Carbs: ${carbsPercent}%`}
          />
          <div 
            style={{ width: `${fatsPercent}%` }} 
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500" 
            title={`Fats: ${fatsPercent}%`}
          />
        </div>

        {/* Timeline banner */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'it' ? 'Velocità prevista:' : 'Planned rate:'} <strong className="text-white mono-font">{nutrition.weeklyRateKg >= 0 ? `+${nutrition.weeklyRateKg}` : nutrition.weeklyRateKg} kg/week</strong>
            </span>
          </div>
          {nutrition.estimatedWeeks > 0 && (
            <span className="text-amber-300 font-roman">
              {language === 'it' ? `Arrivo previsto: ~${nutrition.targetDate}` : `Target arrival: ~${nutrition.targetDate}`}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Goal Mode Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-roman font-bold text-slate-400 uppercase tracking-wider">
            {language === 'it' ? 'Modalità Traiettoria' : 'Physique Goal Mode Calibration'}
          </span>
          {selectedMode && (
            <button
              onClick={() => setSelectedMode(undefined)}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-roman"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'it' ? 'Auto-Calcola da Peso' : 'Auto-derive from target weight'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {modeOptions.map(opt => {
            const isSelected = nutrition.goalMode === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                onClick={() => setSelectedMode(opt.mode)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{opt.icon}</span>
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro AI Oracle Section */}
      <div className="pt-2 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-roman font-black text-amber-300 uppercase tracking-wider">
              {language === 'it' ? 'Oracolo AI • Strategia Pro per Peso Target' : 'Olympian AI Oracle • Target Weight Strategy'}
            </span>
          </div>
          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full font-roman border ${
            isProSubscriber 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isProSubscriber ? 'PRO UNLOCKED' : 'PRO FEATURE'}
          </span>
        </div>

        {isProSubscriber ? (
          <div className="space-y-3 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
            {/* 4 Strategy Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'timing', label: language === 'it' ? 'Timing Nutrienti' : 'Nutrient Timing', icon: '🥗' },
                { id: 'lifting', label: language === 'it' ? 'Adattamento Carichi' : 'Lifting Intensity', icon: '🏋️' },
                { id: 'cardio', label: language === 'it' ? 'Passi & Cardio' : 'Cardio & NEAT', icon: '🏃' },
                { id: 'recovery', label: language === 'it' ? 'Sonno & Recupero' : 'Sleep & Recovery', icon: '⚡' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStrategyTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    activeStrategyTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-roman'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Strategy Directives Content */}
            <div className="space-y-2.5 pt-1">
              {activeStrategyTab === 'timing' && (
                <div className="space-y-2">
                  {nutrition.proAiDirectives.macroTiming.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-amber-400 shrink-0 font-bold">0{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStrategyTab === 'lifting' && (
                <div className="space-y-2">
                  {nutrition.proAiDirectives.trainingCalibration.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-cyan-400 shrink-0 font-bold">0{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStrategyTab === 'cardio' && (
                <div className="space-y-2">
                  {nutrition.proAiDirectives.cardioNeat.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-emerald-400 shrink-0 font-bold">0{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStrategyTab === 'recovery' && (
                <div className="space-y-2">
                  {nutrition.proAiDirectives.recoverySupplements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-purple-400 shrink-0 font-bold">0{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center space-y-3">
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-sm font-bold text-white font-roman">
                {language === 'it' 
                  ? 'Sblocca la Strategia Nutrizionale Completa dell\'Oracolo AI' 
                  : 'Unlock Full Pro AI Target Weight Strategy'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'it'
                  ? 'Ricevi indicazioni personalizzate su nutrient timing peri-workout, modulazione dei carichi in base al deficit/surplus, target di passi giornalieri e protocolli di integrazione.'
                  : 'Get personalized nutrient timing protocols, lifting intensity calibrations for your caloric state, daily step/cardio targets, and deep sleep recovery protocols.'}
              </p>
            </div>
            {onOpenPro && (
              <button
                type="button"
                onClick={onOpenPro}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-roman font-black hover:scale-105 transition-all shadow-md shadow-amber-500/20"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>{language === 'it' ? 'Sblocca Imperivm Pro' : 'Unlock Imperivm Pro'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
