import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Share2, Crown, LogOut, User } from 'lucide-react';
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
  onOpenPro: () => void;
  onSignOut: () => void;
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
  onOpenPro,
  onSignOut,
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
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#0c0e17]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img 
            src="/logo.png" 
            alt="HOMO DEVS Logo" 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-black font-roman tracking-wider text-white flex items-center gap-1">
                HOMO <span className="text-amber-400">DEVS</span>
              </h1>
              <button
                onClick={onOpenLore}
                className="hidden xs:flex items-center gap-1 text-[10px] font-roman uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
                title="Read the HOMO DEVS Mythos"
              >
                <span>📜</span>
                <span>Mythos</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-roman tracking-wider uppercase hidden sm:block">
              Romanvm Impervm • Olympian Strength
            </p>
          </div>
        </div>

        {/* Status indicator & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live London Time & 19:00 Status */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-slate-400 font-medium font-roman">Time:</span>
            <span className="mono-font font-bold text-slate-200">{londonTimeStr}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-semibold font-roman">{profile.targetWorkoutTime} Session Ready</span>
          </div>

          {/* Imperivm Pro Badge Button */}
          <button
            onClick={onOpenPro}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-roman font-bold transition-all shadow-sm"
            title="Unlock Imperivm Pro"
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pro</span>
          </button>

          {/* User Account / Switcher Badge */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold font-roman text-slate-200 transition-all shadow-sm"
            title="Switch User / Account Settings"
          >
            <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
          </button>

          {/* AI Oracle Coach Action */}
          <button
            onClick={onOpenAiCoach}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-roman font-bold transition-all border border-cyan-500/30 shadow-sm"
            title="Open AI Oracle Coach Advice"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Oracle</span>
          </button>

          {/* Share Plan */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-roman font-bold transition-all border border-slate-800"
            title="Share with Legion & Cloud Sync"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Export Plan (JSON) */}
          <button
            onClick={handleExport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-roman font-bold transition-all border border-slate-800"
            title="Download Plan as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-roman font-bold transition-all"
            title="Sign Out to Imperial Gate"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
