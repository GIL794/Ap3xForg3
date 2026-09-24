---
name: homo-deus-scaffolding
description: >-
  Runbook for scaffolding new features, components, exercises, PDF scrolls, and test suites in HOMO DEUS.
  Use when creating new UI views, adding exercises, building PDF exporters, or writing tests.
---

# HOMO DEUS Feature Scaffolding & Component Runbook

Use this skill when scaffolding new components, adding exercises, creating PDF decree generators, or adding new test suites.

---

## 1. Scaffolding UI Components (Roman Imperial Aesthetic)

### 1.1 Aesthetic Style Guide
- **Color Palette**:
  - Backgrounds: `bg-[#08090d]`, `bg-slate-900`, `bg-slate-950`
  - Accents: `amber-500`, `amber-400`, `yellow-400` (Imperial Roman Gold)
  - Borders: `border-amber-500/20` to `border-amber-500/40`, `border-slate-800`
  - Status Indicators: Emerald-400 (Optimal), Amber-400 (Recovering), Rose-400 (Fatigued)
- **Typography**:
  - Headings & Roman Titles: `font-roman font-bold tracking-wider`
  - Numeric metrics & timestamps: `mono-font` / `font-mono`
  - Body text: `font-sans text-slate-200` / `text-slate-300`
- **Component Shell Pattern**:
  ```tsx
  import React from 'react';
  import { Shield, Sparkles } from 'lucide-react';
  import { SupportedLanguage, t } from '../logic/i18n';

  interface MyComponentProps {
    language?: SupportedLanguage;
  }

  export const MyComponent: React.FC<MyComponentProps> = ({ language = 'en' }) => {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-roman text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Title</span>
          </h3>
        </div>
        {/* Content */}
      </div>
    );
  };
  ```

---

## 2. Adding New Exercises to the Imperial Codex

When adding an exercise to `src/data/exerciseLibrary.ts`:
1. **Define the Exercise**:
   ```ts
   {
     id: 'dumbbell_incline_row',
     name: 'Incline Dumbbell Row',
     category: 'upper_pull',
     primaryMuscles: ['back', 'biceps'],
     secondaryMuscles: ['rear_delts', 'forearms'],
     equipment: 'dumbbell',
     tier: 'gladiator',
     biomechanicalFocus: 'Latissimus lower fibers and scapular retraction.',
     // ...
   }
   ```
2. **Add Multi-Language Translations**:
   - In `src/logic/exerciseTranslations.ts`:
     Add entries to `EXERCISE_NAMES` across all 6 languages (`en`, `it`, `es`, `fr`, `de`, `la`).

---

## 3. Scaffolding PDF Decree Generators (`jspdf`)

To add an imperial PDF scroll in `src/logic/pdfExporter.ts`:
1. Use `unit: 'mm'`, `format: 'a4'`.
2. Access dimensions with `doc.internal.pageSize.getWidth()` and `doc.internal.pageSize.getHeight()`.
3. Apply parchment styling:
   - Outer Gold Border: `doc.setDrawColor(212, 175, 55); doc.setLineWidth(1.5);`
   - Inner Inset Border: `doc.setDrawColor(180, 140, 40); doc.setLineWidth(0.4);`
   - Roman Title Banner: `doc.setFont('times', 'bold'); doc.setTextColor(212, 175, 55);`
4. Always include:
   - Athlete Name & Ascension Tier
   - Classical Roman Date (`DIE XIV SEPTEMBRIS A.D. MMXXVI`)
   - Cryptographic SHA-256 seal string at the bottom.

---

## 4. Scaffolding Vitest Unit Tests

Create unit tests in `src/tests/<moduleName>.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { myFunction } from '../logic/myModule';

describe('MyModule Engine (ISO/IEC Compliance)', () => {
  beforeEach(() => {
    // Clean mock storage if applicable
  });

  it('calculates deterministic output for valid athlete parameters', () => {
    const result = myFunction({ weightKg: 85 });
    expect(result).toBeDefined();
  });
});
```
Validate test execution via:
```bash
npm test
```
