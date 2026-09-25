import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, WorkoutDay, TodayWorkout, UserAccount } from './types';
import { 
  getActiveUserId, 
  loadUserState, 
  saveUserState, 
  signOutAthlete,
  initSupabaseAuthListener,
  isLifetimeVipUser,
  checkRemoteEntitlement,
  DEFAULT_GABRIELE_ACCOUNT,
  getAllUserAccounts 
} from './logic/auth';
import { generateWeeklyPlan, personalizeExercise } from './logic/planGenerator';
import { resolveTodayWorkout } from './logic/todayDetector';
import { parseSharedUrl } from './logic/supabase';
import { autoArchiveOrphanedSessions } from './logic/storage';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { TodayWorkoutView } from './components/TodayWorkoutView';
import { WeeklyOverview } from './components/WeeklyOverview';
import { AiCoachAndCloudModal } from './components/AiCoachAndCloudModal';
import { LoreIntroModal } from './components/LoreIntroModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { BrandedLoader } from './components/BrandedLoader';
import { LandingPage } from './components/LandingPage';
import { LegalPage } from './components/LegalPage';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { EvolutionRoadmapModal } from './components/EvolutionRoadmapModal';
import { ImperivmProModal } from './components/ImperivmProModal';
import { GymToolsModal } from './components/GymToolsModal';
import { WorkoutHistoryModal } from './components/WorkoutHistoryModal';
import { WorkoutHistoryView } from './components/WorkoutHistoryView';
import { Dumbbell, Sparkles, CheckCircle2, RefreshCw, BookOpen, ShieldCheck, Crown, Calendar, User, Calculator, History } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportedLanguage, getSavedLanguage, t } from './logic/i18n';
import { initializeGoogleTranslate } from './logic/universalTranslator';

export const App: React.FC = () => {
  // Check direct URL parameters for Google OAuth verification compliance (?page=privacy, ?page=terms, ?page=creed)
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | 'creed' | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page === 'privacy' || page === 'terms' || page === 'creed') {
        return page;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => getActiveUserId());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('FORGING OLYMPIAN STATE');

  // State strictly partitioned by individual user ID
  const [appState, setAppState] = useState<AppState>(() => {
    if (!currentUserId) {
      // Ephemeral fallback state if user is unauthenticated
      return loadUserState('ephemeral_guest');
    }
    const userState = loadUserState(currentUserId);
    const sharedData = parseSharedUrl();
    if (sharedData && sharedData.profile) {
      const mergedProfile = { ...userState.profile, ...sharedData.profile } as UserProfile;
      const weeklyPlan = generateWeeklyPlan(mergedProfile);
      const todayWorkout = resolveTodayWorkout(weeklyPlan, mergedProfile);
      return {
        ...userState,
        profile: mergedProfile,
        weeklyPlan,
        todayWorkout,
        completedSets: {},
      };
    }
    return userState;
  });

  const [variationSeed, setVariationSeed] = useState<number>(0);
  const [regenNotification, setRegenNotification] = useState<string | null>(null);
  const [proWelcomeNotice, setProWelcomeNotice] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>(getSavedLanguage());
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'history' | 'profile'>('today');

  // Synchronize Google Translate universal bridge on language change
  useEffect(() => {
    initializeGoogleTranslate(language);
  }, [language]);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isLoreModalOpen, setIsLoreModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState<boolean>(false);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [isGymToolsOpen, setIsGymToolsOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  // Listen for Supabase OAuth session on mount (Google redirect return)
  useEffect(() => {
    const unsubscribe = initSupabaseAuthListener((user) => {
      setCurrentUserId(user.id);
      const loaded = loadUserState(user.id);
      if (isLifetimeVipUser(user)) {
        loaded.isProSubscriber = true;
        saveUserState(user.id, loaded);
      }
      setAppState(loaded);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Remote Entitlement & Revocation Heartbeat (ISO/IEC 27001)
  // Queries serverless authority and Supabase to enforce remote revocations
  useEffect(() => {
    if (!appState.userAccount) return;
    checkRemoteEntitlement(appState.userAccount).then((status) => {
      if (status.revoked) {
        setAppState((prev) => {
          const updated = { ...prev, isProSubscriber: false };
          if (prev.userId) {
            saveUserState(prev.userId, updated);
          }
          return updated;
        });
      }
    });
  }, [appState.userAccount?.id]);

  // On app startup, detect and auto-archive any unsealed sessions from previous calendar days
  useEffect(() => {
    const res = autoArchiveOrphanedSessions();
    if (res.archived && res.session) {
      setAppState((prev) => {
        const newTonnage = (prev.totalTonnageKg || 0) + res.tonnage;
        const newXp = (prev.xp || 0) + res.xp;
        const updated = {
          ...prev,
          totalTonnageKg: newTonnage,
          xp: newXp,
          profile: {
            ...prev.profile,
            lifetimeTonnageKg: newTonnage,
          },
        };
        if (currentUserId) {
          saveUserState(currentUserId, updated);
        }
        return updated;
      });

      setRegenNotification(`🏛️ Preserved and archived workout from ${res.session.date}! +${res.xp} XP permanently awarded.`);
      setTimeout(() => setRegenNotification(null), 6000);
    }
  }, [currentUserId]);

  // Auto-persist changes strictly to the active user's partition when authenticated
  useEffect(() => {
    if (currentUserId) {
      saveUserState(currentUserId, appState);
    }
  }, [appState, currentUserId]);

  // Handle Standalone Legal Page Back
  if (legalPage) {
    return (
      <LegalPage
        pageType={legalPage}
        onBackToHome={() => {
          setLegalPage(null);
          window.history.pushState({}, '', window.location.pathname);
        }}
      />
    );
  }

  // Handle Authentication from Landing Page
  const handleAthleteAuthenticated = (user: UserAccount) => {
    setLoadingMessage(`INITIALIZING OLYMPIAN LEDGER FOR ${user.name.toUpperCase()}`);
    setIsLoading(true);
    setCurrentUserId(user.id);
    setTimeout(() => {
      const loaded = loadUserState(user.id);
      if (isLifetimeVipUser(user)) {
        loaded.isProSubscriber = true;
        saveUserState(user.id, loaded);
      }
      setAppState(loaded);
      setIsLoading(false);
    }, 600);
  };

  // Handle Sign Out to Gate
  const handleSignOut = async () => {
    setIsLoading(true);
    setLoadingMessage('SEALING OLYMPIAN LEDGER');
    await signOutAthlete();
    setTimeout(() => {
      setCurrentUserId(null);
      setIsLoading(false);
    }, 400);
  };

  // Handle User Switching
  const handleUserChanged = (newUser: UserAccount) => {
    setLoadingMessage(`SWITCHING TO ATHLETE ${newUser.name.toUpperCase()}`);
    setIsLoading(true);
    setCurrentUserId(newUser.id);
    setTimeout(() => {
      const loaded = loadUserState(newUser.id);
      setAppState(loaded);
      setIsLoading(false);
    }, 600);
  };

  // Handle plan generation & regeneration with rotating variations
  const handleGeneratePlan = (updatedProfile: UserProfile) => {
    const nextSeed = variationSeed + 1;
    setVariationSeed(nextSeed);

    const weeklyPlan = generateWeeklyPlan(updatedProfile, nextSeed);
    const todayWorkout = resolveTodayWorkout(weeklyPlan, updatedProfile);

    setAppState((prev) => ({
      ...prev,
      profile: updatedProfile,
      weeklyPlan,
      todayWorkout,
      completedSets: {}, // Reset completed sets so athlete gets a fresh workout
      lastGeneratedAt: new Date().toISOString(),
    }));

    setRegenNotification('Plan regenerated with fresh exercise variations!');
    setTimeout(() => setRegenNotification(null), 3500);
  };

  // Handle profile save only
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setAppState((prev) => {
      // Re-personalize the existing weekly plan with the updated profile (so height, weight, archetype, injuries take effect immediately)
      const updatedWeeklyPlan = (prev.weeklyPlan || []).map((day) => {
        if (!day.isRestDay && day.exercises) {
          return {
            ...day,
            exercises: day.exercises.map((ex) => personalizeExercise(ex, updatedProfile)),
          };
        }
        return day;
      });

      const todayWorkout = resolveTodayWorkout(updatedWeeklyPlan, updatedProfile);
      return {
        ...prev,
        profile: updatedProfile,
        weeklyPlan: updatedWeeklyPlan,
        todayWorkout,
      };
    });
  };

  // Handle toggle day active/rest in weekly overview
  const handleToggleDayActive = (dayIndex: number) => {
    const isCurrentlyActive = appState.profile.availableDays.includes(dayIndex);
    const updatedAvailableDays = isCurrentlyActive
      ? appState.profile.availableDays.filter((d) => d !== dayIndex)
      : [...appState.profile.availableDays, dayIndex];

    const updatedProfile: UserProfile = {
      ...appState.profile,
      availableDays: updatedAvailableDays,
    };

    handleGeneratePlan(updatedProfile);
  };

  // Handle custom focus change for a specific day
  const handleUpdateDayFocus = (dayIndex: number, newName: string, newFocus: string[]) => {
    const updatedWeeklyPlan = appState.weeklyPlan.map((d) => {
      if (d.dayIndex === dayIndex) {
        return {
          ...d,
          name: newName,
          focus: newFocus,
        };
      }
      return d;
    });

    const updatedTodayWorkout = resolveTodayWorkout(updatedWeeklyPlan, appState.profile);

    setAppState((prev) => ({
      ...prev,
      weeklyPlan: updatedWeeklyPlan,
      todayWorkout: updatedTodayWorkout,
    }));
  };

  // Handle completed sets update
  const handleUpdateCompletedSets = (updatedSets: Record<string, boolean[]>) => {
    setAppState((prev) => ({
      ...prev,
      completedSets: updatedSets,
      activeSessionDate: prev.todayWorkout.date,
    }));
  };

  // Handle reset to default profile for this user
  const handleResetDefaults = () => {
    if (currentUserId) {
      const freshState = loadUserState(currentUserId);
      setAppState(freshState);
    }
    setVariationSeed(0);
    setRegenNotification('Profile and workout schedule reset to defaults.');
    setTimeout(() => setRegenNotification(null), 3000);
  };

  // Handle overriding today's plan
  const handleOverrideTodayPlan = (newPlan: WorkoutDay) => {
    setAppState((prev) => ({
      ...prev,
      todayWorkout: {
        ...prev.todayWorkout,
        plan: newPlan,
      },
    }));
  };

  // Handle workout session finished & XP calculation
  const handleWorkoutFinished = (sessionTonnage: number, xpEarned: number) => {
    setAppState((prev) => {
      const newTonnage = (prev.totalTonnageKg || 0) + sessionTonnage;
      const newXp = (prev.xp || 0) + xpEarned;
      const updated: AppState = {
        ...prev,
        totalTonnageKg: newTonnage,
        xp: newXp,
        profile: {
          ...prev.profile,
          lifetimeTonnageKg: newTonnage,
        },
      };
      if (currentUserId) {
        saveUserState(currentUserId, updated);
      }
      return updated;
    });
  };

  // Handle completing onboarding
  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    setLoadingMessage('FORGING YOUR PERSONAL OLYMPIAN SPLIT');
    setIsLoading(true);
    setTimeout(() => {
      const weeklyPlan = generateWeeklyPlan(completedProfile);
      const todayWorkout = resolveTodayWorkout(weeklyPlan, completedProfile);
      setAppState((prev) => ({
        ...prev,
        profile: completedProfile,
        weeklyPlan,
        todayWorkout,
        onboardingCompleted: true,
        loreRead: true,
      }));
      setIsLoading(false);
    }, 700);
  };

  if (isLoading) {
    return <BrandedLoader message={loadingMessage} />;
  }

  // PUBLIC LANDING GATE: If visitor is unauthenticated, show the landing page
  if (!currentUserId) {
    return (
      <>
        <LandingPage
          onAthleteAuthenticated={handleAthleteAuthenticated}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenTerms={() => setIsTermsModalOpen(true)}
          onOpenCreed={() => setIsLoreModalOpen(true)}
          onOpenRoadmap={() => setIsRoadmapModalOpen(true)}
          onOpenPro={() => setIsProModalOpen(true)}
        />

        {/* Global Modals for Unauthenticated Visitors */}
        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />
        <LoreIntroModal
          isOpen={isLoreModalOpen}
          onClose={() => setIsLoreModalOpen(false)}
        />
        <EvolutionRoadmapModal
          isOpen={isRoadmapModalOpen}
          onClose={() => setIsRoadmapModalOpen(false)}
          totalTonnageKg={0}
        />
        <ImperivmProModal
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
          currentUser={null}
          isProSubscriber={false}
        />
      </>
    );
  }

  // AUTHENTICATED ATHLETE DASHBOARD
  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Navbar with Athlete Account & Lore */}
      <Header
        profile={appState.profile}
        weeklyPlan={appState.weeklyPlan}
        todayWorkout={appState.todayWorkout}
        currentUser={appState.userAccount}
        isProSubscriber={appState.isProSubscriber}
        language={language}
        onLanguageChange={setLanguage}
        onOpenAiCoach={() => setIsAiModalOpen(true)}
        onOpenShare={() => setIsAiModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLore={() => setIsLoreModalOpen(true)}
        onOpenPro={() => setIsProModalOpen(true)}
        onOpenHistory={() => setActiveTab('history')}
        onSignOut={handleSignOut}
      />

      {/* Pro Activation Success Banner */}
      {proWelcomeNotice && (
        <div className="sticky top-16 sm:top-20 z-30 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-black font-roman flex items-center justify-center gap-2 shadow-xl animate-in slide-in-from-top duration-300">
          <Crown className="w-4 h-4 fill-slate-950" />
          <span>{proWelcomeNotice}</span>
        </div>
      )}

      {/* Regeneration Toast Banner */}
      {regenNotification && (
        <div className="sticky top-16 sm:top-20 z-30 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-black font-roman flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-200">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{regenNotification}</span>
        </div>
      )}

      {/* Tab Navigation Sub-Header (Desktop & Tablet: Hevy / Strong / Fitbod Calibre) */}
      <div className="hidden md:block sticky top-16 sm:top-20 z-20 bg-[#0c0e17]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 py-2.5">
          {/* Main View Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-roman font-bold transition-all ${
                activeTab === 'today'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${activeTab === 'today' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t('tab.today', language)}</span>
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-roman font-bold transition-all ${
                activeTab === 'weekly'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'weekly' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{t('tab.weekly', language)}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-roman font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <History className={`w-4 h-4 ${activeTab === 'history' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{t('tab.ledger', language)}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-roman font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-purple-400' : 'text-slate-400'}`} />
              <span>{t('tab.profile', language)}</span>
            </button>
          </div>

          {/* Quick Athlete Stats Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-xs font-roman font-bold text-amber-300 transition-all shadow-sm hover:scale-105"
              title="Click to view Athlete Dossier"
            >
              <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
              <span>{(appState.totalTonnageKg || 0).toLocaleString()} kg</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-normal">{(appState.xp || 0).toLocaleString()} XP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - Dedicated Multi-View Display with Safe Bottom Padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-16">
        {/* View 1: Today's Arena Workout Session */}
        {activeTab === 'today' && (
          <section id="today-workout" aria-label="Today's Workout Session">
            <TodayWorkoutView
              todayWorkout={appState.todayWorkout}
              profile={appState.profile}
              completedSets={appState.completedSets}
              loggedWeights={appState.loggedWeights}
              onUpdateLoggedWeight={(exerciseId, weightKg) => {
                setAppState((prev) => ({
                  ...prev,
                  loggedWeights: {
                    ...prev.loggedWeights,
                    [exerciseId]: weightKg,
                  },
                }));
              }}
              onUpdateCompletedSets={handleUpdateCompletedSets}
              onOverridePlan={handleOverrideTodayPlan}
              onOpenPro={() => setIsProModalOpen(true)}
              language={language}
              lifetimeTonnageKg={appState.totalTonnageKg}
              onWorkoutFinished={handleWorkoutFinished}
              isProSubscriber={appState.isProSubscriber}
            />
          </section>
        )}

        {/* View 2: Weekly Split & Battle Schedule */}
        {activeTab === 'weekly' && (
          <section id="weekly-overview" aria-label="Weekly Routine Overview">
            <WeeklyOverview
              weeklyPlan={appState.weeklyPlan}
              todayWorkout={appState.todayWorkout}
              profile={appState.profile}
              onToggleDayActive={handleToggleDayActive}
              onUpdateDayFocus={handleUpdateDayFocus}
              language={language}
            />
          </section>
        )}

        {/* View 3: Dedicated Full-Screen Training Ledger & History */}
        {activeTab === 'history' && (
          <section id="workout-history" aria-label="Training Ledger">
            <WorkoutHistoryView
              language={language}
              onOpenPro={() => setIsProModalOpen(true)}
              onSessionLogged={handleWorkoutFinished}
            />
          </section>
        )}

        {/* View 4: Athlete Dossier & Calibration Profile */}
        {activeTab === 'profile' && (
          <section id="profile-configuration" aria-label="Athlete Profile & Configuration">
            <ProfileForm
              profile={appState.profile}
              userAccount={appState.userAccount}
              isProSubscriber={appState.isProSubscriber}
              totalTonnageKg={appState.totalTonnageKg}
              xp={appState.xp}
              isStandaloneView={true}
              onSaveProfile={handleSaveProfile}
              onGeneratePlan={handleGeneratePlan}
              onResetDefaults={handleResetDefaults}
              language={language}
              onOpenPro={() => setIsProModalOpen(true)}
            />
          </section>
        )}
      </main>

      {/* Modern Romanvm Impervm Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06070a] py-8 pb-24 md:pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HOMO DEUS" className="w-5 h-5 rounded-md object-cover" />
            <span className="font-roman font-bold text-slate-300">{t('footer.engine', language)}</span>
            <span>•</span>
            <span className="text-amber-400 font-roman">Athlete: {appState.userAccount.name}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-roman">
            <button
              onClick={() => setIsLoreModalOpen(true)}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <span>📜</span>
              <span>{t('footer.mythos', language)}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              {t('footer.privacy', language)}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              {t('footer.terms', language)}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('footer.oracle', language)}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Tab Bar (Hevy / Strong / Fitbod Calibre Ergonomics) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0c0e17]/95 backdrop-blur-2xl border-t border-amber-500/25 px-2 py-1 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        {/* Tab 1: Today's Arena */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(10); } catch {}
            }
            setActiveTab('today');
          }}
          className="min-h-[48px] min-w-[54px] flex flex-col items-center justify-center gap-1 transition-all"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'today'
              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm shadow-emerald-500/20 scale-105'
              : 'text-slate-400 hover:text-white'
          }`}>
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-roman font-bold transition-colors ${
            activeTab === 'today' ? 'text-emerald-300' : 'text-slate-400'
          }`}>
            {t('nav.today', language)}
          </span>
        </button>

        {/* Tab 2: Weekly Split */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(10); } catch {}
            }
            setActiveTab('weekly');
          }}
          className="min-h-[48px] min-w-[54px] flex flex-col items-center justify-center gap-1 transition-all"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'weekly'
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 shadow-sm shadow-cyan-500/20 scale-105'
              : 'text-slate-400 hover:text-white'
          }`}>
            <Calendar className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-roman font-bold transition-colors ${
            activeTab === 'weekly' ? 'text-cyan-300' : 'text-slate-400'
          }`}>
            {t('nav.week', language)}
          </span>
        </button>

        {/* Center Action: Gym Tools Medallion (Plate Loader & 1RM) */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(15); } catch {}
            }
            setIsGymToolsOpen(true);
          }}
          className="min-h-[48px] min-w-[54px] flex flex-col items-center justify-center -mt-3.5 group"
          title="Open Gym Tools (Plate Loader & 1RM Calculator)"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 group-active:scale-95 transition-transform border border-amber-200/50">
            <Calculator className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-roman font-bold text-amber-400 mt-1">
            {t('nav.tools', language)}
          </span>
        </button>

        {/* Tab 3: Training Ledger */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(10); } catch {}
            }
            setActiveTab('history');
          }}
          className="min-h-[48px] min-w-[54px] flex flex-col items-center justify-center gap-1 transition-all"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 shadow-sm shadow-amber-500/20 scale-105'
              : 'text-slate-400 hover:text-white'
          }`}>
            <History className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-roman font-bold transition-colors ${
            activeTab === 'history' ? 'text-amber-300' : 'text-slate-400'
          }`}>
            {t('nav.ledger', language)}
          </span>
        </button>

        {/* Tab 4: Athlete Dossier */}
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate(10); } catch {}
            }
            setActiveTab('profile');
          }}
          className="min-h-[48px] min-w-[54px] flex flex-col items-center justify-center gap-1 transition-all"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40 shadow-sm shadow-purple-500/20 scale-105'
              : 'text-slate-400 hover:text-white'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-roman font-bold transition-colors ${
            activeTab === 'profile' ? 'text-purple-300' : 'text-slate-400'
          }`}>
            {t('nav.profile', language)}
          </span>
        </button>
      </nav>

      {/* AI Coach, Share & Cloud Sync Modal */}
      <AiCoachAndCloudModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        profile={appState.profile}
        todayWorkout={appState.todayWorkout}
        weeklyPlan={appState.weeklyPlan}
        isProSubscriber={appState.isProSubscriber}
        onOpenPro={() => setIsProModalOpen(true)}
        language={language}
      />

      {/* Gym Tools Modal (Plate Calculator & 1RM Percentages) */}
      <GymToolsModal
        isOpen={isGymToolsOpen}
        onClose={() => setIsGymToolsOpen(false)}
        initialWeight={80}
        language={language}
      />

      {/* Workout History Ledger Modal */}
      <WorkoutHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        language={language}
      />

      {/* Lore Intro Modal */}
      <LoreIntroModal
        isOpen={isLoreModalOpen}
        onClose={() => {
          setIsLoreModalOpen(false);
          setAppState((prev) => ({ ...prev, loreRead: true }));
        }}
      />

      {/* Onboarding Wizard (shown if not completed) */}
      <OnboardingModal
        isOpen={!appState.onboardingCompleted}
        initialProfile={appState.profile}
        onComplete={handleOnboardingComplete}
        language={language}
      />

      {/* Athlete Login & Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={appState.userAccount}
        onUserChanged={handleUserChanged}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Evolution Roadmap Modal */}
      <EvolutionRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        totalTonnageKg={appState.totalTonnageKg || 0}
      />

      {/* Imperivm Pro Paywall Modal */}
      <ImperivmProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        currentUser={appState.userAccount}
        isProSubscriber={appState.isProSubscriber}
        language={language}
        onUpgradeSuccess={() => {
          try {
            localStorage.setItem('homodevs_vip_passcode_unlocked', 'true');
          } catch {
            // ignore
          }
          setProWelcomeNotice('👑 Imperivm Pro Activated! All Elite Features Unlocked.');
          setTimeout(() => setProWelcomeNotice(null), 4000);
          setAppState(prev => {
            const updated = { ...prev, isProSubscriber: true };
            // Persist immediately so Pro survives page refresh
            if (prev.userId) {
              saveUserState(prev.userId, updated);
            }
            if (currentUserId && currentUserId !== prev.userId) {
              saveUserState(currentUserId, updated);
            }
            return updated;
          });
        }}
      />
    </div>
  );
};

export default App;
