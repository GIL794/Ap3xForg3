import { describe, it, expect } from 'vitest';
import { calculateNutritionTarget } from '../logic/nutritionCalculator';
import { UserProfile } from '../types';

describe('ISO 8000 & ISO/IEC 25010 Data Integrity - Nutrition Calculator', () => {
  const unconfiguredProfile: UserProfile = {
    name: 'Gladiator',
    location: 'Rome',
    timezone: 'UTC',
    experience: 'Intermediate',
    primaryGoal: 'upper_body_hypertrophy',
    secondaryGoals: [],
    availableDays: [1, 2, 4, 5],
    sessionLengthMinutes: 60,
    equipment: ['free_weights'],
    injuries: '',
    preferences: '',
    targetWorkoutTime: '19:00',
    // Biometrics omitted/undefined (Zero Assumptions)
  };

  it('strictly returns isConfigured: false when biometrics are uncalibrated', () => {
    const result = calculateNutritionTarget(unconfiguredProfile);

    expect(result.isConfigured).toBe(false);
    expect(result.missingFields).toContain('currentWeightKg');
    expect(result.missingFields).toContain('heightCm');
    expect(result.missingFields).toContain('ageYears');
    expect(result.targetCalories).toBe(0);
    expect(result.proteinGrams).toBe(0);
  });

  it('accurately computes target calories, TDEE, and macros when genuine biometrics are provided', () => {
    const calibratedProfile: UserProfile = {
      ...unconfiguredProfile,
      currentWeightKg: 82,
      goalWeightKg: 85,
      heightCm: 180,
      ageYears: 30,
      genderPreference: 'masculine',
    };

    const result = calculateNutritionTarget(calibratedProfile);

    expect(result.isConfigured).toBe(true);
    expect(result.missingFields).toHaveLength(0);
    expect(result.bmr).toBeGreaterThan(1700);
    expect(result.tdee).toBeGreaterThan(result.bmr);
    expect(result.targetCalories).toBeGreaterThan(result.tdee); // Surplus for hypertrophy
    expect(result.proteinGrams).toBeGreaterThan(150);
    expect(result.carbsGrams).toBeGreaterThan(200);
    expect(result.fatsGrams).toBeGreaterThan(50);
  });

  it('calculates deficit for cut/fat loss goal', () => {
    const cutProfile: UserProfile = {
      ...unconfiguredProfile,
      currentWeightKg: 90,
      goalWeightKg: 82,
      heightCm: 182,
      ageYears: 28,
      primaryGoal: 'fat_loss',
    };

    const result = calculateNutritionTarget(cutProfile);

    expect(result.isConfigured).toBe(true);
    expect(result.targetCalories).toBeLessThan(result.tdee); // Caloric deficit
    expect(result.calorieDelta).toBeLessThan(0);
  });
});
