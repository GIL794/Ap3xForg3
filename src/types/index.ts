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

export interface AppState {
  profile: UserProfile;
  weeklyPlan: WorkoutDay[];
  todayWorkout: TodayWorkout;
  completedSets: Record<string, boolean[]>; // exerciseId -> array of completed booleans
  loggedWeights: Record<string, number[]>;  // exerciseId -> array of weight in kg
  lastGeneratedAt: string;
}
