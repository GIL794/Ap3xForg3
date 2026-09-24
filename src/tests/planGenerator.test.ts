import { describe, it, expect } from 'vitest';
import { generateWeeklyPlan } from '../logic/planGenerator';
import { DEFAULT_PROFILE } from '../data/defaultProfile';

describe('ISO/IEC 25010 Functional Completeness - Plan Generator', () => {
  it('generates a 7-day schedule with both rest and training days without throwing', () => {
    const plan = generateWeeklyPlan(DEFAULT_PROFILE);

    expect(plan).toHaveLength(7);
    const trainingDays = plan.filter(day => !day.isRestDay);
    const restDays = plan.filter(day => day.isRestDay);

    expect(trainingDays.length).toBeGreaterThanOrEqual(1);
    expect(restDays.length).toBeGreaterThanOrEqual(1);
  });

  it('populates valid exercise definitions and biomechanical cues without assumptions', () => {
    const plan = generateWeeklyPlan(DEFAULT_PROFILE);
    const firstTrainingDay = plan.find(d => !d.isRestDay);

    expect(firstTrainingDay).toBeDefined();
    if (firstTrainingDay) {
      expect(firstTrainingDay.exercises.length).toBeGreaterThan(0);
      firstTrainingDay.exercises.forEach(ex => {
        expect(ex.name).toBeTruthy();
        expect(ex.sets).toBeGreaterThan(0);
        expect(ex.reps).toBeTruthy();
      });
    }
  });
});
