import React, { useState } from 'react';
import { Activity, Sparkles, Layers, UserCheck, ShieldCheck, Flame, RotateCw, Zap, Target } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

interface MuscleRecoveryGaugeProps {
  primaryMuscles: string[];
  totalSetsToday: number;
  onOpenPro: () => void;
  isPro?: boolean;
  language?: SupportedLanguage;
}

interface MuscleStatus {
  id: string;
  name: string;
  latinName: string;
  recoveryPercentage: number;
  status: 'optimal' | 'recovering' | 'fatigued';
  recommendation: string;
  hoursToFullRecovery: number;
  bestMovements: string[];
  functionLore: string;
}

export const MuscleRecoveryGauge: React.FC<MuscleRecoveryGaugeProps> = ({
  primaryMuscles,
  totalSetsToday,
  onOpenPro,
  isPro = false,
  language = 'en',
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');
  const [bodyOrientation, setBodyOrientation] = useState<'front' | 'back'>('front');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [hoveredMuscleId, setHoveredMuscleId] = useState<string | null>(null);

  // Dynamic calculation based on planned exercises and today's volume
  const muscleScores: Record<string, MuscleStatus> = {
    chest: {
      id: 'chest',
      name: 'Pectorals (Chest)',
      latinName: 'Pectoralis Major & Minor',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('chest')) ? 92 : 100,
      status: 'optimal',
      recommendation: 'Primed for high mechanical tension and compound barbell presses.',
      hoursToFullRecovery: 0,
      bestMovements: ['Barbell Bench Press', 'Incline DB Press', 'Dips', 'Cable Flyes'],
      functionLore: 'Horizontal adduction & shoulder flexion. High fast-twitch density.',
    },
    deltoids: {
      id: 'deltoids',
      name: 'Deltoids (Shoulders)',
      latinName: 'Deltoideus (Anterior, Lateral, Posterior)',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('shoulder')) ? 88 : 96,
      status: 'optimal',
      recommendation: 'Full scapular stability available. Target overhead volume & lateral head.',
      hoursToFullRecovery: 6,
      bestMovements: ['Overhead Press', 'Lateral Raises', 'Face Pulls', 'Rear Delt Flyes'],
      functionLore: 'Multi-pennate shoulder abductors. 3D cannonball symmetry.',
    },
    triceps: {
      id: 'triceps',
      name: 'Triceps Brachii',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('tricep') || m.toLowerCase().includes('push')) ? 82 : 98,
      status: 'recovering',
      recommendation: 'Moderate neural fatigue. Focus on controlled eccentric tempo.',
      hoursToFullRecovery: 14,
      bestMovements: ['Rope Pushdowns', 'Skull Crushers', 'Weighted Dips'],
      functionLore: 'Primary elbow extensor accounting for 60% of total arm mass.',
    },
    biceps: {
      id: 'biceps',
      name: 'Biceps & Forearms',
      latinName: 'Biceps Brachii & Brachioradialis',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('bicep') || m.toLowerCase().includes('pull')) ? 86 : 98,
      status: 'optimal',
      recommendation: 'Full elbow flexion power ready for Supinated Curls.',
      hoursToFullRecovery: 8,
      bestMovements: ['Incline DB Curls', 'Barbell Curls', 'Hammer Curls'],
      functionLore: 'Supination and forearm flexion. Vital for heavy pulling mechanics.',
    },
    back: {
      id: 'back',
      name: 'Latissimus & Trapezius',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('back') || m.toLowerCase().includes('pull')) ? 95 : 100,
      status: 'optimal',
      recommendation: 'Grip and lat motor recruitment fully regenerated for heavy pulls.',
      hoursToFullRecovery: 0,
      bestMovements: ['Lat Pulldown', 'Barbell Rows', 'Pull-ups', 'Face Pulls'],
      functionLore: 'The colossal V-Taper wing expanse and scapular anchor of Olympian strength.',
    },
    quads: {
      id: 'quads',
      name: 'Quadriceps',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('quad') || m.toLowerCase().includes('leg')) ? 78 : 95,
      status: 'recovering',
      recommendation: 'Deep tissue recovery underway from preceding squat session.',
      hoursToFullRecovery: 18,
      bestMovements: ['Barbell Squat', 'Leg Press', 'Bulgarian Split Squat', 'Leg Extensions'],
      functionLore: 'Massive knee extensors featuring the iconic vastus medialis teardrop.',
    },
    hamstrings: {
      id: 'hamstrings',
      name: 'Hamstrings & Glutes',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recoveryPercentage: primaryMuscles.some(m => m.toLowerCase().includes('ham') || m.toLowerCase().includes('glute')) ? 80 : 94,
      status: 'recovering',
      recommendation: 'Posterior chain primed for hinge patterns and controlled extension.',
      hoursToFullRecovery: 12,
      bestMovements: ['Romanian Deadlift', 'Lying Leg Curls', 'Barbell Hip Thrusts'],
      functionLore: 'The athletic posterior engine driving hip extension and sprint locomotion.',
    },
    core: {
      id: 'core',
      name: 'Rectus Abdominis & Obliques',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recoveryPercentage: 96,
      status: 'optimal',
      recommendation: 'Intra-abdominal bracing and spinal stabilization at peak capacity.',
      hoursToFullRecovery: 0,
      bestMovements: ['Cable Crunches', 'Hanging Leg Raises', 'Ab Wheel Rollouts'],
      functionLore: 'The segmented marble armor protecting visceral organs and anchoring compound loads.',
    },
    calves: {
      id: 'calves',
      name: 'Calves (Gastrocnemius & Soleus)',
      latinName: 'Gastrocnemius & Soleus',
      recoveryPercentage: 98,
      status: 'optimal',
      recommendation: 'High-frequency endurance tissue ready for explosive plyometrics & heavy calf raises.',
      hoursToFullRecovery: 0,
      bestMovements: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises'],
      functionLore: 'Dense diamond plantar flexors built for unyielding resilience under high frequency.',
    },
  };

  const selectedMuscle = muscleScores[selectedMuscleId] || muscleScores['chest'];

  // Overall readiness across all 9 kinetic chains
  const allPercentages = Object.values(muscleScores).map(m => m.recoveryPercentage);
  const averageReadiness = Math.round(allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length);

  // Return fill styling based on status and selection
  const getMuscleFill = (muscleId: string) => {
    const score = muscleScores[muscleId]?.recoveryPercentage ?? 100;
    if (score >= 90) return 'url(#grad-optimal)';
    if (score >= 80) return 'url(#grad-recovering)';
    return 'url(#grad-fatigued)';
  };

  const getMuscleStroke = (muscleId: string) => {
    if (selectedMuscleId === muscleId) return '#fbbf24'; // radiant gold
    if (hoveredMuscleId === muscleId) return '#38bdf8'; // sky blue hover
    const score = muscleScores[muscleId]?.recoveryPercentage ?? 100;
    if (score >= 90) return '#059669';
    if (score >= 80) return '#d97706';
    return '#be123c';
  };

  const getMuscleStrokeWidth = (muscleId: string) => {
    if (selectedMuscleId === muscleId) return '2.5';
    if (hoveredMuscleId === muscleId) return '2';
    return '0.75';
  };

  const getMuscleFilter = (muscleId: string) => {
    if (selectedMuscleId === muscleId) return 'url(#olympian-glow)';
    return undefined;
  };

  const quickMuscleFilters = [
    { id: 'chest', label: 'Pectorals' },
    { id: 'deltoids', label: 'Deltoids' },
    { id: 'back', label: 'Back & Lats' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'core', label: 'Core / Abs' },
    { id: 'quads', label: 'Quadriceps' },
    { id: 'hamstrings', label: 'Hamstrings' },
    { id: 'calves', label: 'Calves' },
  ];

  return (
    <div className="rounded-3xl bg-[#090c15] border border-amber-500/25 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background radial ambient lights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header telemetry ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800/90 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30 shadow-inner">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white font-roman tracking-wide">
                {t('recovery.title', language)}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans font-black tracking-wider uppercase">
                {averageReadiness}% {t('recovery.calibre', language)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('recovery.subtitle', language)}
            </p>
          </div>
        </div>

        {/* View Mode & Pro Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-roman font-bold">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('recovery.anatomicalMap', language)}
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('recovery.scorecard', language)}
            </button>
          </div>

          <button
            onClick={onOpenPro}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-roman font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('recovery.proInsights', language)}</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-4">
          {/* Quick Muscle Selector Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickMuscleFilters.map(filter => {
              const isSelected = selectedMuscleId === filter.id;
              const score = muscleScores[filter.id]?.recoveryPercentage || 100;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedMuscleId(filter.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-roman font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20 scale-105'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      score >= 90 ? 'bg-emerald-400' : score >= 80 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                  />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 3D Anatomical Heatmap Canvas */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-5 rounded-3xl bg-[#06080f] border border-slate-800/80 shadow-inner relative">
              {/* Orientation Switcher Ribbon */}
              <div className="flex items-center justify-between w-full mb-3 px-2">
                <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-roman font-bold">
                  <button
                    onClick={() => setBodyOrientation('front')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bodyOrientation === 'front'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('recovery.anterior', language)}
                  </button>
                  <button
                    onClick={() => setBodyOrientation('back')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bodyOrientation === 'back'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('recovery.posterior', language)}
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>3D BIOMETRIC LINK</span>
                </div>
              </div>

              {/* High-Definition Biologically Authentic SVG Silhouette */}
              <div className="relative w-64 h-96 flex items-center justify-center">
                <svg
                  viewBox="0 0 320 460"
                  className="w-full h-full drop-shadow-2xl select-none"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }}
                >
                  <defs>
                    {/* 3D Biological Shading Gradients */}
                    <radialGradient id="grad-optimal" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="45%" stopColor="#10b981" />
                      <stop offset="90%" stopColor="#047857" />
                      <stop offset="100%" stopColor="#064e3b" />
                    </radialGradient>

                    <radialGradient id="grad-recovering" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="90%" stopColor="#b45309" />
                      <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>

                    <radialGradient id="grad-fatigued" cx="35%" cy="30%" r="75%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="45%" stopColor="#f43f5e" />
                      <stop offset="90%" stopColor="#be123c" />
                      <stop offset="100%" stopColor="#881337" />
                    </radialGradient>

                    <radialGradient id="grad-chassis" cx="50%" cy="40%" r="70%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="85%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#020617" />
                    </radialGradient>

                    {/* Olympian Radiant Glow Filter for Selected Muscles */}
                    <filter id="olympian-glow" x="-25%" y="-25%" width="150%" height="150%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                      <feComponentTransfer in="blur" result="glow">
                        <feFuncA type="linear" slope="1.8" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Biometric background HUD grid */}
                  <g opacity="0.15" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3">
                    <circle cx="160" cy="230" r="140" fill="none" />
                    <circle cx="160" cy="230" r="90" fill="none" />
                    <line x1="160" y1="20" x2="160" y2="440" />
                    <line x1="20" y1="230" x2="300" y2="230" />
                  </g>

                  {/* Anatomical Head, Cranium & Facial Silhouette */}
                  <g id="cranium">
                    <path
                      d="M 160 16 C 172 16 182 26 182 40 C 182 52 174 62 168 68 L 160 74 L 152 68 C 146 62 138 52 138 40 C 138 26 148 16 160 16 Z"
                      fill="url(#grad-chassis)"
                      stroke="#334155"
                      strokeWidth="1.2"
                    />
                    {/* Jawline and ear contour markers */}
                    <path d="M 148 48 Q 160 62 172 48" fill="none" stroke="#475569" strokeWidth="0.8" opacity="0.6" />
                  </g>

                  {bodyOrientation === 'front' ? (
                    /* ANTERIOR (FRONT) VIEW */
                    <g id="anterior-musculature">
                      {/* Neck / Sternocleidomastoid */}
                      <path
                        d="M 148 58 Q 152 70 156 82 L 152 83 Q 146 72 143 62 Z M 172 58 Q 168 70 164 82 L 168 83 Q 174 72 177 62 Z"
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth="1"
                      />

                      {/* Clavicles (Collar bones guide) */}
                      <path d="M 158 84 Q 136 82 114 84" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                      <path d="M 162 84 Q 184 82 206 84" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

                      {/* DELTOIDS (SHOULDERS - ANTERIOR & LATERAL HEADS) */}
                      <g
                        id="anterior-deltoids"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('deltoids')}
                        onMouseEnter={() => setHoveredMuscleId('deltoids')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Deltoid */}
                        <path
                          d="M 114 84 C 102 85 92 90 88 100 C 84 110 88 122 96 130 C 101 128 106 122 108 114 C 110 104 112 92 114 84 Z"
                          fill={getMuscleFill('deltoids')}
                          stroke={getMuscleStroke('deltoids')}
                          strokeWidth={getMuscleStrokeWidth('deltoids')}
                          filter={getMuscleFilter('deltoids')}
                        />
                        {/* Right Deltoid */}
                        <path
                          d="M 206 84 C 218 85 228 90 232 100 C 236 110 232 122 224 130 C 219 128 214 122 212 114 C 210 104 208 92 206 84 Z"
                          fill={getMuscleFill('deltoids')}
                          stroke={getMuscleStroke('deltoids')}
                          strokeWidth={getMuscleStrokeWidth('deltoids')}
                          filter={getMuscleFilter('deltoids')}
                        />
                      </g>

                      {/* PECTORALIS MAJOR (CHEST - CLAVICULAR & STERNAL HEADS) */}
                      <g
                        id="anterior-pectoralis"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('chest')}
                        onMouseEnter={() => setHoveredMuscleId('chest')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Clavicular & Sternal Pec */}
                        <path
                          d="M 158 86 C 142 85 124 88 114 94 C 111 99 110 106 114 112 C 126 112 144 110 158 110 Z"
                          fill={getMuscleFill('chest')}
                          stroke={getMuscleStroke('chest')}
                          strokeWidth={getMuscleStrokeWidth('chest')}
                          filter={getMuscleFilter('chest')}
                        />
                        <path
                          d="M 158 112 C 144 112 124 114 114 114 C 112 122 116 132 126 136 C 136 140 150 138 158 132 Z"
                          fill={getMuscleFill('chest')}
                          stroke={getMuscleStroke('chest')}
                          strokeWidth={getMuscleStrokeWidth('chest')}
                          filter={getMuscleFilter('chest')}
                        />

                        {/* Right Clavicular & Sternal Pec */}
                        <path
                          d="M 162 86 C 178 85 196 88 206 94 C 209 99 210 106 206 112 C 194 112 176 110 162 110 Z"
                          fill={getMuscleFill('chest')}
                          stroke={getMuscleStroke('chest')}
                          strokeWidth={getMuscleStrokeWidth('chest')}
                          filter={getMuscleFilter('chest')}
                        />
                        <path
                          d="M 162 112 C 176 112 196 114 206 114 C 208 122 204 132 194 136 C 184 140 170 138 162 132 Z"
                          fill={getMuscleFill('chest')}
                          stroke={getMuscleStroke('chest')}
                          strokeWidth={getMuscleStrokeWidth('chest')}
                          filter={getMuscleFilter('chest')}
                        />
                        {/* Sternal midline groove */}
                        <line x1="160" y1="86" x2="160" y2="134" stroke="#020617" strokeWidth="1.5" />
                      </g>

                      {/* BICEPS BRACHII & FOREARMS */}
                      <g
                        id="anterior-arms"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('biceps')}
                        onMouseEnter={() => setHoveredMuscleId('biceps')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Biceps */}
                        <path
                          d="M 98 130 C 94 138 94 150 96 160 C 100 166 104 168 108 166 C 112 158 112 144 110 132 C 105 131 101 130 98 130 Z"
                          fill={getMuscleFill('biceps')}
                          stroke={getMuscleStroke('biceps')}
                          strokeWidth={getMuscleStrokeWidth('biceps')}
                          filter={getMuscleFilter('biceps')}
                        />
                        {/* Right Biceps */}
                        <path
                          d="M 222 130 C 226 138 226 150 224 160 C 220 166 216 168 212 166 C 208 158 208 144 210 132 C 215 131 219 130 222 130 Z"
                          fill={getMuscleFill('biceps')}
                          stroke={getMuscleStroke('biceps')}
                          strokeWidth={getMuscleStrokeWidth('biceps')}
                          filter={getMuscleFilter('biceps')}
                        />

                        {/* Left Forearm */}
                        <path
                          d="M 96 168 C 88 178 84 192 88 208 C 90 216 93 226 95 236 L 103 234 C 104 224 105 210 106 196 C 107 186 108 176 106 168 Z"
                          fill={getMuscleFill('biceps')}
                          stroke={getMuscleStroke('biceps')}
                          strokeWidth={getMuscleStrokeWidth('biceps')}
                          filter={getMuscleFilter('biceps')}
                        />
                        {/* Right Forearm */}
                        <path
                          d="M 224 168 C 232 178 236 192 232 208 C 230 216 227 226 225 236 L 217 234 C 216 224 215 210 214 196 C 213 186 212 176 214 168 Z"
                          fill={getMuscleFill('biceps')}
                          stroke={getMuscleStroke('biceps')}
                          strokeWidth={getMuscleStrokeWidth('biceps')}
                          filter={getMuscleFilter('biceps')}
                        />

                        {/* Hands */}
                        <path d="M 95 238 C 93 244 91 254 92 262 C 94 266 98 266 100 260 L 103 242 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <path d="M 225 238 C 227 244 229 254 228 262 C 226 266 222 266 220 260 L 217 242 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      </g>

                      {/* RECTUS ABDOMINIS & EXTERNAL OBLIQUES (CORE / 6-PACK) */}
                      <g
                        id="anterior-core"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('core')}
                        onMouseEnter={() => setHoveredMuscleId('core')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Upper Abdominal Pair */}
                        <path
                          d="M 158 136 L 138 138 C 136 146 136 152 138 156 L 158 156 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />
                        <path
                          d="M 162 136 L 182 138 C 184 146 184 152 182 156 L 162 156 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />

                        {/* Mid Abdominal Pair (Navel level) */}
                        <path
                          d="M 158 159 L 138 159 C 138 168 138 174 140 178 L 158 178 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />
                        <path
                          d="M 162 159 L 182 159 C 182 168 182 174 180 178 L 162 178 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />

                        {/* Lower Abdominal Pair (V-Taper) */}
                        <path
                          d="M 158 181 L 140 181 C 142 192 148 202 158 208 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />
                        <path
                          d="M 162 181 L 180 181 C 178 192 172 202 162 208 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />

                        {/* External Obliques (Adonis Belt / Flanks) */}
                        <path
                          d="M 132 140 C 124 150 122 164 124 180 C 125 192 128 202 134 210 C 138 206 142 196 140 184 C 138 172 136 156 136 140 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />
                        <path
                          d="M 188 140 C 196 150 198 164 196 180 C 195 192 192 202 186 210 C 182 206 178 196 180 184 C 182 172 184 156 184 140 Z"
                          fill={getMuscleFill('core')}
                          stroke={getMuscleStroke('core')}
                          strokeWidth={getMuscleStrokeWidth('core')}
                          filter={getMuscleFilter('core')}
                        />
                      </g>

                      {/* QUADRICEPS (THIGHS - VASTUS LATERALIS, RECTUS FEMORIS, VASTUS MEDIALIS TEARDROP) */}
                      <g
                        id="anterior-quads"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('quads')}
                        onMouseEnter={() => setHoveredMuscleId('quads')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Thigh */}
                        {/* Vastus Lateralis (Outer Quad Sweep) */}
                        <path
                          d="M 126 214 C 116 226 112 248 112 270 C 112 288 116 304 122 316 C 126 314 128 306 128 296 C 128 274 130 248 132 226 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />
                        {/* Rectus Femoris (Central Quad) */}
                        <path
                          d="M 134 218 C 132 238 132 264 134 286 C 136 298 138 310 142 320 C 144 318 146 308 146 294 C 146 268 146 242 144 222 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />
                        {/* Vastus Medialis (Teardrop above knee) */}
                        <path
                          d="M 146 270 C 146 284 146 296 148 308 C 150 316 154 322 156 322 C 158 318 158 308 156 296 C 154 286 150 276 146 270 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />

                        {/* Right Thigh */}
                        {/* Vastus Lateralis */}
                        <path
                          d="M 194 214 C 204 226 208 248 208 270 C 208 288 204 304 198 316 C 194 314 192 306 192 296 C 192 274 190 248 188 226 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />
                        {/* Rectus Femoris */}
                        <path
                          d="M 186 218 C 188 238 188 264 186 286 C 184 298 182 310 178 320 C 176 318 174 308 174 294 C 174 268 174 242 176 222 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />
                        {/* Vastus Medialis (Teardrop) */}
                        <path
                          d="M 174 270 C 174 284 174 296 172 308 C 170 316 166 322 164 322 C 162 318 162 308 164 296 C 166 286 170 276 174 270 Z"
                          fill={getMuscleFill('quads')}
                          stroke={getMuscleStroke('quads')}
                          strokeWidth={getMuscleStrokeWidth('quads')}
                          filter={getMuscleFilter('quads')}
                        />

                        {/* Kneecaps (Patellae) */}
                        <path d="M 130 324 Q 138 320 146 324 Q 146 332 138 334 Q 130 332 130 324 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <path d="M 174 324 Q 182 320 190 324 Q 190 332 182 334 Q 174 332 174 324 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      </g>

                      {/* CALVES & SHINS (ANTERIOR TIBIALIS & GASTROCNEMIUS FLARES) */}
                      <g
                        id="anterior-calves"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('calves')}
                        onMouseEnter={() => setHoveredMuscleId('calves')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Calf / Tibialis */}
                        <path
                          d="M 128 338 C 122 348 120 362 122 376 C 124 388 128 402 132 416 L 138 416 C 138 400 138 382 138 366 C 138 354 136 344 134 338 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        <path
                          d="M 142 338 C 144 346 148 358 148 370 C 148 384 146 398 144 414 L 140 414 C 140 398 140 382 140 366 C 140 354 141 344 142 338 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />

                        {/* Right Calf / Tibialis */}
                        <path
                          d="M 192 338 C 198 348 200 362 198 376 C 196 388 192 402 188 416 L 182 416 C 182 400 182 382 182 366 C 182 354 184 344 186 338 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        <path
                          d="M 178 338 C 176 346 172 358 172 370 C 172 384 174 398 176 414 L 180 414 C 180 398 180 382 180 366 C 180 354 179 344 178 338 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />

                        {/* Feet / Ankles */}
                        <path d="M 132 418 L 126 438 C 126 442 130 444 136 444 L 144 444 C 146 444 146 440 144 436 L 144 418 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <path d="M 188 418 L 194 438 C 194 442 190 444 184 444 L 176 444 C 174 444 174 440 176 436 L 176 418 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      </g>
                    </g>
                  ) : (
                    /* POSTERIOR (BACK) VIEW */
                    <g id="posterior-musculature">
                      {/* TRAPEZIUS (THE DIAMOND KITE) */}
                      <g
                        id="posterior-trapezius"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('back')}
                        onMouseEnter={() => setHoveredMuscleId('back')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        <path
                          d="M 160 56 L 176 72 L 204 84 L 188 108 L 160 146 L 132 108 L 116 84 L 144 72 Z"
                          fill={getMuscleFill('back')}
                          stroke={getMuscleStroke('back')}
                          strokeWidth={getMuscleStrokeWidth('back')}
                          filter={getMuscleFilter('back')}
                        />
                        {/* Spine divider */}
                        <line x1="160" y1="56" x2="160" y2="146" stroke="#020617" strokeWidth="1.2" />
                      </g>

                      {/* REAR DELTOIDS (POSTERIOR DELTOIDS) */}
                      <g
                        id="posterior-deltoids"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('deltoids')}
                        onMouseEnter={() => setHoveredMuscleId('deltoids')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Rear Delt */}
                        <path
                          d="M 116 84 C 104 85 92 90 88 100 C 86 108 88 118 94 126 C 100 124 106 118 108 110 C 112 100 114 90 116 84 Z"
                          fill={getMuscleFill('deltoids')}
                          stroke={getMuscleStroke('deltoids')}
                          strokeWidth={getMuscleStrokeWidth('deltoids')}
                          filter={getMuscleFilter('deltoids')}
                        />
                        {/* Right Rear Delt */}
                        <path
                          d="M 204 84 C 216 85 228 90 232 100 C 234 108 232 118 226 126 C 220 124 214 118 212 110 C 208 100 206 90 204 84 Z"
                          fill={getMuscleFill('deltoids')}
                          stroke={getMuscleStroke('deltoids')}
                          strokeWidth={getMuscleStrokeWidth('deltoids')}
                          filter={getMuscleFilter('deltoids')}
                        />
                      </g>

                      {/* LATISSIMUS DORSI (V-TAPER WINGS & INFRASPINATUS) */}
                      <g
                        id="posterior-lats"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('back')}
                        onMouseEnter={() => setHoveredMuscleId('back')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Lat Wing */}
                        <path
                          d="M 122 126 C 114 134 112 148 116 166 C 120 178 128 190 138 198 C 142 194 144 182 144 170 C 144 156 142 142 136 132 Z"
                          fill={getMuscleFill('back')}
                          stroke={getMuscleStroke('back')}
                          strokeWidth={getMuscleStrokeWidth('back')}
                          filter={getMuscleFilter('back')}
                        />
                        {/* Right Lat Wing */}
                        <path
                          d="M 198 126 C 206 134 208 148 204 166 C 200 178 192 190 182 198 C 178 194 176 182 176 170 C 176 156 178 142 184 132 Z"
                          fill={getMuscleFill('back')}
                          stroke={getMuscleStroke('back')}
                          strokeWidth={getMuscleStrokeWidth('back')}
                          filter={getMuscleFilter('back')}
                        />

                        {/* Erector Spinae (Lower Back Christmas Tree) */}
                        <path
                          d="M 148 152 C 146 168 146 186 148 204 L 158 206 L 158 152 Z"
                          fill={getMuscleFill('back')}
                          stroke={getMuscleStroke('back')}
                          strokeWidth={getMuscleStrokeWidth('back')}
                          filter={getMuscleFilter('back')}
                        />
                        <path
                          d="M 172 152 C 174 168 174 186 172 204 L 162 206 L 162 152 Z"
                          fill={getMuscleFill('back')}
                          stroke={getMuscleStroke('back')}
                          strokeWidth={getMuscleStrokeWidth('back')}
                          filter={getMuscleFilter('back')}
                        />
                      </g>

                      {/* TRICEPS BRACHII (HORSESHOE & LATERAL HEADS) */}
                      <g
                        id="posterior-triceps"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('triceps')}
                        onMouseEnter={() => setHoveredMuscleId('triceps')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Triceps */}
                        <path
                          d="M 96 128 C 92 136 92 148 94 158 C 98 166 102 168 106 166 C 110 158 110 144 108 130 C 104 129 100 128 96 128 Z"
                          fill={getMuscleFill('triceps')}
                          stroke={getMuscleStroke('triceps')}
                          strokeWidth={getMuscleStrokeWidth('triceps')}
                          filter={getMuscleFilter('triceps')}
                        />
                        {/* Right Triceps */}
                        <path
                          d="M 224 128 C 228 136 228 148 226 158 C 222 166 218 168 214 166 C 210 158 210 144 212 130 C 216 129 220 128 224 128 Z"
                          fill={getMuscleFill('triceps')}
                          stroke={getMuscleStroke('triceps')}
                          strokeWidth={getMuscleStrokeWidth('triceps')}
                          filter={getMuscleFilter('triceps')}
                        />

                        {/* Elbows (Olecranon plates) */}
                        <path d="M 98 166 Q 102 172 106 166" fill="none" stroke="#64748b" strokeWidth="1.5" />
                        <path d="M 214 166 Q 218 172 222 166" fill="none" stroke="#64748b" strokeWidth="1.5" />

                        {/* Posterior Forearms */}
                        <path d="M 96 168 L 94 234 L 102 234 L 106 168 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <path d="M 224 168 L 226 234 L 218 234 L 214 168 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      </g>

                      {/* GLUTEAL COMPLEX & HAMSTRINGS */}
                      <g
                        id="posterior-glutes-hamstrings"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('hamstrings')}
                        onMouseEnter={() => setHoveredMuscleId('hamstrings')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Gluteus Maximus */}
                        <path
                          d="M 158 206 C 144 204 128 208 122 218 C 118 228 120 242 126 252 C 134 258 146 256 158 250 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />
                        {/* Right Gluteus Maximus */}
                        <path
                          d="M 162 206 C 176 204 192 208 198 218 C 202 228 200 242 194 252 C 186 258 174 256 162 250 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />
                        {/* Natal Cleft */}
                        <line x1="160" y1="206" x2="160" y2="252" stroke="#020617" strokeWidth="1.5" />

                        {/* Left Hamstrings (Biceps Femoris & Semitendinosus) */}
                        <path
                          d="M 126 254 C 120 266 118 284 120 302 C 124 314 130 318 134 316 C 136 304 138 290 140 274 C 142 264 142 256 138 254 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />
                        <path
                          d="M 142 254 C 144 266 146 282 148 298 C 150 310 152 316 154 316 C 156 312 156 296 156 280 C 156 266 156 256 154 254 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />

                        {/* Right Hamstrings */}
                        <path
                          d="M 194 254 C 200 266 202 284 200 302 C 196 314 190 318 186 316 C 184 304 182 290 180 274 C 178 264 178 256 182 254 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />
                        <path
                          d="M 178 254 C 176 266 174 282 172 298 C 170 310 168 316 166 316 C 164 312 164 296 164 280 C 164 266 164 256 166 254 Z"
                          fill={getMuscleFill('hamstrings')}
                          stroke={getMuscleStroke('hamstrings')}
                          strokeWidth={getMuscleStrokeWidth('hamstrings')}
                          filter={getMuscleFilter('hamstrings')}
                        />
                      </g>

                      {/* POSTERIOR CALVES (GASTROCNEMIUS DUAL DIAMOND BELLIES & ACHILLES TENDONS) */}
                      <g
                        id="posterior-calves"
                        className="cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedMuscleId('calves')}
                        onMouseEnter={() => setHoveredMuscleId('calves')}
                        onMouseLeave={() => setHoveredMuscleId(null)}
                      >
                        {/* Left Calf Bellies */}
                        <path
                          d="M 128 326 C 122 336 120 350 122 364 C 126 376 132 382 136 380 C 136 368 134 354 132 340 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        <path
                          d="M 138 326 C 140 338 144 352 146 364 C 146 376 142 382 138 380 C 136 368 136 354 136 340 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        {/* Left Achilles Tendon */}
                        <path d="M 134 382 L 134 424 L 140 424 L 140 382 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />

                        {/* Right Calf Bellies */}
                        <path
                          d="M 192 326 C 198 336 200 350 198 364 C 194 376 188 382 184 380 C 184 368 186 354 188 340 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        <path
                          d="M 182 326 C 180 338 176 352 174 364 C 174 376 178 382 182 380 C 184 368 184 354 184 340 Z"
                          fill={getMuscleFill('calves')}
                          stroke={getMuscleStroke('calves')}
                          strokeWidth={getMuscleStrokeWidth('calves')}
                          filter={getMuscleFilter('calves')}
                        />
                        {/* Right Achilles Tendon */}
                        <path d="M 186 382 L 186 424 L 180 424 L 180 382 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />

                        {/* Heels / Soles */}
                        <path d="M 130 424 L 130 440 L 144 440 L 144 424 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <path d="M 190 424 L 190 440 L 176 440 L 176 424 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      </g>
                    </g>
                  )}
                </svg>
              </div>

              {/* Tap feedback indicator */}
              <div className="mt-3 flex items-center justify-between w-full text-[10px] text-slate-400 font-mono px-2">
                <span className="flex items-center gap-1 text-amber-300">
                  <Target className="w-3 h-3" />
                  <span>{selectedMuscle.name}</span>
                </span>
                <span className="text-slate-500 italic">
                  {t('recovery.tapTip', language)}
                </span>
              </div>
            </div>

            {/* Selected Muscle Biomechanical Dossier (Right Side) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-950/85 border border-amber-500/35 space-y-3.5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-roman uppercase font-black text-amber-400/80 tracking-widest block mb-0.5">
                      {t('recovery.selected', language)}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white font-roman flex items-center gap-2">
                      {selectedMuscle.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 italic font-mono">
                      {selectedMuscle.latinName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      {t('recovery.readiness', language)}
                    </span>
                    <span
                      className={`text-2xl font-black mono-font ${
                        selectedMuscle.recoveryPercentage >= 90
                          ? 'text-emerald-400'
                          : selectedMuscle.recoveryPercentage >= 80
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {selectedMuscle.recoveryPercentage}%
                    </span>
                  </div>
                </div>

                {/* Biomechanical progress bar */}
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedMuscle.recoveryPercentage >= 90
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
                        : selectedMuscle.recoveryPercentage >= 80
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                        : 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-300'
                    }`}
                    style={{ width: `${selectedMuscle.recoveryPercentage}%` }}
                  />
                </div>

                {/* Physiology / Function Lore */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{selectedMuscle.functionLore}</span>
                </div>

                {/* Readiness Recommendation */}
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-300 font-roman font-bold">{t('recovery.status', language)}:</strong>{' '}
                  {selectedMuscle.recommendation}
                </div>

                {/* Recovery Timeline Status */}
                {selectedMuscle.hoursToFullRecovery > 0 ? (
                  <div className="text-xs text-amber-300/90 flex items-center gap-2 p-2 rounded-xl bg-amber-950/20 border border-amber-900/40 font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <span>~{selectedMuscle.hoursToFullRecovery}h until full structural supercompensation</span>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-400 flex items-center gap-2 p-2 rounded-xl bg-emerald-950/20 border border-emerald-900/40 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Fully regenerated. Maximum motor unit recruitment threshold ready</span>
                  </div>
                )}

                {/* Target Compound Movements */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-1.5">
                    {t('recovery.targetExercises', language)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMuscle.bestMovements.map((move, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-roman font-bold shadow-sm"
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kinetic Chain Readiness Pill Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('recovery.fresh', language)}
                  </span>
                  <span className="text-base font-black text-emerald-400 mono-font">6 / 9</span>
                  <span className="text-[10px] text-slate-500 block">Optimal Drive</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('recovery.recovering', language)}
                  </span>
                  <span className="text-base font-black text-amber-400 mono-font">3 / 9</span>
                  <span className="text-[10px] text-slate-500 block">In Repair</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('recovery.fatigued', language)}
                  </span>
                  <span className="text-base font-black text-slate-400 mono-font">0 / 9</span>
                  <span className="text-[10px] text-slate-500 block">Exhausted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scorecards List View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(muscleScores).map((muscle) => {
            const isHigh = muscle.recoveryPercentage >= 90;
            const isMid = muscle.recoveryPercentage >= 80 && muscle.recoveryPercentage < 90;

            return (
              <div
                key={muscle.id}
                onClick={() => {
                  setSelectedMuscleId(muscle.id);
                  setViewMode('map');
                }}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/60 transition-all space-y-2.5 cursor-pointer shadow-md group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-amber-300 transition-colors block">
                      {muscle.name}
                    </span>
                    <span className="text-[10px] text-slate-500 italic font-mono">
                      {muscle.latinName}
                    </span>
                  </div>
                  <span
                    className={`font-black mono-font text-sm ${
                      isHigh ? 'text-emerald-400' : isMid ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {muscle.recoveryPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : isMid
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-red-400'
                    }`}
                    style={{ width: `${muscle.recoveryPercentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  {muscle.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
