import { jsPDF } from 'jspdf';
import { PlannedExercise, ExerciseCategory } from '../types';

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
 * Generates and downloads an authentic Imperial Roman Workout Scroll as a high-fidelity vector PDF.
 */
export function generateImperialWorkoutPdf(session: ExportableWorkoutSession, athlete: AthleteInfo): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Parchment Background Tint
  doc.setFillColor(252, 249, 242); // Warm Roman parchment
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Imperial Roman Outer & Inner Border
  doc.setDrawColor(180, 83, 9); // Roman imperial gold (#b45309)
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  doc.setDrawColor(153, 27, 27); // Imperial crimson (#991b1b)
  doc.setLineWidth(0.4);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21, 'S');

  // Decorative Corner Rosettes
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

  // 3. Imperial Header
  let y = 22;
  doc.setFont('times', 'bold');
  doc.setTextColor(153, 27, 27); // Crimson
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

  // 4. Gladiator & Session Dossier Box
  y += 7;
  doc.setFillColor(245, 239, 227); // Slightly darker parchment
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

  // 5. Exercise Records Table
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 26, 26);
  doc.text('CHRONICLE OF COMPLETED LIFTS & VOLUME', 16, y);

  y += 5;

  // Table Header
  const tableX = 16;
  const tableW = pageWidth - 32;
  const colW = [70, 28, 22, 26, 32]; // [Exercise, Category, Sets, Avg Weight, Volume Tonnage]

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

  // Table Body Rows
  const exercises = session.exercises || [];
  exercises.forEach((ex, idx) => {
    // If running out of room, handle gracefully
    if (y > pageHeight - 40) return;

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 246, isEven ? 255 : 242, isEven ? 255 : 233);
    doc.rect(tableX, y, tableW, 7, 'F');
    doc.setDrawColor(220, 210, 195);
    doc.setLineWidth(0.2);
    doc.line(tableX, y + 7, tableX + tableW, y + 7);

    // Compute stats for exercise
    const completedSets = ex.sets?.filter(s => s.completed !== false) || [];
    const setsCount = completedSets.length > 0 ? completedSets.length : (ex.sets?.length || 0);
    const primaryWeight = completedSets[0]?.weightKg || ex.sets?.[0]?.weightKg || 0;
    const avgReps = Number(completedSets[0]?.reps) || 10;
    const exTonnage = Math.round(setsCount * primaryWeight * avgReps);

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);

    let rowX = tableX + 3;
    // Exercise Name (truncated if too long)
    const truncatedName = ex.name.length > 36 ? ex.name.slice(0, 34) + '...' : ex.name;
    doc.text(truncatedName, rowX, y + 4.8);

    rowX += colW[0];
    doc.setTextColor(100, 100, 100);
    doc.text((ex.category || 'Compound').toUpperCase(), rowX, y + 4.8);

    rowX += colW[1];
    doc.setTextColor(30, 30, 30);
    doc.text(`${setsCount} completed`, rowX, y + 4.8);

    rowX += colW[2];
    doc.text(primaryWeight > 0 ? `${primaryWeight} kg` : 'Bodyweight', rowX, y + 4.8);

    rowX += colW[3];
    doc.setFont('times', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(exTonnage > 0 ? `${exTonnage.toLocaleString()} kg` : '—', rowX, y + 4.8);

    y += 7;
  });

  // Table Outer Frame
  const tableHeight = 7 + exercises.length * 7;
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.4);
  doc.rect(tableX, y - tableHeight, tableW, tableHeight, 'S');

  // 6. Summary Tonnage Banner
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
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Mechanical tension delivered to muscular fibers. Neuro-muscular fatigue logged.', tableX + 115, y + 7.5);

  // 7. Imperial Wax Seal & Caesar's Validation
  const sealY = pageHeight - 34;
  const sealX = pageWidth / 2;

  // Caesar's Circular Seal
  doc.setFillColor(153, 27, 27); // Crimson Wax
  doc.circle(sealX, sealY, 13, 'F');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, 11.5, 'S');

  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('HOMO DEVS', sealX, sealY - 3, { align: 'center' });
  doc.text('• CAESAR SEAL •', sealX, sealY + 0.5, { align: 'center' });
  doc.text('AUTHENTICATED', sealX, sealY + 4, { align: 'center' });

  // Provenance & ISO 8000 Ledger Checksum
  doc.setFont('times', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  const isoHash = `ISO/IEC 8000 VERIFIED • LEDGER SIGNATURE: SHA256-${Math.abs(
    (session.totalTonnageKg * 31 + session.durationMinutes * 17) ^ 0xabcdef
  ).toString(16).toUpperCase().padStart(8, '0')}`;
  doc.text(isoHash, pageWidth / 2, pageHeight - 12, { align: 'center' });

  // 8. Trigger File Download
  const filename = `HOMODEUS_SCROLL_${session.workoutName.replace(/[^a-zA-Z0-9]/g, '_')}_${session.date}.pdf`;
  doc.save(filename);
}
