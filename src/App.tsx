import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, WorkoutDay, TodayWorkout } from './types';
import { loadSavedState, saveState, clearSavedState } from './logic/storage';
import { generateWeeklyPlan } from './logic/planGenerator';
import { resolveTodayWorkout } from './logic/todayDetector';
import { parseSharedUrl } from './logic/supabase';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { TodayWorkoutView } from './components/TodayWorkoutView';
import { WeeklyOverview } from './components/WeeklyOverview';
import { AiCoachAndCloudModal } from './components/AiCoachAndCloudModal';
import { Dumbbell, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = loadSavedState();
    // Check if opened via a shared URL parameter
    const sharedData = parseSharedUrl();
    if (sharedData && sharedData.profile) {
      const mergedProfile = { ...saved.profile, ...sharedData.profile } as UserProfile;
      const weeklyPlan = generateWeeklyPlan(mergedProfile);
      const todayWorkout = resolveTodayWorkout(weeklyPlan, mergedProfile);
      return {
        ...saved,
        profile: mergedProfile,
        weeklyPlan,
        todayWorkout,
        completedSets: {},
      };
    }
    return saved;
  });

  const [variationSeed, setVariationSeed] = useState<number>(0);
  const [regenNotification, setRegenNotification] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Auto-persist state changes
  useEffect(() => {
    saveState(appState);
  }, [appState]);

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
      completedSets: {}, // Reset completed sets so user gets a fresh workout
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

  // Handle reset to default profile
  const handleResetDefaults = () => {
    const freshState = clearSavedState();
    setAppState(freshState);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Header
        profile={appState.profile}
        weeklyPlan={appState.weeklyPlan}
        todayWorkout={appState.todayWorkout}
        onOpenAiCoach={() => setIsAiModalOpen(true)}
        onOpenShare={() => setIsAiModalOpen(true)}
      />

      {/* Regeneration Toast Banner */}
      {regenNotification && (
        <div className="sticky top-16 sm:top-20 z-30 w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 px-4 py-2 text-center text-xs font-black flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-200">
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
          />
        </section>

        {/* Section 3: Profile & Goals Configuration */}
        <section id="profile-configuration" aria-label="Athlete Profile & Configuration" className="pt-2">
          <ProfileForm
            profile={appState.profile}
            onSaveProfile={handleSaveProfile}
            onGeneratePlan={handleGeneratePlan}
            onResetDefaults={handleResetDefaults}
          />
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Dumbbell className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-300">ApexForge Workout Engine</span>
            <span>•</span>
            <span>Local Storage Active</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Coach & Cloud Sync Guide
            </button>
            <span>•</span>
            <span>Session Ready for 19:00 BST</span>
          </div>
        </div>
      </footer>

      {/* AI Coach, Share & Cloud Sync Modal */}
      <AiCoachAndCloudModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        profile={appState.profile}
        todayWorkout={appState.todayWorkout}
        weeklyPlan={appState.weeklyPlan}
      />
    </div>
  );
};

export default App;
