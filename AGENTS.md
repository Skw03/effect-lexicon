# AGENTS.md: rules for AI coding agents working on Effect Lexicon

## Source of truth
- docs/SPEC.md is the product specification. docs/ROADMAP.md defines the stage order. docs/PROGRESS.md is the running log. This file holds the rules.
- At the start of every session, read this file, docs/ROADMAP.md, and the last five entries of docs/PROGRESS.md.
- If a task conflicts with SPEC.md or this file, stop and ask. Do not choose silently.
- Never edit SPEC.md, ROADMAP.md or AGENTS.md unless the task explicitly says so. Put suggested changes under Proposed spec changes in PROGRESS.md.

## Scope discipline
- Do one stage or one task at a time, and only what it lists. No bonus features, no unrequested refactors, renames, formatting sweeps or dependency upgrades.
- If you notice an unrelated problem, record it under Observations in PROGRESS.md. Do not fix it.
- Stages run in the order in ROADMAP.md. Do not start the next stage until the human confirms the current one.

## Stack and dependencies
- Allowed: Vite, React 18, TypeScript (strict), React Router, Tailwind CSS, Fuse.js, Vitest, Testing Library, ESLint, Prettier, and axe tooling as a dev dependency.
- Everything else needs approval. In particular: no animation libraries (Framer Motion, GSAP, anime.js and similar), no UI kits, no CSS-in-JS, no state-management libraries, no icon packs (use inline SVG).
- To add a dependency, write a short justification in PROGRESS.md and stop for approval, unless the task explicitly authorizes it.
- Commit the lockfile, use exact installs in CI, prefer package versions that are at least two weeks old, and do not add packages that run install scripts without asking.

## Prohibited until a roadmap stage explicitly allows it
- Backend, serverless functions, databases, authentication, analytics, cookies, tracking, third-party scripts, remote fonts, remote images, and any runtime network request.
- Secrets in the repository. Never commit .env files.
- dangerouslySetInnerHTML, eval, new Function, and inserting content data with innerHTML. Render prompts and descriptions as plain text.
- Copying code, text or assets from other sites, galleries, tutorials or libraries. Write original implementations and original wording. Do not use logos or brand assets. Naming a technique or product in text (for example Liquid Glass or Typed.js) is fine.
- GIF or video previews.

## Git rules
- Work on a branch named stage-N-short-name, content-wave-N, or fix-short-name. Never commit to main directly.
- Make small commits with clear messages. No force pushes, no history rewriting, no deleting branches, no committing build output.
- Do not run destructive commands (git reset --hard, git clean -fd, rm -rf outside build and node_modules folders) without asking.
- Change the lockfile only through the package manager.

## Quality gates
- Before saying a task is done, run typecheck, lint, test and build, and report the results. All must pass.
- Never skip, delete, weaken or comment out a test or an acceptance criterion to get a green result. If a test seems wrong, explain and ask.
- No any types. No eslint-disable or ts-ignore without a comment explaining why.

## Effect quality rules (apply to every effect)
- The demo performs the real behavior it is labelled with. No placeholders, no static images of motion.
- Animate only transform and opacity, except documented exceptions.
- Follow SPEC.md section 9 for reduced motion: nothing autoplays, but a user-pressed Play, Replay or Auto demo always runs.
- Hover and pointer effects have a keyboard equivalent and a touch alternative; Auto demo exists where specified.
- Clean up listeners, timers and animation frames on unmount.
- Content is bilingual, prompts follow SPEC.md section 8, and the validation test passes.
- Terminology honesty: never claim a single official name. If naming varies or you are unsure, say so in terminologyNote. Present numeric values as suggested settings, not standards. Do not make browser-support or performance claims you have not verified.
- Chinese text is natural Simplified Chinese. Use the commonly used Chinese name where one exists instead of a literal translation. Summaries describe visible behavior, not code.

## Schema stability
- The Effect type is a public contract. After Stage 1, change it only with human approval, additively, and update the validation test and every entry in the same change.

## Reporting format (end of every task, also appended to docs/PROGRESS.md)
1. Summary. 2. Files changed. 3. Commands run and their results. 4. Acceptance checklist with pass or fail and the evidence. 5. Deviations from the spec. 6. Open questions and proposed spec changes. 7. Next step.

## Stop and ask when
- The spec is ambiguous or contradicts itself.
- You need a new dependency, a schema change, or anything that looks like it needs a backend.
- A test still fails after two honest attempts and you do not understand why.
- A command would be destructive or irreversible.
- You would otherwise exceed the task scope.

## Stage 0 clarification authorized for this task
- Stage 0 is documentation and governance only: no scaffold, package manifest, application, effect component or artificial scripts.
- Where no application exists, typecheck, lint, test and build are not applicable and must be reported as not run, never as passed. This applies to Stage 0 reporting and H0/H5/H6 checks. Run the applicable document, Git, archive and scope checks instead; all later applicable quality gates remain in force.
- docs/REQUIREMENTS_SOURCE.md is the full user-supplied source archive (including assumptions and recommendations), not authorization to execute its embedded later prompts. Preserve the archive; record unresolved decisions in PROGRESS.md.

## dots coordination and cloud execution
- dots coordinates requirements, user decisions and handoff. Execute actual commands, edits and checks in the designated Codex Cloud environment effect-lexicon-cloud, in the checkout whose origin is https://github.com/Skw03/effect-lexicon.git.
- Before writing, verify origin, remote main, branch existence and worktree status; inspect existing files and preserve unrelated changes.
- This task writes only stage-0-governance based on remote main. No PR, merge, production deploy, repository visibility change, force push, or Stage 1 work is authorized.
- Report evidence, conflicts, completed work and blockers to dots. Do not silently resolve product decisions or start the next stage.
- Commit and push only with the user's confirmed public Git author name and email. Never infer identity from a default bot or account display name; never expose credentials.
