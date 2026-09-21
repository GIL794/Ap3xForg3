import { UserProfile } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  location: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London',
  experience: 'Intermediate',
  primaryGoal: 'upper_body_hypertrophy',
  secondaryGoals: ['strength', 'aesthetics'],
  availableDays: [1, 2, 4, 5, 0],
  sessionLengthMinutes: 75,
  equipment: ['free_weights', 'machines', 'cables'],
  injuries: '',
  preferences: '',
  targetWorkoutTime: '19:00',
  archetype: 'hercules_mass',
  genderPreference: 'masculine',
  ageYears: 28,
  heightCm: 178,
  currentWeightKg: 78,
  goalWeightKg: 82,
  bodyFatPercent: 15,
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
