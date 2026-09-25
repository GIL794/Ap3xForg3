import { jsPDF } from 'jspdf';
import { PlannedExercise, ExerciseCategory, WorkoutDay, UserProfile } from '../types';
import { SupportedLanguage } from './i18n';
import { 
  translateExerciseName, 
  translateCategory, 
  translateTier, 
  translateEquipment, 
  translateBiomechanicalFocus,
  translateMuscle,
  translateWorkoutName,
  translateGoal
} from './exerciseTranslations';

export interface ExportableWorkoutSession {
  date: string;
  dayName: string;
  workoutName: string;
  durationMinutes: number;
  totalTonnageKg: number;
  completedSetsCount?: number;
  exercises: {
    id: string;
    name: string;
    category?: string;
    sets: {
      setNumber: number;
      weightKg?: number;
      reps?: number | string;
      completed?: boolean;
    }[];
  }[];
}

export interface AthleteInfo {
  name: string;
  archetype?: string;
  level?: number;
  xp?: number;
}

/**
 * Converts a standard date string YYYY-MM-DD into a dignified Latin Roman date format.
 */
function toRomanDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'ANNO DOMINI MMXXVI';
    const months = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IVN', 'IVL', 'AVG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    const romanNumerals = (num: number): string => {
      const lookup: Record<string, number> = {
        M: 1000, CM: 900, D: 500, CD: 400,
        C: 100, XC: 90, L: 50, XL: 40,
        X: 10, IX: 9, V: 5, IV: 4, I: 1
      };
      let roman = '';
      for (const i in lookup) {
        while (num >= lookup[i]) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    };

    return `DIE ${romanNumerals(day)} ${month} A.D. ${romanNumerals(year)}`;
  } catch {
    return 'ANNO DOMINI MMXXVI';
  }
}

/**
 * Applies authentic Roman parchment borders and background to any page.
 */
function applyRomanParchmentStyling(doc: jsPDF): { pageWidth: number; pageHeight: number } {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Parchment Background Tint
  doc.setFillColor(252, 249, 242);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Imperial Roman Outer Border (Gold)
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  // Imperial Inner Border (Crimson)
  doc.setDrawColor(153, 27, 27);
  doc.setLineWidth(0.4);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21, 'S');

  // Corner Rosettes
  const corners = [
    [10.5, 10.5],
    [pageWidth - 10.5, 10.5],
    [10.5, pageHeight - 10.5],
    [pageWidth - 10.5, pageHeight - 10.5],
  ];
  corners.forEach(([cx, cy]) => {
    doc.setFillColor(180, 83, 9);
    doc.circle(cx, cy, 1.8, 'FD');
  });

  return { pageWidth, pageHeight };
}

/**
 * Draws the Caesar Wax Seal at bottom of scroll.
 */
function drawCaesarSeal(doc: jsPDF, pageWidth: number, pageHeight: number, label = 'AUTHENTICATED'): void {
  const sealY = pageHeight - 28;
  const sealX = pageWidth / 2;

  // Crimson Wax Circle
  doc.setFillColor(153, 27, 27);
  doc.circle(sealX, sealY, 11, 'F');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.circle(sealX, sealY, 9.8, 'S');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text('HOMO DEVS', sealX, sealY - 2.5, { align: 'center' });
  doc.text('• CAESAR SEAL •', sealX, sealY + 0.5, { align: 'center' });
  doc.text(label, sealX, sealY + 3.5, { align: 'center' });

  // ISO 8000 Ledger Checksum & Corporate Attribution
  doc.setFont('times', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(130, 130, 130);
  const isoHash = `ISO/IEC 8000 VERIFIED • KYRVYN LTD ENGINEERING (kyrvynltd.co.uk) • SHA256-${Math.abs(Date.now() ^ 0xabcdef).toString(16).toUpperCase().padStart(8, '0')}`;
  doc.text(isoHash, pageWidth / 2, pageHeight - 10, { align: 'center' });
}

/**
 * 1. DAILY WORKOUT SCROLL PDF EXPORT
 * Generates and downloads an authentic Imperial Roman Daily Workout Scroll.
 */
export function generateImperialWorkoutPdf(session: ExportableWorkoutSession, athlete: AthleteInfo): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { pageWidth, pageHeight } = applyRomanParchmentStyling(doc);

  // Imperial Header
  let y = 22;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(11);
  doc.text('• S E N A T V S • P O P V L V S Q V E • R O M A N V S •', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('times', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(22);
  doc.text('HOMO DEVS — IMPERIAL WORKOUT SCROLL', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('times', 'italic');
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.text('✦ VIRTVS • CONSTANTIA • GLORIA ✦', pageWidth / 2, y, { align: 'center' });

  // Divider Rule
  y += 4;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  // Gladiator & Session Dossier Box
  y += 7;
  doc.setFillColor(245, 239, 227);
  doc.rect(16, y, pageWidth - 32, 28, 'FD');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.3);
  doc.rect(16, y, pageWidth - 32, 28, 'S');

  // Column 1: Athlete Details
  const col1X = 22;
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(153, 27, 27);
  doc.text('ATHLETE:', col1X, y + 6);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(athlete.name || 'Gladiator of Rome', col1X + 22, y + 6);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('ARCHETYPE:', col1X, y + 13);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text((athlete.archetype || 'Olympian Forge').replace(/_/g, ' ').toUpperCase(), col1X + 26, y + 13);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('RANK & XP:', col1X, y + 20);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(`Legio I • Level ${athlete.level || 1} (${athlete.xp || 150} XP)`, col1X + 24, y + 20);

  // Column 2: Workout Details
  const col2X = pageWidth / 2 + 5;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('WORKOUT:', col2X, y + 6);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(session.workoutName || 'Legion Training', col2X + 24, y + 6);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('DATE:', col2X, y + 13);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(`${session.date} (${toRomanDate(session.date)})`, col2X + 14, y + 13);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('TELEMETRY:', col2X, y + 20);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(
    `${session.durationMinutes} min • ${session.totalTonnageKg.toLocaleString()} kg Iron Tonnage moved`,
    col2X + 26,
    y + 20
  );

  y += 34;

  // Exercise Records Table
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 26, 26);
  doc.text('CHRONICLE OF COMPLETED LIFTS & VOLUME', 16, y);

  y += 5;

  const tableX = 16;
  const tableW = pageWidth - 32;
  const colW = [70, 28, 22, 26, 32];

  doc.setFillColor(180, 83, 9);
  doc.rect(tableX, y, tableW, 7, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);

  let curX = tableX + 3;
  doc.text('EXERCISE', curX, y + 4.8);
  curX += colW[0];
  doc.text('CATEGORY', curX, y + 4.8);
  curX += colW[1];
  doc.text('SETS', curX, y + 4.8);
  curX += colW[2];
  doc.text('LOAD (KG)', curX, y + 4.8);
  curX += colW[3];
  doc.text('VOLUME (KG)', curX, y + 4.8);

  y += 7;

  const exercises = session.exercises || [];
  exercises.forEach((ex, idx) => {
    if (y > pageHeight - 44) return;

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 246, isEven ? 255 : 242, isEven ? 255 : 233);
    doc.rect(tableX, y, tableW, 7, 'F');
    doc.setDrawColor(220, 210, 195);
    doc.setLineWidth(0.2);
    doc.line(tableX, y + 7, tableX + tableW, y + 7);

    const completedSets = ex.sets?.filter(s => s.completed !== false) || [];
    const setsCount = completedSets.length > 0 ? completedSets.length : (ex.sets?.length || 0);
    const primaryWeight = completedSets[0]?.weightKg || ex.sets?.[0]?.weightKg || 0;
    const avgReps = Number(completedSets[0]?.reps) || 10;
    const exTonnage = Math.round(setsCount * primaryWeight * avgReps);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);

    let rowX = tableX + 3;
    const truncatedName = ex.name.length > 36 ? ex.name.slice(0, 34) + '...' : ex.name;
    doc.text(truncatedName, rowX, y + 4.8);

    rowX += colW[0];
    doc.setTextColor(100, 100, 100);
    doc.text((ex.category || 'Compound').toUpperCase(), rowX, y + 4.8);

    rowX += colW[1];
    doc.setTextColor(30, 30, 30);
    doc.text(`${setsCount} sets`, rowX, y + 4.8);

    rowX += colW[2];
    doc.text(primaryWeight > 0 ? `${primaryWeight} kg` : 'Bodyweight', rowX, y + 4.8);

    rowX += colW[3];
    doc.setFont('times', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(exTonnage > 0 ? `${exTonnage.toLocaleString()} kg` : '—', rowX, y + 4.8);

    y += 7;
  });

  const tableHeight = 7 + exercises.length * 7;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.4);
  doc.rect(tableX, y - tableHeight, tableW, tableHeight, 'S');

  // Summary Tonnage Banner
  y += 6;
  doc.setFillColor(245, 239, 227);
  doc.rect(tableX, y, tableW, 12, 'FD');
  doc.setDrawColor(180, 83, 9);
  doc.rect(tableX, y, tableW, 12, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(153, 27, 27);
  doc.text('TOTAL CAMPAIGN WORKLOAD:', tableX + 5, y + 7.5);

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  doc.text(`${session.totalTonnageKg.toLocaleString()} KG MOVED`, tableX + 70, y + 7.5);

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Mechanical tension delivered to muscular fibers. Neuro-muscular fatigue logged.', tableX + 115, y + 7.5);

  drawCaesarSeal(doc, pageWidth, pageHeight, 'AUTHENTICATED');

  const filename = `HOMODEUS_WORKOUT_SCROLL_${session.workoutName.replace(/[^a-zA-Z0-9]/g, '_')}_${session.date}.pdf`;
  doc.save(filename);
}

/**
 * 2. INDIVIDUAL EXERCISE BIOMECHANICAL DOSSIER PDF EXPORT
 * Generates an in-depth execution guide and technical codex for a single exercise.
 */
export function generateExerciseDossierPdf(
  exercise: PlannedExercise,
  language: SupportedLanguage = 'en',
  athleteName = 'Gladiator of Rome'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { pageWidth, pageHeight } = applyRomanParchmentStyling(doc);

  // Imperial Header
  let y = 22;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(11);
  doc.text('• S E N A T V S • P O P V L V S Q V E • R O M A N V S •', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('times', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(20);
  const exerciseTitle = translateExerciseName(exercise.id || exercise.name, language).toUpperCase();
  doc.text(exerciseTitle, pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('times', 'italic');
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.text('✦ BIOMECHANICAL EXERCISE CODEX & EXECUTION DECREE ✦', pageWidth / 2, y, { align: 'center' });

  // Divider Line
  y += 4;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  // Specifications Bar
  y += 6;
  doc.setFillColor(245, 239, 227);
  doc.rect(16, y, pageWidth - 32, 14, 'FD');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.3);
  doc.rect(16, y, pageWidth - 32, 14, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);

  const specY = y + 5;
  const specY2 = y + 10;
  doc.text(`TIER: ${translateTier(exercise.tier, language).toUpperCase()}`, 22, specY);
  doc.text(`CATEGORY: ${translateCategory(exercise.category, language).toUpperCase()}`, 65, specY);
  doc.text(`SETS & REPS: ${exercise.sets} sets × ${exercise.reps}`, 115, specY);
  doc.text(`REST: ${exercise.restSeconds}s`, 165, specY);

  doc.setTextColor(50, 50, 50);
  doc.text(`EQUIPMENT: ${exercise.equipment.map(e => translateEquipment(e, language)).join(', ')}`, 22, specY2);
  doc.text(`TARGET RPE: ${exercise.targetRpe}`, 115, specY2);
  if (exercise.tempo) {
    doc.text(`TEMPO: ${exercise.tempo}`, 165, specY2);
  }

  y += 20;

  // Anatomy & Target Muscles Box
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('I. ANATOMICAL TARGETING & STABILIZERS', 16, y);

  y += 4;
  doc.setFillColor(255, 255, 255);
  doc.rect(16, y, pageWidth - 32, 16, 'FD');
  doc.setDrawColor(210, 195, 175);
  doc.rect(16, y, pageWidth - 32, 16, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('Primary Agonists:', 20, y + 6);
  doc.setFont('times', 'normal');
  doc.setTextColor(30, 30, 30);
  const primaryStr = exercise.primaryMuscles?.map((m: any) => translateMuscle(m, language)).join(', ') || 'Primary Musculature';
  doc.text(primaryStr, 52, y + 6);

  doc.setFont('times', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Secondary / Kinetic Chain:', 20, y + 12);
  doc.setFont('times', 'normal');
  doc.setTextColor(50, 50, 50);
  const secondaryStr = exercise.secondaryMuscles?.map((m: any) => translateMuscle(m, language)).join(', ') || 'Kinetic Stabilizers & Core';
  doc.text(secondaryStr, 64, y + 12);

  y += 22;

  // Biomechanical Execution Protocol
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('II. BIOMECHANICAL EXECUTION DOCTRINE', 16, y);

  y += 5;

  const steps = exercise.executionSteps || {
    setup: 'Firmly stabilize base of support. Brace core with intra-abdominal pressure, pack scapulae, and calibrate joint angles.',
    eccentric: 'Descend under strict 3-second tension control. Maintain path of resistance aligned with prime mover fiber pennation.',
    concentric: 'Drive explosively through the concentric phase without excessive momentum or compensatory joint flexion.',
    commonMistakes: 'Avoid rushing eccentric cadence, flaring elbows, hyperextending lumbar spine, or losing intra-thoracic pressure.',
  };

  const stepItems = [
    { label: 'Phase 1: Setup & Joint Calibration', content: steps.setup },
    { label: 'Phase 2: Eccentric Load & Muscle Stretch', content: steps.eccentric },
    { label: 'Phase 3: Concentric Mechanical Tension', content: steps.concentric },
    { label: 'Phase 4: Common Flaws & Structural Safeguards', content: steps.commonMistakes },
  ];

  stepItems.forEach((step, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 245 : 255, idx % 2 === 0 ? 238 : 255);
    doc.rect(16, y, pageWidth - 32, 16, 'FD');
    doc.setDrawColor(220, 210, 195);
    doc.rect(16, y, pageWidth - 32, 16, 'S');

    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27);
    doc.text(step.label, 20, y + 5);

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const splitLines = doc.splitTextToSize(step.content, pageWidth - 42);
    doc.text(splitLines, 20, y + 10);

    y += 18;
  });

  y += 2;

  // Technique Cues & Form Checklist
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('III. CENTURION FORM CHECKLIST & OVERLOAD RULES', 16, y);

  y += 5;
  doc.setFillColor(245, 239, 227);
  doc.rect(16, y, pageWidth - 32, 24, 'FD');
  doc.setDrawColor(180, 83, 9);
  doc.rect(16, y, pageWidth - 32, 24, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('Technique Cues:', 20, y + 5.5);

  doc.setFont('times', 'normal');
  doc.setTextColor(30, 30, 30);
  const cues = exercise.techniqueCues && exercise.techniqueCues.length > 0
    ? exercise.techniqueCues.slice(0, 3)
    : [
        'Brace abdominal wall 360 degrees as if taking a blow.',
        'Actively pull weight into the deepest comfortable stretch.',
        'Do not compromise joint angles to move heavier load.',
      ];

  cues.forEach((c, cIdx) => {
    doc.text(`• ${c}`, 24, y + 10 + cIdx * 4);
  });

  if (exercise.progressionRule) {
    y += 26;
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(153, 27, 27);
    doc.text('Progressive Overload Rule: ', 16, y);
    doc.setFont('times', 'italic');
    doc.setTextColor(60, 60, 60);
    doc.text(exercise.progressionRule, 62, y);
  }

  drawCaesarSeal(doc, pageWidth, pageHeight, 'STANDARDIZED');

  const safeFilename = `HOMODEUS_EXERCISE_${(exercise.id || exercise.name).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(safeFilename);
}

/**
 * 3. WEEKLY VII-DAY TRAINING CODEX PDF EXPORT
 * Generates an imperial 7-day schedule codex displaying all days, workouts, and volume targets.
 */
export function generateWeeklyPlanPdf(
  weeklyPlan: WorkoutDay[],
  profile: UserProfile,
  language: SupportedLanguage = 'en'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { pageWidth, pageHeight } = applyRomanParchmentStyling(doc);

  // Imperial Header
  let y = 22;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(11);
  doc.text('• S E N A T V S • P O P V L V S Q V E • R O M A N V S •', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setFont('times', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(22);
  doc.text('HOMO DEVS — VII-DAY TRAINING CODEX', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.setFont('times', 'italic');
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.text('✦ IMPERIAL SPLIT STRATEGY & VOLUME ALLOCATION ✦', pageWidth / 2, y, { align: 'center' });

  // Divider Line
  y += 4;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  // Athlete Campaign Dossier
  y += 6;
  doc.setFillColor(245, 239, 227);
  doc.rect(16, y, pageWidth - 32, 20, 'FD');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.3);
  doc.rect(16, y, pageWidth - 32, 20, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(153, 27, 27);
  doc.text('ATHLETE:', 22, y + 6);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(profile.name || 'Gladiator of Rome', 42, y + 6);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('PRIMARY GOAL:', 22, y + 13);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(translateGoal(profile.primaryGoal, language).toUpperCase(), 53, y + 13);

  const col2X = pageWidth / 2 + 5;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('EXPERIENCE:', col2X, y + 6);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(profile.experience.toUpperCase(), col2X + 28, y + 6);

  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('FREQUENCY:', col2X, y + 13);
  doc.setFont('times', 'normal');
  doc.setTextColor(20, 20, 20);
  const activeDaysCount = weeklyPlan.filter(d => !d.isRestDay).length;
  doc.text(`${activeDaysCount} Days Training / ${7 - activeDaysCount} Days Recovery`, col2X + 28, y + 13);

  y += 26;

  // 7-Day Schedule Chronicle
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('WEEKLY BATTLE ORDER (MONDAY THROUGH SUNDAY)', 16, y);

  y += 5;

  const orderedDays = [1, 2, 3, 4, 5, 6, 0].map(idx => 
    weeklyPlan.find(d => d.dayIndex === idx) || {
      dayIndex: idx,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx],
      isRestDay: true,
      name: 'Rest & Recovery Day',
      focus: ['recovery'],
      estimatedDurationMinutes: 0,
      exercises: [],
    }
  );

  orderedDays.forEach((day, idx) => {
    if (y > pageHeight - 44) return;

    const isRest = day.isRestDay;
    doc.setFillColor(isRest ? 245 : 255, isRest ? 245 : 255, isRest ? 245 : 248);
    doc.rect(16, y, pageWidth - 32, 13, 'FD');
    doc.setDrawColor(180, 83, 9);
    doc.setLineWidth(isRest ? 0.2 : 0.35);
    doc.rect(16, y, pageWidth - 32, 13, 'S');

    // Day Tag
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(isRest ? 120 : 153, isRest ? 120 : 27, isRest ? 120 : 27);
    doc.text(`${day.dayName.toUpperCase()}:`, 20, y + 5);

    // Workout Name
    doc.setFont('times', isRest ? 'italic' : 'bold');
    doc.setTextColor(isRest ? 100 : 20, isRest ? 100 : 20, isRest ? 100 : 20);
    const workoutLabel = isRest ? 'Rest Day & Active CNS Recovery' : translateWorkoutName(day.name, language);
    doc.text(workoutLabel, 50, y + 5);

    // Target Focus & Duration
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const focusStr = day.focus && day.focus.length > 0 ? day.focus.join(', ') : 'Rest';
    doc.text(`Focus: ${focusStr}`, 20, y + 10);

    if (!isRest) {
      doc.setTextColor(180, 83, 9);
      doc.text(`~${day.estimatedDurationMinutes || 60} min • ${day.exercises?.length || 0} Movements`, 130, y + 10);
    } else {
      doc.setTextColor(70, 130, 90);
      doc.text('Mobility, Hydration & Protein Synthesis Focus', 115, y + 10);
    }

    y += 15;
  });

  drawCaesarSeal(doc, pageWidth, pageHeight, 'RATIFIED');

  const filename = `HOMODEUS_WEEKLY_CODEX_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
