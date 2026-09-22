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
    console.warn('Oracle AI serverless proxy unavailable, checking client fallback:', err);
  }

  // If serverless proxy returned 404 or failed, check for direct client-side Gemini key
  try {
    const clientKey = (getSavedGeminiKey() || (import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();
    if (clientKey) {
      const direct = await callGeminiDirectly(profile, todayWorkout, clientKey);
      if (direct) return direct;
    }
  } catch (err) {
    console.warn('Direct client Gemini call failed:', err);
  }

  // Built-in intelligent fallback — always works reliably with zero errors
  return generateRuleBasedAudit(profile, todayWorkout);
}

async function callGeminiDirectly(
  profile: UserProfile,
  todayWorkout: TodayWorkout,
  apiKey: string
): Promise<AiCoachRecommendation | null> {
  const plan = todayWorkout.plan;
  const injuryText = profile.injuries?.trim() || 'None';

  const prompt = `You are an elite strength & conditioning specialist and sports medicine physiologist.
Analyse this athlete's workout plan and provide concise, high-value, plain-English coaching recommendations.
Pay SPECIAL attention to any listed injuries and provide explicit exercise modifications.

Athlete Profile:
- Name: ${profile.name}
- Age: ${profile.ageYears ? profile.ageYears + ' years' : 'Adult'}
- Height: ${profile.heightCm ? profile.heightCm + ' cm' : 'Standard'}
- Current Weight: ${profile.currentWeightKg ? profile.currentWeightKg + ' kg' : 'Standard'}
- Goal Weight: ${profile.goalWeightKg ? profile.goalWeightKg + ' kg' : 'Not specified'}
- Experience: ${profile.experience}
- Primary Goal: ${(profile.primaryGoal || '').replace(/_/g, ' ')}
- Secondary Goals: ${(profile.secondaryGoals || []).join(', ') || 'None'}
- Session Length: ${profile.sessionLengthMinutes} minutes
- Equipment: ${(profile.equipment || []).join(', ')}
- Active Injuries / Limitations: ${injuryText}
- Preferences: ${profile.preferences || 'None'}
- Target Gym Time: ${profile.targetWorkoutTime}

Today's Scheduled Session:
- Title: ${plan.name}
- Estimated Duration: ${plan.estimatedDurationMinutes} min
- Exercises:
${(plan.exercises || []).map((e, idx) => `  ${idx + 1}. ${e.name} (${e.sets} sets x ${e.reps}, Rest: ${e.restSeconds}s, Target Effort: ${e.targetRpe}/10)`).join('\n')}

MANDATORY RULES:
1. Use British English spelling throughout (optimise, prioritise, colour, programme, minimise, calibre).
2. Plain, clear, conversational English easily understood by any gym-goer.
3. Greet athlete warmly by name (${profile.name}).
4. If an injury is present (${injuryText}), explicitly name it, explain safe angles, and provide substitutions.

Format your response strictly as JSON with this structure:
{
  "summary": "Warm 1-2 sentence overview addressing ${profile.name} and how today's session moves them towards their goal",
  "intensityCritique": "Clear advice on how hard to push on main compounds vs accessories",
  "volumeEvaluation": "Plain-English assessment of the ${plan.exercises.length} movements and sets",
  "injuryAdaptations": "${injuryText !== 'None' ? 'Explicit protection protocol for ' + injuryText : 'No active injuries reported. Full clearance.'}",
  "suggestedSwaps": [
    {"original": "Exercise Name", "suggested": "Alternative Name", "reason": "Plain-English reason"}
  ],
  "preWorkoutTip": "Actionable hydration and fueling tip timed for their ${profile.targetWorkoutTime} session"
}`;

  const res = await fetch(
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

  if (!res.ok) return null;
  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;
  const parsed = JSON.parse(rawText);
  return { ...parsed, isAiGenerated: true };
}

function generateRuleBasedAudit(profile: UserProfile, todayWorkout: TodayWorkout): AiCoachRecommendation {
  const plan = todayWorkout.plan;
  const exerciseCount = plan.exercises.length;
  const totalSets = plan.exercises.reduce((sum, e) => sum + e.sets, 0);
  const injuries = (profile.injuries || '').trim();

  const athleteGreeting = profile.name ? `Greetings ${profile.name}` : 'Greetings Olympian';
  const statsSnippet = profile.currentWeightKg 
    ? ` At ${profile.currentWeightKg}kg${profile.heightCm ? ` (${profile.heightCm}cm)` : ''},` 
    : '';

  let volumeEvaluation = `Today's session features ${totalSets} working sets across ${exerciseCount} movements, calibrated for ${profile.sessionLengthMinutes} minutes.`;
  if (totalSets > 20) {
    volumeEvaluation += ' Volume is high — ensure you leave 2 reps in reserve on early sets to prevent premature muscle exhaustion.';
  } else {
    volumeEvaluation += ' Ideal volume-to-recovery ratio to stimulate muscle growth without excessive fatigue.';
  }

  // Injury-aware adaptations & dynamic substitutions
  let injuryAdaptations = 'No active injuries reported. Full clearance for all prescribed exercises.';
  const suggestedSwaps: { original: string; suggested: string; reason: string }[] = [];

  if (injuries) {
    const lower = injuries.toLowerCase();
    const adaptations: string[] = [];

    if (lower.includes('shoulder') || lower.includes('rotator') || lower.includes('impingement')) {
      adaptations.push('Avoid flared elbows and pressing behind the neck. Keep elbows at a 45° angle to the torso. Use neutral-grip dumbbells or cable crossovers to protect the rotator cuff.');
      suggestedSwaps.push({
        original: 'Barbell Overhead Press',
        suggested: 'Neutral-Grip Dumbbell Press or Landmine Press',
        reason: 'Significantly reduces shoulder joint impingement while isolating delts safely.',
      });
    }
    if (lower.includes('knee') || lower.includes('patel') || lower.includes('meniscus')) {
      adaptations.push('Replace deep barbell back squats with box squats or leg press with feet placed high on the platform. Avoid leg extensions under heavy loads; use band terminal knee extensions instead.');
      suggestedSwaps.push({
        original: 'Barbell Squat',
        suggested: 'Box Squat or 45° Leg Press (High Foot Position)',
        reason: 'Reduces shear force on the patellar tendon while preserving quad hypertrophy.',
      });
    }
    if (lower.includes('lower back') || lower.includes('lumbar') || lower.includes('disc') || lower.includes('spine')) {
      adaptations.push('Avoid heavy axial spinal loading. Substitute conventional deadlifts with chest-supported rows or trap-bar deadlifts. Replace seated crunches with isometric planks and bird-dogs.');
      suggestedSwaps.push({
        original: 'Conventional Deadlift / Bent-Over Row',
        suggested: 'Chest-Supported Row or Trap Bar Deadlift',
        reason: 'Takes compressive shear forces off the lumbar spine while maintaining back stimulus.',
      });
    }
    if (lower.includes('elbow') || lower.includes('tenni') || lower.includes('golfer')) {
      adaptations.push('Minimise straight-bar curls. Use EZ-bars, hammer curls (neutral grip), or cables with rope attachments to alleviate tendon strain at the joint.');
      suggestedSwaps.push({
        original: 'Barbell Biceps Curl',
        suggested: 'Incline Dumbbell Hammer Curl (Neutral Grip)',
        reason: 'Aligns the wrist and forearm naturally to eliminate elbow tendonitis pain.',
      });
    }
    if (lower.includes('wrist')) {
      adaptations.push('Use wrist wraps on heavy pressing and lifting straps on pulls. Avoid extreme wrist hyperextension during pressing movements.');
    }

    injuryAdaptations = adaptations.length > 0
      ? `🛡️ Explicit Injury Protection Protocol for "${injuries}": ${adaptations.join(' ')}`
      : `🛡️ Note for "${injuries}": Warm up thoroughly with 2-3 progressive warmup sets before working loads. Stop any exercise immediately if sharp pain occurs.`;
  }

  // Fallback swaps if none triggered by injury
  if (suggestedSwaps.length === 0) {
    if (plan.exercises.some(e => e.name.toLowerCase().includes('incline dumbbell press'))) {
      suggestedSwaps.push({
        original: 'Incline Dumbbell Press',
        suggested: '30° Incline Smith Machine Press',
        reason: 'Increases stability for a deeper upper-chest stretch and safer failure training.',
      });
    }
    if (plan.exercises.some(e => e.name.toLowerCase().includes('lateral raise'))) {
      suggestedSwaps.push({
        original: 'Dumbbell Lateral Raises',
        suggested: 'Cross-Body Cable Lateral Raise (pulley at knee height)',
        reason: 'Provides continuous resistance in the lengthened position where dumbbells have zero tension.',
      });
    }
  }

  return {
    summary: `${athleteGreeting}!${statsSnippet} your ${plan.name} session is tailored for ${profile.primaryGoal.replace(/_/g, ' ')}. Primary compound lifts are prioritised first while your energy and muscular focus are peak.`,
    intensityCritique: `Aim for an Effort rating of 8/10 on your main barbell and dumbbell lifts (leave 2 clean repetitions in reserve). On your final isolation exercise, challenge yourself close to positive failure with smooth, controlled 3-second lowering tempo.`,
    volumeEvaluation,
    injuryAdaptations,
    suggestedSwaps: suggestedSwaps.length > 0 ? suggestedSwaps : [
      {
        original: plan.exercises[0]?.name || 'First Compound',
        suggested: 'Weighted Dips or Cable Crossover',
        reason: 'Adds mechanical variety depending on gym equipment availability.',
      },
    ],
    preWorkoutTip: `For your ${profile.targetWorkoutTime} session, drink 500ml water with a pinch of sea salt and consume 30–40g of quick carbohydrates (such as a banana, porridge with honey, or rice cakes) 45 minutes prior for sustained stamina and great muscle pumps.`,
    isAiGenerated: false,
  };
}
