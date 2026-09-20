import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Minus, Volume2, Bell, Zap } from 'lucide-react';

interface RestTimerModalProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds,
  isOpen,
  onClose,
  exerciseName,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [gorillaHype, setGorillaHype] = useState(true);
  const [hypeQuote, setHypeQuote] = useState('');

  const hypeQuotes = [
    '🦍 UNLEASH THE SILVERBACK! Time to move the iron!',
    '👑 LIONS DON\'T WAIT IN THE SAVANNAH. Step up to the rack!',
    '🔥 PURE PRIMAL FOCUS. Leave zero reps in the tank!',
    '⚡ APEX PREDATOR DOMINANCE. Own this set!',
    '🐅 FEAR NO LOAD. The food chain starts with your work ethic!'
  ];

  // Sync when initialSeconds changes
  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(initialSeconds);
      setRemaining(initialSeconds);
      setIsRunning(true);
      setHypeQuote(hypeQuotes[Math.floor(Math.random() * hypeQuotes.length)]);
    }
  }, [initialSeconds, isOpen]);

  // Web Audio synth chime
  const playTone = (freq: number, duration: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = gorillaHype ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext may require user gesture
    }
  };

  const playApexFanfare = () => {
    // 4-note ascending power fanfare
    playTone(523, 0.2); // C5
    setTimeout(() => playTone(659, 0.2), 120); // E5
    setTimeout(() => playTone(784, 0.25), 240); // G5
    setTimeout(() => playTone(1046, 0.6), 380); // C6
  };

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (gorillaHype) {
            playApexFanfare();
          } else {
            playTone(880, 0.5);
            setTimeout(() => playTone(1174, 0.6), 200);
          }
          setHypeQuote(hypeQuotes[Math.floor(Math.random() * hypeQuotes.length)]);
          return 0;
        }
        if (prev === 4 || prev === 3 || prev === 2) {
          playTone(520, 0.15);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, gorillaHype]);

  if (!isOpen) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 100;

  const addSeconds = (amt: number) => {
    setTotalSeconds((t) => Math.max(10, t + amt));
    setRemaining((r) => Math.max(0, r + amt));
  };

  const resetTimer = () => {
    setRemaining(totalSeconds);
    setIsRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-sm rounded-3xl bg-slate-900 border p-6 shadow-2xl text-center transition-all ${
        gorillaHype 
          ? 'border-emerald-500/40 glow-emerald shadow-emerald-500/10' 
          : 'border-slate-700/60 glow-cyan'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close timer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center justify-center gap-2 mb-1 text-xs font-black uppercase tracking-wider">
          {gorillaHype ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span>🦍</span> Apex Rest Stopwatch
            </span>
          ) : (
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Standard Rest Stopwatch
            </span>
          )}
        </div>

        {exerciseName && (
          <p className="text-xs text-slate-400 truncate px-4 mb-3 font-medium">
            Next set: <span className="text-slate-100 font-bold">{exerciseName}</span>
          </p>
        )}

        {/* Circular Progress & Display */}
        <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-800"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 ease-linear ${
                gorillaHype ? 'stroke-emerald-400' : 'stroke-cyan-500'
              }`}
              strokeWidth="7"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black mono-font tracking-tight text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] font-bold mt-1 tracking-wider uppercase text-slate-400">
              {remaining === 0 ? 'GO TIME! 🔥' : 'REST INTERVAL'}
            </span>
          </div>
        </div>

        {/* Hype Quote Alert */}
        {remaining === 0 && (
          <div className="my-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-bounce">
            {hypeQuote}
          </div>
        )}

        {/* Quick adjustment buttons */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={() => addSeconds(-15)}
            disabled={remaining <= 15}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 disabled:opacity-30"
          >
            <Minus className="w-3 h-3" /> 15s
          </button>
          {[60, 90, 120].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setTotalSeconds(preset);
                setRemaining(preset);
                setIsRunning(true);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                totalSeconds === preset
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {preset}s
            </button>
          ))}
          <button
            onClick={() => addSeconds(15)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> 15s
          </button>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Resume
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>

        {/* Primal Gorilla Mode Toggle */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <button
            onClick={() => setGorillaHype(!gorillaHype)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-bold ${
              gorillaHype
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <span>🦍</span>
            <span>Primal Fanfare {gorillaHype ? 'ON' : 'OFF'}</span>
          </button>

          <span className="flex items-center gap-1 text-slate-500">
            <Volume2 className="w-3.5 h-3.5" /> Audio Chimes
          </span>
        </div>
      </div>
    </div>
  );
};
