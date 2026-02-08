# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000
npm run build        # Production build (Vite)
npx tsc --noEmit     # Type check without emitting
```

No test runner or linter is configured.

## Environment

Set `GEMINI_API_KEY` in `.env.local`. Vite injects it as `process.env.API_KEY` via `define` in `vite.config.ts`.

## Architecture

**Stack**: Vite 6, React 19, TypeScript, Tailwind CSS v4 (CSS-based config via `@theme` in `src/index.css`), Sonner (toasts), Google GenAI SDK.

**Path alias**: `@` -> `./src` (configured in both `vite.config.ts` and `tsconfig.json`).

**Active code lives in `src/`** — root-level `App.tsx`, `constants.ts`, `types.ts`, `services/` are legacy from the original AI Studio export and are NOT used by the running app. The entry point is `src/main.tsx` loaded by `index.html`.

### Key modules

- **`src/services/promptBuilder.ts`** — Assembles structured prompts from JSON config files. All AI prompts flow through this module.
- **`src/services/geminiService.ts`** — Google GenAI API calls (analyze, edit image, generate image, generate video). Uses `promptBuilder` for structured prompts.
- **`src/prompts/*.json`** — Editable prompt configuration (brand identity, contexts, negative constraints, templates). Modify these JSON files to adjust AI behavior without touching TypeScript.
- **`src/hooks/useGeneration.ts`** — Generation state management, auto-analysis pipeline, history integration.
- **`src/hooks/useImageUpload.ts`** — File upload with drag-and-drop, base64 conversion, validation.
- **`src/constants/index.ts`** — Visual context presets (10 game contexts, 9 furniture contexts) with `promptModifier` strings.

### Prompt pipeline

```
Upload image → Auto-analyze (ProductAnalysis JSON) → Select context (preset or custom)
→ promptBuilder assembles: [Role + Rules + Scene + Brand + Product + Constraints]
→ geminiService sends to Gemini API
```

The `ProductAnalysis` object (materials, colors, proportions, features) is injected into every generation prompt to preserve product fidelity.

### AI Models used

| Operation | Model | Feature name |
|-----------|-------|-------------|
| Analyze | gemini-2.5-flash-preview-05-20 | Product analysis |
| Edit/Recontextualize | gemini-2.5-flash-preview-05-20 | Nano Banana |
| Generate HD | gemini-2.5-flash-preview-05-20 | Nano Banana Pro |
| Video | veo-3.0-generate-preview | Veo |

### Brand context (Sola Didact)

Swiss educational company (Martigny). Products: educational games + school furniture. Visual identity defined in `src/prompts/brand-identity.json` — warm, natural, Swiss/European aesthetic. Primary green `#5dac3e`, dark charcoal `#3a383e`. No recognizable faces in generated images. See `CONTEXT.MD` for full brand guidelines.

### Tailwind v4

Uses `@import "tailwindcss"` + `@theme {}` in CSS. Custom colors defined in `src/index.css`: `sola-primary`, `sola-dark`, `sola-wood`, `sola-text`. No `tailwind.config.ts` — all config is CSS-based.
