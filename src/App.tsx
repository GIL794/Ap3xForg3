import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, WorkoutDay, TodayWorkout, UserAccount } from './types';
import { 
  getActiveUserId, 
  loadUserState, 
  saveUserState, 
  signOutAthlete,
  initSupabaseAuthListener,
  isLifetimeVipUser,
  DEFAULT_GABRIELE_ACCOUNT,
  getAllUserAccounts 
} from './logic/auth';
import { generateWeeklyPlan } from './logic/planGenerator';
import { resolveTodayWorkout } from './logic/todayDetector';
import { parseSharedUrl } from './logic/supabase';
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
import { Dumbbell, Sparkles, CheckCircle2, RefreshCw, BookOpen, ShieldCheck, Crown, Calendar, User, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportedLanguage, getSavedLanguage, t } from './logic/i18n';

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
      const todayWorkout = resolveTodayWorkout(prev.weeklyPlan, updatedProfile);
      return {
        ...prev,
        profile: updatedProfile,
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
        language={language}
        onLanguageChange={setLanguage}
        onOpenAiCoach={() => setIsAiModalOpen(true)}
        onOpenShare={() => setIsAiModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenLore={() => setIsLoreModalOpen(true)}
        onOpenPro={() => setIsProModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* Section 1: Today's 19:00 Gym Session */}
        <section id="today-workout" aria-label="Today's Workout Session">
          <TodayWorkoutView
            todayWorkout={appState.todayWorkout}
            profile={appState.profile}
            completedSets={appState.completedSets}
            onUpdateCompletedSets={handleUpdateCompletedSets}
            onOverridePlan={handleOverrideTodayPlan}
            onOpenPro={() => setIsProModalOpen(true)}
            language={language}
          />
        </section>

        {/* Section 2: Weekly Overview & Split */}
        <section id="weekly-overview" aria-label="Weekly Routine Overview" className="pt-2">
          <WeeklyOverview
            weeklyPlan={appState.weeklyPlan}
            todayWorkout={appState.todayWorkout}
            profile={appState.profile}
            onToggleDayActive={handleToggleDayActive}
            onUpdateDayFocus={handleUpdateDayFocus}
            language={language}
          />
        </section>

        {/* Section 3: Profile & Goals Configuration */}
        <section id="profile-configuration" aria-label="Athlete Profile & Configuration" className="pt-2">
          <ProfileForm
            profile={appState.profile}
            onSaveProfile={handleSaveProfile}
            onGeneratePlan={handleGeneratePlan}
            onResetDefaults={handleResetDefaults}
            language={language}
          />
        </section>
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

      {/* Mobile Sticky Bottom Tab Bar (Hevy / Strong / Fitbod Caliber) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0c0e17]/95 backdrop-blur-xl border-t border-amber-500/20 px-3 py-2 flex items-center justify-around shadow-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <button
          onClick={() => {
            const el = document.getElementById('today-workout');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-roman font-bold text-emerald-400 hover:text-white transition-colors"
        >
          <Dumbbell className="w-4 h-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('weekly-overview');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-roman font-bold text-cyan-400 hover:text-white transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Week</span>
        </button>

        <button
          onClick={() => setIsGymToolsOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-roman font-bold text-amber-400 hover:text-white transition-colors -mt-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Calculator className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span>Tools</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-roman font-bold text-purple-400 hover:text-white transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Oracle AI</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('profile-configuration');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-roman font-bold text-slate-400 hover:text-white transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
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
      />

      {/* Workout History Ledger Modal */}
      <WorkoutHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
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
