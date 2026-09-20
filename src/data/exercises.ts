import { ExerciseDefinition } from '../types';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // --- PUSH / CHEST ---
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSec: 150,
    targetRpe: '8-8.5',
    tempo: '3-1-1-0',
    techniqueCues: [
      'Retract scapulae and plant feet firmly on the ground.',
      'Touch lower chest with elbows tucked at ~45 degrees.',
      'Drive aggressively off the chest without flaring elbows early.'
    ],
    progressionRule: 'Add 2.5 kg once all 4 sets hit 8 clean reps.'
  },
  {
    id: 'incline_db_press',
    name: 'Incline Dumbbell Press',
    category: 'push',
    primaryMuscles: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 120,
    targetRpe: '8',
    tempo: '3-0-1-0',
    techniqueCues: [
      'Set bench angle to 30 degrees to bias clavicular upper pec.',
      'Control the eccentric lowering phase for 3 seconds.',
      'Converge dumbbells naturally at the top without banging them.'
    ],
    progressionRule: 'Increase dumbbell increment once hitting 10 reps across 3 sets.'
  },
  {
    id: 'dips_chest',
    name: 'Chest Dips (Parallel Bars)',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: ['bodyweight'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSec: 90,
    targetRpe: '8',
    tempo: '2-1-1-0',
    techniqueCues: [
      'Lean torso forward slightly (~20-30 deg) to maximize chest recruitment.',
      'Lower until upper arms are parallel to the floor.',
      'Lock out with controlled triceps extension.'
    ],
    progressionRule: 'Add weight belt (+2.5 kg) once doing 3x12 bodyweight reps.'
  },
  {
    id: 'pushups',
    name: 'Deficit / Standard Push-ups',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['bodyweight'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8-9',
    tempo: '2-0-1-0',
    techniqueCues: [
      'Keep glutes and abs braced in rigid plank position.',
      'Full chest-to-deck range of motion.',
      'Screw palms into floor to engage lats and stabilize shoulders.'
    ]
  },
  {
    id: 'cable_chest_fly',
    name: 'Standing Cable Flyes',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    equipment: ['cables'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 75,
    targetRpe: '8.5-9',
    tempo: '2-1-1-1',
    techniqueCues: [
      'Slight bend in elbows throughout movement.',
      'Emphasize deep stretch at the back and strong 1-sec peak contraction.',
      'Lead with elbows and squeeze pecs together.'
    ]
  },
  {
    id: 'machine_chest_press',
    name: 'Machine Seated Chest Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['machines'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSec: 90,
    targetRpe: '8-9',
    tempo: '3-0-1-0',
    techniqueCues: [
      'Adjust seat so handles align with mid-chest.',
      'Drive through hands while maintaining scapular retraction against the pad.',
      'Great for safe failure training without a spotter.'
    ]
  },

  // --- PULL / BACK ---
  {
    id: 'pull_ups',
    name: 'Pull-ups / Weighted Chin-ups',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['bodyweight'],
    tier: 'compound',
    defaultSets: 4,
    defaultReps: '6-10',
    defaultRestSec: 120,
    targetRpe: '8-8.5',
    tempo: '2-1-1-0',
    techniqueCues: [
      'Initiate pull by depressing shoulder blades down and back.',
      'Pull chest up to touch the bar, leading with elbows.',
      'Control eccentric descent all the way to a dead hang.'
    ],
    progressionRule: 'Add 2.5 kg on dip belt once hitting 4x8 clean reps.'
  },
  {
    id: 'lat_pulldown',
    name: 'Wide-Grip Lat Pulldown',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['cables', 'machines'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSec: 90,
    targetRpe: '8',
    tempo: '3-0-1-1',
    techniqueCues: [
      'Lock thighs under pads and maintain slight arch in upper thoracic spine.',
      'Drive elbows down towards hips, squeezing lats at bottom.',
      'Avoid swinging or leaning back excessively.'
    ]
  },
  {
    id: 'barbell_bent_over_row',
    name: 'Barbell Bent-Over Row',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'core'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSec: 120,
    targetRpe: '8',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Hinge at hips to ~45-degree angle with neutral spine.',
      'Pull bar towards lower ribcage/belly button.',
      'Hold peak squeeze for 1 second before lowering under control.'
    ]
  },
  {
    id: 'one_arm_db_row',
    name: 'One-Arm Dumbbell Row',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 90,
    targetRpe: '8',
    tempo: '2-1-1-0',
    techniqueCues: [
      'Brace on bench with flat back.',
      'Pull elbow straight back in an arc towards the hip.',
      'Allow shoulder blade to stretch forward at bottom for maximal lat stretch.'
    ]
  },
  {
    id: 'seated_cable_row',
    name: 'Seated Cable Row (Close or Wide Grip)',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['cables'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 75,
    targetRpe: '8',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Keep chest elevated and pull handle to lower abdomen.',
      'Squeeze mid-back rhomboids together firmly.',
      'Do not rock torso back and forth excessively.'
    ]
  },
  {
    id: 'face_pulls',
    name: 'Cable Face Pulls',
    category: 'pull',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: ['core'],
    equipment: ['cables'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Set pulley to eye level with rope attachment.',
      'Pull rope towards forehead while rotating hands back (external rotation).',
      'Crucial for shoulder health, rear delts, and posture.'
    ]
  },

  // --- SHOULDERS ---
  {
    id: 'overhead_press',
    name: 'Standing Barbell Overhead Press (OHP)',
    category: 'shoulders',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '6-8',
    defaultRestSec: 150,
    targetRpe: '8',
    tempo: '2-0-1-0',
    techniqueCues: [
      'Squeeze glutes and brace core tightly to avoid lumbar hyperextension.',
      'Press straight up, moving head slightly back then punching through at top.',
      'Lock out arms directly overhead over mid-foot.'
    ]
  },
  {
    id: 'db_lateral_raise',
    name: 'Dumbbell Lateral Raises',
    category: 'shoulders',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['free_weights'],
    tier: 'isolation',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8.5-9',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Slight forward lean with pinkies subtly tilted upward or neutral.',
      'Raise dumbbells out to the sides in the scapular plane.',
      'Control the lowering phase; resist letting arms drop.'
    ]
  },
  {
    id: 'cable_lateral_raise',
    name: 'Single-Arm Cable Lateral Raise',
    category: 'shoulders',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['cables'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8.5',
    tempo: '2-1-1-1',
    techniqueCues: [
      'Set pulley at knee height for continuous tension curve.',
      'Reach arm out towards the corner of the room rather than straight up.',
      'Keep trap muscles quiet and relaxed.'
    ]
  },
  {
    id: 'rear_delt_flyes',
    name: 'Incline Bench Rear Delt Flyes',
    category: 'shoulders',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['back'],
    equipment: ['free_weights'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8.5',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Prone on 30-degree bench to eliminate momentum.',
      'Sweep dumbbells wide in a hugging arc.',
      'Feel contraction specifically in posterior deltoid.'
    ]
  },

  // --- ARMS: BICEPS & TRICEPS ---
  {
    id: 'barbell_curl',
    name: 'EZ-Bar / Barbell Bicep Curl',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    equipment: ['free_weights'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 75,
    targetRpe: '8',
    tempo: '3-0-1-0',
    techniqueCues: [
      'Pin elbows to ribcage; do not sway torso.',
      'Supinate wrists and squeeze biceps intensely at top.',
      'Full extension at bottom before initiating next rep.'
    ]
  },
  {
    id: 'incline_db_curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    equipment: ['free_weights'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 75,
    targetRpe: '8.5',
    tempo: '3-1-1-0',
    techniqueCues: [
      'Set bench to 45-60 degrees for deep long-head stretch.',
      'Allow arms to hang completely vertically.',
      'Curl up smoothly without kicking elbows forward.'
    ]
  },
  {
    id: 'hammer_curl',
    name: 'Dumbbell Hammer Curls',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['core'],
    equipment: ['free_weights'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 60,
    targetRpe: '8.5',
    tempo: '2-0-1-0',
    techniqueCues: [
      'Neutral grip (palms facing each other) targeting brachialis and forearms.',
      'Can be performed alternating or bilateral.',
      'Strict control on descent.'
    ]
  },
  {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    category: 'arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['cables'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 75,
    targetRpe: '8.5',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Lock upper arms stationary beside ribs.',
      'Spread rope apart at the bottom for intense lateral tricep squeeze.',
      'Return up to 90 degrees elbow flexion under tension.'
    ]
  },
  {
    id: 'skull_crushers',
    name: 'EZ-Bar Skull Crushers (Lying Triceps Ext)',
    category: 'arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: ['free_weights'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 90,
    targetRpe: '8',
    tempo: '3-0-1-0',
    techniqueCues: [
      'Lie flat on bench, angle upper arms slightly backward (towards head).',
      'Bend elbows to lower bar just past crown of head.',
      'Drive forearms back up without flaring elbows.'
    ]
  },

  // --- LEGS ---
  {
    id: 'barbell_squat',
    name: 'Barbell Back Squat',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSec: 150,
    targetRpe: '8',
    tempo: '3-1-1-0',
    techniqueCues: [
      'Brace core 360 degrees using valsalva maneuver.',
      'Descend until hip crease is below top of knees.',
      'Drive up smoothly pushing whole foot through floor.'
    ]
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (Barbell or DB)',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'core'],
    equipment: ['free_weights'],
    tier: 'compound',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSec: 120,
    targetRpe: '8',
    tempo: '3-1-1-0',
    techniqueCues: [
      'Soft knee bend; push hips straight backward like closing a car door.',
      'Keep bar skimming along thighs and shins.',
      'Feel massive hamstring stretch, then snap hips forward.'
    ]
  },
  {
    id: 'leg_press',
    name: '45-Degree Leg Press',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['machines'],
    tier: 'compound',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 120,
    targetRpe: '8.5',
    tempo: '3-1-1-0',
    techniqueCues: [
      'Feet shoulder-width on carriage platform.',
      'Do not let lower back round off the seat at bottom.',
      'Stop just short of knee hyperextension lockout.'
    ]
  },
  {
    id: 'walking_lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: ['free_weights'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '10-12 / leg',
    defaultRestSec: 90,
    targetRpe: '8.5',
    tempo: '2-0-1-0',
    techniqueCues: [
      'Step out with wide stride; drop back knee gently towards floor.',
      'Drive through front heel to propel into next forward step.',
      'Keep torso upright and balanced.'
    ]
  },
  {
    id: 'seated_leg_curl',
    name: 'Seated or Lying Leg Curl',
    category: 'legs',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    equipment: ['machines'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRestSec: 75,
    targetRpe: '8.5',
    tempo: '3-0-1-1',
    techniqueCues: [
      'Dorsiflex ankles (toes towards shins) to isolate hamstrings.',
      'Curl pad fully under thighs with 1-second squeeze.',
      'Slow 3-second negative eccentric return.'
    ]
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension Machine',
    category: 'legs',
    primaryMuscles: ['quads'],
    secondaryMuscles: [],
    equipment: ['machines'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 75,
    targetRpe: '8.5-9',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Align knee joints with pivot point of machine.',
      'Extend legs straight, holding top peak contraction for 1 second.',
      'Pure quadriceps isolation without spinal load.'
    ]
  },
  {
    id: 'calf_raises',
    name: 'Standing or Seated Calf Raise',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machines', 'free_weights'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8.5',
    tempo: '2-2-1-1',
    techniqueCues: [
      'Full deep stretch at bottom for 2 seconds to dissipate Achilles reflex.',
      'Explode onto balls of big toes and squeeze calves at peak.'
    ]
  },

  // --- CORE & FINISHERS ---
  {
    id: 'cable_crunch',
    name: 'Kneeling Cable Crunch',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    equipment: ['cables'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    targetRpe: '8.5',
    tempo: '2-0-1-1',
    techniqueCues: [
      'Kneel holding rope beside ears.',
      'Flex spine by curling ribs towards pelvis (do not just bend at hips).',
      'Exhale completely at bottom contraction.'
    ]
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg / Knee Raise',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    tier: 'accessory',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 60,
    targetRpe: '8',
    tempo: '2-1-1-0',
    techniqueCues: [
      'Hang from pull-up bar with dead hang grip.',
      'Roll pelvis upward as knees/legs raise up to chest.',
      'Prevent excessive swinging.'
    ]
  },
  {
    id: 'ab_plank',
    name: 'Weighted or Standard RKC Plank',
    category: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['glutes', 'shoulders'],
    equipment: ['bodyweight'],
    tier: 'isolation',
    defaultSets: 3,
    defaultReps: '45-60 sec',
    defaultRestSec: 60,
    targetRpe: '8',
    tempo: 'Static Hold',
    techniqueCues: [
      'Elbows pulled actively toward toes to create high intra-abdominal tension.',
      'Glutes locked tight, neutral spine.'
    ]
  }
];

export const getExercisesByCategory = (category: ExerciseDefinition['category']) => {
  return EXERCISE_LIBRARY.filter(e => e.category === category);
};

export const getExerciseById = (id: string): ExerciseDefinition | undefined => {
  return EXERCISE_LIBRARY.find(e => e.id === id);
};
