import { UserProfile, WorkoutDay, TodayWorkout } from '../types';

/**
 * Parses a "HH:mm" time string into minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Formats a Date into YYYY-MM-DD in the specified timezone
 */
export function getFormattedDateInTz(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Gets current hour and minute in specified timezone
 */
export function getCurrentTimeInTz(date: Date, timezone: string): { hour: number; minute: number; timeString: string; dayOfWeek: number } {
  try {
    const timeParts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const hour = Number(timeParts.find(p => p.type === 'hour')?.value ?? date.getHours());
    const minute = Number(timeParts.find(p => p.type === 'minute')?.value ?? date.getMinutes());
    
    // Day of week in timezone
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
    });
    const weekdayStr = dayFormatter.format(date);
    const dayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const dayOfWeek = dayMap[weekdayStr] ?? date.getDay();

    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return { hour, minute, timeString, dayOfWeek };
  } catch {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return { hour, minute, timeString, dayOfWeek: date.getDay() };
  }
}

/**
 * Resolves today's workout plan based on current time and user's scheduled weekly routine
 */
export function resolveTodayWorkout(
  weeklyPlan: WorkoutDay[],
  profile: UserProfile,
  referenceDate: Date = new Date()
): TodayWorkout {
  const { timeString: currentTimeStr, dayOfWeek } = getCurrentTimeInTz(referenceDate, profile.timezone);
  const dateStr = getFormattedDateInTz(referenceDate, profile.timezone);

  const currentMins = timeStringToMinutes(currentTimeStr);
  const targetMins = timeStringToMinutes(profile.targetWorkoutTime || '19:00');
  const isPastScheduledTime = currentMins > targetMins;

  // Find plan for today
  let todayDayPlan = weeklyPlan.find(d => d.dayIndex === dayOfWeek);

  // If not found or empty, fallback
  if (!todayDayPlan) {
    todayDayPlan = {
      dayIndex: dayOfWeek,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      isRestDay: true,
      name: 'Active Recovery & Mobility',
      focus: ['mobility', 'recovery'],
      estimatedDurationMinutes: 20,
      exercises: [],
    };
  }

  // Build catch-up plan in case user missed scheduled time or needs an efficient workout
  const catchUpExercises = todayDayPlan.exercises.slice(0, 4).map(ex => ({
    ...ex,
    sets: Math.max(2, ex.sets - 1),
    notes: `${ex.notes} (Express 35-min intensity session)`
  }));

  const catchUpPlan: WorkoutDay = {
    ...todayDayPlan,
    name: `${todayDayPlan.name} [Express Catch-Up]`,
    estimatedDurationMinutes: 35,
    exercises: catchUpExercises,
  };

  let message = '';
  if (todayDayPlan.isRestDay) {
    message = 'Today is scheduled as a rest or active recovery day.';
  } else if (!isPastScheduledTime) {
    const minutesRemaining = targetMins - currentMins;
    if (minutesRemaining <= 60) {
      message = `Session starts in ${minutesRemaining} minutes at ${profile.targetWorkoutTime}. Pre-workout ready!`;
    } else {
      const hrs = Math.floor(minutesRemaining / 60);
      const mins = minutesRemaining % 60;
      message = `Scheduled for ${profile.targetWorkoutTime} today (~${hrs}h ${mins}m away). Review your plan below!`;
    }
  } else {
    message = `It is past your scheduled ${profile.targetWorkoutTime} start. You can do the full session, run the 35-min Catch-Up express plan, or preview tomorrow!`;
  }

  return {
    date: dateStr,
    dayOfWeek,
    scheduledTime: profile.targetWorkoutTime || '19:00',
    isPastScheduledTime,
    isRestDay: todayDayPlan.isRestDay,
    message,
    plan: todayDayPlan,
    catchUpPlan,
  };
}
