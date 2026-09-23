import { BiomechanicalExecution } from '../types';

export interface ExerciseBiomechanicalData {
  execution: BiomechanicalExecution;
  focus: string;
}

export const EXERCISE_BIOMECHANICS: Record<string, ExerciseBiomechanicalData> = {
  barbell_bench_press: {
    focus: 'Sternal Pec Major & Anterior Deltoid Mechanical Tension',
    execution: {
      setup: 'Lie flat with eyes directly beneath the bar. Retract and depress scapulae into the bench, plant feet firmly into the floor, and grip bar slightly wider than shoulder width with wrapped thumbs.',
      eccentric: 'Lower bar in a controlled 3-second descent toward your lower sternum/nipple line. Keep elbows tucked at approximately 45–60 degrees relative to your ribcage; inhale deeply to expand chest.',
      concentric: 'Drive your feet through the floor and push the bar explosively upward and slightly backward toward your eye line. Exhale through the sticking point without unlocking shoulders.',
      commonMistakes: 'Excessive elbow flare (90 degrees) placing destructive shear on rotator cuffs, bouncing bar off sternum, or losing thoracic arch.'
    }
  },
  incline_db_press: {
    focus: 'Clavicular (Upper) Pectoralis Major & Anterior Deltoid',
    execution: {
      setup: 'Set bench to a 30-degree incline. Kick dumbbells up with knees, retract shoulder blades, and rotate wrists to a slight 45-degree inward angle to protect subacromial space.',
      eccentric: 'Lower dumbbells smoothly along the outer ribcage for 3 seconds until you feel a deep stretch in the upper pecs; keep forearms strictly vertical.',
      concentric: 'Drive the dumbbells upward along a natural convergent arc until hands are above upper chest. Contract pecs forcefully at top without clanking dumbbells together.',
      commonMistakes: 'Setting bench angle too steep (>45 degrees) shifting work away from pecs onto front delts, or flaring elbows.'
    }
  },
  dips_chest: {
    focus: 'Inferior Pectoralis Major & Triceps Lateral Head',
    execution: {
      setup: 'Mount parallel bars with locked arms. Lean torso forward ~20–30 degrees, bend knees, and pull shoulder blades slightly downward.',
      eccentric: 'Lower body under strict control until upper arms are parallel to the floor (elbows at 90 degrees). Inhale and maintain the forward chest lean.',
      concentric: 'Press palms through bars to drive body upward. Focus on pulling hands toward each other neurologically to maximize lower chest contraction; exhale at peak.',
      commonMistakes: 'Staying completely upright (shifts load entirely to triceps) or dipping too deep under excessive load causing acromioclavicular strain.'
    }
  },
  pushups: {
    focus: 'Total Pectoral Motor Unit Recruitment & Serratus Anterior',
    execution: {
      setup: 'Hands slightly wider than shoulder width on the floor. Screw palms outward into the floor to lock lats and brace glutes/abs into an unbreakable rigid plank.',
      eccentric: 'Descend as a single solid unit for 2–3 seconds until chest grazes the floor. Elbows should track at a 45-degree arrow formation.',
      concentric: 'Press forcefully through the whole hand, driving the floor away. At top, gently push shoulder blades forward (protraction) to fully engage serratus anterior.',
      commonMistakes: 'Sagging hips indicating core collapse, neck crane leading with chin, or flaring elbows outward.'
    }
  },
  cable_chest_fly: {
    focus: 'Sternal Pec Adduction & Squeeze in Lengthened Position',
    execution: {
      setup: 'Set pulleys to shoulder or mid-chest height. Step one foot forward for a stable staggered base, keeping a subtle 15-degree bend in your elbows.',
      eccentric: 'Open arms wide in a hugging arc until pecs reach a full, comfortable stretch behind the torso plane. Inhale deeply.',
      concentric: 'Sweep hands forward in a wide arc as if hugging a colossal oak tree. Touch knuckles or cross wrists at midline, squeezing inner pecs for a full 1-second hold.',
      commonMistakes: 'Bending and extending elbows like a press, using momentum/torso heave, or setting weights too heavy.'
    }
  },
  machine_chest_press: {
    focus: 'Pure Pec Mechanical Tension with Zero Stabilizer Fatigue',
    execution: {
      setup: 'Adjust seat height so handles align across mid-chest. Plant feet firmly, pin shoulder blades into back pad, and grip handles with neutral or pronated wrists.',
      eccentric: 'Control the machine carriage back for 3 seconds until a safe, deep chest stretch is achieved without shoulders rolling forward.',
      concentric: 'Explode through the handles until arms are extended but elbows not violently locked out. Exhale past the midpoint.',
      commonMistakes: 'Allowing back to peel off the pad during exertion or letting weight stack slam between reps.'
    }
  },
  pull_ups: {
    focus: 'Latissimus Dorsi Width, Teres Major & Bicep Brachii',
    execution: {
      setup: 'Grip pull-up bar slightly wider than shoulder width with overhand grip. Hang fully in passive stretch, then actively pull shoulder blades down and back.',
      eccentric: 'Lower your entire body in a 3-second descent until arms reach full extension and lats are deeply elongated under tension.',
      concentric: 'Drive elbows down and back toward your hip pockets while lifting your clavicle toward the bar. Squeeze lats at the apex and exhale.',
      commonMistakes: 'Kicking or kipping with legs, doing half-reps without full extension, or craning neck over bar.'
    }
  },
  lat_pulldown: {
    focus: 'Latissimus Dorsi Lower/Upper Fibres & Scapular Depression',
    execution: {
      setup: 'Adjust thigh pads snug against quads. Take a wide overhand grip on the bar, sit upright with a subtle 10-degree lean back in the thoracic spine.',
      eccentric: 'Allow the cable to draw arms upward smoothly over 3 seconds, letting scapulae elevate for a maximal lat stretch at the peak.',
      concentric: 'Depress shoulder blades first, then drive elbows down toward ribs. Pull bar smoothly to upper clavicles; squeeze lats for 1 second.',
      commonMistakes: 'Swinging torso back to 45 degrees to use bodyweight momentum, or pulling bar behind neck.'
    }
  },
  barbell_bent_over_row: {
    focus: 'Mid-Back Rhomboids, Lat Thickness & Posterior Deltoid',
    execution: {
      setup: 'Stand over bar with feet hip-width. Hinge at hips to approximately 45 degrees, keep spine neutral and chest proud, grip bar shoulder-width.',
      eccentric: 'Lower bar under strict control down the front of your shins until lats and rhomboids are fully stretched, keeping spine rigid.',
      concentric: 'Pull elbows back past torso, bringing bar directly into lower ribcage/navel. Pinch shoulder blades together with maximum intent.',
      commonMistakes: 'Rounding lumbar spine under heavy loads, or standing up too upright turning the movement into a shrug.'
    }
  },
  one_arm_db_row: {
    focus: 'Unilateral Latissimus Dorsi & Deep Scapular Retraction',
    execution: {
      setup: 'Place one knee and hand on flat bench, or brace against dumbbell rack. Back flat, holding dumbbell hanging straight down with neutral grip.',
      eccentric: 'Lower dumbbell downward and slightly forward toward the floor to maximize lat stretch; maintain square hips.',
      concentric: 'Pull dumbbell upward in a subtle arc toward your hip crease (not straight to chest). Drive with the elbow and squeeze your side lat.',
      commonMistakes: 'Twisting torso to yank weight up with rotation, or pulling with the bicep instead of the lat.'
    }
  },
  seated_cable_row: {
    focus: 'Mid-Back Rhomboids, Mid-Trapezius & Postural Scapulae',
    execution: {
      setup: 'Sit tall with feet on footplates, knees slightly flexed. Grip V-bar or wide handle, pull shoulders back, and sit upright with a proud chest.',
      eccentric: 'Lean forward slightly from hips (not spine) to let the cable pull shoulder blades forward into a full mid-back stretch.',
      concentric: 'Pull torso back to perpendicular, retract shoulder blades, and row handle into lower abdomen. Hold peak squeeze for 1 second.',
      commonMistakes: 'Excessive hyperextension swinging back and forth, or rounding shoulders forward at contraction.'
    }
  },
  face_pulls: {
    focus: 'Posterior Deltoid, Infraspinatus, Teres Minor & Lower Traps',
    execution: {
      setup: 'Set pulley to eye level with rope attachment. Grip rope ends with neutral grip (thumbs facing back), take two steps back into a staggered stance.',
      eccentric: 'Allow arms to be drawn straight forward under cable tension, feeling rear delts stretch while keeping torso stationary.',
      concentric: 'Pull rope toward nose/forehead while actively pulling hands apart and rotating wrists backward (external rotation). Squeeze rear delts.',
      commonMistakes: 'Setting weight too heavy and leaning backward, or pulling down toward chest instead of eye level.'
    }
  },
  overhead_press: {
    focus: 'Anterior & Lateral Deltoids, Clavicular Pec & Core Bracing',
    execution: {
      setup: 'Bar resting on clavicles/front delts with hands just outside shoulders. Squeeze glutes, lock quads, and brace abdominal wall rigidly.',
      eccentric: 'Lower bar down in a controlled path past nose to rest on upper chest, keeping elbows tucked slightly forward.',
      concentric: 'Press bar straight upward in vertical plane. As bar clears forehead, push head forward into the "window" and lock arms overhead.',
      commonMistakes: 'Bending knees to push-press, or hyperextending lumbar spine into an artificial incline bench.'
    }
  },
  db_lateral_raise: {
    focus: 'Lateral Deltoid Abduction for 3D Shoulder Cap & Width',
    execution: {
      setup: 'Stand with feet hip-width, dumbbells by sides. Hinge forward ~10–15 degrees at hips to align lateral delt fibres in the plane of the scapula.',
      eccentric: 'Resist gravity for 2–3 seconds on the way down; stop dumbbells just before they touch hips to keep continuous tension.',
      concentric: 'Raise dumbbells outward toward the room corners (scapular plane ~30 deg forward). Lead with elbows, lifting to shoulder height.',
      commonMistakes: 'Shrugging upper traps to lift weights, using hip momentum, or swinging dumbbells forward.'
    }
  },
  cable_lateral_raise: {
    focus: 'Continuous Resistance Curve on Lateral Deltoid (Peak Tension at Bottom)',
    execution: {
      setup: 'Set pulley to ankle or knee height. Stand with cable running behind or in front of legs, gripping handle with far arm.',
      eccentric: 'Control handle back down across body over 2–3 seconds, feeling constant tension all the way into the inner stretch.',
      concentric: 'Reach hand outward and upward away from body in an arc until arm is parallel to floor. Hold peak contraction for 1 second.',
      commonMistakes: 'Bending elbow excessively turning it into an upright row, or jerking torso sideways.'
    }
  },
  rear_delt_flyes: {
    focus: 'Posterior Deltoid Isolation & Postural Scapular Health',
    execution: {
      setup: 'Lie chest-down on a 30-degree incline bench with dumbbells hanging. Wrists neutral or palms facing feet.',
      eccentric: 'Lower dumbbells smoothly until arms hang vertically, keeping tension on the back of the shoulder caps.',
      concentric: 'Sweep dumbbells out wide to sides with elbows slightly bent. Focus purely on rear deltoids pulling outwards.',
      commonMistakes: 'Squeezing shoulder blades together aggressively (recruits traps/rhomboids instead of rear delts) or swinging dumbbells.'
    }
  },
  barbell_curl: {
    focus: 'Biceps Brachii (Short & Long Heads) & Brachialis',
    execution: {
      setup: 'Stand tall with feet hip-width. Grip EZ-bar or straight barbell shoulder-width with underhand grip. Pin elbows to ribcage.',
      eccentric: 'Lower bar down with a strict 3-second cadence until arms are fully extended at the bottom.',
      concentric: 'Curl bar up toward collarbone by flexing biceps. Keep elbows stationary without letting them swing forward.',
      commonMistakes: 'Swinging hips and lumbar spine for momentum, or taking half reps at the bottom.'
    }
  },
  incline_db_curl: {
    focus: 'Biceps Long Head Stretch & Peak Development',
    execution: {
      setup: 'Set bench to 45–60 degrees. Sit back with head and shoulders flat, letting arms hang straight down toward the floor.',
      eccentric: 'Lower dumbbells under full muscular control until forearms are extended and biceps reach maximum lengthened stretch.',
      concentric: 'Supinate wrists as you curl dumbbells upward, keeping upper arms strictly vertical and perpendicular to the ground.',
      commonMistakes: 'Flaring elbows outward or sitting forward off the bench during the concentric.'
    }
  },
  hammer_curl: {
    focus: 'Brachialis, Brachioradialis & Forearm Thickness (Elbow Safe)',
    execution: {
      setup: 'Stand tall with dumbbells at sides in a neutral grip (palms facing inward toward thighs).',
      eccentric: 'Lower dumbbells over 2–3 seconds keeping wrists neutral and solid like a hammer.',
      concentric: 'Curl dumbbells upward while maintaining neutral palms-in orientation until forearms compress against biceps.',
      commonMistakes: 'Rotating wrists inward or outward, or rocking shoulders backward.'
    }
  },
  triceps_rope_pushdown: {
    focus: 'Triceps Lateral & Medial Heads (High Mechanical Tension)',
    execution: {
      setup: 'Attach rope to high pulley. Stand with knees slightly soft, torso tilted 10 degrees forward, elbows pinned to side ribs.',
      eccentric: 'Allow forearms to rise up to 90 degrees elbow flexion under controlled tension, keeping upper arms motionless.',
      concentric: 'Push rope down forcefully. As hands reach hips, flare the rope ends outward away from each other to peak tricep contraction.',
      commonMistakes: 'Letting elbows drift forward and backward, or using chest weight to press down.'
    }
  },
  skull_crushers: {
    focus: 'Triceps Long Head Lengthened-State Hypertrophy',
    execution: {
      setup: 'Lie on flat bench gripping EZ-bar with narrow grip. Extend arms straight up, then angle upper arms backward ~10 degrees toward head.',
      eccentric: 'Bend elbows to lower bar in an arc just past the crown of your head, keeping upper arms angled backward for continuous tension.',
      concentric: 'Extend forearms back to starting position by contracting triceps, without letting elbows flare outward.',
      commonMistakes: 'Flaring elbows wide (strains medial elbow joint), or dropping bar onto forehead.'
    }
  },
  barbell_squat: {
    focus: 'Quadriceps, Gluteus Maximus & Axial Core Bracing',
    execution: {
      setup: 'Unrack bar across upper traps (high bar) or rear delts (low bar). Feet shoulder-width apart, toes flared 15–30 degrees. Brace core 360 degrees.',
      eccentric: 'Sit down and slightly back, tracking knees directly in line with toes. Descend smoothly over 3 seconds until hip crease is below top of knee.',
      concentric: 'Drive whole foot through floor, keeping chest proud and knees pushed out. Rise smoothly without hips shooting back.',
      commonMistakes: 'Knee valgus (knees caving inward), heels lifting off floor, or lumbar rounding (butt wink).'
    }
  },
  romanian_deadlift: {
    focus: 'Hamstrings, Gluteus Maximus & Posterior Chain Hinge',
    execution: {
      setup: 'Stand tall holding barbell or dumbbells at thighs. Soft unlock at knees, neutral spine, shoulders retracted.',
      eccentric: 'Push hips backward as if trying to touch the wall behind you. Slide bar down shins until deep hamstring stretch is felt (shins remain vertical).',
      concentric: 'Drive hips forward aggressively into bar by contracting glutes and hamstrings until standing erect. Exhale at top.',
      commonMistakes: 'Squatting the weight down with forward knee travel, or rounding thoracic/lumbar spine.'
    }
  },
  leg_press: {
    focus: 'High-Volume Quadriceps & Glute Hypertrophy (Spine Sparing)',
    execution: {
      setup: 'Sit in carriage with lower back pressed firmly against pad. Place feet shoulder-width on platform at mid-height.',
      eccentric: 'Release safety catches and lower carriage down for 3 seconds until knees reach 90 degrees without lower back peeling off seat.',
      concentric: 'Press carriage away through the heels and mid-foot. Stop just short of locking knees out to preserve joint cartilage.',
      commonMistakes: 'Rounding pelvis/lumbar off the back pad at bottom (causes severe spinal disc compression), or hyperextending knees.'
    }
  },
  walking_lunges: {
    focus: 'Unilateral Quadriceps, Gluteus Medius & Dynamic Stability',
    execution: {
      setup: 'Stand upright holding dumbbells at sides. Choose a clear track on the gym floor.',
      eccentric: 'Take a long stride forward, descending straight down until back knee gently kisses the ground. Front shin should be nearly vertical.',
      concentric: 'Drive through front heel and mid-foot to propel yourself smoothly into the next walking step.',
      commonMistakes: 'Short strides causing excessive acute knee angle, or wobbling laterally through weak hip stabilizers.'
    }
  },
  seated_leg_curl: {
    focus: 'Hamstrings in Hip-Flexed (Lengthened) Position',
    execution: {
      setup: 'Align knee joints with machine pivot axis. Secure thigh pad firmly over quads; ankle pad sits just below calves.',
      eccentric: 'Allow legs to straighten over 3 seconds under full tension until hamstrings are elongated, toes pulled toward shins.',
      concentric: 'Flex hamstrings forcefully to curl pad fully under thighs. Squeeze for a 1-second peak contraction.',
      commonMistakes: 'Allowing thighs to rise off seat pad, or letting weights slam at the top.'
    }
  },
  leg_extension: {
    focus: 'Rectus Femoris & Quadriceps Isolation',
    execution: {
      setup: 'Sit back with knees aligned with machine pivot point. Lower shin pad rests comfortably against lower tibia.',
      eccentric: 'Lower weights under strict 3-second control without letting the weight stack touch at bottom.',
      concentric: 'Extend knees smoothly to full extension, holding peak quadriceps contraction for 1 full second.',
      commonMistakes: 'Jerking body forward with momentum, or violently kicking the pad.'
    }
  },
  calf_raises: {
    focus: 'Gastrocnemius & Soleus Ankle Plantarflexion',
    execution: {
      setup: 'Balls of feet on edge of step or platform, heels hanging off. Shoulders under pads or holding dumbbells.',
      eccentric: 'Lower heels down as deep as possible into a full 2-second passive calf stretch to eliminate Achilles tendon reflex.',
      concentric: 'Drive upward onto balls of big toes as high as possible. Squeeze calves firmly for 1 second at apex.',
      commonMistakes: 'Bouncing rapidly without pause at bottom, or letting ankles roll outward.'
    }
  },
  cable_crunch: {
    focus: 'Rectus Abdominis Spinal Flexion Under Overload',
    execution: {
      setup: 'Kneel in front of cable stack holding rope attachment beside ears. Hips remain high and stationary.',
      eccentric: 'Allow cable to draw torso upward until spine is extended, maintaining tension on the abs throughout.',
      concentric: 'Exhale and curl ribcage down toward pelvis, flexing the spine into a tight ball. Squeeze abs for 1 second.',
      commonMistakes: 'Hinging at hips like a bow instead of curling the spine, or sitting back onto heels.'
    }
  },
  hanging_leg_raise: {
    focus: 'Lower Rectus Abdominis, Obliques & Deep Core Bracing',
    execution: {
      setup: 'Hang from pull-up bar with overhand grip, shoulders active and core engaged.',
      eccentric: 'Lower legs slowly over 2–3 seconds until vertical, preventing any backward swing.',
      concentric: 'Curl pelvis upward and raise knees/feet toward chest. Focus on rolling pelvis toward sternum.',
      commonMistakes: 'Swinging body back and forth using hip momentum, or failing to tilt pelvis.'
    }
  },
  ab_plank: {
    focus: 'Isometric Intra-Abdominal Wall & Lumbar Stability',
    execution: {
      setup: 'Prone position with elbows directly under shoulders, forearms parallel. Feet hip-width.',
      eccentric: 'Maintain rigid static isometric tension; pull elbows neurologically toward toes and squeeze glutes.',
      concentric: 'Breathe rhythmically into the diaphragm while maintaining rigid spinal alignment.',
      commonMistakes: 'Hips sagging toward floor or piking high in the air.'
    }
  },
  incline_db_neutral_press: {
    focus: 'Subacromial Sparing Upper Pec Overload (Rotator Cuff Safe)',
    execution: {
      setup: 'Set bench to 30 degrees. Hold dumbbells with neutral palms-in grip to maximize subacromial space.',
      eccentric: 'Lower dumbbells slowly along sides of chest with forearms vertical; elbows glide in natural scapular plane.',
      concentric: 'Drive upward in smooth arc, squeezing pecs at apex while avoiding shoulder roll.',
      commonMistakes: 'Letting wrists twist outward or dropping elbows below safe shoulder depth.'
    }
  },
  chest_supported_row: {
    focus: 'Mid-Back & Lat Thickness with Complete Lumbar De-loading',
    execution: {
      setup: 'Lie chest-down on 30–45 degree incline bench with feet planted. Dumbbells or bar hanging down.',
      eccentric: 'Lower weights until arms are fully extended, allowing shoulder blades to stretch around ribcage.',
      concentric: 'Drive elbows back toward hips, pinning shoulder blades together against the supportive pad.',
      commonMistakes: 'Lifting chest off pad during exertion, or shrugging shoulders toward ears.'
    }
  },
  box_squats: {
    focus: 'Vertical Shin Hip-Hinge Squat (Patellar Tendon Safe)',
    execution: {
      setup: 'Stand in front of knee-height box or bench with slightly wider stance. Core braced.',
      eccentric: 'Sit backward reaching hips to the box while keeping shins perpendicular to floor.',
      concentric: 'Pause gently on box without relaxing, then drive through heels to stand erect.',
      commonMistakes: 'Bouncing or rocking off the box, or letting knees collapse inward.'
    }
  },
  cable_rope_hammer_curl: {
    focus: 'Brachialis & Forearms (Elbow & Wrist Joint Sparing)',
    execution: {
      setup: 'Attach rope to low pulley. Stand tall with neutral grip, elbows pinned to sides.',
      eccentric: 'Lower hands over 3 seconds under constant cable tension with neutral wrists.',
      concentric: 'Curl rope upward until forearms contact biceps; keep wrists straight and locked.',
      commonMistakes: 'Swinging back or letting elbows flare wide.'
    }
  }
};

/**
 * Returns biomechanical execution guide for an exercise ID or fallback
 */
export function getBiomechanicalExecution(id: string, name: string): ExerciseBiomechanicalData {
  if (EXERCISE_BIOMECHANICS[id]) {
    return EXERCISE_BIOMECHANICS[id];
  }

  const lower = (name || id).toLowerCase();
  if (lower.includes('press') || lower.includes('push')) {
    return {
      focus: 'Pectoral & Deltoid Mechanical Overload',
      execution: {
        setup: 'Position body with stable base of support, retract shoulder blades, and grip handles/bar firmly.',
        eccentric: 'Lower resistance in a controlled 3-second descent, keeping elbows at safe ~45-degree angle.',
        concentric: 'Press forcefully along natural arm path, exhaling past sticking point without unlocking joints violently.',
        commonMistakes: 'Flaring elbows excessively, bouncing off end-range, or losing torso bracing.'
      }
    };
  }

  if (lower.includes('pull') || lower.includes('row')) {
    return {
      focus: 'Latissimus Dorsi & Scapular Retractor Hypertrophy',
      execution: {
        setup: 'Establish solid torso anchor, depress shoulder blades, and align arms with cable or bar trajectory.',
        eccentric: 'Allow resistance to smoothly elongate lats and upper back over 3 seconds into a full stretch.',
        concentric: 'Lead with elbows pulling toward hips; pinch shoulder blades together and hold for 1 second.',
        commonMistakes: 'Yanking weight with torso momentum, or failing to achieve full extension at bottom.'
      }
    };
  }

  if (lower.includes('squat') || lower.includes('leg') || lower.includes('lunge')) {
    return {
      focus: 'Lower Body Compound Tension & Core Stability',
      execution: {
        setup: 'Feet shoulder-width, toes subtly flared. Brace abdominal wall with full 360-degree intra-abdominal pressure.',
        eccentric: 'Descend under control for 3 seconds tracking knees over toes until target depth is achieved.',
        concentric: 'Drive through whole foot, maintaining proud chest and vertical torso posture to top lockout.',
        commonMistakes: 'Knee valgus collapse, heels coming off platform, or rounding lower back.'
      }
    };
  }

  return {
    focus: 'Target Muscle Hypertrophy & Biomechanical Tension',
    execution: {
      setup: 'Position yourself with stable base, brace core, and establish clean joint alignment.',
      eccentric: 'Lower resistance smoothly over 2–3 seconds to feel full stretch on target muscle.',
      concentric: 'Contract target muscle deliberately with peak 1-second contraction at top.',
      commonMistakes: 'Using body momentum, cutting range of motion short, or hyperextending joints.'
    }
  };
}
