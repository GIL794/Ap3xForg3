---
name: homo-deus-standards
description: >-
  Authoritative standard of practice and ISO/IEC architectural guidelines for the HOMO DEUS codebase.
  Use when writing, refactoring, or auditing core logic, biometrics, security, storage, or compliance.
---

# HOMO DEUS Core Engineering & ISO/IEC Standards

Use this skill when developing or reviewing code in the HOMO DEUS project to ensure 100% adherence to zero-assumption engineering, software product quality (ISO/IEC 25010), and cryptographic data security (ISO/IEC 27001).

---

## 1. Zero-Assumption Biometric & Domain Architecture

### 1.1 The Golden Rule
**NEVER ASSUME OR DEFAULT ATHLETE DATA.**
If an athlete's weight, target weight, height, body fat, or 1RM is missing:
- Do NOT inject arbitrary numbers (e.g. `const weight = profile.weight || 80;`).
- Explicitly declare the metric as unlogged: `const weight = profile.weight ?? null;`.
- Render a transparent, respectful prompt in the UI guiding the athlete to calibrate their metrics.

### 1.2 Mathematical & Exercise-Science Formulas
Always use peer-reviewed, validated equations:
- **Basal Metabolic Rate (BMR)**:
  - Standard (Mifflin-St Jeor):
    $$\text{BMR}_{\text{male}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$$
    $$\text{BMR}_{\text{female}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$$
  - Authenticated Body Fat (Katch-McArdle):
    $$\text{LBM} = \text{weight} \times (1 - \frac{\text{bodyFat}\%}{100})$$
    $$\text{BMR} = 370 + (21.6 \times \text{LBM})$$
- **One-Rep Max (1RM)**:
  - Brzycki Equation: $1\text{RM} = \text{Weight} \times \frac{36}{37 - \text{Reps}}$ (validated for reps $\le 10$)
  - Epley Equation: $1\text{RM} = \text{Weight} \times \left(1 + \frac{\text{Reps}}{30}\right)$

---

## 2. ISO/IEC 25010 (Software Product Quality & Functional Completeness)

### 2.1 Zero Phantom Features
- Every claim made in UI copy, onboarding modals, or paywall previews must correspond to genuine, executable code in the codebase.
- Prohibited:
  - Advertising "Encrypted Cloud Storage" when data is stored in unencrypted plaintext `localStorage`.
  - Advertising "Imperial Workout PDF Scrolls" without an underlying `jsPDF` engine.
  - Advertising "3D Anatomical Heatmap" if only an SVG exists, or vice versa.

### 2.2 Reliability & Fault Tolerance
- All storage reads and JSON parses must be wrapped in `try/catch` blocks with safe, graceful fallbacks.
- Never crash the UI when network connectivity or third-party APIs (e.g., Supabase, Google Translate) are unavailable.

---

## 3. ISO/IEC 27001 (Information Security & Cryptographic Integrity)

### 3.1 Local Storage Encryption
- Persistent user history, tonnage ledgers, and transaction records must be encrypted using the client-side Web Crypto API:
  - Algorithm: **AES-GCM-256** (`src/logic/cryptoStorage.ts`).
  - Key Derivation: PBKDF2 with 100,000 iterations and salt.
  - Integrity Check: SHA-256 checksum embedded in package metadata.

### 3.2 Digital Seals & Audit Trails
- Any decree, financial transaction, or ascension victory must compute an immutable SHA-256 digital HMAC seal:
  $$\text{Seal} = \text{SHA-256}(\text{ReceiptID} + \text{TxReference} + \text{UserEmail} + \text{Amount} + \text{Timestamp})$$
- Seals are embedded directly in downloadable PDFs and stored in local encrypted ledgers for verification.

---

## 4. Verification & Testing Runbook

Before completing any task:
1. Run `npm test` to verify Vitest suites.
2. Run `npm run build` to verify TypeScript typing and bundle compilation.
3. Validate browser behavior and responsiveness.
