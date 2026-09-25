import { describe, it, expect } from 'vitest';
import { t } from '../logic/i18n';
import { translateExperienceLevel } from '../logic/exerciseTranslations';

describe('Universal Localization (i18n) & Sports-Science Accuracy', () => {
  it('correctly translates ExperienceLevel to authentic Italian (Avanzato, NEVER assaggiato)', () => {
    // English
    expect(translateExperienceLevel('Beginner', 'en')).toBe('Beginner');
    expect(translateExperienceLevel('Intermediate', 'en')).toBe('Intermediate');
    expect(translateExperienceLevel('Advanced', 'en')).toBe('Advanced');

    // Italian: Must be Avanzato, strictly never 'assaggiato'
    expect(translateExperienceLevel('Beginner', 'it')).toBe('Principiante');
    expect(translateExperienceLevel('Intermediate', 'it')).toBe('Intermedio');
    expect(translateExperienceLevel('Advanced', 'it')).toBe('Avanzato');
    expect(translateExperienceLevel('Advanced', 'it')).not.toBe('assaggiato');

    // Spanish
    expect(translateExperienceLevel('Advanced', 'es')).toBe('Avanzado');

    // French
    expect(translateExperienceLevel('Advanced', 'fr')).toBe('Avancé');

    // German
    expect(translateExperienceLevel('Advanced', 'de')).toBe('Erfahren');

    // Latin
    expect(translateExperienceLevel('Advanced', 'la')).toBe('Expertus');
  });

  it('correctly translates recovery anatomical orientations', () => {
    expect(t('recovery.anterior', 'it')).toBe('ANTERIORE (FRONTE)');
    expect(t('recovery.posterior', 'it')).toBe('POSTERIORE (RETRO)');

    expect(t('recovery.anterior', 'en')).toBe('ANTERIOR (FRONT)');
    expect(t('recovery.posterior', 'en')).toBe('POSTERIOR (BACK)');

    expect(t('recovery.anterior', 'es')).toBe('ANTERIOR (FRENTE)');
    expect(t('recovery.posterior', 'es')).toBe('POSTERIOR (ESPALDA)');
  });

  it('correctly translates Arena segmented tabs across languages', () => {
    expect(t('tabs.workoutLifts', 'it')).toBe('Esercizi & Serie');
    expect(t('tabs.bioRecovery', 'it')).toBe('Bio-Recupero & SNC');
    expect(t('tabs.gladiatorAscension', 'it')).toBe('Ascensione Gladiatore');

    expect(t('tabs.workoutLifts', 'en')).toBe('Workout Lifts');
    expect(t('tabs.bioRecovery', 'en')).toBe('Bio-Recovery & CNS');
    expect(t('tabs.gladiatorAscension', 'en')).toBe('Gladiator Ascension');
  });

  it('correctly translates athlete dossier fields in Italian', () => {
    expect(t('profile.experience', 'it')).toBe('Livello di Esperienza');
    expect(t('profile.primaryFocus', 'it')).toBe('Obiettivo Primario');
    expect(t('profile.targetTime', 'it')).toBe('Orario Allenamento Oggi');
    expect(t('profile.daysAvailable', 'it')).toBe('Giorni Disponibili a Settimana');
    expect(t('profile.sessionDuration', 'it')).toBe('Durata della Sessione');
    expect(t('profile.secondaryGoals', 'it')).toBe('Obiettivi Secondari');
    expect(t('profile.timezone', 'it')).toBe('Fuso Orario');
    expect(t('today.workingSets', 'it')).toBe('Serie Allenanti');
  });
});
