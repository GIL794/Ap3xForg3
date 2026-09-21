import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Share2, 
  Crown, 
  LogOut, 
  Menu, 
  X, 
  Dumbbell, 
  Calendar, 
  User, 
  BookOpen, 
  Clock,
  Shield,
  History
} from 'lucide-react';
import { UserProfile, WorkoutDay, TodayWorkout, UserAccount } from '../types';
import { exportPlanAsJson } from '../logic/storage';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  saveLanguage, 
  t 
} from '../logic/i18n';

interface HeaderProps {
  profile: UserProfile;
  weeklyPlan: WorkoutDay[];
  todayWorkout: TodayWorkout;
  currentUser: UserAccount;
  isProSubscriber?: boolean;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onOpenAiCoach: () => void;
  onOpenShare: () => void;
  onOpenAuth: () => void;
  onOpenLore: () => void;
  onOpenPro: () => void;
  onOpenHistory?: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  weeklyPlan,
  todayWorkout,
  currentUser,
  isProSubscriber = false,
  language = 'en',
  onLanguageChange,
  onOpenAiCoach,
  onOpenShare,
  onOpenAuth,
  onOpenLore,
  onOpenPro,
  onOpenHistory,
  onSignOut,
}) => {
  const [londonTimeStr, setLondonTimeStr] = useState<string>('');
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSelectLang = (code: SupportedLanguage) => {
    saveLanguage(code);
    setShowLangMenu(false);
    if (onLanguageChange) onLanguageChange(code);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleExport = () => {
    exportPlanAsJson(profile, weeklyPlan, todayWorkout);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#0c0e17]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <img 
              src="/logo.png" 
              alt="HOMO DEUS Logo" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl object-cover border border-amber-500/40 shadow-md shadow-amber-500/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-black font-roman tracking-wider text-white flex items-center gap-1">
                  HOMO <span className="text-amber-400">DEUS</span>
                </h1>
                <button
                  onClick={onOpenLore}
                  className="hidden md:flex items-center gap-1 text-[10px] font-roman uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
                  title="Read the HOMO DEUS Mythos"
                >
                  <span>📜</span>
                  <span>{t('nav.mythos', language)}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-roman tracking-wider uppercase hidden sm:block">
                Romanvm Impervm • Olympian Strength
              </p>
            </div>
          </div>

          {/* DESKTOP ACTIONS (md+ / ≥768px) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Live Time & Countdown */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-slate-400 font-medium font-roman">Time:</span>
              <span className="mono-font font-bold text-slate-200">{londonTimeStr}</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-semibold font-roman">{profile.targetWorkoutTime} {t('nav.sessionReady', language)}</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold font-roman text-slate-300 transition-colors shadow-sm"
                title="Change Language / Cambia Lingua"
              >
                <span>{currentLangObj.flag}</span>
                <span className="uppercase text-[11px]">{currentLangObj.code}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#0c0e17] border border-amber-500/40 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-roman uppercase font-bold text-slate-400 border-b border-slate-800 mb-1">
                    {t('lang.choose', language)}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLang(lang.code)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-roman transition-colors text-left ${
                        language === lang.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Imperivm Pro Badge Button */}
            <button
              onClick={onOpenPro}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-roman font-bold transition-all shadow-sm ${
                isProSubscriber
                  ? 'bg-gradient-to-r from-amber-500/35 via-yellow-400/35 to-amber-500/35 text-amber-200 hover:text-white border-2 border-amber-400/80 shadow-md shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-white border border-amber-500/40'
              }`}
              title={isProSubscriber ? "Emperor Pro Active" : "Unlock Imperivm Pro"}
            >
              <Crown className={`w-3.5 h-3.5 ${isProSubscriber ? 'text-amber-300 fill-amber-400' : 'text-amber-400'}`} />
              <span>{isProSubscriber ? t('nav.proActive', language) : t('nav.pro', language)}</span>
            </button>

            {/* User Account / Switcher Badge */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold font-roman text-slate-200 transition-all shadow-sm"
              title="Switch User / Account Settings"
            >
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
            </button>

            {/* AI Oracle Coach Action */}
            <button
              onClick={onOpenAiCoach}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-roman font-bold transition-all border border-cyan-500/30 shadow-sm"
              title="Open AI Oracle Coach Advice"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('nav.oracle', language)}</span>
            </button>

            {/* Training Ledger History */}
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white text-xs font-roman font-bold transition-all border border-amber-500/30 shadow-sm"
                title="View Training Ledger & Past History"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('nav.ledger', language)}</span>
              </button>
            )}

            {/* Share Plan */}
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-roman font-bold transition-all border border-slate-800"
              title="Share with Legion & Cloud Sync"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav.share', language)}</span>
            </button>

            {/* Export Plan (JSON) */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-roman font-bold transition-all border border-slate-800"
              title="Download Plan as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JSON</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-roman font-bold transition-all"
              title="Sign Out to Imperial Gate"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* MOBILE ACTIONS (<md / <768px): Lean, no overflow */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Language Toggle */}
            <button
              onClick={() => {
                const nextIndex = (SUPPORTED_LANGUAGES.findIndex(l => l.code === language) + 1) % SUPPORTED_LANGUAGES.length;
                handleSelectLang(SUPPORTED_LANGUAGES[nextIndex].code);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs transition-colors"
              title="Toggle Language"
            >
              <span>{currentLangObj.flag}</span>
            </button>

            {/* Pro Button */}
            <button
              onClick={onOpenPro}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-roman font-bold ${
                isProSubscriber
                  ? 'bg-amber-500/30 text-amber-200 border-2 border-amber-400/80 shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${isProSubscriber ? 'text-amber-300 fill-amber-400' : 'text-amber-400'}`} />
              <span>{isProSubscriber ? t('nav.proActive', language) : t('nav.pro', language)}</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0c0e17] border-l border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header & User Card */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-roman font-bold text-base">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-roman">{currentUser.name}</h3>
                    <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {currentUser.email || 'Olympian Athlete'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => scrollToSection('today-workout')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>{t('today.arena', language)}</span>
                </button>

                <button
                  onClick={() => scrollToSection('weekly-overview')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{t('weekly.title', language)}</span>
                </button>

                <button
                  onClick={() => scrollToSection('profile-configuration')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <span>{t('profile.title', language)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAiCoach();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-cyan-300 hover:bg-slate-800/80 transition-colors border border-cyan-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t('nav.oracle', language)}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                    AI
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPro();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-amber-300 hover:bg-amber-500/10 transition-colors border border-amber-500/30"
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>{isProSubscriber ? t('nav.proActive', language) : t('nav.pro', language)}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                    {isProSubscriber ? 'PRO' : 'VIP'}
                  </span>
                </button>

                {onOpenHistory && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenHistory();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-4 h-4 text-amber-400" />
                      <span>{t('nav.ledger', language)}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                      History
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenLore();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{t('nav.mythos', language)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenShare();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.share', language)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleExport();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.export', language)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold font-roman text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.switchUser', language)}</span>
                </button>
              </nav>

              {/* Language Selection in Drawer */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-roman uppercase font-bold text-slate-400 block mb-2">
                  {t('lang.choose', language)}
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLang(lang.code)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-roman flex items-center justify-center gap-1 border transition-colors ${
                        language === lang.code
                          ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer & Sign Out */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-roman font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.signOut', language)}</span>
              </button>

              <div className="text-center text-[10px] text-slate-500 font-roman">
                HOMO DEUS • London {londonTimeStr}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
