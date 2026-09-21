// Vercel Serverless Function: /api/ai-coach
// Reads GEMINI_API_KEY from server-side environment (never exposed to browser)
// Called by the frontend as POST /api/ai-coach

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // No key configured — return a signal to use rule-based fallback
    return res.status(200).json({ useFallback: true });
  }

  try {
    const { profile, todayWorkout } = req.body;

    if (!profile || !todayWorkout) {
      return res.status(400).json({ error: 'Missing profile or todayWorkout' });
    }

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
- Location & Timezone: ${profile.location || 'London, UK'} (${profile.timezone || 'Europe/London'})
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
1. Use British English spelling throughout (e.g. optimise, prioritise, colour, programme, minimise, calibre).
2. Write in plain, clear, conversational English that is easily understood by any gym-goer. Avoid academic jargon (explain any technical terms like RPE simply as effort level out of 10).
3. Greet the athlete warmly by name (${profile.name}) in the summary and reference their specific stats.
4. If an injury is present (${injuryText}), you MUST explicitly name it, explain the safe range of motion, and suggest direct exercise substitutions.

Format your response strictly as JSON with the following structure:
{
  "summary": "Warm, personalised 1-2 sentence overview addressing ${profile.name} and how today's session moves them towards their goal",
  "intensityCritique": "Clear advice on how hard to push (Effort out of 10) on main compound lifts versus accessory exercises",
  "volumeEvaluation": "Plain-English assessment of the ${plan.exercises.length} movements and set volume for their recovery capacity",
  "injuryAdaptations": "${injuryText !== 'None' ? 'Explicit protection protocol for ' + injuryText + ' — movements/angles to avoid, and safe alternatives' : 'No active injuries reported. Full clearance for all prescribed exercises.'}",
  "suggestedSwaps": [
    {"original": "Exercise Name", "suggested": "Alternative Name", "reason": "Plain-English reason why this swap protects joints or fits equipment"}
  ],
  "preWorkoutTip": "Actionable hydration and fueling tip timed for their ${profile.targetWorkoutTime} session"
}`;

    const geminiRes = await fetch(
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

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      console.error('Gemini API error:', errData);
      return res.status(200).json({ useFallback: true, error: errData.error?.message });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(200).json({ useFallback: true });
    }

    const parsed = JSON.parse(rawText);
    return res.status(200).json({ ...parsed, isAiGenerated: true });
  } catch (err) {
    console.error('ai-coach handler error:', err);
    // Always return graceful fallback signal — never 500 to user
    return res.status(200).json({ useFallback: true });
  }
}
