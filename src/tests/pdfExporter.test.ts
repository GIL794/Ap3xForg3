import { describe, it, expect } from 'vitest';
import { 
  generateImperialWorkoutPdf, 
  generateExerciseDossierPdf, 
  generateWeeklyPlanPdf, 
  ExportableWorkoutSession, 
  AthleteInfo 
} from '../logic/pdfExporter';
import { PlannedExercise, WorkoutDay, UserProfile } from '../types';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { generateWeeklyPlan } from '../logic/planGenerator';

describe('ISO/IEC 25010 Functional Completeness - Imperial PDF Scroll & Codex Exporters', () => {
  const session: ExportableWorkoutSession = {
    date: '2026-09-24',
    dayName: 'Thursday',
    workoutName: 'Upper Body A (Push Emphasis)',
    durationMinutes: 75,
    totalTonnageKg: 6200,
    completedSetsCount: 16,
    exercises: [
      {
        id: 'barbell_bench_press',
        name: 'Barbell Bench Press',
        category: 'push',
        sets: [
          { setNumber: 1, weightKg: 100, reps: 8, completed: true },
          { setNumber: 2, weightKg: 100, reps: 8, completed: true },
          { setNumber: 3, weightKg: 95, reps: 9, completed: true },
          { setNumber: 4, weightKg: 90, reps: 10, completed: true },
        ],
      },
      {
        id: 'overhead_press',
        name: 'Standing Barbell Overhead Press',
        category: 'push',
        sets: [
          { setNumber: 1, weightKg: 60, reps: 8, completed: true },
          { setNumber: 2, weightKg: 60, reps: 8, completed: true },
          { setNumber: 3, weightKg: 55, reps: 10, completed: true },
        ],
      },
    ],
  };

  const athlete: AthleteInfo = {
    name: 'Gabriele',
    archetype: 'hercules_mass',
    level: 7,
    xp: 4200,
  };

  const testExercise: PlannedExercise = {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'push',
    tier: 'compound',
    sets: 4,
    reps: '8-10',
    restSeconds: 120,
    targetRpe: '8-9',
    notes: 'Primary horizontal press.',
    equipment: ['free_weights'],
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    progressionRule: 'Double progression: 4x8 -> 4x10 before adding 2.5kg.',
    executionSteps: {
      setup: 'Set shoulder blades retracted and depressed into bench pad.',
      eccentric: 'Lower bar with forearms vertical to lower sternum.',
      concentric: 'Drive through pectorals without letting shoulders roll forward.',
      commonMistakes: 'Bouncing bar off chest or flaring elbows 90 degrees.',
    },
    techniqueCues: ['Bend the bar in half', 'Drive feet through the ground'],
  };

  it('generates Imperial Roman Daily Workout PDF scroll without throwing', () => {
    expect(() => {
      generateImperialWorkoutPdf(session, athlete);
    }).not.toThrow();
  });

  it('generates Individual Exercise Biomechanical Codex PDF without throwing', () => {
    expect(() => {
      generateExerciseDossierPdf(testExercise, 'en', 'Gabriele');
    }).not.toThrow();
  });

  it('generates Weekly VII-Day Training Codex PDF without throwing', () => {
    const weeklyPlan = generateWeeklyPlan(DEFAULT_PROFILE);
    expect(() => {
      generateWeeklyPlanPdf(weeklyPlan, DEFAULT_PROFILE, 'en');
    }).not.toThrow();
  });
});
