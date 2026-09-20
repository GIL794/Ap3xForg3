export type SupportedLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'la';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'la', label: 'Lingua Latina', flag: '🏛️' },
];

const LANGUAGE_KEY = 'homodevs_language_preference';

export function getSavedLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY) as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    // Auto-detect browser language
    const browserLang = navigator.language?.slice(0, 2).toLowerCase();
    if (browserLang === 'it') return 'it';
    if (browserLang === 'es') return 'es';
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'de') return 'de';
  } catch {
    // fallback
  }
  return 'en';
}

export function saveLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav & Header
    'nav.mythos': 'Mythos',
    'nav.oracle': 'Oracle AI',
    'nav.share': 'Share',
    'nav.pro': 'Pro',
    'nav.export': 'Export JSON',
    'nav.sessionReady': 'Session Ready',
    'nav.switchUser': 'Athlete Account',

    // Today's Workout
    'today.arena': "Today's Arena",
    'today.readySubtitle': 'Target gym deployment with dynamic mechanical tension and Roman discipline.',
    'today.restSubtitle': 'Sacred recovery day. Muscles grow in repose through protein synthesis.',
    'today.restDay': 'Imperial Rest Day',
    'today.complete': 'Complete Session',
    'today.reset': 'Reset Sets',
    'today.totalVolume': 'Total Iron Forged',
    'today.amphorae': 'Amphorae',
    'today.plateLoader': 'Barbell Plates',
    'today.oneRm': '1RM Brackets',
    'today.recovery': 'Bio-Recovery Gauge',
    'today.warmup': 'Ramp-Up Warmup',
    'today.cooldown': 'Imperial Cooldown',
    'today.setsCompleted': 'Sets Completed',

    // Set Types
    'set.warmup': 'Warmup (W)',
    'set.normal': 'Working (1..N)',
    'set.drop': 'Drop Set (D)',
    'set.failure': 'To Failure (F)',

    // Rest Timer
    'timer.title': 'Imperial Rest Stopwatch',
    'timer.pause': 'Pause',
    'timer.resume': 'Resume',
    'timer.done': 'Done',
    'timer.fanfare': 'Imperial Fanfare',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Ascend to the highest echelon of strength. Unlock the complete Olympian arsenal.',
    'pro.monthly': 'Regular Pro',
    'pro.lifetime': 'Emperor Lifetime',
    'pro.perMonth': '/ month',
    'pro.forever': 'forever',
    'pro.airtm': 'AirTM Pay',
    'pro.card': 'Stripe / Card',
    'pro.passcode': 'VIP Passcode',
    'pro.confirmAirtm': 'Confirm AirTM Transfer & Unlock Pro',

    // Language
    'lang.choose': 'Language',
  },
  it: {
    // Nav & Header
    'nav.mythos': 'Il Mito',
    'nav.oracle': 'Oracolo AI',
    'nav.share': 'Condividi',
    'nav.pro': 'Imperivm Pro',
    'nav.export': 'Esporta JSON',
    'nav.sessionReady': 'Sessione Pronta',
    'nav.switchUser': 'Account Atleta',

    // Today's Workout
    'today.arena': "L'Arena di Oggi",
    'today.readySubtitle': 'Allenamento pronto per la palestra con tensione meccanica e disciplina romana.',
    'today.restSubtitle': 'Giorno sacro di riposo. I muscoli crescono a riposo tramite sintesi proteica.',
    'today.restDay': 'Giorno di Riposo Imperiale',
    'today.complete': 'Completa Sessione',
    'today.reset': 'Azzera Serie',
    'today.totalVolume': 'Ferro Totale Forgiato',
    'today.amphorae': 'Anfore',
    'today.plateLoader': 'Dischi Bilanciere',
    'today.oneRm': 'Calcolo 1RM',
    'today.recovery': 'Livello di Recupero Muscolare',
    'today.warmup': 'Riscaldamento Progressivo',
    'today.cooldown': 'Defaticamento Imperiale',
    'today.setsCompleted': 'Serie Completate',

    // Set Types
    'set.warmup': 'Riscaldamento (W)',
    'set.normal': 'Serie Allenante (1..N)',
    'set.drop': 'Drop Set (D)',
    'set.failure': 'A Cedimento (F)',

    // Rest Timer
    'timer.title': 'Cronometro di Recupero Imperiale',
    'timer.pause': 'Pausa',
    'timer.resume': 'Riprendi',
    'timer.done': 'Fine',
    'timer.fanfare': 'Fanfara Imperiale',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Raggiungi il vertice della forza fisica. Sblocca l\'arsenale olimpico completo.',
    'pro.monthly': 'Pro Mensile',
    'pro.lifetime': 'Imperatore a Vita',
    'pro.perMonth': '/ mese',
    'pro.forever': 'per sempre',
    'pro.airtm': 'Paga con AirTM',
    'pro.card': 'Carta / Stripe',
    'pro.passcode': 'Codice VIP',
    'pro.confirmAirtm': 'Conferma Trasferimento AirTM e Sblocca Pro',

    // Language
    'lang.choose': 'Lingua',
  },
  es: {
    // Nav & Header
    'nav.mythos': 'El Mito',
    'nav.oracle': 'Oráculo AI',
    'nav.share': 'Compartir',
    'nav.pro': 'Imperivm Pro',
    'nav.export': 'Exportar JSON',
    'nav.sessionReady': 'Sesión Lista',
    'nav.switchUser': 'Cuenta Atleta',

    // Today's Workout
    'today.arena': 'La Arena de Hoy',
    'today.readySubtitle': 'Despliegue en el gimnasio con tensión mecánica y disciplina romana.',
    'today.restSubtitle': 'Día sagrado de recuperación. Los músculos crecen durante el descanso.',
    'today.restDay': 'Día de Descanso Imperial',
    'today.complete': 'Completar Sesión',
    'today.reset': 'Reiniciar Series',
    'today.totalVolume': 'Hierro Total Forjado',
    'today.amphorae': 'Ánforas',
    'today.plateLoader': 'Discos de Barra',
    'today.oneRm': 'Cálculo 1RM',
    'today.recovery': 'Indicador de Recuperación',
    'today.warmup': 'Calentamiento Progresivo',
    'today.cooldown': 'Enfriamiento Imperial',
    'today.setsCompleted': 'Series Completadas',

    // Set Types
    'set.warmup': 'Calentamiento (W)',
    'set.normal': 'Serie Normal (1..N)',
    'set.drop': 'Drop Set (D)',
    'set.failure': 'Al Fallo (F)',

    // Rest Timer
    'timer.title': 'Cronómetro de Descanso Imperial',
    'timer.pause': 'Pausa',
    'timer.resume': 'Reanudar',
    'timer.done': 'Listo',
    'timer.fanfare': 'Fanfarria Imperial',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Asciende a la cumbre de la fuerza. Desbloquea el arsenal olímpico completo.',
    'pro.monthly': 'Pro Mensual',
    'pro.lifetime': 'Emperador Vitalicio',
    'pro.perMonth': '/ mes',
    'pro.forever': 'para siempre',
    'pro.airtm': 'Pagar con AirTM',
    'pro.card': 'Tarjeta / Stripe',
    'pro.passcode': 'Código VIP',
    'pro.confirmAirtm': 'Confirmar Transferencia AirTM y Activar Pro',

    // Language
    'lang.choose': 'Idioma',
  },
  fr: {
    // Nav & Header
    'nav.mythos': 'Le Mythe',
    'nav.oracle': 'Oracle IA',
    'nav.share': 'Partager',
    'nav.pro': 'Imperivm Pro',
    'nav.export': 'Exporter JSON',
    'nav.sessionReady': 'Séance Prête',
    'nav.switchUser': 'Compte Athlète',

    // Today's Workout
    'today.arena': "L'Arène d'Aujourd'hui",
    'today.readySubtitle': 'Déploiement en salle avec tension mécanique et discipline romaine.',
    'today.restSubtitle': 'Jour sacré de repos. Les muscles se construisent dans le repos.',
    'today.restDay': 'Repos Impérial',
    'today.complete': 'Terminer la Séance',
    'today.reset': 'Réinitialiser',
    'today.totalVolume': 'Fer Total Forgé',
    'today.amphorae': 'Amphores',
    'today.plateLoader': 'Disques de Barre',
    'today.oneRm': 'Calcul 1RM',
    'today.recovery': 'Jauge de Récupération',
    'today.warmup': 'Échauffement Progressif',
    'today.cooldown': 'Retour au Calme',
    'today.setsCompleted': 'Séries Complétées',

    // Set Types
    'set.warmup': 'Échauffement (W)',
    'set.normal': 'Série de Travail (1..N)',
    'set.drop': 'Drop Set (D)',
    'set.failure': 'À l\'Échec (F)',

    // Rest Timer
    'timer.title': 'Chronomètre de Repos Impérial',
    'timer.pause': 'Pause',
    'timer.resume': 'Reprendre',
    'timer.done': 'Terminé',
    'timer.fanfare': 'Fanfare Impériale',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Atteignez le sommet de la force. Débloquez tout l\'arsenal olympien.',
    'pro.monthly': 'Pro Mensuel',
    'pro.lifetime': 'Empereur à Vie',
    'pro.perMonth': '/ mois',
    'pro.forever': 'à vie',
    'pro.airtm': 'Paiement AirTM',
    'pro.card': 'Carte / Stripe',
    'pro.passcode': 'Code VIP',
    'pro.confirmAirtm': 'Confirmer Virement AirTM et Activer Pro',

    // Language
    'lang.choose': 'Langue',
  },
  de: {
    // Nav & Header
    'nav.mythos': 'Der Mythos',
    'nav.oracle': 'Orakel KI',
    'nav.share': 'Teilen',
    'nav.pro': 'Imperivm Pro',
    'nav.export': 'JSON Export',
    'nav.sessionReady': 'Training Bereit',
    'nav.switchUser': 'Athleten-Konto',

    // Today's Workout
    'today.arena': 'Die Heutige Arena',
    'today.readySubtitle': 'Gym-Einsatz mit mechanischer Spannung und römischer Disziplin.',
    'today.restSubtitle': 'Heiliger Ruhetag. Muskeln wachsen in der Erholung.',
    'today.restDay': 'Imperialer Ruhetag',
    'today.complete': 'Einheit Beenden',
    'today.reset': 'Sätze Zurücksetzen',
    'today.totalVolume': 'Geschmiedetes Eisen',
    'today.amphorae': 'Amphoren',
    'today.plateLoader': 'Hantelscheiben',
    'today.oneRm': '1RM Rechner',
    'today.recovery': 'Muskel-Regeneration',
    'today.warmup': 'Aufwärm-Pyramide',
    'today.cooldown': 'Imperiales Cooldown',
    'today.setsCompleted': 'Abgeschlossene Sätze',

    // Set Types
    'set.warmup': 'Aufwärmsatz (W)',
    'set.normal': 'Arbeitssatz (1..N)',
    'set.drop': 'Drop-Satz (D)',
    'set.failure': 'Bis zum Muskelversagen (F)',

    // Rest Timer
    'timer.title': 'Imperiale Pausenuhr',
    'timer.pause': 'Pause',
    'timer.resume': 'Weiter',
    'timer.done': 'Fertig',
    'timer.fanfare': 'Imperiale Fanfare',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Erreiche den Gipfel der Stärke. Schalte das komplette olympische Arsenal frei.',
    'pro.monthly': 'Monatliches Pro',
    'pro.lifetime': 'Lebenslanger Imperator',
    'pro.perMonth': '/ Monat',
    'pro.forever': 'für immer',
    'pro.airtm': 'Mit AirTM Bezahlen',
    'pro.card': 'Karte / Stripe',
    'pro.passcode': 'VIP Code',
    'pro.confirmAirtm': 'AirTM Transfer Bestätigen & Pro Aktivieren',

    // Language
    'lang.choose': 'Sprache',
  },
  la: {
    // Nav & Header
    'nav.mythos': 'Mythos Imperii',
    'nav.oracle': 'Oraculum AI',
    'nav.share': 'Partire',
    'nav.pro': 'Imperivm Pro',
    'nav.export': 'Exportare',
    'nav.sessionReady': 'Exercitatio Parata',
    'nav.switchUser': 'Ratio Athletae',

    // Today's Workout
    'today.arena': 'Arena Hodierna',
    'today.readySubtitle': 'Labor ferreus in palaestra cum disciplina Romana.',
    'today.restSubtitle': 'Dies quietis sacra. Robur in requie crescit.',
    'today.restDay': 'Dies Quietis Imperialis',
    'today.complete': 'Conficere Cursum',
    'today.reset': 'Redintegrare',
    'today.totalVolume': 'Ferrum Conflatorum',
    'today.amphorae': 'Amphorae',
    'today.plateLoader': 'Orbes Ferrei',
    'today.oneRm': 'Calculus 1RM',
    'today.recovery': 'Vires Recreatae',
    'today.warmup': 'Praeparatio Gradualis',
    'today.cooldown': 'Requies Post Bellum',
    'today.setsCompleted': 'Series Confectae',

    // Set Types
    'set.warmup': 'Tirocinium (W)',
    'set.normal': 'Pugna Legitima (1..N)',
    'set.drop': 'Series Deminuta (D)',
    'set.failure': 'Usque ad Defectionem (F)',

    // Rest Timer
    'timer.title': 'Horologium Quietis Caesaris',
    'timer.pause': 'Consistere',
    'timer.resume': 'Repetere',
    'timer.done': 'Factum',
    'timer.fanfare': 'Classicum Imperiale',

    // Paywall Modal
    'pro.modalTitle': 'HOMO DEVS IMPERIVM PRO',
    'pro.subtitle': 'Ascende ad apicem virium. Pande arma deorum.',
    'pro.monthly': 'Pro Menstruum',
    'pro.lifetime': 'Imperator Perpetuus',
    'pro.perMonth': '/ mense',
    'pro.forever': 'in perpetuum',
    'pro.airtm': 'Pecunia AirTM',
    'pro.card': 'Charta / Stripe',
    'pro.passcode': 'Symbolum VIP',
    'pro.confirmAirtm': 'Confirma Pecuniam AirTM & Sume Pro',

    // Language
    'lang.choose': 'Lingua',
  },
};

export function t(key: string, lang: SupportedLanguage = 'en'): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}
