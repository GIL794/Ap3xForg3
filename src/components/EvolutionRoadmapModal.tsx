import React from 'react';
import { X, Crown, Zap, Check, Lock, Shield, Sparkles } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

export interface AscensionTier {
  tierNumber: number;
  romanNumeral: string;
  name: string;
  mythos: string;
  emoji: string;
  minKg: number;
  maxKg: number;
  badge: string;
  lore: string;
  color: string;
  glow: string;
}

export const ASCENSION_TIERS: AscensionTier[] = [
  {
    tierNumber: 1,
    romanNumeral: 'I',
    name: 'Tiro',
    mythos: 'Plebeian Recruit',
    emoji: '🏛️',
    minKg: 0,
    maxKg: 25000,
    badge: 'Mortal Initiate',
    lore: 'Mortal flesh, raw and untested. You step onto the marble sand of the gymnasium lifting your first barbell. Every Olympian was once a recruit.',
    color: 'border-slate-700 bg-slate-900/60 text-slate-300',
    glow: 'shadow-slate-500/10',
  },
  {
    tierNumber: 2,
    romanNumeral: 'II',
    name: 'Hastatus',
    mythos: 'Legionary Initiate',
    emoji: '⚔️',
    minKg: 25000,
    maxKg: 75000,
    badge: 'Frontline Iron',
    lore: 'Frontline spearman. You wield weights with military discipline and pristine form. Tendons adapting to the mechanical forge.',
    color: 'border-amber-700/40 bg-amber-950/20 text-amber-300',
    glow: 'shadow-amber-700/10',
  },
  {
    tierNumber: 3,
    romanNumeral: 'III',
    name: 'Centurion',
    mythos: 'Forge Veteran',
    emoji: '🛡️',
    minKg: 75000,
    maxKg: 200000,
    badge: 'Legion Commander',
    lore: 'Leader of the century. You command respect in the squat rack, moving iron with surgical composure and unwavering grit.',
    color: 'border-amber-600/40 bg-amber-950/25 text-amber-200',
    glow: 'shadow-amber-600/15',
  },
  {
    tierNumber: 4,
    romanNumeral: 'IV',
    name: 'Gladiator Primus',
    mythos: 'Colosseum Champion',
    emoji: '🗡️',
    minKg: 200000,
    maxKg: 450000,
    badge: 'Arena Conqueror',
    lore: 'Tens of thousands roaring in the Flavian Amphitheatre. You triumph over high-volume fatigue, earning the rudis of freedom.',
    color: 'border-orange-500/40 bg-orange-950/30 text-orange-200',
    glow: 'shadow-orange-500/15',
  },
  {
    tierNumber: 5,
    romanNumeral: 'V',
    name: 'Spartan Vanguard',
    mythos: 'Leonidas Discipline',
    emoji: '🏺',
    minKg: 450000,
    maxKg: 850000,
    badge: 'Thermopylae Will',
    lore: '300 warriors in your soul. Unyielding phalanx core stability, iron legs, and refusal to surrender a single repetition to failure.',
    color: 'border-red-500/40 bg-red-950/25 text-red-200',
    glow: 'shadow-red-500/20',
  },
  {
    tierNumber: 6,
    romanNumeral: 'VI',
    name: 'Hermes / Atalanta',
    mythos: 'Fleet-Footed Titans',
    emoji: '🪽',
    minKg: 850000,
    maxKg: 1500000,
    badge: 'Winged Agility',
    lore: 'Swift messenger god and undefeated huntress. Explosive fast-twitch motor units, blistering athletic conditioning, and flawless agility.',
    color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200',
    glow: 'shadow-cyan-500/20',
  },
  {
    tierNumber: 7,
    romanNumeral: 'VII',
    name: 'Ares / Bellona',
    mythos: 'War Sovereign',
    emoji: '🩸',
    minKg: 1500000,
    maxKg: 2500000,
    badge: 'Gods of Battle',
    lore: 'The unyielding spirit of war. You tear through plateaus like siege engines through city walls. High-intensity mechanical tension.',
    color: 'border-rose-500/50 bg-rose-950/30 text-rose-200',
    glow: 'shadow-rose-500/25',
  },
  {
    tierNumber: 8,
    romanNumeral: 'VIII',
    name: 'Apollo / Artemis',
    mythos: 'Sun God & Golden Huntress',
    emoji: '🏹',
    minKg: 2500000,
    maxKg: 4000000,
    badge: 'Golden Harmony',
    lore: 'Chiseled 3D deltoids, powerful posterior chain, and sunlit athletic symmetry. Your physique begins to transcend mortal limitations.',
    color: 'border-yellow-500/50 bg-yellow-950/30 text-yellow-200',
    glow: 'shadow-yellow-500/25',
  },
  {
    tierNumber: 9,
    romanNumeral: 'IX',
    name: 'Adonis / Aphrodite',
    mythos: 'Divine Golden Ratio',
    emoji: '💎',
    minKg: 4000000,
    maxKg: 6500000,
    badge: 'Supreme Symmetry',
    lore: 'The golden ratio embodied in living marble. Perfect waist-to-shoulder proportion, sculpted core, and aesthetic divinity admired across the empire.',
    color: 'border-emerald-400/60 bg-emerald-950/30 text-emerald-200',
    glow: 'shadow-emerald-400/25',
  },
  {
    tierNumber: 10,
    romanNumeral: 'X',
    name: 'Hercules / Hera',
    mythos: 'Titan of 12 Labors',
    emoji: '🦁',
    minKg: 6500000,
    maxKg: 10000000,
    badge: 'Olympian Colossus',
    lore: 'Crushing the Nemean lion and bearing the celestial sphere. Unmatched compound deadlift power and unbreakable structural density.',
    color: 'border-amber-400/70 bg-amber-950/40 text-amber-100',
    glow: 'shadow-amber-400/30 glow-gold',
  },
  {
    tierNumber: 11,
    romanNumeral: 'XI',
    name: 'Poseidon / Amphitrite',
    mythos: 'The Earth-Shaker',
    emoji: '🔱',
    minKg: 10000000,
    maxKg: 15000000,
    badge: 'Abyssal Titan',
    lore: 'Earth tremors with every barbell drop. Deep colossal squats and back density that commands oceans. You possess oceanic reserves of power.',
    color: 'border-teal-400/70 bg-teal-950/40 text-teal-100',
    glow: 'shadow-teal-400/30',
  },
  {
    tierNumber: 12,
    romanNumeral: 'XII',
    name: 'Jupiter / Minerva',
    mythos: 'Sovereign of Olympus',
    emoji: '⚡',
    minKg: 15000000,
    maxKg: 25000000,
    badge: 'Thunder Sovereign',
    lore: 'Thunderbolts in your hands, divine tactical intelligence in your mind. The supreme rulers of Mount Olympus acknowledge you as their equal.',
    color: 'border-purple-400/80 bg-purple-950/50 text-purple-100',
    glow: 'shadow-purple-400/35 glow-imperial',
  },
  {
    tierNumber: 13,
    romanNumeral: 'XIII',
    name: 'HOMO DEVS',
    mythos: 'Living Deity of Iron',
    emoji: '👑',
    minKg: 25000000,
    maxKg: Infinity,
    badge: 'God Among Mortals',
    lore: 'TRANSCENDENCE ABSOLUTE. Mortal limits obliterated. You have fused human intellect with the eternal physique of Greco-Roman gods. An immortal legacy carved into history.',
    color: 'border-amber-300 bg-gradient-to-br from-amber-950/80 via-slate-900 to-purple-950/60 text-amber-100',
    glow: 'shadow-amber-300/40 glow-apex ring-1 ring-amber-400/60',
  },
];

interface EvolutionRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTonnageKg: number;
  language?: SupportedLanguage;
}

export const EvolutionRoadmapModal: React.FC<EvolutionRoadmapModalProps> = ({
  isOpen,
  onClose,
  totalTonnageKg,
  language = 'en',
}) => {
  if (!isOpen) return null;

  const romanAmphorae = Math.round(totalTonnageKg / 26); // 1 Roman amphora ~ 26 kg
  const currentTier = ASCENSION_TIERS.find(
    (t) => totalTonnageKg >= t.minKg && totalTonnageKg < t.maxKg
  ) || ASCENSION_TIERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0d0f17] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-roman tracking-wider flex items-center gap-2">
                {t('roadmap.title', language)}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{t('history.lifetimeTonnage', language)}: <strong className="text-amber-400 mono-font">{totalTonnageKg.toLocaleString()} kg</strong></span>
                <span>•</span>
                <span>🏺 <strong className="text-amber-300 mono-font">{romanAmphorae.toLocaleString()}</strong> {t('ascension.amphorae', language)}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold font-roman">{t('roadmap.rank', language)}: {currentTier.name} ({currentTier.romanNumeral})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 13-Tier Roadmap List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {ASCENSION_TIERS.map((tier) => {
            const isUnlocked = totalTonnageKg >= tier.minKg;
            const isCurrent = totalTonnageKg >= tier.minKg && totalTonnageKg < tier.maxKg;

            return (
              <div
                key={tier.tierNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-2 border-amber-400 bg-slate-900/90 shadow-xl glow-gold'
                    : isUnlocked
                    ? `${tier.color} opacity-95`
                    : 'border-slate-800/60 bg-slate-950/40 opacity-40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0 p-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                      {tier.emoji}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-amber-500 font-roman tracking-wider">
                          {language === 'la' ? `Gradus ${tier.romanNumeral} / XIII` : `${t('ascension.level', language)} ${tier.tierNumber} / 13 • Tier ${tier.romanNumeral}`}
                        </span>
                        <h4 className="text-sm font-black text-white font-roman tracking-wide">
                          {tier.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 italic">
                          ({tier.mythos})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-800/80 text-amber-300 border border-amber-500/20">
                          {tier.badge}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-amber-400 text-slate-950 animate-pulse font-roman">
                            {t('roadmap.currentStanding', language)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 italic mb-2 leading-relaxed">
                        "{tier.lore}"
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mono-font">
                        <span>
                          {t('roadmap.requiredVolume', language)}: {tier.minKg.toLocaleString()} kg {tier.maxKg !== Infinity ? `- ${tier.maxKg.toLocaleString()} kg` : '+'}
                        </span>
                        <span>•</span>
                        <span className="text-amber-400/80">
                          ~{Math.round(tier.minKg / 26).toLocaleString()} {t('ascension.amphorae', language)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    {isUnlocked ? (
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 italic font-roman text-center sm:text-left">
            {t('roadmap.vincit', language)}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
          >
            {t('roadmap.close', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EVOLUTION_TIERS = ASCENSION_TIERS;
