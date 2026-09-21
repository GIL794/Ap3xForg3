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
Analyze this athlete's workout plan and provide concise, high-value coaching recommendations.
Pay SPECIAL attention to any listed injuries and provide explicit exercise modifications.

Athlete Profile:
- Name: ${profile.name}
- Location & Timezone: ${profile.location || 'Unknown'} (${profile.timezone || 'UTC'})
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
${(plan.exercises || []).map((e, idx) => `  ${idx + 1}. ${e.name} (${e.sets} sets x ${e.reps}, Rest: ${e.restSeconds}s, RPE: ${e.targetRpe})`).join('\n')}

Format your response strictly as JSON with the following structure:
{
  "summary": "1-2 sentence assessment of how this workout fits their goal",
  "intensityCritique": "Advice on RPE and mechanical tension for today's compounds",
  "volumeEvaluation": "Assessment of weekly and session volume for their experience level",
  "injuryAdaptations": "${injuryText !== 'None' ? 'Specific modifications for ' + injuryText + ' — list any exercises to avoid or substitute, and provide safe alternatives' : 'No active injuries noted. Cleared for full prescribed program.'}",
  "suggestedSwaps": [
    {"original": "Exercise Name", "suggested": "Alternative Name", "reason": "Why this swap may benefit them"}
  ],
  "preWorkoutTip": "Specific timing or nutritional advice for their session at ${profile.targetWorkoutTime}"
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
