import React, { useState, useEffect } from 'react';
import { Timer, Plus, FastForward, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface FloatingRestTimerProps {
  initialSeconds: number;
  exerciseName?: string;
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export const FloatingRestTimer: React.FC<FloatingRestTimerProps> = ({
  initialSeconds,
  exerciseName,
  isOpen,
  onClose,
  onExpand,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Sync when triggered with new initialSeconds
  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(initialSeconds);
      setRemaining(initialSeconds);
      setIsRunning(true);
    }
  }, [initialSeconds, isOpen]);

  // Web Audio Synth chime
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      
      // Secondary pleasant harmony
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1046, ctx.currentTime); // C6
          gain2.gain.setValueAtTime(0.2, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.6);
        } catch {
          // ignore
        }
      }, 150);
    } catch {
      // AudioContext needs interaction
    }
  };

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          playChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, isMuted]);

  if (!isOpen) return null;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isFinished = remaining === 0;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 100;

  const handleAdjust = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTotalSeconds((t) => Math.max(10, t + delta));
    setRemaining((r) => Math.max(0, r + delta));
    if (remaining <= 0) {
      setIsRunning(true);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemaining(0);
    setIsRunning(false);
    playChime();
    setTimeout(() => onClose(), 800);
  };

  return (
    <aside 
      aria-label="Active Rest Timer"
      className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-45 w-[94%] max-w-md animate-in slide-in-from-bottom-5 duration-200"
    >
      <div 
        onClick={onExpand}
        className={`relative overflow-hidden cursor-pointer rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 p-3 sm:p-3.5 flex items-center justify-between gap-3 ${
          isFinished 
            ? 'bg-emerald-950/90 border-emerald-500 shadow-emerald-500/20 glow-emerald'
            : 'bg-[#0c0e17]/95 border-amber-500/40 hover:border-amber-500 shadow-amber-500/10 glow-gold'
        }`}
      >
        {/* Animated Progress Bar under the card */}
        <div 
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Left: Timer display & Exercise Label */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
            isFinished
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}>
            <Timer className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-lg sm:text-xl font-black mono-font tracking-tight ${
                isFinished ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className={`text-[10px] font-roman uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                isFinished 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isFinished ? 'Rest Done! Lift!' : 'Resting'}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate max-w-[150px] sm:max-w-[200px]">
              {exerciseName || 'Next Working Set'}
            </p>
          </div>
        </div>

        {/* Right: Quick floor controls */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => handleAdjust(30, e)}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-amber-300 hover:text-white text-xs font-bold font-roman transition-colors flex items-center gap-0.5"
            title="Add 30 seconds"
          >
            <Plus className="w-3 h-3" />
            <span>30s</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold font-roman transition-colors flex items-center gap-1"
            title="Skip rest"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Skip</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute timer' : 'Mute timer'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onExpand}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Expand to Fullscreen Timer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            title="Dismiss rest bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
