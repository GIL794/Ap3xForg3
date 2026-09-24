import { 
  UserProfile, 
  WorkoutDay, 
  PlannedExercise, 
  ExerciseDefinition, 
  WarmupProtocol, 
  CooldownProtocol 
} from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { DAY_NAMES } from '../data/defaultProfile';
import { getBiomechanicalExecution } from '../data/exerciseBiomechanics';

/**
 * Filter exercises by available user equipment
 */
function filterByEquipment(exercises: ExerciseDefinition[], userEquipment: string[]): ExerciseDefinition[] {
  return exercises.filter(ex => 
    ex.equipment.some(eq => userEquipment.includes(eq)) || ex.equipment.includes('bodyweight')
  );
}

/**
 * Safe exercise selector that rotates choices based on variation seed
 */
function pickExercise(
  candidateIds: string[],
  availableExercises: ExerciseDefinition[],
  alreadyPickedIds: Set<string>,
  fallbackCategory?: ExerciseDefinition['category'],
  variationSeed: number = 0
): PlannedExercise {
  // Reorder candidates by variationSeed offset
  const reordered: string[] = [];
  const offset = candidateIds.length > 0 ? (variationSeed % candidateIds.length) : 0;
  for (let i = 0; i < candidateIds.length; i++) {
    reordered.push(candidateIds[(i + offset) % candidateIds.length]);
  }

  // First try reordered candidate IDs
  for (const id of reordered) {
    if (!alreadyPickedIds.has(id)) {
      const match = availableExercises.find(e => e.id === id);
      if (match) {
        alreadyPickedIds.add(match.id);
        return exerciseDefToPlanned(match);
      }
    }
  }

  // Fallback to category if candidates weren't available with current equipment
  if (fallbackCategory) {
    const categoryMatches = availableExercises.filter(
      e => e.category === fallbackCategory && !alreadyPickedIds.has(e.id)
    );
    if (categoryMatches.length > 0) {
      const catOffset = variationSeed % categoryMatches.length;
      const chosen = categoryMatches[catOffset];
      alreadyPickedIds.add(chosen.id);
      return exerciseDefToPlanned(chosen);
    }
  }

  // Absolute fallback
  const fallbackDef = EXERCISE_LIBRARY.find(e => e.id === candidateIds[0]) || EXERCISE_LIBRARY[0];
  return exerciseDefToPlanned(fallbackDef);
}

function exerciseDefToPlanned(def: ExerciseDefinition, customSets?: number, customReps?: string): PlannedExercise {
  const bio = getBiomechanicalExecution(def.id, def.name);
  return {
    id: def.id,
    name: def.name,
    category: def.category,
    tier: def.tier,
    sets: customSets ?? def.defaultSets,
    reps: customReps ?? def.defaultReps,
    restSeconds: def.defaultRestSec,
    targetRpe: def.targetRpe,
    notes: def.techniqueCues.slice(0, 2).join(' • '),
    techniqueCues: def.techniqueCues,
    tempo: def.tempo,
    equipment: def.equipment,
    primaryMuscles: def.primaryMuscles,
    progressionRule: def.progressionRule || 'Add 2.5 kg (compound) or 1 kg (accessory) when hitting top reps for all sets.',
    executionSteps: bio.execution,
    biomechanicalFocus: bio.focus,
    engineSource: 'library'
  };
}

/**
 * Deeply personalizes a planned exercise using the athlete's complete profile
 */
export function personalizeExercise(ex: PlannedExercise, profile: UserProfile): PlannedExercise {
  const finalEx: PlannedExercise = { ...ex };
  const injuryStr = (profile.injuries || '').toLowerCase();
  let isSubstituted = false;
  const originalName = ex.name;

  // 1. Comprehensive Biomechanical Injury Substitutions
  if (injuryStr.includes('shoulder') || injuryStr.includes('rotator') || injuryStr.includes('impingement')) {
    if (finalEx.id === 'barbell_bench_press') {
      finalEx.id = 'incline_db_neutral_press';
      finalEx.name = 'Incline Dumbbell Neutral Press (Shoulder Safe)';
      finalEx.notes = 'Neutral palms-in grip at 30° eliminates subacromial impingement.';
      isSubstituted = true;
    } else if (finalEx.id === 'overhead_press') {
      finalEx.id = 'incline_db_neutral_press';
      finalEx.name = 'Seated Incline Neutral Dumbbell Press (Shoulder Safe)';
      finalEx.notes = 'Neutral grip eliminates acromial impingement under overhead load.';
      isSubstituted = true;
    } else if (finalEx.id === 'dips_chest') {
      finalEx.id = 'machine_chest_press';
      finalEx.name = 'Machine Chest Press (Shoulder Safe)';
      finalEx.notes = 'Guided trajectory stabilizes glenohumeral joint.';
      isSubstituted = true;
    }
  }

  if (injuryStr.includes('lower back') || injuryStr.includes('lumbar') || injuryStr.includes('sciatica') || injuryStr.includes('disc')) {
    if (finalEx.id === 'barbell_bent_over_row') {
      finalEx.id = 'chest_supported_row';
      finalEx.name = 'Chest-Supported Incline DB Row (Lumbar Safe)';
      finalEx.notes = 'Chest pad support completely relieves axial shear on lumbar vertebrae.';
      isSubstituted = true;
    } else if (finalEx.id === 'barbell_squat') {
      finalEx.id = 'leg_press';
      finalEx.name = '45-Degree Leg Press (Lumbar Supported)';
      finalEx.notes = 'Rigid back support pad prevents spinal compression and pelvic tilt.';
      isSubstituted = true;
    }
  }

  if (injuryStr.includes('knee') || injuryStr.includes('patellar') || injuryStr.includes('meniscus') || injuryStr.includes('acl')) {
    if (finalEx.id === 'leg_extension') {
      finalEx.id = 'romanian_deadlift';
      finalEx.name = 'Romanian Deadlift (Hamstring / Knee Sparing)';
      finalEx.notes = 'Posterior-chain hip hinge eliminates anterior patellofemoral shear.';
      isSubstituted = true;
    } else if (finalEx.id === 'walking_lunges') {
      finalEx.id = 'box_squats';
      finalEx.name = 'Box Squat with Vertical Shin (Patellar Safe)';
      finalEx.notes = 'Vertical shin angle minimizes patellar tendon shear.';
      isSubstituted = true;
    }
  }

  if (injuryStr.includes('elbow') || injuryStr.includes('tennis') || injuryStr.includes('golfer')) {
    if (finalEx.id === 'skull_crushers') {
      finalEx.id = 'triceps_rope_pushdown';
      finalEx.name = 'Cable Rope Pushdown (Elbow Safe)';
      finalEx.notes = 'Neutral rope separation eliminates medial elbow torque.';
      isSubstituted = true;
    } else if (finalEx.id === 'barbell_curl') {
      finalEx.id = 'hammer_curl';
      finalEx.name = 'Dumbbell Hammer Curls (Neutral Grip / Elbow Safe)';
      finalEx.notes = 'Neutral wrist alignment eliminates epicondylar tension.';
      isSubstituted = true;
    }
  }

  if (injuryStr.includes('wrist') || injuryStr.includes('carpal')) {
    if (finalEx.id === 'barbell_curl') {
      finalEx.id = 'hammer_curl';
      finalEx.name = 'Dumbbell Hammer Curls (Wrist Sparing)';
      finalEx.notes = 'Neutral grip avoids wrist hyperextension under load.';
      isSubstituted = true;
    }
  }

  // 2. Load Sports-Science Biomechanical Execution Guide
  const bio = getBiomechanicalExecution(finalEx.id, finalEx.name);
  finalEx.executionSteps = bio.execution;
  finalEx.biomechanicalFocus = bio.focus;
  finalEx.engineSource = 'library';

  if (isSubstituted) {
    finalEx.isInjurySubstituted = true;
    finalEx.originalExerciseName = originalName;
  }

  // 3. Synthesize Rich Personalized Rationale (Strict ISO Data Quality — Zero Assumptions)
  const archetype = profile.archetype;
  const height = profile.heightCm;
  const currW = profile.currentWeightKg;
  const goalW = profile.goalWeightKg;
  const isDeficit = profile.primaryGoal === 'fat_loss' || (typeof currW === 'number' && typeof goalW === 'number' && goalW < currW - 2);
  const isSurplus = profile.primaryGoal === 'upper_body_hypertrophy' || profile.primaryGoal === 'full_body_hypertrophy' || (typeof currW === 'number' && typeof goalW === 'number' && goalW > currW + 2);

  const rationaleParts: string[] = [];

  // Archetype rationale (only if archetype is selected)
  if (archetype === 'adonis_aesthetic') {
    if (finalEx.primaryMuscles.includes('chest') || finalEx.primaryMuscles.includes('shoulders')) {
      rationaleParts.push('Adonis V-Taper Priority: Clavicular upper chest and lateral delt volume to forge the 1.618 Golden Ratio');
    } else if (finalEx.primaryMuscles.includes('back')) {
      rationaleParts.push('Adonis V-Taper Priority: Lat width expansion for a tapered silhouette flowing into a narrow waist');
    } else {
      rationaleParts.push('Adonis Aesthetic Calibration: Proportional hypertrophy and structural balance');
    }
  } else if (archetype === 'hercules_mass') {
    rationaleParts.push('Hercules Mass Protocol: Heavy compound overload engineered for maximum myofibrillar mass and colossal strength');
  } else if (archetype === 'artemis_power') {
    if (finalEx.primaryMuscles.includes('glutes') || finalEx.primaryMuscles.includes('hamstrings')) {
      rationaleParts.push('Artemis Huntress Priority: Powerful posterior-chain recruitment for explosive athletic power and glute drive');
    } else {
      rationaleParts.push('Artemis Athletic Conditioning: Functional kinetic energy transfer and core stability');
    }
  } else if (archetype === 'aphrodite_curves') {
    if (finalEx.primaryMuscles.includes('glutes') || finalEx.primaryMuscles.includes('hamstrings') || finalEx.primaryMuscles.includes('shoulders')) {
      rationaleParts.push('Aphrodite Sovereign Focus: Targeted glute and lateral delt tension to craft a sculpted hourglass aesthetic');
    } else {
      rationaleParts.push('Aphrodite Conditioning: High metabolic muscle tone with minimal waist thickening');
    }
  } else if (archetype === 'ares_combat') {
    rationaleParts.push('Ares Centurion Protocol: High work capacity and functional unilateral strength for battle-ready stamina');
  } else if (archetype === 'athena_sculpt') {
    rationaleParts.push('Athena Goddess Focus: Postural scapular alignment and 3D shoulder capping for symmetry');
  }

  // Height lever biomechanical adjustment (strictly if height is provided)
  if (typeof height === 'number' && height > 0) {
    if (height >= 185) {
      if (finalEx.category === 'legs') {
        rationaleParts.push(`Tall Lever Calibration (${height}cm): Longer femurs increase knee torque—cueing wider stance and high foot placement`);
      } else if (finalEx.category === 'push') {
        rationaleParts.push(`Tall Lever Calibration (${height}cm): Longer humeri create high shoulder moment arms—tuck elbows at ~45° to protect acromion`);
      }
    } else if (height <= 165) {
      rationaleParts.push(`Compact Lever Advantage (${height}cm): Shorter moment arms allow full deep stretch and explosive concentric power`);
    }
  }

  // Weight goal context (strictly if weights are provided)
  if (typeof currW === 'number' && typeof goalW === 'number' && currW > 0 && goalW > 0) {
    if (isDeficit) {
      rationaleParts.push(`Caloric Deficit (${currW}kg → ${goalW}kg): Mechanical tension prioritized at RPE ${finalEx.targetRpe} to shield muscle against catabolism`);
    } else if (isSurplus) {
      rationaleParts.push(`Hypertrophic Surplus (${currW}kg → ${goalW}kg): Rest intervals (${finalEx.restSeconds}s) configured for ATP-CP replenishment and progressive volume`);
    }
  }

  // Injury note
  if (isSubstituted) {
    rationaleParts.push(`Joint Safeguard: Substituted from ${originalName} to eliminate harmful shear forces`);
  }

  finalEx.personalizationReason = rationaleParts.join(' • ');

  return finalEx;
}

/**
 * Generates appropriate warm-up based on focus areas
 */
function generateWarmup(focus: string[]): WarmupProtocol {
  const isUpper = focus.some(f => ['chest', 'back', 'shoulders', 'arms'].includes(f));
  const isLower = focus.some(f => ['quads', 'hamstrings', 'glutes'].includes(f));

  const general = [
    '3-5 minutes light cardio (incline treadmill walk, stationary rower, or bike) to raise core body temp',
    'Controlled arm swings, torso twists & thoracic spine rotations (15 reps each)'
  ];

  const specificActivation: string[] = [];
  if (isUpper) {
    specificActivation.push('Scapular push-ups & band pull-aparts (2 sets of 15 reps)');
    specificActivation.push('Light cable or dumbbell face pulls / external rotations (1-2 sets of 12 reps)');
    specificActivation.push('Pyramid warm-up sets on first main compound (empty bar x 10, 50% x 5, 75% x 3)');
  }
  if (isLower) {
    specificActivation.push('World\'s greatest stretch & deep bodyweight goblet squat hold (60 sec)');
    specificActivation.push('Glute bridges & bodyweight lateral lunges (2 sets of 10/side)');
    specificActivation.push('Pyramid warm-up sets on primary leg movement before working sets');
  }

  return {
    durationMinutes: 7,
    general,
    specificActivation
  };
}

/**
 * Generates appropriate cool-down
 */
function generateCooldown(focus: string[]): CooldownProtocol {
  const isUpper = focus.some(f => ['chest', 'back', 'shoulders', 'arms'].includes(f));
  const activities = [
    '2 minutes relaxed nasal breathing walk to lower heart rate'
  ];
  if (isUpper) {
    activities.push('Doorway chest & anterior delt stretch (45s per side)');
    activities.push('Lat & upper back dead hang or doorway stretch (45s)');
  } else {
    activities.push('Kneeling hip flexor / couch stretch (45s per side)');
    activities.push('Hamstring & calf stretch (45s per side)');
  }
  return {
    durationMinutes: 4,
    activities
  };
}

/**
 * Calibrates workout volume to target session length (45, 60, 75, 90 mins)
 */
function calibrateVolume(exercises: PlannedExercise[], sessionLengthMinutes: number): PlannedExercise[] {
  let targetExerciseCount = 6;
  if (sessionLengthMinutes <= 45) {
    targetExerciseCount = 4;
  } else if (sessionLengthMinutes <= 60) {
    targetExerciseCount = 5;
  } else if (sessionLengthMinutes >= 90) {
    targetExerciseCount = 8;
  } else {
    targetExerciseCount = 6; // 75 mins
  }

  // Slice or adjust sets
  const adjusted = exercises.slice(0, targetExerciseCount).map((ex, idx) => {
    // If 45 min, reduce sets slightly to keep pace high
    if (sessionLengthMinutes <= 45 && ex.tier === 'accessory') {
      return { ...ex, sets: Math.max(2, ex.sets - 1), restSeconds: Math.min(ex.restSeconds, 60) };
    }
    // If 75-90 min, keep robust sets
    return ex;
  });

  return adjusted;
}

/**
 * Estimates total workout duration in minutes
 */
function estimateDuration(exercises: PlannedExercise[], warmupMinutes: number, cooldownMinutes: number): number {
  let totalMinutes = warmupMinutes + cooldownMinutes;
  for (const ex of exercises) {
    // Average set execution ~45 sec (0.75 min) + rest seconds
    const timePerSet = 0.75 + (ex.restSeconds / 60);
    totalMinutes += ex.sets * timePerSet;
    // Buffer for plate changes/transition ~1 min per exercise
    totalMinutes += 1.2;
  }
  return Math.round(totalMinutes);
}

/**
 * Builds Upper A (Push Emphasis)
 */
function buildUpperA(available: ExerciseDefinition[], sessionLength: number, variationSeed: number = 0): WorkoutDay {
  const picked = new Set<string>();
  const exercises: PlannedExercise[] = [
    pickExercise(['barbell_bench_press', 'machine_chest_press'], available, picked, 'push', variationSeed),
    pickExercise(['incline_db_press', 'cable_chest_fly'], available, picked, 'push', variationSeed),
    pickExercise(['overhead_press', 'cable_lateral_raise'], available, picked, 'shoulders', variationSeed),
    pickExercise(['lat_pulldown', 'pull_ups', 'seated_cable_row'], available, picked, 'pull', variationSeed),
    pickExercise(['db_lateral_raise', 'cable_lateral_raise'], available, picked, 'shoulders', variationSeed),
    pickExercise(['triceps_rope_pushdown', 'skull_crushers', 'dips_chest'], available, picked, 'arms', variationSeed),
    pickExercise(['cable_crunch', 'hanging_leg_raise', 'ab_plank'], available, picked, 'core', variationSeed)
  ];

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['chest', 'shoulders', 'triceps']);
  const cooldown = generateCooldown(['chest', 'shoulders', 'triceps']);

  return {
    dayIndex: 1,
    dayName: 'Monday',
    isRestDay: false,
    name: 'Upper A (Push Emphasis & Upper Pecs)',
    focus: ['chest', 'shoulders', 'triceps', 'lats'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'Double progression: When you achieve top reps (e.g. 8 or 10) on all sets with pristine technique, increase load by 2.5 kg next session.'
  };
}

/**
 * Builds Lower A (Squat Emphasis & Hamstrings)
 */
function buildLowerA(available: ExerciseDefinition[], sessionLength: number, variationSeed: number = 0): WorkoutDay {
  const picked = new Set<string>();
  const exercises: PlannedExercise[] = [
    pickExercise(['barbell_squat', 'leg_press'], available, picked, 'legs', variationSeed),
    pickExercise(['romanian_deadlift'], available, picked, 'legs', variationSeed),
    pickExercise(['leg_extension', 'walking_lunges'], available, picked, 'legs', variationSeed),
    pickExercise(['seated_leg_curl'], available, picked, 'legs', variationSeed),
    pickExercise(['calf_raises'], available, picked, 'legs', variationSeed),
    pickExercise(['hanging_leg_raise', 'cable_crunch'], available, picked, 'core', variationSeed)
  ];

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['quads', 'hamstrings', 'glutes']);
  const cooldown = generateCooldown(['quads', 'hamstrings', 'glutes']);

  return {
    dayIndex: 2,
    dayName: 'Tuesday',
    isRestDay: false,
    name: 'Lower A (Squat Focus & Posterior Chain)',
    focus: ['quads', 'hamstrings', 'glutes', 'core'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'Increase squat/leg press load by 2.5-5 kg once all sets hit top of rep range.'
  };
}

/**
 * Builds Upper B (Pull Emphasis & Width)
 */
function buildUpperB(available: ExerciseDefinition[], sessionLength: number, variationSeed: number = 0): WorkoutDay {
  const picked = new Set<string>();
  const exercises: PlannedExercise[] = [
    pickExercise(['pull_ups', 'lat_pulldown'], available, picked, 'pull', variationSeed),
    pickExercise(['barbell_bent_over_row', 'one_arm_db_row', 'seated_cable_row'], available, picked, 'pull', variationSeed),
    pickExercise(['incline_db_press', 'machine_chest_press', 'dips_chest'], available, picked, 'push', variationSeed),
    pickExercise(['seated_cable_row', 'face_pulls'], available, picked, 'pull', variationSeed),
    pickExercise(['face_pulls', 'rear_delt_flyes'], available, picked, 'pull', variationSeed),
    pickExercise(['barbell_curl', 'incline_db_curl', 'hammer_curl'], available, picked, 'arms', variationSeed),
    pickExercise(['skull_crushers', 'triceps_rope_pushdown'], available, picked, 'arms', variationSeed)
  ];

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['back', 'biceps', 'rear_delts']);
  const cooldown = generateCooldown(['back', 'biceps']);

  return {
    dayIndex: 4,
    dayName: 'Thursday',
    isRestDay: false,
    name: 'Upper B (Pull Emphasis & V-Taper)',
    focus: ['back', 'lats', 'biceps', 'chest', 'rear delts'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'Focus on explosive concentric pull, 1s peak squeeze, and slow 3s eccentric descent.'
  };
}

/**
 * Builds Lower B (Hinge Focus & Conditioning)
 */
function buildLowerB(available: ExerciseDefinition[], sessionLength: number, variationSeed: number = 0): WorkoutDay {
  const picked = new Set<string>();
  const exercises: PlannedExercise[] = [
    pickExercise(['romanian_deadlift', 'barbell_squat'], available, picked, 'legs', variationSeed),
    pickExercise(['leg_press', 'walking_lunges'], available, picked, 'legs', variationSeed),
    pickExercise(['walking_lunges', 'leg_extension'], available, picked, 'legs', variationSeed),
    pickExercise(['seated_leg_curl'], available, picked, 'legs', variationSeed),
    pickExercise(['leg_extension', 'calf_raises'], available, picked, 'legs', variationSeed),
    pickExercise(['ab_plank', 'cable_crunch'], available, picked, 'core', variationSeed)
  ];

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['hamstrings', 'glutes', 'quads']);
  const cooldown = generateCooldown(['hamstrings', 'glutes']);

  return {
    dayIndex: 5,
    dayName: 'Friday',
    isRestDay: false,
    name: 'Lower B (Hinge Focus & Leg Density)',
    focus: ['hamstrings', 'quads', 'glutes', 'calves'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'Control eccentric tempo on RDL to protect lower back and maximise hamstring recruitment.'
  };
}

/**
 * Builds Upper C (Volume Specialization: Delts, Arms, Upper Pecs, Core)
 * Ideal for Sunday 19:00 gym session!
 */
function buildUpperC(available: ExerciseDefinition[], sessionLength: number, variationSeed: number = 0): WorkoutDay {
  const picked = new Set<string>();
  const exercises: PlannedExercise[] = [
    pickExercise(['incline_db_press', 'barbell_bench_press', 'machine_chest_press'], available, picked, 'push', variationSeed),
    pickExercise(['seated_cable_row', 'lat_pulldown', 'one_arm_db_row'], available, picked, 'pull', variationSeed),
    pickExercise(['db_lateral_raise', 'cable_lateral_raise'], available, picked, 'shoulders', variationSeed),
    pickExercise(['rear_delt_flyes', 'face_pulls'], available, picked, 'shoulders', variationSeed),
    pickExercise(['incline_db_curl', 'barbell_curl', 'hammer_curl'], available, picked, 'arms', variationSeed),
    pickExercise(['triceps_rope_pushdown', 'skull_crushers', 'dips_chest'], available, picked, 'arms', variationSeed),
    pickExercise(['cable_crunch', 'hanging_leg_raise', 'ab_plank'], available, picked, 'core', variationSeed)
  ];

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['chest', 'shoulders', 'arms', 'back']);
  const cooldown = generateCooldown(['chest', 'shoulders', 'arms']);

  return {
    dayIndex: 0,
    dayName: 'Sunday',
    isRestDay: false,
    name: 'Upper C (Hypertrophy Pump: Delts, Arms & Upper Pecs)',
    focus: ['shoulders', 'chest', 'arms', 'upper back', 'core'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'High-volume hypertrophy day: Aim for high mechanical tension, strict mind-muscle connection, and RPE 8-9 on isolation finishers.'
  };
}

/**
 * Builds Full Body Day
 */
function buildFullBody(dayIdx: number, variant: 'A' | 'B' | 'C', available: ExerciseDefinition[], sessionLength: number): WorkoutDay {
  const picked = new Set<string>();
  let exercises: PlannedExercise[] = [];

  if (variant === 'A') {
    exercises = [
      pickExercise(['barbell_squat', 'leg_press'], available, picked, 'legs'),
      pickExercise(['barbell_bench_press', 'incline_db_press'], available, picked, 'push'),
      pickExercise(['barbell_bent_over_row', 'seated_cable_row'], available, picked, 'pull'),
      pickExercise(['db_lateral_raise'], available, picked, 'shoulders'),
      pickExercise(['triceps_rope_pushdown'], available, picked, 'arms'),
      pickExercise(['cable_crunch'], available, picked, 'core')
    ];
  } else if (variant === 'B') {
    exercises = [
      pickExercise(['romanian_deadlift'], available, picked, 'legs'),
      pickExercise(['overhead_press', 'incline_db_press'], available, picked, 'shoulders'),
      pickExercise(['pull_ups', 'lat_pulldown'], available, picked, 'pull'),
      pickExercise(['leg_extension'], available, picked, 'legs'),
      pickExercise(['barbell_curl'], available, picked, 'arms'),
      pickExercise(['hanging_leg_raise'], available, picked, 'core')
    ];
  } else {
    exercises = [
      pickExercise(['leg_press', 'barbell_squat'], available, picked, 'legs'),
      pickExercise(['dips_chest', 'incline_db_press'], available, picked, 'push'),
      pickExercise(['one_arm_db_row'], available, picked, 'pull'),
      pickExercise(['seated_leg_curl'], available, picked, 'legs'),
      pickExercise(['cable_lateral_raise'], available, picked, 'shoulders'),
      pickExercise(['hammer_curl'], available, picked, 'arms')
    ];
  }

  const calibrated = calibrateVolume(exercises, sessionLength);
  const warmup = generateWarmup(['quads', 'chest', 'back']);
  const cooldown = generateCooldown(['quads', 'chest', 'back']);

  return {
    dayIndex: dayIdx,
    dayName: DAY_NAMES[dayIdx],
    isRestDay: false,
    name: `Full Body ${variant}`,
    focus: ['quads', 'hamstrings', 'chest', 'back', 'shoulders'],
    estimatedDurationMinutes: estimateDuration(calibrated, warmup.durationMinutes, cooldown.durationMinutes),
    warmup,
    exercises: calibrated,
    cooldown,
    progressionRule: 'Progressive overload across all compound stations; log working weights and reps.'
  };
}

/**
 * Builds a Rest / Recovery Day
 */
function buildRestDay(dayIndex: number): WorkoutDay {
  return {
    dayIndex,
    dayName: DAY_NAMES[dayIndex],
    isRestDay: true,
    name: 'Rest & Recovery Protocol',
    focus: ['recovery', 'nutrition', 'mobility'],
    estimatedDurationMinutes: 15,
    warmup: {
      durationMinutes: 15,
      general: [
        '15-30 minute relaxed walk outside (6,000-8,000 steps)',
        'Hydration: 3L water with electrolytes',
        'Protein intake target: 1.8-2.2g per kg bodyweight'
      ],
      specificActivation: [
        'Foam roll quads, lats, and thoracic spine (5 mins)',
        'Static hip flexor & doorway pec stretch'
      ]
    },
    exercises: [],
    progressionRule: 'Focus on deep restorative sleep (7.5-9 hrs) and optimal nutrition for muscle protein synthesis.'
  };
}

/**
 * Primary plan generator matching user goals, equipment, days, and profile
 */
export function generateWeeklyPlan(profile: UserProfile, variationSeed: number = 0): WorkoutDay[] {
  const availableExercises = filterByEquipment(EXERCISE_LIBRARY, profile.equipment);
  const daysSelected = new Set(profile.availableDays);
  const sessionLength = profile.sessionLengthMinutes || 75;

  const weeklyPlan: WorkoutDay[] = [];

  // If Upper-Body Hypertrophy
  if (profile.primaryGoal === 'upper_body_hypertrophy') {
    // Generate the standard repertoire of routines with variationSeed
    const upperA = buildUpperA(availableExercises, sessionLength, variationSeed);
    const lowerA = buildLowerA(availableExercises, sessionLength, variationSeed);
    const upperB = buildUpperB(availableExercises, sessionLength, variationSeed);
    const lowerB = buildLowerB(availableExercises, sessionLength, variationSeed);
    const upperC = buildUpperC(availableExercises, sessionLength, variationSeed);

    // If today is Sunday (day 0) and Sunday is selected, make sure Sunday is an Upper day (Upper C or Upper A)
    // Map templates to selected days
    const activeDayIndices = [0, 1, 2, 3, 4, 5, 6].filter(d => daysSelected.has(d));
    const templates = [upperA, lowerA, upperB, lowerB, upperC];

    // Build assignment map
    const dayAssignment: Record<number, WorkoutDay> = {};

    // Special priority for Sunday if Sunday is active: Upper C (Upper Hypertrophy)
    let templateCursor = 0;
    for (const dayIdx of activeDayIndices) {
      if (dayIdx === 0) {
        // Sunday: Upper C (Arms & Delts Hypertrophy)
        dayAssignment[0] = { ...upperC, dayIndex: 0, dayName: 'Sunday' };
      } else if (dayIdx === 1) {
        dayAssignment[1] = { ...upperA, dayIndex: 1, dayName: 'Monday' };
      } else if (dayIdx === 2) {
        dayAssignment[2] = { ...lowerA, dayIndex: 2, dayName: 'Tuesday' };
      } else if (dayIdx === 4) {
        dayAssignment[4] = { ...upperB, dayIndex: 4, dayName: 'Thursday' };
      } else if (dayIdx === 5) {
        dayAssignment[5] = { ...lowerB, dayIndex: 5, dayName: 'Friday' };
      } else {
        // Any other day, assign next template
        const template = templates[templateCursor % templates.length];
        dayAssignment[dayIdx] = { ...template, dayIndex: dayIdx, dayName: DAY_NAMES[dayIdx] };
        templateCursor++;
      }
    }

    // Fill all 7 days of the week
    for (let i = 0; i < 7; i++) {
      if (daysSelected.has(i) && dayAssignment[i]) {
        weeklyPlan.push(dayAssignment[i]);
      } else {
        weeklyPlan.push(buildRestDay(i));
      }
    }
  } else if (profile.primaryGoal === 'full_body_hypertrophy' || profile.primaryGoal === 'general_fitness') {
    // Full body approach
    let variantToggle = 0;
    const variants: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    for (let i = 0; i < 7; i++) {
      if (daysSelected.has(i)) {
        const v = variants[(variantToggle + variationSeed) % variants.length];
        weeklyPlan.push(buildFullBody(i, v, availableExercises, sessionLength));
        variantToggle++;
      } else {
        weeklyPlan.push(buildRestDay(i));
      }
    }
  } else {
    // Strength / Fat Loss: Upper / Lower variation
    const upperA = buildUpperA(availableExercises, sessionLength, variationSeed);
    const lowerA = buildLowerA(availableExercises, sessionLength, variationSeed);
    const upperB = buildUpperB(availableExercises, sessionLength, variationSeed);
    const lowerB = buildLowerB(availableExercises, sessionLength, variationSeed);
    const cycle = [upperA, lowerA, upperB, lowerB];
    let cursor = variationSeed;
    for (let i = 0; i < 7; i++) {
      if (daysSelected.has(i)) {
        const tmpl = cycle[cursor % cycle.length];
        weeklyPlan.push({
          ...tmpl,
          dayIndex: i,
          dayName: DAY_NAMES[i]
        });
        cursor++;
      } else {
        weeklyPlan.push(buildRestDay(i));
      }
    }
  }

  // Apply deep sports-science personalization & biomechanical calibration across all days
  for (const day of weeklyPlan) {
    if (!day.isRestDay && day.exercises) {
      day.exercises = day.exercises.map(ex => personalizeExercise(ex, profile));
    }
  }

  return weeklyPlan;
}
