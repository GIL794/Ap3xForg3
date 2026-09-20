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
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0e17] border-2 border-amber-500/40 shadow-2xl glow-gold overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="HOMO DEVS"
              className="w-12 h-12 rounded-2xl object-cover border border-amber-400 shadow-md shadow-amber-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-roman text-white tracking-wider">
                  THE HOMO DEVS MYTHOS
                </h3>
                <span className="text-[10px] font-roman uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Romanvm Impervm
                </span>
              </div>
              <p className="text-xs text-slate-400 font-roman">The Silverback Paradox & The Path to Divine Ascension</p>
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
            <div className="flex items-center gap-2 font-bold text-amber-400 font-roman uppercase tracking-wider text-xs">
              <span>🏛️</span> Act I: The Fragile Mortal (Tiro)
            </div>
            <p>
              Mortals enter the gym unconditioned, sedentary, and disconnected from raw Olympian power. They swing weights aimlessly, mimic fleeting trends, and struggle against biological inertia.
            </p>
          </div>

          {/* Act II */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 font-roman uppercase tracking-wider text-xs">
              <span>🦍</span> Act II: The Silverback Paradox
            </div>
            <p>
              They lift, eat in surplus, and add raw muscle. Soon they feel like a <strong className="text-white">Silverback Gorilla</strong> — 400 pounds of muscle capable of snapping branches and moving iron.
            </p>
            <p className="text-amber-200 font-medium italic border-l-2 border-amber-400 pl-3 my-2 font-roman">
              "Yet in the wild savannah, a gorilla is still prey. When night falls, the solitary leopard and the lion pride strike without mercy. Raw mass without predatory tactical speed, cardiovascular fortitude, and strategic intelligence will always be hunted down."
            </p>
            <p>
              Most gym lifters plateau at this stage: heavy, breathless tying their shoes, and vulnerable to fatigue and plateaus.
            </p>
          </div>

          {/* Act III */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-amber-950/40 border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 font-roman uppercase tracking-wider text-xs">
              <span>👑</span> Act III: The Ascension to HOMO DEVS
            </div>
            <p>
              <strong className="text-white font-roman">HOMO DEVS</strong> shatters that ceiling. We synthesize progressive overload compound science, autoregulated bio-recovery, and relentless mechanical tension.
            </p>
            <p className="text-slate-200 font-semibold font-roman">
              We do not stop at the beast. We unite human intelligence with the eternal aesthetics and power of Roman champions and Olympian gods: <strong className="text-amber-400 font-roman">HOMO DEVS — A God Among Mortals</strong>.
            </p>
            <p className="text-xs text-slate-400 italic">
              Beaten by no predator. Beaten by no barbell. Beaten by no obstacle.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 italic font-roman">
            "Vincit qui se vincit"
          </span>

          <button
            onClick={() => {
              if (onEnterForge) onEnterForge();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-roman font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>Swear the Oath & Enter The Imperivm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
