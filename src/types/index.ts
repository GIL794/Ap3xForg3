export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PrimaryGoal = 
  | 'upper_body_hypertrophy'
  | 'full_body_hypertrophy'
  | 'strength'
  | 'fat_loss'
  | 'general_fitness';

export type SecondaryGoal = 
  | 'strength' 
  | 'aesthetics' 
  | 'endurance' 
  | 'mobility' 
  | 'core_stability';

export type EquipmentType = 
  | 'free_weights' 
  | 'machines' 
  | 'cables' 
  | 'bodyweight'
  | 'bands';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'core';

export type ExerciseCategory = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core';

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType[];
  tier: 'compound' | 'accessory' | 'isolation';
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
  targetRpe: string;
  techniqueCues: string[];
  tempo?: string;
  substitutes?: string[];
  progressionRule?: string;
}

export interface PlannedExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  tier: 'compound' | 'accessory' | 'isolation';
  sets: number;
  reps: string;
  restSeconds: number;
  targetRpe: string;
  notes: string;
  techniqueCues?: string[];
  tempo?: string;
  equipment: EquipmentType[];
  primaryMuscles: MuscleGroup[];
  progressionRule?: string;
}

export interface WarmupProtocol {
  durationMinutes: number;
  general: string[];
  specificActivation: string[];
}

export interface CooldownProtocol {
  durationMinutes: number;
  activities: string[];
}

export interface WorkoutDay {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;  // e.g. "Monday", "Sunday"
  isRestDay: boolean;
  name: string;     // e.g. "Upper A (Push Emphasis)"
  focus: string[];  // e.g. ["chest", "shoulders", "triceps"]
  estimatedDurationMinutes: number;
  warmup?: WarmupProtocol;
  exercises: PlannedExercise[];
  cooldown?: CooldownProtocol;
  progressionRule?: string;
}

export type MythologicalArchetype = 
  | 'hercules_mass'      // The Titan: Colossal Hypertrophy & Power (Hercules)
  | 'adonis_aesthetic'   // The Olympian: Golden Ratio V-Taper & Core (Adonis / Apollo)
  | 'ares_combat'        // The Centurion: Functional Stamina & Warrior Grit (Ares)
  | 'artemis_power'      // The Huntress: Glute & Posterior Chain Athletic Power (Artemis / Atalanta)
  | 'athena_sculpt'      // The War Goddess: Sculpted Delts & Aesthetic Symmetry (Athena)
  | 'aphrodite_curves';  // The Sovereign: Golden Ratio Hourglass & Vitality (Aphrodite / Venus)

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface UserProfile {
  name: string;
  location: string;
  timezone: string;
  experience: ExperienceLevel;
  primaryGoal: PrimaryGoal;
  secondaryGoals: SecondaryGoal[];
  availableDays: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  sessionLengthMinutes: number; // 45, 60, 75, 90
  equipment: EquipmentType[];
  injuries: string;
  preferences: string;
  targetWorkoutTime: string; // e.g. "19:00"
  archetype?: MythologicalArchetype;
  genderPreference?: 'masculine' | 'feminine' | 'neutral';
  ageYears?: number;
  heightCm?: number;
  currentWeightKg?: number;
  goalWeightKg?: number;
  bodyFatPercent?: number;
  lifetimeTonnageKg?: number;
}

export interface TodayWorkout {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  scheduledTime: string;
  isPastScheduledTime: boolean;
  isRestDay: boolean;
  message?: string;
  plan: WorkoutDay;
  catchUpPlan?: WorkoutDay;
}

export interface UserAccount {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface LoggedSetRecord {
  setNumber: number;
  type: SetType;
  weightKg: number;
  reps: number;
  targetWeightKg?: number;
  targetReps?: string;
  completed: boolean;
  isPr?: boolean;
}

export interface WorkoutHistorySession {
  id: string;
  date: string; // ISO date or YYYY-MM-DD
  dayName: string;
  workoutName: string;
  durationMinutes: number;
  totalTonnageKg: number;
  completedSetsCount: number;
  totalSetsCount: number;
  prCount: number;
  exercises: {
    id: string;
    name: string;
    category: ExerciseCategory;
    sets: LoggedSetRecord[];
  }[];
}

export interface AppState {
  userId: string;
  userAccount: UserAccount;
  profile: UserProfile;
  weeklyPlan: WorkoutDay[];
  todayWorkout: TodayWorkout;
  completedSets: Record<string, boolean[]>; // exerciseId -> array of completed booleans
  setTypes?: Record<string, SetType[]>;    // exerciseId -> array of set types
  loggedWeights: Record<string, number>;    // exerciseId -> weight in kg
  detailedSets?: Record<string, LoggedSetRecord[]>; // exerciseId -> array of LoggedSetRecord
  totalTonnageKg: number;
  xp?: number;
  lastGeneratedAt: string;
  onboardingCompleted: boolean;
  loreRead: boolean;
  isProSubscriber?: boolean;
}

