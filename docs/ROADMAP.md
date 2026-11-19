## F. Long-term plan (the full stage map)

Save this section as docs/ROADMAP.md in the repo. Stages 1 to 5 are the prompts in section E. The final stage of the MVP is Stage 6: Launch v1.0. Everything after it is a growth stage, each with an entry gate so you never build ahead of evidence.

### F1. Stage map

| Stage | Name | Outcome | Gate to move on |
| --- | --- | --- | --- |
| 0 | Governance setup | Rules, roadmap and progress log in the repo; dot confirms it understands them | You approve dot’s summary |
| 1 | Foundation and first vertical slice | 3 working effects end to end | Stage 1 completion criteria pass |
| 2 | Discovery | Gallery, filters, search | Same |
| 3 | Demos, batch A | 10 effects total | Same |
| 4 | Demos, batch B | 18 effects total | Same |
| 5 | Guide and hardening | Accessibility, reduced motion, performance, tests, README | All 13 acceptance criteria verified |
| 6 | Launch v1.0 (publish) | Public site on your domain, prerendered pages, CI and deploy pipeline, release runbook | Production smoke test passes; you have personally read all 18 entries |
| 7 | Content waves (ongoing) | Grow from 18 to about 40, then about 60 effects, in waves of 6 to 8 | Per wave: validation and search tests pass, no regression, you read every new prompt |
| 8 | Feedback loop | Privacy-friendly analytics (zero-result searches, Copy prompt per effect) and a “can’t find your effect?” link | You lift the no-analytics rule in AGENTS.md first |
| 9 | Prompt quality and code tab | Each prompt tested in real AI tools; optional code-snippet tab | Prompt test pass rate you define (suggest at least 80 percent judged close to the demo) |
| 10 | Personalization | Dark mode, favorites (localStorage), English interface | Demand from real users or your own priority |
| 11 | Search upgrade (only if needed) | Embedding-based search, built on precomputed data | Many zero-result or low-click searches remain after synonym work |
| 12 | Community and accounts (only if needed) | Submissions with moderation, synced favorites | You decide to run a service; needs a backend and a new security review |

Suggested trigger for Stage 11: after two rounds of synonym improvements, if more than roughly one in ten searches still returns nothing useful. Treat this as a starting point, not a rule.

### F2. How content grows (Stage 7 and later)

- Add effects in waves of 6 to 8, grouped by theme, so each wave is reviewable in one sitting.
- Every effect passes the same definition of done: working demo, bilingual prompts following section 8 of the spec, synonyms and everyday phrases, terminology note where names vary, related links, validation test, search acceptance query, reduced-motion and keyboard behavior.
- You read every prompt and terminology note before a wave ships. Naming is the product’s credibility; dot should not be the only reviewer.
- Candidate effects (edit freely): text scramble, marquee ticker, number count-up, image zoom on hover, accordion expand, tab underline indicator slide, toast slide-in, scroll progress bar, sticky scroll sections, horizontal scroll section, animated gradient border, custom cursor follower, toggle switch, confetti burst, button-to-spinner morph, mesh gradient (style), noise grain texture (style), dotted grid background (style), neumorphism (style), bento grid hover.

### F3. Tasks only you can do

- Final site name; check domain availability and any trademark conflicts.
- Buy the domain; create the hosting account and DNS records; create the Git repository and turn on branch protection for main.
- Choose a license for the code and a license or terms for the written content.
- Supply a 1200 by 630 px share image (og-image.png) and a favicon source.
- Have a native Chinese reader check wording, and someone who knows front-end terminology check names and aliases.
- Choose the analytics tool at Stage 8 and update AGENTS.md before dot touches it.
- Decide where feedback goes (an email address or an issue tracker).

### F4. Main risks to keep in view

- Terminology errors damage trust more than missing features. Keep human review in every wave.
- Demos that look right but do not match their prompts. Stage 9 exists to catch this.
- Scope creep by the agent. The rules in section G are written to prevent it.
- A long-running agent losing context. docs/PROGRESS.md and the resume prompt in section H5 make every session restartable.
- Search-engine visibility. A pure single-page app indexes poorly, so Stage 6 includes prerendering.

### Current authorization — Stages 2–5 (2026-11-19)

The user confirmed Stage 1 UI/interaction and authorized sequential delivery through Stage 5: Stage 2 gallery/search/filtering; Stage 3 ten effects; Stage 4 eighteen effects; Stage 5 guide, responsive/accessibility/performance hardening and full acceptance. Dots coordinates implementation, independent H6, fixes and stage acceptance. Once a stage passes review and required checks, commit/push and update PROGRESS before proceeding. This replaces the older per-stage manual confirmation gate and human-only merge rule for these authorized stages: dots may coordinate PR/merge of completed stage branches if checks and repository permissions permit. No direct main writes, permission changes, force pushes, branch deletion, check bypasses or deployments.

This Stage 2 worker stops at an uncommitted candidate for independent H6; committing/pushing requires a later explicit coordinator instruction. Stage 1 base: a847ed7a3520ec86ac9d8c60c9a835b87b571767, not an assumed main merge. Preserve concurrent work. Only one stage at a time; do not claim stage acceptance while review is pending.

Routine scoped implementation and fixes are delegated; product goal changes, major visual changes, stack changes and unresolved permissions go to the user together. Preserve the original requirements, all acceptance criteria, environment and permission rules. Stage 0 historical approvals are not rewritten. Stop after Stage 5 with the complete acceptance report and Stage 6 release-preparation items. No automatic authority for Stage 6 or later; F3 and later-stage gates still apply.
