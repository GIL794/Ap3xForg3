import { UserProfile, TodayWorkout } from '../types';

export interface AiCoachRecommendation {
  summary: string;
  intensityCritique: string;
  volumeEvaluation: string;
  injuryAdaptations: string;
  suggestedSwaps: { original: string; suggested: string; reason: string }[];
  preWorkoutTip: string;
  isAiGenerated: boolean;
}

const GEMINI_KEY_STORAGE = 'homodevs_gemini_api_key';

/** @deprecated Key is now managed server-side via Vercel env vars. Kept for migration only. */
export function getSavedGeminiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

/** @deprecated */
export function saveGeminiKey(key: string): void {
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  } else {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  }
}

/**
 * Calls the secure Vercel serverless proxy (/api/ai-coach) which reads
 * GEMINI_API_KEY from server-side env — the key is NEVER exposed to the browser.
 * Falls back to the built-in rule-based sport-science engine if the API is unavailable.
 */
export async function generateAiCoachingRecommendations(
  profile: UserProfile,
  todayWorkout: TodayWorkout,
  _customApiKey?: string  // Unused — kept for backwards compatibility
): Promise<AiCoachRecommendation> {
  try {
    const response = await fetch('/api/ai-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, todayWorkout }),
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.useFallback && data.summary) {
        return data as AiCoachRecommendation;
      }
    }
  } catch (err) {
    console.warn('Oracle AI proxy unavailable, using built-in sport-science engine:', err);
  }

  // Built-in intelligent fallback — always works even without Gemini key
  return generateRuleBasedAudit(profile, todayWorkout);
}

function generateRuleBasedAudit(profile: UserProfile, todayWorkout: TodayWorkout): AiCoachRecommendation {
  const plan = todayWorkout.plan;
  const exerciseCount = plan.exercises.length;
  const totalSets = plan.exercises.reduce((sum, e) => sum + e.sets, 0);
  const injuries = (profile.injuries || '').trim();

  let volumeEvaluation = `Current session features ${totalSets} working sets across ${exerciseCount} movements, calibrated for ${profile.sessionLengthMinutes} minutes.`;
  if (totalSets > 20) {
    volumeEvaluation += ' Volume is high — ensure 2-3 reps in reserve (RIR) on early sets to prevent junk volume accumulation.';
  } else {
    volumeEvaluation += ' Solid stimulus-to-fatigue ratio without excessive neural fatigue.';
  }

  // Injury-aware adaptations
  let injuryAdaptations = 'No active injuries noted. Cleared for full prescribed program.';
  if (injuries) {
    const lower = injuries.toLowerCase();
    const adaptations: string[] = [];

    if (lower.includes('shoulder') || lower.includes('rotator')) {
      adaptations.push('Avoid overhead pressing behind the neck. Substitute military press with landmine press or Arnold press with neutral grip. Keep external rotation under control on lateral raises.');
    }
    if (lower.includes('knee') || lower.includes('patel')) {
      adaptations.push('Replace full-depth barbell squats with box squats or leg press at 70° angle. Avoid leg extensions — substitute with terminal knee extensions (TKE) with band.');
    }
    if (lower.includes('lower back') || lower.includes('lumbar') || lower.includes('disc')) {
      adaptations.push('Replace conventional deadlifts with trap bar deadlifts or Romanian deadlifts with controlled ROM. Avoid loaded spinal flexion (cable crunches) — substitute with planks and dead bugs.');
    }
    if (lower.includes('elbow') || lower.includes('tenni') || lower.includes('golfer')) {
      adaptations.push('Reduce grip-intensive work. Substitute barbell curls with cable curls (neutral grip). Avoid reverse curls temporarily. Use wrist wraps for pressing movements.');
    }
    if (lower.includes('wrist')) {
      adaptations.push('Use wrist straps on pulling movements. Substitute barbell press with dumbbell (neutral grip). Avoid extreme wrist flexion on preacher curls.');
    }

    injuryAdaptations = adaptations.length > 0
      ? `Adapting for: ${injuries}. ${adaptations.join(' ')}`
      : `Active condition noted: ${injuries}. Monitor pain signals — stop any movement that causes sharp or acute pain and consult a physiotherapist if symptoms persist.`;
  }

  const suggestedSwaps: { original: string; suggested: string; reason: string }[] = [];
  if (plan.exercises.some(e => e.name.toLowerCase().includes('incline dumbbell press'))) {
    suggestedSwaps.push({
      original: 'Incline Dumbbell Press',
      suggested: '30° Incline Smith Machine Press',
      reason: 'Increases stability for deeper clavicular pec stretch and safer failure training.',
    });
  }
  if (plan.exercises.some(e => e.name.toLowerCase().includes('lateral raise'))) {
    suggestedSwaps.push({
      original: 'Dumbbell Lateral Raises',
      suggested: 'Cross-Body Cable Lateral Raise (pulley at knee height)',
      reason: 'Provides continuous resistance in the lengthened position where DBs have zero tension.',
    });
  }

  return {
    summary: `${profile.name}, your ${plan.name} session is primed for your target goal. Compounds are prioritized first when CNS drive is highest.`,
    intensityCritique: `Aim for RPE 8 on main compounds (leave 2 clean reps in tank). Take your final isolation set to technical failure (RPE 9.5–10) with controlled 3-second eccentrics.`,
    volumeEvaluation,
    injuryAdaptations,
    suggestedSwaps: suggestedSwaps.length > 0 ? suggestedSwaps : [
      {
        original: plan.exercises[0]?.name || 'First Compound',
        suggested: 'Weighted Dips or Cable Crossover',
        reason: 'Adds mechanical variation depending on gym equipment availability.',
      },
    ],
    preWorkoutTip: `For your ${profile.targetWorkoutTime} session, consume 30–40g fast carbs (banana, rice cake with honey) and 500ml water with a pinch of sea salt 45 minutes prior for optimal intracellular hydration and muscle pumps.`,
    isAiGenerated: false,
  };
}
