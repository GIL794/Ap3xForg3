import { AppState, UserProfile, WorkoutDay, TodayWorkout } from '../types';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { generateWeeklyPlan } from './planGenerator';
import { resolveTodayWorkout } from './todayDetector';

import { DEFAULT_GABRIELE_ACCOUNT } from './auth';

const STORAGE_KEY = 'homo_devs_planner_v1';

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profile && parsed.weeklyPlan) {
        // Re-resolve today workout with fresh reference time
        const todayWorkout = resolveTodayWorkout(parsed.weeklyPlan, parsed.profile);
        return {
          userId: parsed.userId || DEFAULT_GABRIELE_ACCOUNT.id,
          userAccount: parsed.userAccount || DEFAULT_GABRIELE_ACCOUNT,
          onboardingCompleted: parsed.onboardingCompleted ?? true,
          loreRead: parsed.loreRead ?? true,
          totalTonnageKg: parsed.totalTonnageKg || 0,
          ...parsed,
          todayWorkout,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load saved state from localStorage:', err);
  }

  // Fallback to initial auto-generated state for Gabriele
  const profile = { ...DEFAULT_PROFILE };
  const weeklyPlan = generateWeeklyPlan(profile);
  const todayWorkout = resolveTodayWorkout(weeklyPlan, profile);

  return {
    userId: DEFAULT_GABRIELE_ACCOUNT.id,
    userAccount: DEFAULT_GABRIELE_ACCOUNT,
    profile,
    weeklyPlan,
    todayWorkout,
    completedSets: {},
    loggedWeights: {},
    totalTonnageKg: 0,
    lastGeneratedAt: new Date().toISOString(),
    onboardingCompleted: true,
    loreRead: true,
  };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function clearSavedState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return loadSavedState();
}

/**
 * Downloads the current plan and profile as a JSON file
 */
export function exportPlanAsJson(profile: UserProfile, weeklyPlan: WorkoutDay[], todayWorkout: TodayWorkout): void {
  const exportData = {
    app: 'HOMO DEVS Romanvm Impervm',
    exportedAt: new Date().toISOString(),
    profile,
    weeklyPlan,
    todayWorkout: {
      date: todayWorkout.date,
      scheduledTime: todayWorkout.scheduledTime,
      plan: todayWorkout.plan,
    },
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `exercise-plan-${profile.name.toLowerCase()}-${todayWorkout.date}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Copies a clean markdown summary of today's workout to the clipboard
 */
export async function copyWorkoutToClipboard(todayWorkout: TodayWorkout): Promise<boolean> {
  const plan = todayWorkout.plan;
  if (!plan) return false;

  let text = `🏋️ ${plan.name} (${todayWorkout.scheduledTime})\n`;
  text += `📅 Date: ${todayWorkout.date} | Target Duration: ~${plan.estimatedDurationMinutes} min\n\n`;

  if (plan.warmup) {
    text += `🔥 WARM-UP (${plan.warmup.durationMinutes} min):\n`;
    plan.warmup.specificActivation.forEach(a => text += `• ${a}\n`);
    text += '\n';
  }

  text += `💪 EXERCISES:\n`;
  plan.exercises.forEach((ex, idx) => {
    text += `${idx + 1}. ${ex.name} — ${ex.sets} sets × ${ex.reps} (Rest: ${ex.restSeconds}s, RPE: ${ex.targetRpe})\n`;
    if (ex.notes) text += `   Tip: ${ex.notes}\n`;
  });

  if (plan.progressionRule) {
    text += `\n📈 PROGRESSION RULE: ${plan.progressionRule}\n`;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

const HISTORY_STORAGE_KEY = 'homodevs_workout_history_v1';
const NOTES_STORAGE_KEY = 'homodevs_exercise_notes_v1';

export function saveWorkoutSession(session: import('../types').WorkoutHistorySession): void {
  try {
    const existing = getWorkoutHistory();
    const updated = [session, ...existing.filter(s => s.id !== session.id)].slice(0, 100);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save workout session:', err);
  }
}

export function getWorkoutHistory(): import('../types').WorkoutHistorySession[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExerciseNote(exerciseId: string, note: string): void {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const notes = raw ? JSON.parse(raw) : {};
    notes[exerciseId] = note;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save exercise note:', err);
  }
}

export function getExerciseNote(exerciseId: string): string {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return '';
    const notes = JSON.parse(raw);
    return notes[exerciseId] || '';
  } catch {
    return '';
  }
}

