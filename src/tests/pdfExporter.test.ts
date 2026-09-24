import { describe, it, expect, vi } from 'vitest';
import { generateImperialWorkoutPdf, ExportableWorkoutSession, AthleteInfo } from '../logic/pdfExporter';

describe('ISO/IEC 25010 Functional Completeness - Imperial PDF Scroll Exporter', () => {
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

  it('generates Imperial Roman PDF scroll without throwing exceptions', () => {
    // jsPDF internally calls HTML5 save in browsers, we verify generation executes cleanly
    expect(() => {
      generateImperialWorkoutPdf(session, athlete);
    }).not.toThrow();
  });
});
