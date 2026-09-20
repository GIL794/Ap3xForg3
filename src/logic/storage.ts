import { AppState, UserProfile, WorkoutDay, TodayWorkout } from '../types';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { generateWeeklyPlan } from './planGenerator';
import { resolveTodayWorkout } from './todayDetector';

const STORAGE_KEY = 'apex_exercise_planner_v1';

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profile && parsed.weeklyPlan) {
        // Re-resolve today workout with fresh reference time
        const todayWorkout = resolveTodayWorkout(parsed.weeklyPlan, parsed.profile);
        return {
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
    profile,
    weeklyPlan,
    todayWorkout,
    completedSets: {},
    loggedWeights: {},
    lastGeneratedAt: new Date().toISOString(),
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
    app: 'ApexForge Exercise Planner',
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
