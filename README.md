# 动效词典 Effect Lexicon

A static bilingual dictionary of UI effects, with real demos and copyable prompts.
Stage 1 contains **3D Tilt Card**, **Typewriter Text**, and **Glassmorphism**. The Library is a temporary list of three links. Search, filters, gallery previews, Guide, and the other 15 effects belong to later stages.

## Run and verify

Use a current Node.js version supported by Vite 6 (verified here with Node 24.22.1 and npm 11.9.0).

```sh
npm ci --ignore-scripts
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

If the environment's default npm cache is not writable, add `--cache /tmp/effect-npm-cache` to `npm ci`. Dependency versions and the npm lockfile are exact. Install scripts stay disabled; Vite uses esbuild's optional platform binary. No animation library, UI kit, or runtime external service is used. Fuse.js is installed for the prescribed stack; discovery is not implemented yet.

The build produces `dist/` for a local static HTTP server. It needs no runtime internet requests. Production hosting, fallback rewrites for direct SPA routes, prerendering and deployment are Stage 6 work; opening `index.html` via `file://` is not the preview workflow.

## Browser verification

`scripts/browser_smoke.py` uses an **already installed** Python Playwright and `/usr/bin/chromium`; they are environment tools, not project dependencies. With the development server on port 5173:

```sh
python3 scripts/browser_smoke.py
```

It verifies real browser behavior, including bilingual clipboard contents, clipboard failure, mouse/keyboard/touch, visible focus, reduced motion, static CSS parameters, responsive widths, and unknown routes. It writes the result to `/tmp/effect-stage1-browser.json`. It does not install software. Unit tests alone do not establish these browser results. A physical mobile device and the full Stage 5 accessibility audit remain separate checks.

## Add an effect (when its stage is approved)

1. Create `src/content/effects/<slug>.ts` with the full `Effect` contract and bilingual prompt templates, then export it in `src/content/index.ts`.
2. Write the real React demo and adjacent CSS in `src/demos/`, using the `DemoProps` contract and cleaning up timers, frames and listeners.
3. Register its component in `src/demos/registry.ts`. Implement keyboard/touch equivalents and finite explicit playback under reduced motion.
4. Add synonyms and acceptance queries when the Stage 2 search module exists; preserve names, everyday phrases, suggested numeric values and terminology caveats. Future references are allowed only by the controlled Stage 1 list; Stage 4 must remove that allowance and require implemented related entries.
5. Run typecheck, lint, tests, build and the applicable browser checks. At the current stage the exact three-sample count is intentional; expand its assertion only with the next approved content stage. Keep the final 18-effect requirements intact.

Prompt templates support `{{key}}`, `{{#booleanKey}}…{{/booleanKey}}`, and `{{^booleanKey}}…{{/booleanKey}}`. Numeric units are added once, boolean/select defaults are validated by kind. Static styles explicitly state no trigger/no motion and do not invent a duration.

Read `AGENTS.md`, `docs/SPEC.md`, `docs/ROADMAP.md` and `docs/PROGRESS.md` before making changes. `docs/REQUIREMENTS_SOURCE.md` is the unmodified source archive. Stage 1 delivery awaits independent H6 review; it does not authorize Stage 2, merge or deployment.
