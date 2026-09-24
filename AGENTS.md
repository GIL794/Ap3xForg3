# HOMO DEUS — Agentic Engineering Guidelines & Architectural Codex

This document serves as the authoritative architectural blueprint, standard of practice, and quality contract for any AI assistant (Antigravity IDE, Cursor, Claude Code, GitHub Copilot, Gemini CLI) or human developer working on the **HOMO DEUS** codebase.

---

## 1. Core Architectural Tenets

### 1.1 Zero Assumptions Principle (Strict Data Integrity)
- **Never assume or default biometric values**: If an athlete has not logged their bodyweight, target weight, 1RM, or daily sets, the application must **never** inject arbitrary defaults (e.g., assuming 80kg or 100kg bench press).
- **Explicit Unlogged States**: Represent unlogged data as `null` or `undefined` and prompt the athlete with transparent, helpful setup cues.
- **Biometric Formulas**: Strictly adhere to validated exercise-science standards:
  - **BMR (Basal Metabolic Rate)**: Mifflin-St Jeor equation when body fat % is unknown; Katch-McArdle formula when authentic body fat % is provided.
  - **TDEE & Energy Calibrations**: Derived dynamically from validated activity multipliers and targeted goal rates (e.g. 0.25kg - 0.75kg weekly change).
  - **1RM Equations**: Brzycki ($W \times \frac{36}{37 - R}$) and Epley ($W \times (1 + \frac{R}{30})$) intensity calculations.

### 1.2 ISO/IEC 25010 Compliance (Functional Completeness & Integrity)
- **Zero Phantom Claims**: Every feature, tier, or metric claimed in UI copy or documentation **must exist as real, working, tested code**.
- **Auditable Truth**: If the interface states "Cryptographically Sealed Ledger", data must be secured via real Web Crypto AES-GCM-256. If it states "Payment Verified", transactions must be validated against real transaction reference rules, anti-replay storage, and SHA-256 seals.
- **No Mock Timeouts for Security**: Mock `setTimeout` calls posing as verification or authentication are strictly prohibited.

### 1.3 ISO/IEC 27001 Compliance (Information Security & Privacy)
- **Client-Side Encrypted Storage**: All persistent training ledgers, history, and receipts stored in `localStorage` must use Web Crypto AES-GCM-256 encryption (`src/logic/cryptoStorage.ts`).
- **Cryptographic Audit Seals**: Every financial or ascension decree must compute a 256-bit SHA-256 HMAC digital seal binding receipt ID, transaction reference, athlete ID, and timestamp.
- **Anti-Replay Fraud Protection**: Transaction identifiers must be recorded in an encrypted ledger (`homodeus_payment_receipts_v1`) and checked on every verification attempt to reject duplicate redemptions.

---

## 2. UI/UX Design System & Layout Paradigm

### 2.1 Simplicity Wins (Prevent Sensory Overload)
- **Gym Floor Focus First**: Lifters in the gym need instant access to today's workout without scroll fatigue. 
- **Segmented View Controllers**: Group complex secondary dashboards into intuitive, tactile segmented tabs:
  - **`[ 🏋️ Workout Lifts ]`** (*Default*): Progress bar, warmup protocol (collapsible), and exercises with sets, reps, weight inputs, and rest timer.
  - **`[ 🧬 Bio-Recovery & CNS ]`**: 2D/3D Anatomical readiness gauge, recovery timelines, and muscle dossiers.
  - **`[ 👑 Gladiator Ascension ]`**: Olympian Evolution Card, Pantheon tiers, and lifetime volume metrics.
- **Clean Hero Header**: Avoid clumping 6+ buttons into headers. Keep only primary actions (`Imperial Scroll PDF`, `Rest Timer`, `Finish Workout`).

### 2.2 Anatomical Visualization Standards
- **2D Precision Map Default**: Default to the biologically aligned 2D SVG silhouette (`engineMode: '2d_svg'`). It provides authentic anatomical boundaries (pectorals, teardrop vastus medialis, obliques, lats) that lifters instantly recognize.
- **3D WebGL Model Rules**:
  - **Auto-spin must be OFF by default** (`isRotating: false`). Do not disorient users with endless spinning.
  - **Orientation Snap**: When Anterior or Posterior buttons are clicked, immediately halt any rotation (`isRotatingRef.current = false`) and snap the model to exact 0° or 180° rotation.
  - Use `isRotatingRef` to prevent stale closure capture inside Three.js animation loops.

---

## 3. Universal Localization (i18n) Standards

- **Zero Hardcoded English**: Every button, status badge, HUD readout, anatomical group, recommendation, and lore snippet must be passed through localization.
- **Supported Languages**: English (`en`), Italian (`it`), Spanish (`es`), French (`fr`), German (`de`), and Latin (`la`).
- **Dual-Layer Architecture**:
  1. **Native Localized Dictionaries**: High-performance, compile-time dictionaries in `src/logic/i18n.ts` and `src/logic/exerciseTranslations.ts` ensure instant, offline-capable translations.
  2. **Universal Google Translate Bridge**: `src/logic/universalTranslator.ts` dynamically sets `googtrans=/en/${lang}` cookies and synchronizes Google Translate to translate any dynamically generated content (AI feedback, user notes, custom exercises).

---

## 4. Payment Verification & Decree Architecture

- **Transaction ID Format**: Minimum 8 alphanumeric characters, rejecting mock/test keywords (`TEST`, `FAKE`, `12345678`, `ASDFASDF`).
- **Anti-Replay Validation**: Query verified receipts ledger before redemption; reject duplicate claims.
- **Official Imperial Decree (PDF)**: Automatically provide downloadable, high-resolution PDF proof-of-purchase certificates with cryptographic seals using `jspdf`.

---

## 5. Engineering Workflow & Quality Gateways

### 5.1 Verification Checklist Before Any Commit
1. **Unit Tests**: Run `npm test`. All Vitest test suites in `src/tests/` must pass 100%.
2. **Production Bundle**: Run `npm run build`. TypeScript compilation (`tsc`) and Vite bundling must succeed with zero errors.
3. **Browser Validation**: For UI changes, test in browser at `http://localhost:3000/` and verify mobile responsiveness.
4. **Git Hygiene**: Stage only relevant files and write semantic commit messages (e.g. `feat(recovery): ...`, `fix(ux): ...`).

### 5.2 Key Project Modules
| Path | Purpose |
| :--- | :--- |
| `src/logic/cryptoStorage.ts` | Web Crypto AES-GCM-256 encryption engine & SHA-256 hashing |
| `src/logic/paymentVerification.ts` | Authentic transaction verification, anti-replay guards & PDF decrees |
| `src/logic/universalTranslator.ts` | Google Translate universal DOM bridge & cookie synchronizer |
| `src/logic/i18n.ts` | Multilingual UI dictionaries across 6 languages |
| `src/logic/exerciseTranslations.ts` | Biomechanical lore, exercise names, and muscle translations |
| `src/logic/pdfExporter.ts` | Imperial Parchment PDF generator for daily, exercise, & weekly scrolls |
| `src/logic/nutritionCalculator.ts` | Zero-assumption metabolic & macronutrient calculation engine |
| `src/components/ThreeAnatomicalModel.tsx` | Three.js WebGL 3D anatomical model with orientation snap |
| `src/components/MuscleRecoveryGauge.tsx` | Fitbod-calibre 2D/3D muscle readiness & recovery simulation |
| `src/components/TodayWorkoutView.tsx` | Segmented workout arena (Lifts, Bio-Recovery, Ascension) |
