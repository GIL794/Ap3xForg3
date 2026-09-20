import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Share2, BookOpen, User } from 'lucide-react';
import { UserProfile, WorkoutDay, TodayWorkout, UserAccount } from '../types';
import { exportPlanAsJson } from '../logic/storage';

interface HeaderProps {
  profile: UserProfile;
  weeklyPlan: WorkoutDay[];
  todayWorkout: TodayWorkout;
  currentUser: UserAccount;
  onOpenAiCoach: () => void;
  onOpenShare: () => void;
  onOpenAuth: () => void;
  onOpenLore: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  weeklyPlan,
  todayWorkout,
  currentUser,
  onOpenAiCoach,
  onOpenShare,
  onOpenAuth,
  onOpenLore,
}) => {
  const [londonTimeStr, setLondonTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat('en-GB', {
          timeZone: profile.timezone || 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date());
        setLondonTimeStr(str);
      } catch {
        setLondonTimeStr(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [profile.timezone]);

  const handleExport = () => {
    exportPlanAsJson(profile, weeklyPlan, todayWorkout);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img 
            src="/logo.png" 
            alt="Ap3xF0rg3 Logo" 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-emerald-500/40 shadow-md shadow-emerald-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                AP3X<span className="text-emerald-400">F0RG3</span>
              </h1>
              <button
                onClick={onOpenLore}
                className="hidden xs:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors"
                title="Read the Ap3xF0rg3 Creed"
              >
                <span>📜</span>
                <span>Lore</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Forge yourself from primate strength to true Apex Predator
            </p>
          </div>
        </div>

        {/* Status indicator & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live London Time & 19:00 Status */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-medium">London:</span>
            <span className="mono-font font-bold text-slate-200">{londonTimeStr}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">{profile.targetWorkoutTime} Session Ready</span>
          </div>

          {/* User Account / Switcher Badge */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all shadow-sm"
            title="Switch User / Account Settings"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
          </button>

          {/* AI Coach Action */}
          <button
            onClick={onOpenAiCoach}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/30 shadow-sm"
            title="Open AI Coach Advice"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">AI Coach</span>
          </button>

          {/* Share Plan */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
            title="Share with Friends & Cloud Sync"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Export Plan (JSON) */}
          <button
            onClick={handleExport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
            title="Download Plan as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
