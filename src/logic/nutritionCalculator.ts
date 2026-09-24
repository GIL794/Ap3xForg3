import { UserProfile, NutritionTarget, PhysiqueGoalMode } from '../types';
import { SupportedLanguage } from './i18n';

/**
 * Calculates athlete BMR, TDEE, target calories, macros and Pro AI directives
 * based on current weight, goal weight, height, age, body fat %, and training frequency.
 */
export function calculateNutritionTarget(
  profile: UserProfile,
  forcedMode?: PhysiqueGoalMode,
  language: SupportedLanguage = 'en'
): NutritionTarget {
  const missingFields: string[] = [];
  if (!profile.currentWeightKg || profile.currentWeightKg <= 0) missingFields.push('currentWeightKg');
  if (!profile.heightCm || profile.heightCm <= 0) missingFields.push('heightCm');
  if (!profile.ageYears || profile.ageYears <= 0) missingFields.push('ageYears');

  if (missingFields.length > 0) {
    return {
      isConfigured: false,
      missingFields,
      bmr: 0,
      tdee: 0,
      targetCalories: 0,
      calorieDelta: 0,
      goalMode: forcedMode || 'recomp',
      modeLabel: language === 'it' ? 'Dati Biometrici Richiesti' : 'Biometrics Required',
      weeklyRateKg: 0,
      estimatedWeeks: 0,
      targetDate: '',
      proteinGrams: 0,
      proteinPerKg: 0,
      carbsGrams: 0,
      fatsGrams: 0,
      waterLiters: 0,
      proteinKcal: 0,
      carbsKcal: 0,
      fatsKcal: 0,
      proAiDirectives: {
        macroTiming: [
          language === 'it' 
            ? 'Configura peso, altezza ed età nel dossier per calcolare la ripartizione dei macronutrienti secondo standard ISO.'
            : 'Configure your current weight, height, and age in your Athlete Dossier to compute tailored macronutrient timing.'
        ],
        trainingCalibration: [
          language === 'it'
            ? 'La calibrazione dell\'intensità meccanica richiede peso attuale e peso obiettivo verificati.'
            : 'Mechanical tension calibration requires verified current weight and goal weight.'
        ],
        cardioNeat: [
          language === 'it'
            ? 'Il calcolo del dispendio energetico giornaliero (TDEE) e i passi target richiedono parametri biometrici reali.'
            : 'Daily energy expenditure (TDEE) and NEAT targets require verified biometric parameters.'
        ],
        recoverySupplements: [
          language === 'it'
            ? 'Il fabbisogno idrico e di integrazione si calcola sulla tua massa corporea reale.'
            : 'Hydration and supplement dosage is computed from your verified body mass.'
        ],
      },
    };
  }

  const weight = profile.currentWeightKg!;
  const goalWeight = profile.goalWeightKg ?? weight;
  const height = profile.heightCm!;
  const age = profile.ageYears!;
  const isFeminine = profile.genderPreference === 'feminine';
  const bodyFat = profile.bodyFatPercent;

  // 1. Calculate Basal Metabolic Rate (BMR)
  let bmr: number;
  if (bodyFat && bodyFat > 4 && bodyFat < 50) {
    // Katch-McArdle formula (gold standard when body fat is known)
    const leanMassKg = weight * (1 - bodyFat / 100);
    bmr = Math.round(370 + 21.6 * leanMassKg);
  } else {
    // Mifflin-St Jeor formula
    if (isFeminine) {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    } else {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
  }

  // 2. Activity Multiplier for TDEE based on training days & duration
  const daysPerWeek = profile.availableDays?.length || 4;
  const duration = profile.sessionLengthMinutes || 60;
  let activityMultiplier = 1.45;
  if (daysPerWeek <= 2) activityMultiplier = 1.35;
  else if (daysPerWeek === 3) activityMultiplier = 1.45;
  else if (daysPerWeek === 4) activityMultiplier = 1.55;
  else if (daysPerWeek === 5) activityMultiplier = 1.65;
  else activityMultiplier = 1.75;

  if (duration >= 75) activityMultiplier += 0.05;

  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Determine Goal Mode
  let goalMode: PhysiqueGoalMode = forcedMode || 'recomp';
  if (!forcedMode) {
    const deltaWeight = goalWeight - weight;
    if (deltaWeight < -4) {
      goalMode = 'fat_loss_moderate';
    } else if (deltaWeight < -0.5) {
      goalMode = 'fat_loss_moderate';
    } else if (deltaWeight > 4) {
      goalMode = 'hypertrophy_aggressive';
    } else if (deltaWeight > 0.5) {
      goalMode = 'lean_bulk';
    } else {
      goalMode = 'recomp';
    }
  }

  // 4. Calorie Delta & Weekly Rate
  let calorieDelta = 0;
  let weeklyRateKg = 0; // Negative for loss, positive for gain

  switch (goalMode) {
    case 'fat_loss_aggressive':
      calorieDelta = -600;
      weeklyRateKg = -0.65;
      break;
    case 'fat_loss_moderate':
      calorieDelta = -400;
      weeklyRateKg = -0.45;
      break;
    case 'recomp':
      calorieDelta = 0;
      weeklyRateKg = 0;
      break;
    case 'lean_bulk':
      calorieDelta = 300;
      weeklyRateKg = 0.30;
      break;
    case 'hypertrophy_aggressive':
      calorieDelta = 500;
      weeklyRateKg = 0.50;
      break;
  }

  const targetCalories = Math.max(1200, tdee + calorieDelta);

  // 5. Estimated Weeks to Goal
  const weightDifference = Math.abs(goalWeight - weight);
  let estimatedWeeks = 0;
  if (weeklyRateKg !== 0 && weightDifference > 0.2) {
    estimatedWeeks = Math.max(1, Math.round(weightDifference / Math.abs(weeklyRateKg)));
  }

  const targetDateObj = new Date();
  targetDateObj.setDate(targetDateObj.getDate() + estimatedWeeks * 7);
  const targetDate = targetDateObj.toLocaleDateString(
    language === 'it' ? 'it-IT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  // 6. Macro Distribution
  let proteinPerKg = 2.0;
  if (goalMode.startsWith('fat_loss')) {
    proteinPerKg = 2.3; // Higher protein in a deficit preserves muscle mass
  } else if (goalMode === 'recomp') {
    proteinPerKg = 2.2;
  } else {
    proteinPerKg = 2.0;
  }

  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinKcal = proteinGrams * 4;

  const fatsGrams = Math.round(Math.max(50, weight * 0.85));
  const fatsKcal = fatsGrams * 9;

  const remainingKcalForCarbs = Math.max(0, targetCalories - (proteinKcal + fatsKcal));
  const carbsGrams = Math.round(remainingKcalForCarbs / 4);
  const carbsKcal = carbsGrams * 4;

  // Hydration baseline
  const waterLiters = Number(((weight * 0.035) + (duration / 60 * 0.7)).toFixed(1));

  // 7. Localized Labels and Pro AI Directives
  const modeLabels: Record<PhysiqueGoalMode, Record<SupportedLanguage, string>> = {
    fat_loss_aggressive: {
      en: 'Aggressive Cut (Rapid Deficit)',
      it: 'Definizione Rapida (Deficit Aggressivo)',
      es: 'Definición Rápida (Déficit Agresivo)',
      fr: 'Sèche Rapide (Déficit Agressif)',
      de: 'Schnelle Definition (Aggressives Defizit)',
      la: 'Definitio Celeris (Deficitum Acerbum)',
    },
    fat_loss_moderate: {
      en: 'Lean Definition (Optimal Deficit)',
      it: 'Definizione Ottimale (Deficit Moderato)',
      es: 'Definición Óptima (Déficit Moderado)',
      fr: 'Sèche Optimale (Déficit Modéré)',
      de: 'Optimale Definition (Moderates Defizit)',
      la: 'Definitio Optima (Deficitum Moderatum)',
    },
    recomp: {
      en: 'Body Recomposition (Maintenance)',
      it: 'Ricomposizione Corporea (Mantenimento)',
      es: 'Recomposición Corporal (Mantenimiento)',
      fr: 'Recomposition Corporelle (Maintien)',
      de: 'Körper-Rekompensation (Erhaltung)',
      la: 'Recompositio Corporis (Conservatio)',
    },
    lean_bulk: {
      en: 'Lean Hypertrophic Bulk (Clean Surplus)',
      it: 'Massa Pulita (Surplus Ipertrofico)',
      es: 'Volumen Limpio (Superávit Hipertrófico)',
      fr: 'Prise de Masse Sèche (Surplus Propre)',
      de: 'Sauberer Masseaufbau (Hypertrophie-Surplus)',
      la: 'Incrementum Musculare Mundum (Surplus)',
    },
    hypertrophy_aggressive: {
      en: 'Maximum Mass (Colossal Surplus)',
      it: 'Massa Massima (Surplus Colossale)',
      es: 'Masa Máxima (Superávit Colosal)',
      fr: 'Masse Maximale (Surplus Colossal)',
      de: 'Maximaler Masseaufbau (Kolossaler Surplus)',
      la: 'Incrementum Colossale (Magnus Surplus)',
    },
  };

  const proAiDirectives = generateProAiDirectives(goalMode, profile, proteinGrams, language);

  return {
    bmr,
    tdee,
    targetCalories,
    calorieDelta,
    goalMode,
    modeLabel: modeLabels[goalMode][language] || modeLabels[goalMode]['en'],
    weeklyRateKg,
    estimatedWeeks,
    targetDate,
    proteinGrams,
    proteinPerKg,
    carbsGrams,
    fatsGrams,
    waterLiters,
    proteinKcal,
    carbsKcal,
    fatsKcal,
    proAiDirectives,
    isConfigured: true,
    missingFields: [],
  };
}

function generateProAiDirectives(
  mode: PhysiqueGoalMode,
  profile: UserProfile,
  proteinGrams: number,
  lang: SupportedLanguage
): {
  macroTiming: string[];
  trainingCalibration: string[];
  cardioNeat: string[];
  recoverySupplements: string[];
} {
  const isCut = mode.startsWith('fat_loss');
  const isBulk = mode.includes('bulk') || mode.includes('hypertrophy');
  const archetype = profile.archetype || 'hercules_mass';

  if (lang === 'it') {
    return {
      macroTiming: [
        `Suddividi i ${proteinGrams}g di proteine in 4-5 pasti da ~${Math.round(proteinGrams / 4.5)}g ciascuno per mantenere la sintesi proteica muscolare (mTOR) attiva per tutta la giornata.`,
        isCut
          ? 'Consuma il 60% dei carboidrati giornalieri nella finestra peri-workout (pasto pre-allenamento 90 min prima, pasto post-allenamento entro 60 min) per massimizzare la prestazione senza accumulo adiposo.'
          : 'Inserisci una quota ricca di carboidrati complessi 2 ore prima del workout e una fonte ad alto indice glicemico post-allenamento per saturare le riserve di glicogeno muscolare.',
        'Assumi 40g di caseina o proteine a lento rilascio prima di coricarti per prevenire il catabolismo notturno e favorire il recupero delle miofibrille.',
      ],
      trainingCalibration: [
        isCut
          ? 'Scudo Anticatabolico: Mantieni carichi pesanti a RPE 8-8.5 sui sollevamenti composti. La tensione meccanica è il segnale biologico primario per impedire al corpo di degradare massa muscolare in deficit.'
          : 'Sovraccarico Progressivo: Spingi l\'RPE tra 8.5 e 9.5 con accumulo di volume. In surplus calorico, ogni 2 settimane punta ad aumentare di 1 rip o +1.25-2.5 kg sui tuoi esercizi cardine.',
        `Calibrazione Archetipo (${archetype}): Focalizza l'intensità massima e il primo esercizio della seduta sui distretti target prima di accumulare fatica sistemica.`,
        'Evita serie spazzatura: concentrati su ripetizioni di qualità con fase eccentrica controllata di 2-3 secondi per massimizzare il danno tissutale controllato.',
      ],
      cardioNeat: [
        isCut
          ? 'Obiettivo NEAT: 9.500 - 11.000 passi al giorno. Camminata a passo svelto a digiuno o post-prandiale per ossidare grassi preservando il glicogeno delle gambe per lo squat.'
          : 'Controllo Metabolico: 7.000 - 8.500 passi al giorno per mantenere l\'insulino-sensibilità attiva e indirizzare il surplus energetico verso il tessuto muscolare anziché adiposo.',
        isCut
          ? 'Cardio Zona 2: 2 sessioni settimanali da 25 minuti su cyclette o pendenza treadmill (frequenza cardiaca al 60-70% del massimale).'
          : 'Limita il cardio HIIT ad alta intensità a massimo 1 seduta breve a settimana per non compromettere il recupero dei legamenti e delle articolazioni.',
      ],
      recoverySupplements: [
        'Creatina Monoidrato: 5g al giorno ogni mattina o post-allenamento. Fondamentale per mantenere l\'idratazione intracellulare e le scorte di fosfocreatina.',
        'Magnesio Bisglicinato (300-400mg) e Zinco 30 minuti prima di dormire per ottimizzare la qualità del sonno profondo ad onde lente e l\'ormone della crescita (GH).',
        'Architettura del Sonno: 7.5 - 8.5 ore di sonno continuativo. L\'85% della produzione di testosterone ed endocrina rigenerativa avviene durante il sonno REM profondo.',
      ],
    };
  }

  if (lang === 'es') {
    return {
      macroTiming: [
        `Divide los ${proteinGrams}g de proteína en 4 o 5 tomas de ~${Math.round(proteinGrams / 4.5)}g para mantener la síntesis proteica muscular estimulada de forma continua.`,
        isCut
          ? 'Concentra el 60% de tus carbohidratos en la ventana peri-entrenamiento (90 min antes y 60 min después) para sostener la fuerza sin ralentizar la pérdida de grasa.'
          : 'Aporta carbohidratos complejos 2 horas antes de entrenar y azúcares de rápida asimilación post-entreno para reponer al máximo el glucógeno.',
        'Toma una dosis de proteína de absorción lenta (caseína o requesón) antes de acostarte para frenar el catabolismo nocturno.',
      ],
      trainingCalibration: [
        isCut
          ? 'Escudo Anticatabólico: Mantén series pesadas a RPE 8-8.5 en ejercicios multiarticulares. La tensión mecánica es la clave para no perder masa muscular en déficit.'
          : 'Sobrecarga Progresiva: Explota el superávit subiendo cargas (+1.25 a 2.5 kg) o repeticiones cada 10-14 días con RPE 8.5 a 9.5.',
        `Ajuste por Arquetipo (${archetype}): Prioriza la musculatura clave al inicio de la sesión cuando el sistema nervioso central está al 100%.`,
        'Controla la fase excéntrica en 2 a 3 segundos para activar el máximo reclutamiento de fibras musculares de contracción rápida.',
      ],
      cardioNeat: [
        isCut
          ? 'Objetivo NEAT: 9.500 - 11.000 pasos diarios. Caminata continua para oxidar grasa sin fatigar el sistema nervioso central.'
          : 'NEAT Saludable: 7.000 - 8.500 pasos al día para optimizar la sensibilidad a la insulina y evitar acumulación de grasa visceral.',
        isCut
          ? 'Cardio Zona 2: 2 sesiones de 25-30 minutos en cinta inclinada a ritmo conversacional.'
          : 'Cardio ligero de mantenimiento cardiovascular sin exceder para no mermar la recuperación muscular.',
      ],
      recoverySupplements: [
        'Creatina Monohidrato: 5g diarios con agua o batido para preservar la fuerza celular y el volumen intramuscular.',
        'Magnesio Bisglicinato (300-400mg) antes de dormir para favorecer la relajación muscular y el descanso profundo.',
        'Sueño Reparador: 7.5 - 8.5 horas por noche. El 80% de la hormona del crecimiento se secreta en las fases de sueño profundo.',
      ],
    };
  }

  if (lang === 'fr') {
    return {
      macroTiming: [
        `Répartis les ${proteinGrams}g de protéines en 4 à 5 repas de ~${Math.round(proteinGrams / 4.5)}g pour stimuler continuellement la synthèse des protéines (mTOR).`,
        isCut
          ? 'Consomme 60% de tes glucides autour de la séance (pré-entraînement 90 min avant, post-entraînement dans l\'heure) pour préserver la force sans stocker.'
          : 'Privilégie les glucides complexes avant l\'entraînement et à index glycémique élevé après pour saturer le glycogène intramusculaire.',
        'Prends une source de protéines lentes (caséine) au coucher pour limiter le catabolisme nocturne.',
      ],
      trainingCalibration: [
        isCut
          ? 'Bouclier Anticatabolique: Conserve des charges lourdes à RPE 8-8.5 sur les mouvements polyarticulaires pour signaler au corps de préserver le muscle.'
          : 'Surcharge Progressive: Tire parti du surplus pour ajouter 1 rép ou 1.25-2.5 kg toutes les deux semaines avec un RPE de 8.5-9.5.',
        `Calibration Morphologique (${archetype}): Place les groupes musculaires prioritaires au début de l\'entraînement.`,
        'Maintiens un tempo contrôlé de 2-3 secondes sur la descente (excentrique) pour un recrutement myofibrillaire optimal.',
      ],
      cardioNeat: [
        isCut
          ? 'Cible NEAT: 9 500 à 11 000 pas par jour. Marche rapide pour maximiser l\'oxydation des lipides sans épuiser les cuisses.'
          : 'NEAT Actif: 7 000 à 8 500 pas quotidiens pour préserver la sensibilité à l\'insuline et diriger les nutriments vers le muscle.',
        isCut
          ? 'Cardio Zone 2: 2 sessions de 25 minutes sur tapis incliné ou vélo à intensité modérée.'
          : 'Cardio modéré pour la santé mitochondriale sans compromettre l\'anabolisme.',
      ],
      recoverySupplements: [
        'Créatine Monohydrate: 5g par jour pour maintenir l\'hydratation cellulaire et la puissance ATP.',
        'Bisglycinate de magnésium (300-400mg) au coucher pour optimiser la détente neuromusculaire et le sommeil profond.',
        'Architecture du Sommeil: 7.5 à 8.5 heures chaque nuit pour soutenir la sécrétion naturelle d\'hormone de croissance.',
      ],
    };
  }

  if (lang === 'de') {
    return {
      macroTiming: [
        `Verteile die ${proteinGrams}g Protein auf 4-5 Mahlzeiten à ~${Math.round(proteinGrams / 4.5)}g, um die Muskelproteinsynthese über den Tag optimal anzuregen.`,
        isCut
          ? 'Nimm 60% der täglichen Kohlenhydrate im Zeitfenster um das Training herum ein (90 Min vorher und direkt danach), um volle Kraft im Defizit zu garantieren.'
          : 'Konsumiere komplexe Kohlenhydrate 2 Stunden vor dem Training und schnelle Glukosequellen danach für maximalen Glykogenaufbau.',
        'Nimm vor dem Schlafen langsame Proteinquellen (Casein oder Magerquark), um nächtlichen Muskelabbau zu verhindern.',
      ],
      trainingCalibration: [
        isCut
          ? 'Antikataboler Schild: Behalte schwere Grundübungen bei RPE 8-8.5 bei. Mechanische Spannung ist das wichtigste biologische Signal zum Muskelerhalt.'
          : 'Progressive Überlastung: Nutze den Kalorienüberschuss, um alle 10-14 Tage Gewicht (+1.25 bis 2.5 kg) oder Wiederholungen zu steigern.',
        `Archetyp-Spezifisch (${archetype}): Trainiere Schlüsselfokus-Muskeln ganz zu Beginn der Einheit bei voller Frische.`,
        'Kontrollierte 2-3 Sekunden Negativphase (Exzentrik) für maximale Mikrotraumatisierung der schnellen Muskelfasern.',
      ],
      cardioNeat: [
        isCut
          ? 'NEAT-Ziel: 9.500 - 11.000 Schritte täglich. Zügiges Gehen zur Fettverbrennung, ohne die Beinmuskulatur zu ermüden.'
          : 'Gesunder NEAT: 7.000 - 8.500 Schritte pro Tag, um die Insulinsensitivität hoch zu halten und Fettaufbau zu minimieren.',
        isCut
          ? 'Zone-2-Kardio: 2 Einheiten à 25 Minuten auf dem Steigungs-Laufband bei moderatem Puls.'
          : 'Leichtes Kardio zur kardiovaskulären Unterstützung ohne Regenerationskompromisse.',
      ],
      recoverySupplements: [
        'Kreatin-Monohydrat: 5g täglich für Zellhydratation und maximale intramuskuläre Phosphokreatinspeicher.',
        'Magnesium-Bisglycinat (300-400mg) vor dem Schlafen zur neuromuskulären Entspannung.',
        'Schlafarchitektur: 7.5 - 8.5 Stunden Schlaf für maximale Ausschüttung von Wachstumshormonen (HGH) und Testosteron.',
      ],
    };
  }

  if (lang === 'la') {
    return {
      macroTiming: [
        `Divide ${proteinGrams}g proteinae in 4-5 cibos ~${Math.round(proteinGrams / 4.5)}g ad synthesim musculorum perpetuam sustinendam.`,
        isCut
          ? 'Consume 60% sacchari circum tempus palaestrae ad vires servandas sine accumulatione adipis.'
          : 'Sume hydrata carbonii ante certamen et post pugnam ad glycogenum musculorum replendum.',
        'Caseinum ante noctem bibe ad catabolismum nocturnum arcendum.',
      ],
      trainingCalibration: [
        isCut
          ? 'Scutum Anticatabolicum: Tene onera gravia RPE 8-8.5 in exercitiis compositis ad fibras musculorum servandas.'
          : 'Progressio Overload: Supera onera singulis hebdomadibus cum energia abundante ad robur gladiatorium.',
        `Pro Archetypo (${archetype}): Movere prius musculos primarios cum animus recens est.`,
        'Descensus lentus (2-3 secunda) ad vim mechanicam maximam.',
      ],
      cardioNeat: [
        isCut
          ? 'Passus Diurni: 10.000 passus ad adipem comburendum.'
          : 'Passus Diurni: 8.000 passus ad vigorem cordis.',
        'Cursus levis ad vires conservandas.',
      ],
      recoverySupplements: [
        'Creatina Monohydrata: 5g cotidie ad vires amplificandas.',
        'Magnesium ante somnum ad quietem corpori praebendam.',
        'Somnus: 8 horae requiei ad corpus restituendum.',
      ],
    };
  }

  // Default: English
  return {
    macroTiming: [
      `Distribute your ${proteinGrams}g daily protein across 4–5 meals (~${Math.round(proteinGrams / 4.5)}g per feeding) to trigger Muscle Protein Synthesis (MPS) via mTOR threshold every 3–4 hours.`,
      isCut
        ? 'Allocate 60% of your daily carbohydrates around your workout window (pre-workout meal 90 min prior, post-workout within 60 min) to sustain heavy output while in a deficit.'
        : 'Fuel up with complex low-glycemic carbohydrates 2 hours before lifting, followed by rapid-digesting carbs and protein post-workout to saturate intramuscular glycogen stores.',
      'Consume 35–45g of slow-digesting micellar casein or Greek yogurt before bed to sustain amino acid bioavailability throughout the overnight recovery phase.',
    ],
    trainingCalibration: [
      isCut
        ? 'Anti-Catabolic Mechanical Tension: Maintain heavy loads at RPE 8–8.5 on primary compound lifts. Heavy tension is the primary biological signal that signals your body to spare muscle tissue while in a deficit.'
        : 'Hypertrophic Progressive Overload: Exploit your caloric surplus to achieve double progression (adding +1 rep or +1.25–2.5 kg every 10–14 days) while keeping RPE at 8.5–9.5.',
      `Archetype Calibration (${archetype}): Prioritize your signature muscle groups at the very start of your workout when your central nervous system (CNS) is freshest.`,
      'Enforce strict 2–3 second eccentric tempo to induce high mechanical tension on fast-twitch Type IIx muscle fibers.',
    ],
    cardioNeat: [
      isCut
        ? 'Daily NEAT Target: 9,500 – 11,000 steps/day. Low-impact brisk walking elevates daily energy expenditure without taxing leg recovery or triggering systemic hunger spikes.'
        : 'Metabolic Conditioning NEAT: 7,000 – 8,500 steps/day. Keeps insulin sensitivity high and partitions surplus calories toward myofibrillar hypertrophy rather than visceral fat.',
      isCut
        ? 'Zone 2 Cardio: 2 sessions per week of 25–30 minutes on an incline treadmill walk or stationary cycle at 60–70% max heart rate.'
        : 'Limit strenuous HIIT cardio to maximum 1 short session/week to avoid blunting muscular anabolism or recovery.',
    ],
    recoverySupplements: [
      'Creatine Monohydrate: 5g daily taken consistently with water or post-workout shake to maximize intracellular hydration and phosphocreatine ATP replenishment.',
      'Magnesium Bisglycinate (300–400mg) and Zinc taken 30 minutes prior to sleep to promote parasympathetic nervous system recovery and slow-wave sleep depth.',
      'Sleep Architecture: Prioritize 7.5 – 8.5 hours of uninterrupted sleep. Over 80% of human growth hormone (HGH) secretion and motor unit recovery takes place during Stage 3/4 deep REM sleep.',
    ],
  };
}
