import { UserProfile } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Gabriele',
  location: 'London, UK',
  timezone: 'Europe/London',
  experience: 'Intermediate',
  primaryGoal: 'upper_body_hypertrophy',
  secondaryGoals: ['strength', 'aesthetics'],
  // Mon (1), Tue (2), Thu (4), Fri (5), and Sun (0) to ensure today's 19:00 session is ready
  availableDays: [1, 2, 4, 5, 0],
  sessionLengthMinutes: 75,
  equipment: ['free_weights', 'machines', 'cables'],
  injuries: '',
  preferences: 'Likes compound lifts, progressive overload, structured plans. Dislikes overly long workouts, random WOD style.',
  targetWorkoutTime: '19:00',
};

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const DAY_NAMES_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;
