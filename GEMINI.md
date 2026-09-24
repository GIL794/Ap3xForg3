# HOMO DEUS — Gemini System Rules

Please adhere strictly to the engineering standards and quality codex outlined in [AGENTS.md](./AGENTS.md).

## Critical Directives for Gemini / Antigravity Agents
1. **Zero Assumptions**: Never assume athlete biometric parameters. Prompt for authentic inputs.
2. **ISO/IEC 25010**: Zero phantom claims. If a capability is displayed in the UI, write the complete, authentic implementation.
3. **ISO/IEC 27001**: Encrypt persistent storage with AES-GCM-256 (`src/logic/cryptoStorage.ts`). Digitally seal receipts and decrees with SHA-256 HMAC.
4. **Layout Simplicity**: Workout exercises must always remain front-and-center. Secondary analytical tools belong in segmented tabs (`Workout Lifts`, `Bio-Recovery & CNS`, `Gladiator Ascension`).
5. **Anatomical Visualization**: 2D SVG precision map is the default view. 3D WebGL auto-rotation is OFF by default; orientation snapping (Anterior/Posterior) halts rotation immediately.
6. **Universal i18n**: No hardcoded English strings. Synchronize `universalTranslator.ts` with localized dictionaries in `i18n.ts` and `exerciseTranslations.ts`.
7. **Quality Gateways**: Ensure `npm test` and `npm run build` pass with zero errors before concluding any turn.
