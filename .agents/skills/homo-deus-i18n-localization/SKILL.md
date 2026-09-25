---
name: homo-deus-i18n-localization
description: >-
  Standard procedure for multi-language internationalization and Google Translate bridge in HOMO DEUS.
  Use when adding new text strings, translating UI components, or extending language support.
---

# HOMO DEUS Universal Internationalization (i18n) Runbook

Use this skill whenever introducing new user-facing copy, buttons, badges, tooltips, or components to guarantee 100% translation coverage across all supported languages.

---

## 1. Supported Languages
The HOMO DEUS engine supports 6 official languages:
- **`en`**: English (Default base)
- **`it`**: Italiano
- **`es`**: Español
- **`fr`**: Français
- **`de`**: Deutsch
- **`la`**: Lingua Latina (Sacred Classical Roman)

---

## 2. 100% Native Translation Architecture
 
```
User View (DOM)
  └── Native Compile-Time Dictionaries (i18n.ts & exerciseTranslations.ts)
         → Zero network latency, instant render, 100% offline accuracy
         → Sports-science terminology verified (no machine translation artifacts)
         → Synchronized via universalTranslator.ts (document.documentElement.lang)
```

---

## 3. Adding New UI Keys to `src/logic/i18n.ts`

When adding a UI string:
1. Define the key in `TRANSLATIONS.en`:
   ```ts
   'arena.newFeature': 'New Tactical Feature',
   ```
2. Mirror the key across **ALL** 5 other language dictionaries:
   - `it`: `'arena.newFeature': 'Nuova Funzionalità Tattica',`
   - `es`: `'arena.newFeature': 'Nueva Función Táctica',`
   - `fr`: `'arena.newFeature': 'Nouvelle Fonctionnalité Tactique',`
   - `de`: `'arena.newFeature': 'Neue Taktische Funktion',`
   - `la`: `'arena.newFeature': 'Novum Munus Tacticum',`
3. In your component, access the string via `t('arena.newFeature', language)`:
   ```tsx
   <span>{t('arena.newFeature', language)}</span>
   ```

---

## 4. Translating Anatomical & Biomechanical Lore

Biomechanical text is centralized in `src/logic/exerciseTranslations.ts`:
- **Exercise Names**: Add to `EXERCISE_NAMES` dictionary.
- **Muscle Readiness & Lore**: Add to `MUSCLE_RECOVERY_TRANSLATIONS` via `getTranslatedMuscleInfo(muscleId, language)`:
  - `name`: Localized name (e.g. `Pettorali (Petto)`)
  - `latinName`: Anatomical term (e.g. `Pectoralis Major & Minor`)
  - `recommendation`: Contextual recovery guidance
  - `functionLore`: Biomechanical movement explanation

---

## 5. Google Translate Universal Bridge (`universalTranslator.ts`)

- **Automatic Cookie Synchronization**:
  When language switches, `setGoogleTranslateCookie(lang)` sets:
  `googtrans=/en/${targetLang}` (or clears it if `en`).
- **Dynamic Translation Trigger**:
  `initializeGoogleTranslate(lang)` dynamically triggers the Google Translate element to translate dynamic text throughout the DOM.
- **Style Isolation**:
  The default Google Translate top banner frame is suppressed via CSS in `index.html` to prevent layout jumps:
  ```css
  .goog-te-banner-frame { display: none !important; }
  body { top: 0px !important; }
  #google_translate_element { display: none; }
  ```

---

## 6. Anti-Leak Checklist for Reviewing UI
- [ ] Are orientation toggles (Anterior / Posterior) wrapped in `t()`?
- [ ] Are 3D/2D engine toggles wrapped in `t()`?
- [ ] Are tab labels and badge counters localized?
- [ ] Are modal titles, input placeholders, and error banners localized?
- [ ] Does switching to Italian (`it`) leave any English text on screen?
