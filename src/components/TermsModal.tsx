import React from 'react';
import { X, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-roman text-white">Terms of Service</h3>
              <p className="text-xs text-slate-400 font-roman">HOMO DEUS • Gym Safety & Usage Terms</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 mb-0.5 text-xs font-roman">Medical & Physical Health Disclaimer:</strong>
              Weightlifting and physical conditioning carry inherent risk of injury. Always perform warm-up sets, follow proper form, and consult with a licensed medical professional before undertaking any rigorous exercise program.
            </div>
          </div>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">1. Service Description</h4>
            <p>
              HOMO DEUS provides computational workout scheduling, barbell plate loading assistance, bio-recovery analytics, and progress tracking tools for personal training use.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">2. User Responsibility</h4>
            <p>
              Athletes are solely responsible for selecting safe working loads, checking gym equipment integrity, and listening to biological pain cues. HOMO DEUS is not liable for injury or property damage incurred while executing exercises.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">3. Imperivm Pro Subscriptions</h4>
            <p>
              Imperivm Pro subscriptions (£4.99/mo or £99.99 Lifetime) grant premium access to Live Oracle AI, 3D bio-recovery heatmaps, and cloud sync. Monthly passes may be canceled anytime.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">4. Corporate Ownership & Contact</h4>
            <p>
              HOMO DEUS is a proprietary fitness product of <strong>Kyrvyn Ltd</strong> (Company No. 17246800, England & Wales, <a href="https://kyrvynltd.co.uk" target="_blank" rel="noreferrer" className="text-amber-400 underline">kyrvynltd.co.uk</a>). For all commercial, technical, and legal inquiries, contact <strong className="text-slate-200">contact@kyrvynltd.co.uk</strong>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-bold text-xs"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};
