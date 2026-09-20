import React, { useState, useEffect } from 'react';

interface BrandedLoaderProps {
  message?: string;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ message }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    'Vincit qui se vincit...',
    'Forging neuromuscular pathways in the Colosseum...',
    'Calibrating mechanical tension & Olympian landmarks...',
    'Ascending through the XIII Tiers of Divine Ascension...',
    'Uniting mortal intellect with immortal physique...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090d] p-6 text-center animate-in fade-in duration-300">
      {/* Glowing Imperial Ring & Logo */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping opacity-50" />
        <div className="absolute -inset-3 rounded-full border border-amber-500/30 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/10 to-yellow-500/20 blur-xl" />

        <img
          src="/logo.png"
          alt="HOMO DEVS Romanvm Impervm"
          className="relative w-24 h-24 rounded-3xl object-cover border-2 border-amber-400 shadow-2xl shadow-amber-500/30"
        />
      </div>

      {/* Brand Title */}
      <h2 className="text-2xl font-black font-roman tracking-wider text-white mb-2">
        HOMO <span className="text-amber-400">DEVS</span>
      </h2>

      {/* Subtitle / Status message */}
      <p className="text-xs uppercase font-bold font-roman tracking-widest text-amber-400 mb-4">
        {message || 'INITIALIZING OLYMPIAN PROTOCOL'}
      </p>

      {/* Dynamic Roman Quote */}
      <div className="h-6">
        <p className="text-xs text-slate-400 font-roman italic max-w-sm transition-all duration-300 animate-pulse">
          "{quotes[quoteIndex]}"
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-6 border border-amber-500/20">
        <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 rounded-full animate-pulse w-full shadow-sm shadow-amber-400" />
      </div>
    </div>
  );
};
