import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Shield, Zap, Flame, Award } from 'lucide-react';

interface ImperivmProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
}

export const ImperivmProModal: React.FC<ImperivmProModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = (plan: 'monthly' | 'lifetime') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(`Welcome to HOMO DEVS Imperivm Pro! Plan: ${plan === 'lifetime' ? 'Lifetime Emperor' : 'Monthly Pro'}`);
      if (onUpgradeSuccess) {
        onUpgradeSuccess();
      }
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    }, 1200);
  };

  const PRO_PERKS = [
    {
      title: 'Live Oracle AI Exercise Physiologist',
      description: 'Real-time Gemini Flash 2.0 intelligence for dynamic fatigue analysis, injury swaps, and nutrition adjustments.',
    },
    {
      title: 'Full 3D Bio-Recovery & Fatigue Heatmap',
      description: 'Algorithmic muscle readiness scores preventing overtraining and pinpointing optimal progressive overload windows.',
    },
    {
      title: 'Divine Ascension Tiers XI — XIII',
      description: 'Unlock Poseidon, Jupiter, and the ultimate HOMO DEVS rank with custom imperial badges and ceremonial fanfares.',
    },
    {
      title: 'Unlimited Cloud Sync & Multi-Device Ledger',
      description: 'Seamlessly access and synchronize all your workout logs across iPhone, Android, iPad, and desktop.',
    },
    {
      title: 'Imperial PDF Scrolls & Training Certificates',
      description: 'Export pristine Roman-styled workout scrolls and proof of strength achievements.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Decorative Laurel Banner Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-amber-950/40 via-[#10131f] to-[#0c0e17] border-b border-amber-500/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 mb-3">
            <Crown className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h3 className="text-2xl font-black text-white font-roman tracking-wider uppercase">
            HOMO DEVS <span className="text-amber-400">IMPERIVM PRO</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 font-roman">
            Ascend to the highest echelon of strength. Unlock the complete Olympian arsenal.
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Success notification */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-center font-roman font-bold text-sm">
              ✨ {successMessage}
            </div>
          )}

          {/* Pricing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Pro Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg glow-gold'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-roman uppercase font-black text-slate-300 tracking-wider">
                  Regular Pro
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase">
                  Monthly Pass
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mono-font flex items-baseline gap-1">
                <span className="text-amber-300">£4.99</span>
                <span className="text-xs text-slate-400 font-sans">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Full access to Live Oracle AI, Bio-Recovery gauge, and cloud synchronization. Cancel anytime.
              </p>
            </div>

            {/* Lifetime Emperor Plan */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                selectedPlan === 'lifetime'
                  ? 'border-amber-400 bg-amber-950/30 shadow-xl glow-gold'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Best Value • Lifetime
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-roman uppercase font-black text-amber-300 tracking-wider">
                  Emperor Lifetime
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  One-Time
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mono-font flex items-baseline gap-1">
                <span className="text-amber-300">£99.99</span>
                <span className="text-xs text-emerald-400 font-sans font-bold">forever</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-2">
                Eternal membership. Never pay another subscription fee. Includes all future Olympian expansions.
              </p>
            </div>
          </div>

          {/* Perks List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-amber-400 font-roman tracking-wider">
              Included in Imperivm Pro
            </h4>
            <div className="space-y-2.5">
              {PRO_PERKS.map((perk, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block font-roman">
                      {perk.title}
                    </strong>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Checkout Action */}
        <div className="p-5 sm:p-6 bg-slate-950 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>🔒 Encrypted 256-bit checkout • Instant activation</span>
          </div>

          <button
            onClick={() => handleCheckout(selectedPlan)}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-roman font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>
                  {selectedPlan === 'lifetime'
                    ? 'Ascend with Lifetime Emperor — £99.99'
                    : 'Claim Imperivm Pro — £4.99/mo'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
