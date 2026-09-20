import React, { useState, useEffect } from 'react';

interface BrandedLoaderProps {
  message?: string;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ message }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    'Forging neuromuscular pathways...',
    'Calibrating mechanical tension & RPE landmarks...',
    'Awakening primal instincts in the iron jungle...',
    'Simulating hypertrophic stimulus-to-fatigue ratio...',
    'Ascending beyond the Silverback to Apex Predator...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d16] p-6 text-center animate-in fade-in duration-300">
      {/* Glowing Energy Ring & Logo */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping opacity-50" />
        <div className="absolute -inset-3 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: '6s' }} />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-500/10 to-emerald-500/20 blur-xl" />

        <img
          src="/logo.png"
          alt="Ap3xF0rg3 Cyber Gorilla"
          className="relative w-24 h-24 rounded-3xl object-cover border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30"
        />
      </div>

      {/* Brand Title */}
      <h2 className="text-2xl font-black tracking-tight text-white mb-2">
        AP3X<span className="text-emerald-400">F0RG3</span>
      </h2>

      {/* Subtitle / Status message */}
      <p className="text-xs uppercase font-bold tracking-wider text-emerald-400 mono-font mb-4">
        {message || 'INITIALIZING PROTOCOL'}
      </p>

      {/* Dynamic Lore Quote */}
      <div className="h-6">
        <p className="text-xs text-slate-400 italic max-w-sm transition-all duration-300 animate-pulse">
          "{quotes[quoteIndex]}"
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-6 border border-slate-800">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 rounded-full animate-pulse w-full" />
      </div>
    </div>
  );
};
