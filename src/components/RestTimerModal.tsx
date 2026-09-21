import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Minus, Volume2, Bell, Crown, Sparkles } from 'lucide-react';
import { SupportedLanguage, t } from '../logic/i18n';

interface RestTimerModalProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
  language?: SupportedLanguage;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds,
  isOpen,
  onClose,
  exerciseName,
  language = 'en',
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [imperialHype, setImperialHype] = useState(true);
  const [hypeQuote, setHypeQuote] = useState('');

  const hypeQuotes = [
    '🏛️ VIRTUS ET GLORIA. Step into the arena!',
    '⚡ BY THE THUNDER OF JUPITER. Shatter this set!',
    '🦁 HERCULEAN STRENGTH. Leave zero reps in reserve!',
    '⚔️ SPARTAN DISCIPLINE. Pain is fleeting, glory is eternal!',
    '👑 STAND AMONG THE GODS. Own the barbell!'
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
      osc.type = imperialHype ? 'triangle' : 'sine';
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

  const playImperialFanfare = () => {
    // 4-note ascending imperial victory fanfare
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
          if (imperialHype) {
            playImperialFanfare();
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
  }, [isRunning, isOpen, imperialHype]);

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
      <div className={`relative w-full max-w-sm rounded-3xl bg-[#0c0e17] border-2 p-6 shadow-2xl text-center transition-all ${
        imperialHype 
          ? 'border-amber-500/40 glow-gold shadow-amber-500/10' 
          : 'border-slate-800'
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
        <div className="flex items-center justify-center gap-2 mb-1 text-xs font-roman font-black uppercase tracking-wider">
          {imperialHype ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" /> Olympian Rest Stopwatch
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Standard Rest Stopwatch
            </span>
          )}
        </div>

        {exerciseName && (
          <p className="text-xs text-slate-400 truncate px-4 mb-3 font-medium">
            Next set: <span className="text-amber-200 font-bold font-roman">{exerciseName}</span>
          </p>
        )}

        {/* Circular Progress & Display */}
        <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-900"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 ease-linear ${
                imperialHype ? 'stroke-amber-400' : 'stroke-cyan-500'
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
            <span className="text-[11px] font-bold mt-1 tracking-wider uppercase text-amber-400 font-roman">
              {remaining === 0 ? 'GO TIME! 🔥' : 'REST INTERVAL'}
            </span>
          </div>
        </div>

        {/* Hype Quote Alert */}
        {remaining === 0 && (
          <div className="my-2 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-roman font-bold animate-bounce">
            {hypeQuote}
          </div>
        )}

        {/* Quick adjustment buttons */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={() => addSeconds(-15)}
            disabled={remaining <= 15}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1 disabled:opacity-30 border border-slate-800"
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
              className={`px-2.5 py-1 text-xs rounded-lg font-bold font-roman transition-colors ${
                totalSeconds === preset
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {preset}s
            </button>
          ))}
          <button
            onClick={() => addSeconds(15)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-800"
          >
            <Plus className="w-3 h-3" /> 15s
          </button>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3 rounded-2xl font-black font-roman flex items-center gap-2 shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> {t('timer.pause', language)}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> {t('timer.resume', language)}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-roman font-bold transition-colors border border-slate-800"
          >
            {t('timer.done', language)}
          </button>
        </div>

        {/* Imperial Horn Mode Toggle */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <button
            onClick={() => setImperialHype(!imperialHype)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-roman font-bold ${
              imperialHype
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Imperial Fanfare {imperialHype ? 'ON' : 'OFF'}</span>
          </button>

          <span className="flex items-center gap-1 text-slate-500 font-roman">
            <Volume2 className="w-3.5 h-3.5" /> Chimes Active
          </span>
        </div>
      </div>
    </div>
  );
};
