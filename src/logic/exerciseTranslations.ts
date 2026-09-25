import { SupportedLanguage } from './i18n';
import { BiomechanicalExecution, MythologicalArchetype, PrimaryGoal, SecondaryGoal, EquipmentType, ExerciseCategory, ExperienceLevel } from '../types';

// ==========================================
// 1. EXERCISE NAMES TRANSLATIONS
// ==========================================
export const EXERCISE_NAMES: Record<string, Record<SupportedLanguage, string>> = {
  barbell_bench_press: {
    en: 'Barbell Bench Press',
    it: 'Panca Piana con Bilanciere',
    es: 'Press de Banca con Barra',
    fr: 'Développé Couché à la Barre',
    de: 'Bankdrücken mit der Langhantel',
    la: 'Pressio Scanni cum Vecte',
  },
  incline_db_press: {
    en: 'Incline Dumbbell Press',
    it: 'Distensioni su Panca Inclinata con Manubri',
    es: 'Press Inclinado con Mancuernas',
    fr: 'Développé Incliné aux Haltères',
    de: 'Schrägbankdrücken mit Kurzhanteln',
    la: 'Pressio Inclinata cum Alteribus',
  },
  dips_chest: {
    en: 'Chest Dips (Parallel Bars)',
    it: 'Dip alle Parallele per il Petto',
    es: 'Fondos en Paralelas para Pecho',
    fr: 'Dips aux Barres Parallèles (Pectoraux)',
    de: 'Dips an Barren (Brustfokus)',
    la: 'Demissio in Vectibus Parallelis',
  },
  pushups: {
    en: 'Deficit / Standard Push-ups',
    it: 'Piegamenti a Terra / Push-up',
    es: 'Flexiones de Brazos / Push-ups',
    fr: 'Pompes Classiques / Déficit',
    de: 'Liegestütze / Defizit-Push-ups',
    la: 'Impulsus a Solo',
  },
  cable_chest_fly: {
    en: 'Standing Cable Flyes',
    it: 'Croci ai Cavi in Piedi',
    es: 'Aperturas en Polea de Pie',
    fr: 'Écartés à la Poulie Debout',
    de: 'Kabelzug-Fliegende im Stehen',
    la: 'Cruces Funium Stantes',
  },
  machine_chest_press: {
    en: 'Machine Seated Chest Press',
    it: 'Chest Press da Seduto alla Macchina',
    es: 'Press de Pecho en Máquina Sentado',
    fr: 'Presse Pectorale Assise',
    de: 'Brustpresse an der Maschine',
    la: 'Pressio Pectoris in Machina',
  },
  pull_ups: {
    en: 'Pull-ups / Weighted Chin-ups',
    it: 'Trazioni alla Sbarra / Zavorrate',
    es: 'Dominadas / Dominadas con Lastre',
    fr: 'Tractions / Tractions Lestées',
    de: 'Klimmzüge / Mit Zusatzgewicht',
    la: 'Tractiones ad Vectem',
  },
  lat_pulldown: {
    en: 'Wide-Grip Lat Pulldown',
    it: 'Lat Machine con Presa Larga',
    es: 'Jalón al Pecho Agarre Ancho',
    fr: 'Tirage Vertical Prise Large',
    de: 'Latzug mit breitem Griff',
    la: 'Tractus Dorsi Latus',
  },
  barbell_bent_over_row: {
    en: 'Barbell Bent-Over Row',
    it: 'Rematore con Bilanciere Busto Flesso',
    es: 'Remo con Barra Inclinado',
    fr: 'Rowing Barre Buste Penché',
    de: 'Vorgebeugtes Langhantelrudern',
    la: 'Remigatio cum Vecte Inclinata',
  },
  one_arm_db_row: {
    en: 'One-Arm Dumbbell Row',
    it: 'Rematore con Manubrio a un Braccio',
    es: 'Remo con Mancuerna a una Mano',
    fr: 'Rowing Haltère à un Bras',
    de: 'Einarmiges Kurzhantelrudern',
    la: 'Remigatio Unius Brachii',
  },
  seated_cable_row: {
    en: 'Seated Cable Row (Close or Wide Grip)',
    it: 'Pulley Basso al Cavo da Seduto',
    es: 'Remo Sentado en Polea Baja',
    fr: 'Rowing Assis à la Poulie',
    de: 'Rudern am Kabelzug im Sitzen',
    la: 'Remigatio Funicularis Sedens',
  },
  face_pulls: {
    en: 'Cable Face Pulls',
    it: 'Face Pull ai Cavi con Corda',
    es: 'Face Pull en Polea con Cuerda',
    fr: 'Face Pull à la Poulie avec Corde',
    de: 'Face Pulls am Kabelzug',
    la: 'Tractio ad Faciem Funicularis',
  },
  overhead_press: {
    en: 'Standing Barbell Overhead Press (OHP)',
    it: 'Lento Avanti in Piedi con Bilanciere (OHP)',
    es: 'Press Militar con Barra de Pie (OHP)',
    fr: 'Développé Militaire Debout (OHP)',
    de: 'Überkopfdrücken mit der Langhantel (OHP)',
    la: 'Pressio Supra Caput cum Vecte',
  },
  db_lateral_raise: {
    en: 'Dumbbell Lateral Raises',
    it: 'Alzate Laterali con Manubri',
    es: 'Elevaciones Laterales con Mancuernas',
    fr: 'Élévations Latérales aux Haltères',
    de: 'Seitheben mit Kurzhanteln',
    la: 'Elevationes Laterales cum Alteribus',
  },
  cable_lateral_raise: {
    en: 'Single-Arm Cable Lateral Raise',
    it: 'Alzate Laterali al Cavo Singolo',
    es: 'Elevación Lateral en Polea a un Brazo',
    fr: 'Élévations Latérales à la Poulie (Unilatéral)',
    de: 'Einarmiges Seitheben am Kabelzug',
    la: 'Elevationes Laterales Funiculares',
  },
  rear_delt_flyes: {
    en: 'Incline Bench Rear Delt Flyes',
    it: 'Alzate Posteriori su Panca Inclinata',
    es: 'Pájaros en Banco Inclinado',
    fr: 'Oiseau sur Banc Incliné (Deltoïdes Postérieurs)',
    de: 'Vorgebeugtes Seitheben auf der Schrägbank',
    la: 'Cruces Posteriores in Scanno',
  },
  barbell_curl: {
    en: 'EZ-Bar / Barbell Bicep Curl',
    it: 'Curl per Bicipiti con Bilanciere EZ',
    es: 'Curl de Bíceps con Barra EZ / Recta',
    fr: 'Curl Biceps à la Barre EZ',
    de: 'Langhantel-Bizepscurls / EZ-Stange',
    la: 'Flexio Bicipitis cum Vecte',
  },
  incline_db_curl: {
    en: 'Incline Dumbbell Bicep Curl',
    it: 'Curl con Manubri su Panca Inclinata',
    es: 'Curl de Bíceps Inclinado con Mancuernas',
    fr: 'Curl Incliné aux Haltères',
    de: 'Schrägbank-Bizepscurls mit Kurzhanteln',
    la: 'Flexio Bicipitis in Scanno Inclinato',
  },
  hammer_curl: {
    en: 'Dumbbell Hammer Curls',
    it: 'Curl a Martello con Manubri',
    es: 'Curl Martillo con Mancuernas',
    fr: 'Curl Marteau aux Haltères',
    de: 'Hammercurls mit Kurzhanteln',
    la: 'Flexio Malleolaris cum Alteribus',
  },
  triceps_rope_pushdown: {
    en: 'Cable Triceps Rope Pushdown',
    it: 'Pushdown per Tricipiti ai Cavi con Corda',
    es: 'Extensión de Tríceps en Polea con Cuerda',
    fr: 'Extension Triceps à la Poulie avec Corde',
    de: 'Trizepsdrücken am Kabelzug mit Seil',
    la: 'Depressio Tricipitis Funicularis',
  },
  skull_crushers: {
    en: 'EZ-Bar Skull Crushers (Lying Triceps Ext)',
    it: 'French Press su Panca con Bilanciere EZ',
    es: 'Press Francés con Barra EZ (Skull Crushers)',
    fr: 'Barre au Front (Skull Crushers) Barre EZ',
    de: 'Skull Crushers / Stirndrücken mit EZ-Stange',
    la: 'Extensio Tricipitis Iacens',
  },
  barbell_squat: {
    en: 'Barbell Back Squat',
    it: 'Squat con Bilanciere',
    es: 'Sentadilla Trasera con Barra',
    fr: 'Squat Arrière à la Barre',
    de: 'Langhantel-Kniebeugen',
    la: 'Flexio Genuum cum Vecte',
  },
  romanian_deadlift: {
    en: 'Romanian Deadlift (Barbell or DB)',
    it: 'Stacco Rumeno con Bilanciere o Manubri (RDL)',
    es: 'Peso Muerto Rumano con Barra o Mancuernas (RDL)',
    fr: 'Soulevé de Terre Roumain (Barre ou Haltères)',
    de: 'Rumänisches Kreuzheben (Langhantel/Kurzhanteln)',
    la: 'Sublatio Dacoromana',
  },
  leg_press: {
    en: '45-Degree Leg Press',
    it: 'Pressa a 45 Gradi per le Gambe',
    es: 'Prensa de Piernas a 45 Grados',
    fr: 'Presse à Cuisses Inclinée 45°',
    de: '45-Grad Beinpresse',
    la: 'Pressio Crurum XLV Graduum',
  },
  walking_lunges: {
    en: 'Dumbbell Walking Lunges',
    it: 'Affondi Camminati con Manubri',
    es: 'Zancadas Caminando con Mancuernas',
    fr: 'Fentes Marchées aux Haltères',
    de: 'Ausfallschritte im Gehen mit Kurzhanteln',
    la: 'Gradus Ambulatorii cum Alteribus',
  },
  seated_leg_curl: {
    en: 'Seated or Lying Leg Curl',
    it: 'Leg Curl da Seduto o Sdraiato',
    es: 'Curl Femoral Sentado o Tumbado',
    fr: 'Leg Curl Assis ou Couché (Ischios)',
    de: 'Beinbeuger sitzend oder liegend',
    la: 'Flexio Cruris Sedens',
  },
  leg_extension: {
    en: 'Leg Extension Machine',
    it: 'Leg Extension alla Macchina',
    es: 'Extensión de Cuádriceps en Máquina',
    fr: 'Leg Extension (Presse à Quadriceps)',
    de: 'Beinstrecker an der Maschine',
    la: 'Extensio Crurum in Machina',
  },
  calf_raises: {
    en: 'Standing or Seated Calf Raise',
    it: 'Calf Raise in Piedi o da Seduto (Polpacci)',
    es: 'Elevación de Talones en Máquina (Gemelos)',
    fr: 'Élévations des Mollets (Debout ou Assis)',
    de: 'Wadenheben im Stehen oder Sitzen',
    la: 'Elevatio Surarum',
  },
  cable_crunch: {
    en: 'Kneeling Cable Crunch',
    it: 'Crunch ai Cavi in Ginocchio',
    es: 'Crunch en Polea de Rodillas',
    fr: 'Crunch à la Poulie Haute à Genoux',
    de: 'Kabel-Crunch kniend',
    la: 'Flexio Abdominalis Funicularis',
  },
  hanging_leg_raise: {
    en: 'Hanging Leg / Knee Raise',
    it: 'Alzate Gambe o Ginocchia alla Sbarra',
    es: 'Elevaciones de Piernas Colgado',
    fr: 'Relevés de Jambes Suspendu à la Barre',
    de: 'Beinheben hängend an der Klimmzugstange',
    la: 'Elevatio Crurum Pendens',
  },
  ab_plank: {
    en: 'Weighted or Standard RKC Plank',
    it: 'Plank Addominale Standard o Zavorrato',
    es: 'Plancha Abdominal RKC / con Lastre',
    fr: 'Planche Abdominale (Gainage)',
    de: 'RKC Unterarmstütz / Plank',
    la: 'Statio Tabulae Abdominalis',
  },

  // Joint safe variations
  incline_db_neutral_press: {
    en: 'Incline Dumbbell Neutral Press (Shoulder Safe)',
    it: 'Distensioni Panca Inclinata Presa Neutra (Salva Spalle)',
    es: 'Press Inclinado Agarre Neutro (Protección Hombro)',
    fr: 'Développé Incliné Prise Neutre (Protection Épaule)',
    de: 'Schrägbankdrücken Neutralgriff (Schulterschonend)',
    la: 'Pressio Inclinata Manu Neutra (Tutela Umeri)',
  },
  chest_supported_row: {
    en: 'Chest-Supported Incline DB Row (Lumbar Safe)',
    it: 'Rematore con Manubri su Panca Inclinata (Salva Lombari)',
    es: 'Remo Inclinado con Apoyo en Pecho (Protección Lumbar)',
    fr: 'Tirage Incliné Poitrine Appuyée (Protection Lombaire)',
    de: 'Brustgestütztes Kurzhantelrudern (Lendenschonend)',
    la: 'Remigatio Pectoralis Inclinata (Tutela Lumborum)',
  },
  box_squats: {
    en: 'Box Squat with Vertical Shin (Patellar Safe)',
    it: 'Box Squat con Tibia Verticale (Salva Ginocchia)',
    es: 'Sentadilla al Cajón Tibia Vertical (Protección Rotuliana)',
    fr: 'Squat sur Boîte Tibia Vertical (Protection Genou)',
    de: 'Box-Kniebeugen mit vertikalem Schienbein (Knieschonend)',
    la: 'Flexio Genuum in Capsam (Tutela Patellae)',
  },
  cable_rope_hammer_curl: {
    en: 'Cable Rope Hammer Curl (Elbow Safe)',
    it: 'Hammer Curl ai Cavi con Corda (Salva Gomiti)',
    es: 'Curl Martillo en Polea con Cuerda (Protección Codo)',
    fr: 'Curl Marteau à la Poulie avec Corde (Protection Coude)',
    de: 'Kabel-Hammercurls mit Seil (Ellbogenschonend)',
    la: 'Flexio Malleolaris Funicularis (Tutela Cubiti)',
  },
};

export function translateExerciseName(idOrName: string, lang: SupportedLanguage = 'en'): string {
  if (!idOrName) return '';
  if (lang === 'en') return idOrName;

  const rawLower = idOrName.toLowerCase().trim();
  const lower = idOrName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  // Exact ID match
  if (EXERCISE_NAMES[idOrName]) {
    return EXERCISE_NAMES[idOrName][lang] || EXERCISE_NAMES[idOrName].en;
  }
  if (EXERCISE_NAMES[lower]) {
    return EXERCISE_NAMES[lower][lang] || EXERCISE_NAMES[lower].en;
  }

  // Key match
  for (const [key, trans] of Object.entries(EXERCISE_NAMES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return trans[lang] || trans.en;
    }
  }

  // Exact or partial English name match
  for (const trans of Object.values(EXERCISE_NAMES)) {
    if (trans.en.toLowerCase() === rawLower || rawLower.includes(trans.en.toLowerCase()) || trans.en.toLowerCase().includes(rawLower)) {
      return trans[lang] || trans.en;
    }
  }

  // If already customized or substituted, retain or format
  return idOrName;
}

// ==========================================
// 2. MUSCLE NAMES
// ==========================================
export const MUSCLE_NAMES: Record<string, Record<SupportedLanguage, string>> = {
  chest: { en: 'Chest', it: 'Petto', es: 'Pecho', fr: 'Poitrine', de: 'Brust', la: 'Pectus' },
  back: { en: 'Back', it: 'Dorso', es: 'Espalda', fr: 'Dos', de: 'Rücken', la: 'Dorsum' },
  lats: { en: 'Lats', it: 'Gran Dorsale', es: 'Dorsales', fr: 'Grands Dorsaux', de: 'Latissimus', la: 'Latissimi' },
  shoulders: { en: 'Shoulders', it: 'Spalle', es: 'Hombros', fr: 'Épaules', de: 'Schultern', la: 'Umeri' },
  biceps: { en: 'Biceps', it: 'Bicipiti', es: 'Bíceps', fr: 'Biceps', de: 'Bizeps', la: 'Bicipites' },
  triceps: { en: 'Triceps', it: 'Tricipiti', es: 'Tríceps', fr: 'Triceps', de: 'Trizeps', la: 'Tricipites' },
  arms: { en: 'Arms', it: 'Braccia', es: 'Brazos', fr: 'Bras', de: 'Arme', la: 'Brachia' },
  quads: { en: 'Quads', it: 'Quadricipiti', es: 'Cuádriceps', fr: 'Quadriceps', de: 'Quadrizeps', la: 'Quadricepites' },
  hamstrings: { en: 'Hamstrings', it: 'Femorali', es: 'Isquiotibiales', fr: 'Ischio-jambiers', de: 'Beinbeuger', la: 'Hamstringi' },
  glutes: { en: 'Glutes', it: 'Glutei', es: 'Glúteos', fr: 'Fessiers', de: 'Gesäß', la: 'Glutaei' },
  calves: { en: 'Calves', it: 'Polpacci', es: 'Pantorrillas', fr: 'Mollets', de: 'Waden', la: 'Surae' },
  core: { en: 'Core / Abs', it: 'Addome / Core', es: 'Core / Abdomen', fr: 'Gainage / Abdos', de: 'Rumpf / Bauch', la: 'Centrum Corporis' },
  recovery: { en: 'Recovery', it: 'Recupero', es: 'Recuperación', fr: 'Récupération', de: 'Erholung', la: 'Recuperatio' },
  nutrition: { en: 'Nutrition', it: 'Nutrizione', es: 'Nutrición', fr: 'Nutrition', de: 'Ernährung', la: 'Nutritio' },
  mobility: { en: 'Mobility', it: 'Mobilità', es: 'Movilidad', fr: 'Mobilité', de: 'Mobilität', la: 'Mobilitas' },
};

export function translateMuscle(muscle: string, lang: SupportedLanguage = 'en'): string {
  const key = (muscle || '').toLowerCase().trim();
  return MUSCLE_NAMES[key]?.[lang] || MUSCLE_NAMES[key]?.en || muscle;
}

// ==========================================
// 3. CATEGORIES, TIERS & EQUIPMENT
// ==========================================
export const CATEGORY_NAMES: Record<ExerciseCategory, Record<SupportedLanguage, string>> = {
  push: { en: 'Push', it: 'Spinta', es: 'Empuje', fr: 'Poussée', de: 'Druck', la: 'Pulsus' },
  pull: { en: 'Pull', it: 'Trazione', es: 'Tracción', fr: 'Tirage', de: 'Zug', la: 'Tractus' },
  legs: { en: 'Legs', it: 'Gambe', es: 'Piernas', fr: 'Jambes', de: 'Beine', la: 'Crura' },
  shoulders: { en: 'Shoulders', it: 'Spalle', es: 'Hombros', fr: 'Épaules', de: 'Schultern', la: 'Umeri' },
  arms: { en: 'Arms', it: 'Braccia', es: 'Brazos', fr: 'Bras', de: 'Arme', la: 'Brachia' },
  core: { en: 'Core', it: 'Addome', es: 'Core', fr: 'Abdominaux', de: 'Rumpf', la: 'Centrum' },
};

export function translateCategory(cat: ExerciseCategory, lang: SupportedLanguage = 'en'): string {
  return CATEGORY_NAMES[cat]?.[lang] || CATEGORY_NAMES[cat]?.en || cat;
}

export const TIER_NAMES: Record<string, Record<SupportedLanguage, string>> = {
  compound: { en: 'Compound', it: 'Fondamentale', es: 'Compuesto', fr: 'Polyarticulaire', de: 'Grundübung', la: 'Compositus' },
  accessory: { en: 'Accessory', it: 'Accessorio', es: 'Accesorio', fr: 'Accessoire', de: 'Ergänzung', la: 'Accessorium' },
  isolation: { en: 'Isolation', it: 'Isolamento', es: 'Aislamiento', fr: 'Isolation', de: 'Isolation', la: 'Isolatum' },
};

export function translateTier(tier: string, lang: SupportedLanguage = 'en'): string {
  return TIER_NAMES[tier]?.[lang] || TIER_NAMES[tier]?.en || tier;
}

export const EQUIPMENT_NAMES: Record<EquipmentType, Record<SupportedLanguage, string>> = {
  free_weights: { en: 'Free Weights', it: 'Pesi Liberi', es: 'Pesas Libres', fr: 'Poids Libres', de: 'Freie Gewichte', la: 'Pondera Libera' },
  machines: { en: 'Gym Machines', it: 'Macchinari', es: 'Máquinas', fr: 'Machines', de: 'Geräte', la: 'Machinae' },
  cables: { en: 'Cables', it: 'Cavi', es: 'Poleas', fr: 'Câbles', de: 'Kabelzüge', la: 'Funes' },
  bodyweight: { en: 'Bodyweight', it: 'Corpo Libero', es: 'Peso Corporal', fr: 'Poids du Corps', de: 'Eigengewicht', la: 'Pondus Corporis' },
  bands: { en: 'Resistance Bands', it: 'Elastici', es: 'Bandas Elásticas', fr: 'Bandes Élastiques', de: 'Widerstandsbänder', la: 'Fasciae' },
};

export function translateEquipment(eq: EquipmentType | string, lang: SupportedLanguage = 'en'): string {
  const key = eq as EquipmentType;
  return EQUIPMENT_NAMES[key]?.[lang] || EQUIPMENT_NAMES[key]?.en || eq.replace('_', ' ');
}

// ==========================================
// 4. WORKOUT ROUTINE NAMES
// ==========================================
export const WORKOUT_ROUTINES: Record<string, Record<SupportedLanguage, string>> = {
  'Upper A (Push Emphasis & Upper Pecs)': {
    en: 'Upper A (Push Emphasis & Upper Pecs)',
    it: 'Parte Superiore A (Focus Spinta & Pettorali Alti)',
    es: 'Tren Superior A (Énfasis Empuje y Pectoral Superior)',
    fr: 'Haut du Corps A (Poussée & Haut des Pectoraux)',
    de: 'Oberkörper A (Druckfokus & Obere Brust)',
    la: 'Pars Superior A (Pulsus & Pectus Superius)',
  },
  'Lower A (Squat Focus & Posterior Chain)': {
    en: 'Lower A (Squat Focus & Posterior Chain)',
    it: 'Parte Inferiore A (Focus Squat & Catena Posteriore)',
    es: 'Tren Inferior A (Enfoque Sentadilla y Cadena Posterior)',
    fr: 'Bas du Corps A (Squat & Chaîne Postérieure)',
    de: 'Unterkörper A (Kniebeugen & Hintere Kette)',
    la: 'Pars Inferior A (Flexio Genuum & Pars Posterior)',
  },
  'Upper B (Pull Emphasis & V-Taper)': {
    en: 'Upper B (Pull Emphasis & V-Taper)',
    it: 'Parte Superiore B (Focus Trazione & V-Taper)',
    es: 'Tren Superior B (Énfasis Tirón y V-Taper)',
    fr: 'Haut du Corps B (Tirage & Silhouette en V)',
    de: 'Oberkörper B (Zugfokus & V-Form)',
    la: 'Pars Superior B (Tractus & Forma V)',
  },
  'Lower B (Hinge Focus & Leg Density)': {
    en: 'Lower B (Hinge Focus & Leg Density)',
    it: 'Parte Inferiore B (Focus Stacco & Densità Gambe)',
    es: 'Tren Inferior B (Enfoque Bisagra y Densidad de Piernas)',
    fr: 'Bas du Corps B (Charnière & Densité Jambes)',
    de: 'Unterkörper B (Hüftbeugung & Beindichte)',
    la: 'Pars Inferior B (Cardo & Crura)',
  },
  'Upper C (Hypertrophy Pump: Delts, Arms & Upper Pecs)': {
    en: 'Upper C (Hypertrophy Pump: Delts, Arms & Upper Pecs)',
    it: 'Parte Superiore C (Pump Ipertrofico: Deltoidi, Braccia & Petto)',
    es: 'Tren Superior C (Congestión: Deltoides, Brazos y Pecho Superior)',
    fr: 'Haut du Corps C (Congestion: Deltoïdes, Bras & Haut des Pectoraux)',
    de: 'Oberkörper C (Hypertrophie-Pump: Schultern, Arme & Obere Brust)',
    la: 'Pars Superior C (Hypertrophia: Umeri, Brachia & Pectus)',
  },
  'Rest & Recovery Protocol': {
    en: 'Rest & Recovery Protocol',
    it: 'Protocollo di Riposo & Rigenerazione',
    es: 'Protocolo de Descanso y Recuperación',
    fr: 'Protocole de Repos & Récupération',
    de: 'Ruhe- & Regenerationsprotokoll',
    la: 'Ratio Quietis & Recuperationis',
  },
  'Full Body A': {
    en: 'Full Body A',
    it: 'Corpo Completo A',
    es: 'Cuerpo Completo A',
    fr: 'Corps Entier A',
    de: 'Ganzkörper A',
    la: 'Corpus Totum A',
  },
  'Full Body B': {
    en: 'Full Body B',
    it: 'Corpo Completo B',
    es: 'Cuerpo Completo B',
    fr: 'Corps Entier B',
    de: 'Ganzkörper B',
    la: 'Corpus Totum B',
  },
  'Full Body C': {
    en: 'Full Body C',
    it: 'Corpo Completo C',
    es: 'Cuerpo Completo C',
    fr: 'Corps Entier C',
    de: 'Ganzkörper C',
    la: 'Corpus Totum C',
  },
};

export function translateWorkoutName(name: string, lang: SupportedLanguage = 'en'): string {
  if (WORKOUT_ROUTINES[name]) {
    return WORKOUT_ROUTINES[name][lang] || WORKOUT_ROUTINES[name].en;
  }
  return name;
}

// ==========================================
// 5. WARMUP & COOLDOWN TRANSLATIONS
// ==========================================
export const WARMUP_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  '3-5 minutes light cardio (incline treadmill walk, stationary rower, or bike) to raise core body temp': {
    en: '3-5 minutes light cardio (incline treadmill walk, stationary rower, or bike) to raise core body temp',
    it: '3-5 minuti di cardio leggero (camminata in salita sul tapis roulant, vogatore o cyclette) per aumentare la temperatura corporea',
    es: '3-5 minutos de cardio ligero (cinta inclinada, remo o bicicleta) para elevar la temperatura corporal',
    fr: '3-5 minutes de cardio léger (tapis incliné, rameur ou vélo) pour monter la température corporelle',
    de: '3-5 Minuten leichtes Cardio (Steigungslaufband, Rudergerät oder Fahrrad) zur Erhöhung der Körpertemperatur',
    la: '3-5 minuta cursus levis ad corpus calefaciendum',
  },
  'Controlled arm swings, torso twists & thoracic spine rotations (15 reps each)': {
    en: 'Controlled arm swings, torso twists & thoracic spine rotations (15 reps each)',
    it: 'Slanci controllati delle braccia, torsioni del busto e rotazioni della colonna toracica (15 rip per tipo)',
    es: 'Oscilaciones controladas de brazos, giros de torso y rotaciones torácicas (15 reps cada una)',
    fr: 'Balancements contrôlés des bras, rotations du torse et de la colonne thoracique (15 reps)',
    de: 'Kontrollierte Armschwünge, Rumpfdrehungen & Rotationen der Brustwirbelsäule (je 15 Wdh.)',
    la: 'Circumductiones brachiorum et rotationes thoracis (XV vices)',
  },
  'Scapular push-ups & band pull-aparts (2 sets of 15 reps)': {
    en: 'Scapular push-ups & band pull-aparts (2 sets of 15 reps)',
    it: 'Push-up scapolari & aperture con elastico (2 serie da 15 rip)',
    es: 'Flexiones escapulares y aperturas con banda elástica (2 series de 15 reps)',
    fr: 'Pompes scapulaires & tirages avec bande élastique (2 séries de 15 reps)',
    de: 'Skapuläre Liegestütze & Band Pull-Aparts (2 Sätze à 15 Wdh.)',
    la: 'Impulsus scapulares et distractiones fasciae (II series XV vicum)',
  },
  'Light cable or dumbbell face pulls / external rotations (1-2 sets of 12 reps)': {
    en: 'Light cable or dumbbell face pulls / external rotations (1-2 sets of 12 reps)',
    it: 'Face pull leggeri ai cavi o rotazioni esterne con manubri (1-2 serie da 12 rip)',
    es: 'Face pulls ligeros en polea o rotaciones externas con mancuerna (1-2 series de 12 reps)',
    fr: 'Face pulls légers à la poulie ou rotations externes aux haltères (1-2 séries de 12 reps)',
    de: 'Leichte Face Pulls am Kabelzug oder Außenrotationen mit Kurzhanteln (1-2 Sätze à 12 Wdh.)',
    la: 'Tractiones leves ad faciem vel rotationes externae (I-II series XII vicum)',
  },
  'Pyramid warm-up sets on first main compound (empty bar x 10, 50% x 5, 75% x 3)': {
    en: 'Pyramid warm-up sets on first main compound (empty bar x 10, 50% x 5, 75% x 3)',
    it: 'Serie di avvicinamento piramidale sul primo esercizio (bilanciere vuoto x 10, 50% x 5, 75% x 3)',
    es: 'Series de aproximación piramidal en el primer ejercicio (barra vacía x 10, 50% x 5, 75% x 3)',
    fr: 'Séries pyramidales d\'échauffement sur le premier mouvement (barre à vide x 10, 50% x 5, 75% x 3)',
    de: 'Pyramidale Aufwärmsätze bei der ersten Hauptübung (leere Stange x 10, 50% x 5, 75% x 3)',
    la: 'Series pyramidales praeparatoriae (vectis vacuus x X, L% x V, LXXV% x III)',
  },
  'World\'s greatest stretch & deep bodyweight goblet squat hold (60 sec)': {
    en: "World's greatest stretch & deep bodyweight goblet squat hold (60 sec)",
    it: 'World\'s Greatest Stretch e tenuta in squat profondo a corpo libero (60 sec)',
    es: 'El estiramiento rey (World\'s Greatest Stretch) y sentadilla profunda isométrica (60 seg)',
    fr: 'Le plus grand étirement du monde & maintien en squat profond au poids du corps (60 sec)',
    de: 'World\'s Greatest Stretch & tiefer Goblet-Squat-Hold mit eigenem Körpergewicht (60 Sek.)',
    la: 'Optima extensio articulorum et statio ima flexus (LX secunda)',
  },
  'Glute bridges & bodyweight lateral lunges (2 sets of 10/side)': {
    en: 'Glute bridges & bodyweight lateral lunges (2 sets of 10/side)',
    it: 'Ponte per i glutei & affondi laterali a corpo libero (2 serie da 10 per lato)',
    es: 'Puentes de glúteo y zancadas laterales con peso corporal (2 series de 10 por lado)',
    fr: 'Pont de fessiers & fentes latérales au poids du corps (2 séries de 10 par côté)',
    de: 'Glute Bridges & seitliche Ausfallschritte mit eigenem Körpergewicht (2 Sätze à 10/Seite)',
    la: 'Pons glutaeorum et gradus laterales (II series X pro parte)',
  },
  'Pyramid warm-up sets on primary leg movement before working sets': {
    en: 'Pyramid warm-up sets on primary leg movement before working sets',
    it: 'Serie di avvicinamento piramidale sul primo esercizio di gambe prima dei set allenanti',
    es: 'Series de aproximación piramidal en el ejercicio principal de piernas',
    fr: 'Séries d\'échauffement pyramidales sur le premier exercice pour les jambes',
    de: 'Pyramidale Aufwärmsätze bei der primären Beinübung vor den Arbeitssätzen',
    la: 'Series praeparatoriae crurum ante exercitium primum',
  },
  '2 minutes relaxed nasal breathing walk to lower heart rate': {
    en: '2 minutes relaxed nasal breathing walk to lower heart rate',
    it: '2 minuti di camminata rilassata con respirazione nasale per abbassare il battito',
    es: '2 minutos de caminata relajada respirando por la nariz para reducir el pulso',
    fr: '2 minutes de marche détendue avec respiration nasale pour abaisser la fréquence cardiaque',
    de: '2 Minuten entspanntes Gehen mit Nasenatmung zur Senkung der Herzfrequenz',
    la: 'II minuta ambulationis tranquillae cum respiratione nasali',
  },
  'Doorway chest & anterior delt stretch (45s per side)': {
    en: 'Doorway chest & anterior delt stretch (45s per side)',
    it: 'Stretching pettorale e deltoide anteriore contro lo stipite (45s per lato)',
    es: 'Estiramiento de pecho y deltoides anterior en puerta (45s por lado)',
    fr: 'Étirement de la poitrine et du deltoïde antérieur contre un cadre (45s par côté)',
    de: 'Brust- & vordere Schulterdehnung am Türrahmen (45 Sek. pro Seite)',
    la: 'Extensio pectoris et umeri in limine (XLV secunda pro parte)',
  },
  'Lat & upper back dead hang or doorway stretch (45s)': {
    en: 'Lat & upper back dead hang or doorway stretch (45s)',
    it: 'Dead hang alla sbarra per dorsali o stretching dorsale (45s)',
    es: 'Suspensión pasiva en barra o estiramiento de dorsales (45s)',
    fr: 'Suspension passive à la barre ou étirement des dorsaux (45s)',
    de: 'Aushängen an der Stange (Dead Hang) oder Lattraining-Dehnung (45 Sek.)',
    la: 'Suspensio passiva ad dorsum relaxandum (XLV secunda)',
  },
  'Kneeling hip flexor / couch stretch (45s per side)': {
    en: 'Kneeling hip flexor / couch stretch (45s per side)',
    it: 'Stretching dei flessori dell\'anca in ginocchio / couch stretch (45s per lato)',
    es: 'Estiramiento de flexores de cadera de rodillas (45s por lado)',
    fr: 'Étirement des fléchisseurs de la hanche à genoux (45s par côté)',
    de: 'Hüftbeuger-Dehnung im Knien / Couch Stretch (45 Sek. pro Seite)',
    la: 'Extensio flexorum coxae in genibus (XLV secunda pro parte)',
  },
  'Hamstring & calf stretch (45s per side)': {
    en: 'Hamstring & calf stretch (45s per side)',
    it: 'Stretching per femorali e polpacci (45s per lato)',
    es: 'Estiramiento de isquiotibiales y gemelos (45s por lado)',
    fr: 'Étirement des ischio-jambiers et mollets (45s par côté)',
    de: 'Beinbeuger- & Wadendehnung (45 Sek. pro Seite)',
    la: 'Extensio crurum et surarum (XLV secunda pro parte)',
  },
};

export function translateWarmupItem(item: string, lang: SupportedLanguage = 'en'): string {
  return WARMUP_TRANSLATIONS[item]?.[lang] || WARMUP_TRANSLATIONS[item]?.en || item;
}

// ==========================================
// 6. BIOMECHANICAL EXECUTION GUIDE TRANSLATION
// ==========================================
export const BIOMECHANICS_PHASE_NAMES: Record<string, Record<SupportedLanguage, string>> = {
  setup: {
    en: '1. Setup & Stance',
    it: '1. Assetto & Posizione',
    es: '1. Posición y Ajuste',
    fr: '1. Position & Préparation',
    de: '1. Setup & Haltung',
    la: '1. Dispositio & Statio',
  },
  eccentric: {
    en: '2. Eccentric (Lowering)',
    it: '2. Eccentrica (Discesa Controllata)',
    es: '2. Excéntrica (Bajada Controlada)',
    fr: '2. Excentrique (Descente Contrôlée)',
    de: '2. Exzentrisch (Kontrolliertes Absenken)',
    la: '2. Motus Devexus (Descensus)',
  },
  concentric: {
    en: '3. Concentric (Drive)',
    it: '3. Concentrica (Spinta Esplosiva)',
    es: '3. Concéntrica (Impulso Explosivo)',
    fr: '3. Concentrique (Poussée Explosive)',
    de: '3. Konzentrisch (Explosiver Antrieb)',
    la: '3. Motus Impulsorius (Ascensus)',
  },
  commonMistakes: {
    en: '4. Form Traps & Mistakes to Avoid',
    it: '4. Errori Comuni da Evitare',
    es: '4. Errores Comunes a Evitar',
    fr: '4. Pièges & Erreurs à Éviter',
    de: '4. Häufige Formfehler vermeiden',
    la: '4. Errores Vitandi',
  },
};

// Generic translated cues when rendering biomechanical phases in other languages
export function translateBiomechanicalSteps(
  id: string,
  steps?: BiomechanicalExecution,
  lang: SupportedLanguage = 'en'
): BiomechanicalExecution | undefined {
  if (!steps) return undefined;
  if (lang === 'en') return steps;

  // If Italian, translate terms and retain deep cues
  if (lang === 'it') {
    return {
      setup: `Assetto fondamentale: ${steps.setup.replace(/scapulae/gi, 'scapole').replace(/bench/gi, 'panca').replace(/feet/gi, 'piedi').replace(/core/gi, 'addome')}`,
      eccentric: `Fase discendente (3s): ${steps.eccentric.replace(/inhale/gi, 'inspira profondamente').replace(/stretch/gi, 'allungamento muscolare')}`,
      concentric: `Fase di spinta: ${steps.concentric.replace(/exhale/gi, 'espira superando il punto critico').replace(/drive/gi, 'spingi con forza')}`,
      commonMistakes: `Attenzione: ${steps.commonMistakes.replace(/flaring/gi, 'allargare eccessivamente').replace(/bouncing/gi, 'far rimbalzare il peso')}`,
    };
  }

  if (lang === 'es') {
    return {
      setup: `Ajuste inicial: ${steps.setup.replace(/scapulae/gi, 'escápulas').replace(/bench/gi, 'banco').replace(/feet/gi, 'pies')}`,
      eccentric: `Fase de bajada (3s): ${steps.eccentric.replace(/inhale/gi, 'inhala profundamente').replace(/stretch/gi, 'estiramiento')}`,
      concentric: `Fase de empuje: ${steps.concentric.replace(/exhale/gi, 'exhala pasando el punto crítico')}`,
      commonMistakes: `Errores a evitar: ${steps.commonMistakes}`,
    };
  }

  if (lang === 'fr') {
    return {
      setup: `Préparation: ${steps.setup}`,
      eccentric: `Phase excentrique: ${steps.eccentric}`,
      concentric: `Phase concentrique: ${steps.concentric}`,
      commonMistakes: `Erreurs courantes: ${steps.commonMistakes}`,
    };
  }

  if (lang === 'de') {
    return {
      setup: `Setup & Haltung: ${steps.setup}`,
      eccentric: `Exzentrische Phase: ${steps.eccentric}`,
      concentric: `Konzentrische Phase: ${steps.concentric}`,
      commonMistakes: `Häufige Fehler: ${steps.commonMistakes}`,
    };
  }

  if (lang === 'la') {
    return {
      setup: `Dispositio corporis: ${steps.setup}`,
      eccentric: `Descensus temperatus: ${steps.eccentric}`,
      concentric: `Ascensus potens: ${steps.concentric}`,
      commonMistakes: `Cavenda: ${steps.commonMistakes}`,
    };
  }

  return steps;
}

export function translateBiomechanicalFocus(focus?: string, lang: SupportedLanguage = 'en'): string | undefined {
  if (!focus) return undefined;
  if (lang === 'en') return focus;

  if (lang === 'it') {
    return focus
      .replace(/Mechanical Tension/gi, 'Tensione Meccanica')
      .replace(/Spine Sparing/gi, 'Salva Colonna')
      .replace(/Pec Major/gi, 'Pettorale Maggiore')
      .replace(/Anterior Deltoid/gi, 'Deltoide Anteriore')
      .replace(/Lateral Deltoid/gi, 'Deltoide Laterale')
      .replace(/Posterior Deltoid/gi, 'Deltoide Posteriore')
      .replace(/Quadriceps/gi, 'Quadricipiti')
      .replace(/Hamstrings/gi, 'Femorali')
      .replace(/Glutes/gi, 'Glutei')
      .replace(/Biceps/gi, 'Bicipiti')
      .replace(/Triceps/gi, 'Tricipiti');
  }

  if (lang === 'es') {
    return focus
      .replace(/Mechanical Tension/gi, 'Tensión Mecánica')
      .replace(/Pec Major/gi, 'Pectoral Mayor')
      .replace(/Anterior Deltoid/gi, 'Deltoides Anterior')
      .replace(/Lateral Deltoid/gi, 'Deltoides Lateral')
      .replace(/Posterior Deltoid/gi, 'Deltoides Posterior')
      .replace(/Quadriceps/gi, 'Cuádriceps')
      .replace(/Hamstrings/gi, 'Isquiotibiales');
  }

  return focus;
}

// ==========================================
// 7. PERSONALIZATION REASON TRANSLATION
// ==========================================
export function translatePersonalizationReason(reason?: string, lang: SupportedLanguage = 'en'): string | undefined {
  if (!reason) return undefined;
  if (lang === 'en') return reason;

  if (lang === 'it') {
    return reason
      .replace(/Adonis V-Taper Priority: Clavicular upper chest and lateral delt volume to forge the 1.618 Golden Ratio/gi, 'Priorità V-Taper Adonis: Volume per pettorali alti e deltoidi laterali per forgiare la Proporzione Aurea 1.618')
      .replace(/Adonis V-Taper Priority: Lat width expansion for a tapered silhouette flowing into a narrow waist/gi, 'Priorità V-Taper Adonis: Espansione della larghezza dorsale per una silhouette affusolata con vita stretta')
      .replace(/Hercules Mass Protocol: Heavy compound overload engineered for maximum myofibrillar mass and colossal strength/gi, 'Protocollo Massa Ercole: Sovraccarico con esercizi fondamentali pesanti per la massima massa miofibrillare e forza colossale')
      .replace(/Artemis Huntress Priority: Powerful posterior-chain recruitment for explosive athletic power and glute drive/gi, 'Priorità Cacciatrice Artemide: Reclutamento potente della catena posteriore per forza atletica esplosiva e glutei scolpiti')
      .replace(/Aphrodite Sovereign Focus: Targeted glute and lateral delt tension to craft a sculpted hourglass aesthetic/gi, 'Focus Sovrana Afrodite: Tensione mirata su glutei e deltoidi laterali per una silhouette a clessidra definita')
      .replace(/Ares Centurion Protocol: High work capacity and functional unilateral strength for battle-ready stamina/gi, 'Protocollo Centurione Ares: Alta capacità di lavoro e forza unilaterale per una resistenza da combattimento')
      .replace(/Athena Goddess Focus: Postural scapular alignment and 3D shoulder capping for symmetry/gi, 'Focus Dea Atena: Allineamento scapolare posturale e spalle a tutto tondo per una simmetria regale')
      .replace(/Tall Lever Calibration/gi, 'Calibrazione Leve Lunghe')
      .replace(/Compact Lever Advantage/gi, 'Vantaggio Leve Compatte')
      .replace(/Caloric Deficit/gi, 'Deficit Calorico')
      .replace(/Hypertrophic Surplus/gi, 'Surplus Ipertrofico')
      .replace(/Joint Safeguard/gi, 'Protezione Articolare');
  }

  if (lang === 'es') {
    return reason
      .replace(/Adonis V-Taper Priority/gi, 'Prioridad V-Taper Adonis')
      .replace(/Hercules Mass Protocol/gi, 'Protocolo de Masa Hércules')
      .replace(/Artemis Huntress Priority/gi, 'Prioridad Cazadora Artemisa')
      .replace(/Aphrodite Sovereign Focus/gi, 'Enfoque Soberana Afrodita')
      .replace(/Ares Centurion Protocol/gi, 'Protocolo Centurión Ares')
      .replace(/Athena Goddess Focus/gi, 'Enfoque Diosa Atenea')
      .replace(/Tall Lever Calibration/gi, 'Calibración Palancas Largas')
      .replace(/Compact Lever Advantage/gi, 'Ventaja Palancas Compactas')
      .replace(/Caloric Deficit/gi, 'Déficit Calórico')
      .replace(/Hypertrophic Surplus/gi, 'Superávit Hipertrófico')
      .replace(/Joint Safeguard/gi, 'Protección Articular');
  }

  return reason;
}

// ==========================================
// 8. GOALS & ARCHETYPES
// ==========================================
export const PRIMARY_GOALS: Record<PrimaryGoal, Record<SupportedLanguage, string>> = {
  upper_body_hypertrophy: {
    en: 'Upper-Body Hypertrophy (Muscle Growth)',
    it: 'Ipertrofia Parte Superiore (Crescita Muscolare)',
    es: 'Hipertrofia Tren Superior (Crecimiento Muscular)',
    fr: 'Hypertrophie du Haut du Corps',
    de: 'Oberkörper-Hypertrophie (Muskelaufbau)',
    la: 'Hypertrophia Partis Superioris',
  },
  full_body_hypertrophy: {
    en: 'Full-Body Hypertrophy',
    it: 'Ipertrofia Corpo Completo',
    es: 'Hipertrofia Cuerpo Completo',
    fr: 'Hypertrophie du Corps Entier',
    de: 'Ganzkörper-Hypertrophie',
    la: 'Hypertrophia Corporis Totius',
  },
  strength: {
    en: 'Strength Focus (Upper & Lower Overload)',
    it: 'Focus Forza Pura (Sovraccarico Pesante)',
    es: 'Fuerza Pura (Sobrecarga Pesada)',
    fr: 'Force Pure (Surcharge Lourde)',
    de: 'Kraftfokus (Maximale Überlastung)',
    la: 'Fortitudo Maxima',
  },
  fat_loss: {
    en: 'Fat Loss + Muscle Maintenance',
    it: 'Definizione & Mantenimento Muscolare',
    es: 'Pérdida de Grasa y Mantenimiento',
    fr: 'Perte de Gras & Maintien Musculaire',
    de: 'Fettabbau & Muskelerhalt',
    la: 'Deminutio Adipis & Defensio Musculorum',
  },
  general_fitness: {
    en: 'General Fitness & Athleticism',
    it: 'Forma Atletica Generale & Longevità',
    es: 'Forma Física General y Atletismo',
    fr: 'Forme Générale & Athlétisme',
    de: 'Allgemeine Fitness & Athletik',
    la: 'Salus et Athletismus Generalis',
  },
};

export function translateGoal(goal: PrimaryGoal, lang: SupportedLanguage = 'en'): string {
  return PRIMARY_GOALS[goal]?.[lang] || PRIMARY_GOALS[goal]?.en || goal;
}

export const EXPERIENCE_LEVELS: Record<ExperienceLevel, Record<SupportedLanguage, string>> = {
  Beginner: {
    en: 'Beginner',
    it: 'Principiante',
    es: 'Principiante',
    fr: 'Débutant',
    de: 'Anfänger',
    la: 'Tiro',
  },
  Intermediate: {
    en: 'Intermediate',
    it: 'Intermedio',
    es: 'Intermedio',
    fr: 'Intermédiaire',
    de: 'Fortgeschritten',
    la: 'Mediocris',
  },
  Advanced: {
    en: 'Advanced',
    it: 'Avanzato', // Strictly 'Avanzato' - NEVER 'assaggiato'
    es: 'Avanzado',
    fr: 'Avancé',
    de: 'Erfahren',
    la: 'Expertus',
  },
};

export function translateExperienceLevel(level: ExperienceLevel, lang: SupportedLanguage = 'en'): string {
  return EXPERIENCE_LEVELS[level]?.[lang] || EXPERIENCE_LEVELS[level]?.en || level;
}

export const SECONDARY_GOALS: Record<SecondaryGoal, Record<SupportedLanguage, string>> = {
  strength: { en: 'Raw Strength', it: 'Forza Pura', es: 'Fuerza Bruta', fr: 'Force Pure', de: 'Maximalkraft', la: 'Vis Cruda' },
  aesthetics: { en: 'Aesthetics & Proportions', it: 'Estetica & Proporzioni', es: 'Estética y Proporciones', fr: 'Esthétique & Proportions', de: 'Ästhetik & Proportionen', la: 'Aesthetica' },
  endurance: { en: 'Work Capacity / Conditioning', it: 'Capacità di Lavoro & Fiato', es: 'Capacidad de Trabajo / Resistencia', fr: 'Capacité de Travail', de: 'Ausdauer & Kondition', la: 'Perseverantia' },
  mobility: { en: 'Joint Mobility & Longevity', it: 'Mobilità Articolare & Longevità', es: 'Movilidad Articular y Longevidad', fr: 'Mobilité & Longévité', de: 'Gelenkmobilität', la: 'Mobilitas Articulorum' },
  core_stability: { en: 'Core Stability', it: 'Stabilità del Core', es: 'Estabilidad del Core', fr: 'Gainage & Stabilité', de: 'Rumpfstabilität', la: 'Firmitas Centri' },
};

export function translateSecondaryGoal(goal: SecondaryGoal, lang: SupportedLanguage = 'en'): string {
  return SECONDARY_GOALS[goal]?.[lang] || SECONDARY_GOALS[goal]?.en || goal;
}

export const ARCHETYPES: Record<MythologicalArchetype, Record<SupportedLanguage, { name: string; god: string; focus: string; gender: string }>> = {
  hercules_mass: {
    en: { name: 'The Titan', god: 'Hercules', focus: 'Mass & Power', gender: 'Masc' },
    it: { name: 'Il Titano', god: 'Ercole', focus: 'Massa & Potenza', gender: 'Masc' },
    es: { name: 'El Titán', god: 'Hércules', focus: 'Masa y Fuerza', gender: 'Masc' },
    fr: { name: 'Le Titan', god: 'Hercule', focus: 'Masse & Force', gender: 'Masc' },
    de: { name: 'Der Titan', god: 'Herkules', focus: 'Masse & Kraft', gender: 'Masc' },
    la: { name: 'Titan', god: 'Hercules', focus: 'Moles & Potentia', gender: 'Masc' },
  },
  artemis_power: {
    en: { name: 'The Huntress', god: 'Artemis', focus: 'Glutes & Speed', gender: 'Fem' },
    it: { name: 'La Cacciatrice', god: 'Artemide', focus: 'Glutei & Velocità', gender: 'Fem' },
    es: { name: 'La Cazadora', god: 'Artemisa', focus: 'Glúteos y Velocidad', gender: 'Fem' },
    fr: { name: 'La Chasseresse', god: 'Artémis', focus: 'Fessiers & Vitesse', gender: 'Fem' },
    de: { name: 'Die Jägerin', god: 'Artemis', focus: 'Gesäß & Schnelligkeit', gender: 'Fem' },
    la: { name: 'Venatrix', god: 'Artemis', focus: 'Glutaei & Velocitas', gender: 'Fem' },
  },
  adonis_aesthetic: {
    en: { name: 'The Olympian', god: 'Adonis', focus: 'V-Taper Symmetry', gender: 'Masc' },
    it: { name: "L'Olimpico", god: 'Adone', focus: 'Simmetria V-Taper', gender: 'Masc' },
    es: { name: 'El Olímpico', god: 'Adonis', focus: 'Simetría V-Taper', gender: 'Masc' },
    fr: { name: "L'Olympien", god: 'Adonis', focus: 'Symétrie V-Taper', gender: 'Masc' },
    de: { name: 'Der Olympier', god: 'Adonis', focus: 'V-Form Symmetrie', gender: 'Masc' },
    la: { name: 'Olympicus', god: 'Adonis', focus: 'Symmetria V-Taper', gender: 'Masc' },
  },
  athena_sculpt: {
    en: { name: 'The War Goddess', god: 'Athena', focus: 'Delts & Posture', gender: 'Fem' },
    it: { name: 'La Dea della Guerra', god: 'Atena', focus: 'Spalle & Portamento', gender: 'Fem' },
    es: { name: 'Diosa de la Guerra', god: 'Atenea', focus: 'Hombros y Postura', gender: 'Fem' },
    fr: { name: 'Déesse de la Guerre', god: 'Athéna', focus: 'Épaules & Posture', gender: 'Fem' },
    de: { name: 'Die Kriegsgöttin', god: 'Athene', focus: 'Schultern & Haltung', gender: 'Fem' },
    la: { name: 'Dea Belli', god: 'Minerva', focus: 'Umeri & Habitus', gender: 'Fem' },
  },
  ares_combat: {
    en: { name: 'The Centurion', god: 'Ares', focus: 'Warrior Stamina', gender: 'Masc' },
    it: { name: 'Il Centurione', god: 'Marte / Ares', focus: 'Resistenza Guerriera', gender: 'Masc' },
    es: { name: 'El Centurión', god: 'Ares', focus: 'Resistencia Guerrera', gender: 'Masc' },
    fr: { name: 'Le Centurion', god: 'Arès', focus: 'Endurance Combattante', gender: 'Masc' },
    de: { name: 'Der Zenturio', god: 'Ares', focus: 'Kämpfer-Ausdauer', gender: 'Masc' },
    la: { name: 'Centurio', god: 'Mars', focus: 'Perseverantia Bellica', gender: 'Masc' },
  },
  aphrodite_curves: {
    en: { name: 'The Sovereign', god: 'Aphrodite', focus: 'Hourglass Curves', gender: 'Fem' },
    it: { name: 'La Sovrana', god: 'Afrodite', focus: 'Curve a Clessidra', gender: 'Fem' },
    es: { name: 'La Soberana', god: 'Afrodita', focus: 'Curvas de Reloj de Arena', gender: 'Fem' },
    fr: { name: 'La Souveraine', god: 'Aphrodite', focus: 'Courbes Sculptées', gender: 'Fem' },
    de: { name: 'Die Herrscherin', god: 'Aphrodite', focus: 'Sanduhr-Kurven', gender: 'Fem' },
    la: { name: 'Regina', god: 'Venus', focus: 'Forma Clepsydrae', gender: 'Fem' },
  },
};

export function translateArchetype(archId: MythologicalArchetype, lang: SupportedLanguage = 'en') {
  return ARCHETYPES[archId]?.[lang] || ARCHETYPES[archId]?.en || { name: archId, god: '', focus: '', gender: '' };
}

// ==========================================
// 9. DAY NAMES (FULL & SHORT)
// ==========================================
export const DAY_NAMES_TRANSLATED: Record<SupportedLanguage, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  la: ['Dies Solis', 'Dies Lunae', 'Dies Martis', 'Dies Mercurii', 'Dies Iovis', 'Dies Veneris', 'Dies Saturni'],
};

export const DAY_NAMES_SHORT_TRANSLATED: Record<SupportedLanguage, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  la: ['Sol', 'Lun', 'Mar', 'Mer', 'Iov', 'Ven', 'Sat'],
};

export function translateDayName(dayIdx: number, lang: SupportedLanguage = 'en', short = false): string {
  if (short) {
    return DAY_NAMES_SHORT_TRANSLATED[lang]?.[dayIdx] || DAY_NAMES_SHORT_TRANSLATED.en[dayIdx] || '';
  }
  return DAY_NAMES_TRANSLATED[lang]?.[dayIdx] || DAY_NAMES_TRANSLATED.en[dayIdx] || '';
}

// ==========================================
// 10. BIO-RECOVERY ANATOMICAL TRANSLATIONS
// ==========================================
export interface TranslatedMuscleRecoveryInfo {
  id: string;
  name: string;
  latinName: string;
  recommendation: string;
  functionLore: string;
}

export const MUSCLE_RECOVERY_TRANSLATIONS: Record<string, Record<SupportedLanguage, TranslatedMuscleRecoveryInfo>> = {
  chest: {
    en: {
      id: 'chest',
      name: 'Pectorals (Chest)',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Primed for high mechanical tension and compound barbell presses.',
      functionLore: 'Horizontal adduction & shoulder flexion. High fast-twitch fiber density.',
    },
    it: {
      id: 'chest',
      name: 'Pettorali (Petto)',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Pronti per alta tensione meccanica e distensioni pesanti su panca piana.',
      functionLore: 'Adduzione orizzontale e flessione omerale. Alta densità di fibre rapide.',
    },
    es: {
      id: 'chest',
      name: 'Pectorales (Pecho)',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Preparados para alta tensión mecánica y press de banca pesado.',
      functionLore: 'Aducción horizontal y flexión del hombro. Gran densidad de fibras rápidas.',
    },
    fr: {
      id: 'chest',
      name: 'Pectoraux (Poitrine)',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Prêts pour une forte tension mécanique et développé couché lourd.',
      functionLore: 'Adduction horizontale et flexion de l\'épaule. Haute densité de fibres rapides.',
    },
    de: {
      id: 'chest',
      name: 'Brustmuskulatur (Pectoralis)',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Bereit für maximale mechanische Spannung und schweres Bankdrücken.',
      functionLore: 'Horizontale Adduktion und Schulterflexion. Hohe Dichte an schnell zuckenden Fasern.',
    },
    la: {
      id: 'chest',
      name: 'Pectorales',
      latinName: 'Pectoralis Major & Minor',
      recommendation: 'Parati ad summam tensionem mechanicam et vectis scanni impulsus.',
      functionLore: 'Adductio horizontalis et flexio umeri. Densitas fibrarum celerium maxima.',
    },
  },
  deltoids: {
    en: {
      id: 'deltoids',
      name: 'Deltoids (Shoulders)',
      latinName: 'Deltoideus (Anterior, Lateral, Posterior)',
      recommendation: 'Full scapular stability available. Target overhead volume & lateral head.',
      functionLore: 'Multi-pennate shoulder abductors. 3D cannonball symmetry.',
    },
    it: {
      id: 'deltoids',
      name: 'Deltoidi (Spalle)',
      latinName: 'Deltoideus (Anterior, Lateralis, Posterior)',
      recommendation: 'Completa stabilità scapolare pronta. Ottimo per overhead press e alzate laterali.',
      functionLore: 'Abduttori scapolari multi-pennati per una simmetria 3D a palla di cannone.',
    },
    es: {
      id: 'deltoids',
      name: 'Deltoides (Hombros)',
      latinName: 'Deltoideus (Anterior, Lateral, Posterior)',
      recommendation: 'Estabilidad escapular completa. Ideal para press militar y elevaciones laterales.',
      functionLore: 'Abductores multipenniformes del hombro. Simetría 3D de bala de cañón.',
    },
    fr: {
      id: 'deltoids',
      name: 'Deltoïdes (Épaules)',
      latinName: 'Deltoideus (Anterior, Lateralis, Posterior)',
      recommendation: 'Stabilité scapulaire totale disponible. Ciblez le développé militaire et élévations.',
      functionLore: 'Abducteurs de l\'épaule multipennés pour une carrure 3D puissante.',
    },
    de: {
      id: 'deltoids',
      name: 'Schultermuskulatur (Deltoideus)',
      latinName: 'Deltoideus (Anterior, Lateral, Posterior)',
      recommendation: 'Volle Schulterblattstabilität bereit. Ideal für Überkopfdrücken und Seitheben.',
      functionLore: 'Multipennate Schulterabduktoren für imposante 3D-Kanonenkugel-Symmetrie.',
    },
    la: {
      id: 'deltoids',
      name: 'Deltoidei (Umeri)',
      latinName: 'Deltoideus (Anterior, Lateralis, Posterior)',
      recommendation: 'Stabilitas scapularis integra. Opportunum ad vectis elationem et lateralia.',
      functionLore: 'Abductores umerales multipennati ad coronam bellicam effingendam.',
    },
  },
  triceps: {
    en: {
      id: 'triceps',
      name: 'Triceps Brachii',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Moderate neural fatigue. Focus on controlled eccentric tempo.',
      functionLore: 'Primary elbow extensor accounting for 60% of total arm mass.',
    },
    it: {
      id: 'triceps',
      name: 'Tricipiti Brachiali',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Fatica neurale moderata. Concentrati sul tempo eccentrico controllato.',
      functionLore: 'Principale estensore del gomito, costituisce il 60% della massa del braccio.',
    },
    es: {
      id: 'triceps',
      name: 'Tríceps Braquial',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Fatiga neural moderata. Enfatizar la fase excéntrica controlada.',
      functionLore: 'Principal extensor del codo, conforma el 60% del volumen del brazo.',
    },
    fr: {
      id: 'triceps',
      name: 'Triceps Brachial',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Fatigue neurale modérée. Privilégiez un tempo excentrique maîtrisé.',
      functionLore: 'Extenseur principal du coude représentant 60% de la masse du bras.',
    },
    de: {
      id: 'triceps',
      name: 'Trizeps (Triceps Brachii)',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Mittlere neuronale Ermüdung. Konzentriere dich auf kontrolliertes exzentrisches Tempo.',
      functionLore: 'Hauptstrecker des Ellenbogens, macht 60% des Armvolumens aus.',
    },
    la: {
      id: 'triceps',
      name: 'Triceps Brachii',
      latinName: 'Triceps Brachii (Caput Longum, Laterale, Mediale)',
      recommendation: 'Fatigatio modica. Custodi motum eccentricum accurate.',
      functionLore: 'Extensor cubiti praecipuus qui partem maiorem lacerti efficit.',
    },
  },
  biceps: {
    en: {
      id: 'biceps',
      name: 'Biceps & Forearms',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Full elbow flexion power ready for Supinated Curls.',
      functionLore: 'Supination and forearm flexion. Vital for heavy pulling mechanics.',
    },
    it: {
      id: 'biceps',
      name: 'Bicipiti & Avambracci',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Piena potenza di flessione del gomito pronta per curl supinati pesanti.',
      functionLore: 'Supinazione e flessione dell\'avambraccio. Fondamentale per tutte le trazioni.',
    },
    es: {
      id: 'biceps',
      name: 'Bíceps y Antebrazos',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Potencia total de flexión de codo lista para curls pesados.',
      functionLore: 'Supinación y flexión del antebrazo. Vital en tracciones pesadas.',
    },
    fr: {
      id: 'biceps',
      name: 'Biceps & Avant-bras',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Puissance maximale de flexion du coude disponible pour les curls.',
      functionLore: 'Supination et flexion de l\'avant-bras. Vital pour les tirages lourds.',
    },
    de: {
      id: 'biceps',
      name: 'Bizeps & Unterarme',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Volle Beugekraft des Ellenbogens bereit für schwere Curls.',
      functionLore: 'Supination und Beugung des Unterarms. Essentiell für Zugübungen.',
    },
    la: {
      id: 'biceps',
      name: 'Biceps et Brachioradiales',
      latinName: 'Biceps Brachii & Brachioradialis',
      recommendation: 'Potentia flexus cubiti integra ad tractus et curvationes.',
      functionLore: 'Supinatio et flexio lacerti. Clavis virium ad trahendum.',
    },
  },
  back: {
    en: {
      id: 'back',
      name: 'Latissimus & Trapezius',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Grip and lat motor recruitment fully regenerated for heavy pulls.',
      functionLore: 'The colossal V-Taper wing expanse and scapular anchor of Olympian strength.',
    },
    it: {
      id: 'back',
      name: 'Dorsali & Trapezi',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Presa e reclutamento motorio dei dorsali pienamente rigenerati per tirate pesanti.',
      functionLore: 'La maestosa ampiezza alare a V e l\'ancoraggio scapolare della forza olimpica.',
    },
    es: {
      id: 'back',
      name: 'Dorsales y Trapecios',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Agarre y reclutamiento dorsal completamente regenerados para tirones pesados.',
      functionLore: 'La envergadura en V y el ancla escapular de la fuerza olímpica.',
    },
    fr: {
      id: 'back',
      name: 'Dorsaux & Trapèzes',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Grip et recrutement moteur des dorsaux totalement régénérés.',
      functionLore: 'L\'envergure dorsale en V et l\'ancrage scapulaire de la puissance olympienne.',
    },
    de: {
      id: 'back',
      name: 'Latissimus & Trapez',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Griffkraft und Rückenmuskelrekrutierung für schwere Züge voll regeneriert.',
      functionLore: 'Die gewaltige V-Form Flügelspanne und das scapuläre Fundament olympischer Kraft.',
    },
    la: {
      id: 'back',
      name: 'Latissimus et Trapezius',
      latinName: 'Latissimus Dorsi, Trapezius & Rhomboidei',
      recommendation: 'Prehensio et vires dorsales ad graves tractus paratae.',
      functionLore: 'Alae dorsi expansae et ancora scapularis roboris olimpici.',
    },
  },
  quads: {
    en: {
      id: 'quads',
      name: 'Quadriceps',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Deep tissue recovery underway from preceding squat session.',
      functionLore: 'Massive knee extensors featuring the iconic vastus medialis teardrop.',
    },
    it: {
      id: 'quads',
      name: 'Quadricipiti',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Recupero tissutale profondo in corso dalla sessione precedente di squat.',
      functionLore: 'Potenti estensori del ginocchio con la celebre forma a goccia del vasto mediale.',
    },
    es: {
      id: 'quads',
      name: 'Cuádriceps',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Recuperación tisular profunda en curso tras la sesión de sentadillas.',
      functionLore: 'Poderosos extensores de rodilla con la clásica gota del vasto medial.',
    },
    fr: {
      id: 'quads',
      name: 'Quadriceps',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Régénération tissulaire profonde en cours après la séance de squat.',
      functionLore: 'Puissants extenseurs du genou arborant la fameuse goutte du vaste médial.',
    },
    de: {
      id: 'quads',
      name: 'Quadrizeps (Oberschenkel)',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Tiefe Gewebserholung nach vorangegangener Kniebeugen-Einheit im Gange.',
      functionLore: 'Wuchtige Kniestrecker mit der ikonischen Vastus-Medialis-Tränenform.',
    },
    la: {
      id: 'quads',
      name: 'Quadriceps Femoris',
      latinName: 'Quadriceps Femoris (Vastus Medialis, Lateralis, Rectus)',
      recommendation: 'Recuperatio textuum procedit post flexiones graves crurum.',
      functionLore: 'Extensores genuum maximi columnis marmoreis athletae similes.',
    },
  },
  hamstrings: {
    en: {
      id: 'hamstrings',
      name: 'Hamstrings & Glutes',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Posterior chain primed for hinge patterns and controlled extension.',
      functionLore: 'The athletic posterior engine driving hip extension and sprint locomotion.',
    },
    it: {
      id: 'hamstrings',
      name: 'Femorali & Glutei',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Catena cinetica posteriore pronta per stacchi rumeni ed estensioni d\'anca.',
      functionLore: 'Il motore posteriore atletico che genera la massima spinta propulsiva.',
    },
    es: {
      id: 'hamstrings',
      name: 'Isquiosurales y Glúteos',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Cadena posterior lista para peso muerto rumano y extensión de cadera.',
      functionLore: 'El motor posterior atlético que impulsa la extensión de cadera y la potencia.',
    },
    fr: {
      id: 'hamstrings',
      name: 'Ischio-jambiers & Fessiers',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Chaîne postérieure prête pour les mouvements de charnière et soulevés de terre.',
      functionLore: 'Le moteur athlétique postérieur propulsant l\'extension de la hanche.',
    },
    de: {
      id: 'hamstrings',
      name: 'Beinbeuger & Gesäß',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Hintere Muskelkette bereit für Kreuzhebe-Varianten und Hüftstreckung.',
      functionLore: 'Der athletische Heckantrieb für explosive Hüftstreckung und Sprintkraft.',
    },
    la: {
      id: 'hamstrings',
      name: 'Femorales et Glutei',
      latinName: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
      recommendation: 'Catena posterior parata ad mortiferos tractus et impulsionem coxae.',
      functionLore: 'Machina posterior athletica cursum celerem et robur propulsionis gignens.',
    },
  },
  core: {
    en: {
      id: 'core',
      name: 'Rectus Abdominis & Obliques',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Intra-abdominal bracing and spinal stabilization at peak capacity.',
      functionLore: 'The segmented marble armor protecting visceral organs and anchoring compound loads.',
    },
    it: {
      id: 'core',
      name: 'Addominali & Obliqui',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Pressione intra-addominale e stabilizzazione spinale al massimo del potenziale.',
      functionLore: 'L\'armatura di marmo scolpito che protegge gli organi vitali e stabilizza i carichi pesanti.',
    },
    es: {
      id: 'core',
      name: 'Abdominales y Oblicuos',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Presión intraabdominal y soporte espinal en su máxima capacidad.',
      functionLore: 'La armadura de mármol que protege órganos vitales y sostiene cargas compuestas.',
    },
    fr: {
      id: 'core',
      name: 'Abdominaux & Obliques',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Gainage intra-abdominal et stabilisation vertébrale à pleine capacité.',
      functionLore: 'L\'armure de marbre sculptée protégeant les organes et stabilisant les charges.',
    },
    de: {
      id: 'core',
      name: 'Bauchmuskeln & Rumpf',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Intra-abdominelle Stabilität und Wirbelsäulenstütze auf höchstem Niveau.',
      functionLore: 'Der gemeißelte Marmorpanzer, der vitale Organe schützt und Grundübungen stabilisiert.',
    },
    la: {
      id: 'core',
      name: 'Abdominales et Obliqui',
      latinName: 'Rectus Abdominis & Obliquus Externus',
      recommendation: 'Firmitas interior et stabilimentum spinae ad summum vigorem.',
      functionLore: 'Lorica marmorea viscera tuens et gravissima onera fulciens.',
    },
  },
  calves: {
    en: {
      id: 'calves',
      name: 'Calves (Gastrocnemius & Soleus)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'High-frequency endurance tissue ready for heavy calf raises.',
      functionLore: 'Dense diamond plantar flexors built for unyielding resilience under high frequency.',
    },
    it: {
      id: 'calves',
      name: 'Polpacci (Gastrocnemio & Soleo)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'Tessuto resistente ad alta frequenza, pronto per calf raises pesanti.',
      functionLore: 'Flessori plantari a diamante costruiti per resistere a carichi ripetuti e frequenti.',
    },
    es: {
      id: 'calves',
      name: 'Pantorrillas (Gemelos y Sóleo)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'Tejido de resistencia de alta frecuencia listo para elevaciones de talones pesadas.',
      functionLore: 'Flexores plantares de diamante diseñados para una resistencia infatigable.',
    },
    fr: {
      id: 'calves',
      name: 'Mollets (Gastrocnémien & Soléaire)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'Tissu d\'endurance à haute fréquence prêt pour les extensions de mollets lourdes.',
      functionLore: 'Fléchisseurs plantaires sculptés pour une endurance inébranlable.',
    },
    de: {
      id: 'calves',
      name: 'Waden (Gastrocnemius & Soleus)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'Hochfrequentes Ausdauergewebe bereit für schweres Wadenheben.',
      functionLore: 'Dichte Diamant-Plantarflexoren für unnachgiebige Ausdauer unter hoher Frequenz.',
    },
    la: {
      id: 'calves',
      name: 'Surae (Gastrocnemius & Soleus)',
      latinName: 'Gastrocnemius & Soleus',
      recommendation: 'Fibrae perennes ad crebras surarum elationes paratae.',
      functionLore: 'Flexores plantares adamantini perpetuae firmitatis.',
    },
  },
};

export function getTranslatedMuscleInfo(muscleId: string, lang: SupportedLanguage = 'en'): TranslatedMuscleRecoveryInfo {
  const group = MUSCLE_RECOVERY_TRANSLATIONS[muscleId];
  if (!group) {
    return {
      id: muscleId,
      name: muscleId.toUpperCase(),
      latinName: muscleId,
      recommendation: 'Primed for systematic stimulus.',
      functionLore: 'Biomechanical kinetic chain.',
    };
  }
  return group[lang] || group.en;
}

