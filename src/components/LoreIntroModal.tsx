import React from 'react';
import { X, Sparkles, Shield, Flame, Crown, ArrowRight } from 'lucide-react';

interface LoreIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterForge?: () => void;
}

export const LoreIntroModal: React.FC<LoreIntroModalProps> = ({
  isOpen,
  onClose,
  onEnterForge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl glow-emerald overflow-hidden">
        {/* Background glow & Cyber Gorilla watermark */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Ap3xF0rg3"
              className="w-12 h-12 rounded-2xl object-cover border border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  THE AP3XF0RG3 CREED
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Primal Lore
                </span>
              </div>
              <p className="text-xs text-slate-400">Why the Silverback Gorilla is not enough</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Act I */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider text-xs">
              <span>🐒</span> Act I: The Fragile Primate
            </div>
            <p>
              Humans enter the gym weak, hunched over desk monitors, and disconnected from raw biological power. They pick up light dumbbells, swing mindlessly, and dream of raw strength.
            </p>
          </div>

          {/* Act II */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400 uppercase tracking-wider text-xs">
              <span>🦍</span> Act II: The Silverback Paradox
            </div>
            <p>
              They lift heavy, eat in an aggressive surplus, and grow thick slabs of muscle. Soon, they feel like a <strong className="text-white">Silverback Gorilla</strong>. A 400-pound beast capable of breaking branches and bench-pressing massive iron.
            </p>
            <p className="text-cyan-300/90 font-medium italic border-l-2 border-cyan-400 pl-3 my-2">
              "Yet in the wild savannah, a gorilla is still a herbivore primate. When a pride of lions descends, the gorilla is prey. Pure raw bulk without savage conditioning, tactical biomechanics, and relentless heart will always get hunted down."
            </p>
            <p>
              In gym culture, most people plateau at the "gorilla" stage: heavy, slow, out of breath tying their shoes, and vulnerable to fatigue.
            </p>
          </div>

          {/* Act III */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-wider text-xs">
              <span>👑</span> Act III: The Ascension to Apex Predator
            </div>
            <p>
              <strong className="text-white">Ap3xF0rg3</strong> is built to shatter that ceiling. We fuse progressive overload compound science with savage mechanical tension and high-volume hypertrophy.
            </p>
            <p className="text-slate-200 font-semibold">
              You do not stop at the gorilla. You forge your body, your nervous system, and your mental fortitude until you stand at the <strong className="text-emerald-400">ABSOLUTE TOP OF THE FOOD CHAIN</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Beaten by no animal. Beaten by no barbell. Beaten by no obstacle.
            </p>
          </div>

          {/* Evolution Ladder */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl block mb-1">🐒</span>
              <span className="font-bold text-slate-400 block text-[11px]">Chimp</span>
              <span className="text-[10px] text-slate-600">0 - 1.5k kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl block mb-1">🦍</span>
              <span className="font-bold text-cyan-400 block text-[11px]">Gorilla</span>
              <span className="text-[10px] text-slate-500">1.5k - 4k kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl block mb-1">🐅</span>
              <span className="font-bold text-emerald-400 block text-[11px]">Hunter</span>
              <span className="text-[10px] text-slate-500">4k - 7.5k kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/40">
              <span className="text-xl block mb-1">👑</span>
              <span className="font-bold text-purple-400 block text-[11px]">Apex Predator</span>
              <span className="text-[10px] text-purple-300 font-bold">7.5k+ kg</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 italic">
            "Fear no load. Own the food chain."
          </span>

          <button
            onClick={() => {
              if (onEnterForge) onEnterForge();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Take the Oath & Enter Forge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
