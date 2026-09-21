import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Server, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-roman text-white">Privacy Policy</h3>
              <p className="text-xs text-slate-400 font-roman">HOMO DEVS • Effective Date: September 2026</p>
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
          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" /> 1. Introduction & Scope
            </h4>
            <p>
              HOMO DEVS ("we", "our", or "the App") respects your personal privacy. This policy outlines how we handle athlete information when you use our workout generator and progress tracking engine.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-400" /> 2. Information We Collect
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
              <li><strong className="text-slate-200">Athlete Profile Data:</strong> Athlete codename, fitness experience level, mythological archetype, primary and secondary goals, and target training times.</li>
              <li><strong className="text-slate-200">Workout & Performance Logs:</strong> Working set weights, repetitions, set types, logged tonnage, and customised exercise splits.</li>
              <li><strong className="text-slate-200">Authentication Information:</strong> If you sign in via Google OAuth, we receive your basic public profile information (name, email address, and profile picture avatar) solely to authenticate your athlete account.</li>
            </ul>
          </section>

          <section className="space-y-1.5 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-300 font-roman flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-amber-400" /> 3. Google API Services & Limited Use Policy
            </h4>
            <p>
              HOMO DEVS' use and transfer to any other app of information received from Google APIs adheres strictly to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements.
            </p>
            <p className="text-slate-400 mt-1">
              We do <strong>NOT</strong> sell, rent, commercialize, or transfer your personal or Google user data to advertising platforms, data brokers, or third-party marketing services.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">4. Data Storage, Security & Isolation</h4>
            <p>
              Athlete data is strictly partitioned by user ID. Workouts and logged weights are stored in secure local storage and, when cloud sync is enabled, in an enterprise-grade Supabase PostgreSQL instance protected by Row Level Security (RLS) policies ensuring users can only access their own private records.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-roman">5. Your Rights & Data Deletion</h4>
            <p>
              You maintain full control over your workout records. You can reset your profile, switch athlete accounts, or purge all locally cached data at any time directly through the app interface. To request full deletion of any cloud-synced account data, contact our team.
            </p>
          </section>

          <section className="space-y-1.5 pt-2 border-t border-slate-800 flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Privacy inquiries & Data Officer: <strong className="text-slate-200">privacy@homodevs.app</strong></span>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-roman font-bold text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
