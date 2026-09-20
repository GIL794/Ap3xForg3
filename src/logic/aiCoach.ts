import { UserProfile, TodayWorkout } from '../types';

export interface AiCoachRecommendation {
  summary: string;
  intensityCritique: string;
  volumeEvaluation: string;
  suggestedSwaps: { original: string; suggested: string; reason: string }[];
  preWorkoutTip: string;
  isAiGenerated: boolean;
}

const GEMINI_KEY_STORAGE = 'apex_gemini_api_key';

export function getSavedGeminiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiKey(key: string): void {
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  } else {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  }
}

/**
 * Calls Google Gemini Free API (1.5 Flash / 2.0 Flash) or provides intelligent built-in coaching audit
 */
export async function generateAiCoachingRecommendations(
  profile: UserProfile,
  todayWorkout: TodayWorkout,
  customApiKey?: string
): Promise<AiCoachRecommendation> {
  const apiKey = customApiKey?.trim() || getSavedGeminiKey();

  // If API key is provided, query Gemini 1.5 Flash (100% Free at aistudio.google.com)
  if (apiKey) {
    try {
      const plan = todayWorkout.plan;
      const prompt = `You are an elite strength & conditioning specialist and hypertrophy researcher.
Analyze this athlete's workout plan and provide concise, high-value coaching recommendations.

Athlete Profile:
- Name: ${profile.name}
- Location & Timezone: ${profile.location} (${profile.timezone})
- Experience: ${profile.experience}
- Primary Goal: ${profile.primaryGoal.replace(/_/g, ' ')}
- Secondary Goals: ${profile.secondaryGoals.join(', ')}
- Session Length: ${profile.sessionLengthMinutes} minutes
- Equipment: ${profile.equipment.join(', ')}
- Limitations / Injuries: ${profile.injuries || 'None'}
- Preferences: ${profile.preferences}
- Today's Gym Time: ${profile.targetWorkoutTime}

Today's Scheduled Session:
- Title: ${plan.name}
- Estimated Duration: ${plan.estimatedDurationMinutes} min
- Exercises:
${plan.exercises.map((e, idx) => `  ${idx + 1}. ${e.name} (${e.sets} sets x ${e.reps}, Rest: ${e.restSeconds}s, RPE: ${e.targetRpe})`).join('\n')}

Format your response strictly as JSON with the following structure:
{
  "summary": "1-2 sentence assessment of how this workout fits their goal",
  "intensityCritique": "Advice on RPE and mechanical tension for today's compounds",
  "volumeEvaluation": "Assessment of weekly and session volume for their experience level",
  "suggestedSwaps": [
    {"original": "Exercise Name", "suggested": "Alternative Name", "reason": "Why this swap may benefit them"}
  ],
  "preWorkoutTip": "Specific timing or nutritional advice for their session at ${profile.targetWorkoutTime}"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          ...parsed,
          isAiGenerated: true,
        };
      }
    } catch (err) {
      console.warn('Gemini API query failed or key was invalid. Falling back to built-in sport-science engine:', err);
    }
  }

  // Built-in intelligent fallback coach (zero API key needed)
  return generateRuleBasedAudit(profile, todayWorkout);
}

function generateRuleBasedAudit(profile: UserProfile, todayWorkout: TodayWorkout): AiCoachRecommendation {
  const plan = todayWorkout.plan;
  const isUpper = profile.primaryGoal === 'upper_body_hypertrophy';
  const exerciseCount = plan.exercises.length;
  const totalSets = plan.exercises.reduce((sum, e) => sum + e.sets, 0);

  let volumeEvaluation = `Current session features ${totalSets} working sets across ${exerciseCount} movements, calibrated for ${profile.sessionLengthMinutes} minutes.`;
  if (totalSets > 20) {
    volumeEvaluation += ' Volume is high—ensure you preserve 2-3 reps in reserve (RIR) on early sets to prevent junk volume.';
  } else {
    volumeEvaluation += ' Solid stimulus-to-fatigue ratio without excessive neural fatigue.';
  }

  const suggestedSwaps = [];
  if (plan.exercises.some(e => e.name.toLowerCase().includes('incline dumbbell press'))) {
    suggestedSwaps.push({
      original: 'Incline Dumbbell Press',
      suggested: '30° Incline Smith Machine Press',
      reason: 'Increases stability for deeper clavicular pec stretch and safer failure training without stabilizers fatiguing first.'
    });
  }
  if (plan.exercises.some(e => e.name.toLowerCase().includes('lateral raise'))) {
    suggestedSwaps.push({
      original: 'Dumbbell Lateral Raises',
      suggested: 'Cross-Body Cable Lateral Raise (pulley at knee height)',
      reason: 'Provides a continuous resistance curve in the lengthened position where DBs have zero tension.'
    });
  }

  return {
    summary: `${profile.name}, your ${plan.name} session is primed for upper-body hypertrophy. Compounds are prioritized first when central nervous system drive is highest.`,
    intensityCritique: `Aim for RPE 8 on main compounds (leave 2 clean reps in tank). Take your final isolation set (delts/arms) to technical failure (RPE 9.5-10) with controlled 3-second eccentrics.`,
    volumeEvaluation,
    suggestedSwaps: suggestedSwaps.length > 0 ? suggestedSwaps : [
      {
        original: plan.exercises[0]?.name || 'First Compound',
        suggested: 'Weighted Dips or Cable Crossover',
        reason: 'Adds mechanical variation depending on gym equipment availability.'
      }
    ],
    preWorkoutTip: `For your ${profile.targetWorkoutTime} gym time, consume 30-40g fast carbs (e.g. banana, rice cake with honey) and 500ml water with a pinch of salt ~45 mins before training for optimal muscle pumps and intracellular hydration.`,
    isAiGenerated: false,
  };
}
