# Stage 6 release runbook — candidate, production held

The 2026-11-19 instruction opens Stage 6 development and independent candidate verification only. Stage 7 is not authorized. This runbook is not approval to connect a host, publish a preview, activate workflows, merge into a deploying branch, or deploy. No account, domain, asset license or human read-through is assumed. The Stage 0–5 historical merge authorization remains scoped to those stages.

## Reproduce the local candidate

Use Node 24 and the committed lockfile:

```sh
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`preview` is a loopback-only static server at port 4173 (`PORT` overrides it). It serves the actual generated HTML, security headers, immutable hashed assets, no-cache HTML and true 404 responses. It is a local simulation, not a chosen-provider or hosted-preview test. Vite development remains `npm run dev`.

Build generates 20 content routes (Gallery, Guide, 18 published details), plus `404.html`. It cleans the temporary SSR bundle in `finally`; neither `dist` nor `.prerender` belongs in Git. The source content index owns sitemap membership. No new product dependency is needed. Unknown paths must serve `404.html` with status 404; never rewrite every unknown path to Gallery. Known routes map to their own `index.html`. The shared path policy normalizes known aliases (trailing/repeated slashes, letter case, percent-encoded letters and terminal `index.html`) and the local host returns 308 to the canonical path, preserving the query. Unknown paths render/return 404; malformed percent encoding returns HTTP 400. Metadata, SSR and client routes use the same policy; arbitrary physical HTML is never served as a competing route. Serve scripts/CSS with correct MIME types. No server application is deployed.

## Explicit site configuration

Ordinary local builds work without any owner input: no canonical URL, no invented share image, noindex/nofollow, robots disallow and an empty sitemap. This intentionally does not pass a production SEO release gate. To test metadata and Lighthouse locally:

```sh
VITE_SITE_ORIGIN=http://127.0.0.1:4173 npm run build
npm run preview
```

This is a test origin, never a production value. Vite still builds in production mode; the separate `RELEASE_MODE=production` flag is an owner-input guard for actual release output, not the Vite mode. Never publish that output. Rebuild with the approved origin for every preview/production target; do not copy a loopback build to a host. `RELEASE_MODE=production` requires HTTPS on the default port and a named DNS origin: all IP literals (including public IPs), local/reserved/example names, conventional placeholder/preview/staging labels and known provider preview suffixes are rejected, along with missing owner inputs. This syntax/classification guard cannot prove DNS resolution, ownership, or owner approval; those remain separate human release gates. It is a build validation flag, not a deployment command or grant of approval.

Effective configuration is resolved with Vite `loadEnv` and validated before output. Precedence (highest last): `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`, existing process values. Interpolation follows Vite. The build defaults to mode `production`; `npm run build -- --mode audit` selects another env-file mode without disabling validation. Do not commit env files. Both client and SSR bundles receive the same frozen, validated release values; Vite automatic env-file loading is disabled afterward. Dev/test configuration uses the same resolver. Asset checks also use the resolved values. Invalid configuration fails before either bundle builds. Local audit HTTP loopback origins remain allowed only without `RELEASE_MODE=production`.

`npm test` includes the original Vitest suite plus Node's dependency-free defensive configuration/path tests. `python3 scripts/stage6_config_build_check.py` checks real builds and env-file/process precedence using harmless local fixtures in `/tmp`; `AUDIT_BASE=http://127.0.0.1:4173 python3 scripts/stage6_paths_check.py` checks aliases/direct/refresh/JS-on/off/metadata and unknown paths on the actual local host. These checks add no exploit payload, production deployment or product dependency.

Owner-approved build inputs, all currently pending except the existing provisional display name:

| Variable / file | Required decision |
| --- | --- |
| `VITE_SITE_ORIGIN` | Bare HTTPS origin, no trailing slash/path; owner-approved real domain |
| `VITE_SITE_NAME` | Final name, domain/trademark checks; existing UI name is provisional |
| `VITE_FEEDBACK_URL` | Approved HTTPS issue tracker or mailto address |
| `VITE_CODE_LICENSE`, `VITE_CODE_LICENSE_URL` | Owner's license name and authoritative HTTPS terms link; add approved LICENSE text separately |
| `VITE_CONTENT_TERMS` | Owner-supplied plain text content terms, never agent-authored legal terms |
| `VITE_RELEASE_ASSETS=true` | Only after owner supplies approved assets below |
| `public/og-image.png` | Rights-cleared 1200×630 PNG; dimensions checked at build |
| `public/favicon.svg` | Rights-cleared self-contained SVG source; manually inspect for external dependencies |

When assets are enabled, the build emits share tags, favicon links and a manifest. No substitute logo, licensed image, terms, account or final name has been invented. All VITE values are public; do not place secrets in them or commit `.env` files.

## Security and caching contract

The exact locally served policy is in `scripts/serve.mjs`: own-origin resources only, no inline scripts/eval, no objects, no framing, own-origin base and forms. `style-src 'self' 'unsafe-inline'` is necessary for React demo parameters (CSS variables, transforms, blur, dimensions) and textarea autosizing. It does not permit external styles. X-Content-Type-Options nosniff, strict-origin-when-cross-origin Referrer-Policy, and Permissions-Policy disabling camera/microphone/geolocation/payment/USB apply to all responses, including 404. Hashed JS/CSS get `public,max-age=31536000,immutable`; HTML and metadata get `no-cache`. HTTPS and HSTS belong to the selected host and are not simulated by loopback HTTP. The local favicon.ico request returns 204 until an approved favicon is configured; it is not a supplied brand asset.

Reproduce CSP and hydration checks with `python3 scripts/stage6_regression.py`. For another local port set `AUDIT_BASE`. Use provisioned Python Playwright and Chromium. `scripts/stage6_build_check.py` verifies on-disk metadata (pass the same `VITE_SITE_ORIGIN` as the build); `scripts/stage6_prepaint_check.py` blocks the application bundle to test prehydration preferences; `scripts/stage6_boundary_check.py` uses dev port 5173 to inject an intentional failing demo and check isolation. This includes actual no-JS content, 18 detail hydrations in EN/ZH × normal/reduced motion, direct/refresh routes, true 404 and dynamic CSS interactions. See candidate evidence for further inherited suites and limitations.

## CI and independent release gates

`docs/ci/release-checks.yml` is an inert Actions template, not an activated workflow. It specifies pull-request clean install, typecheck, lint, test, build and real mobile Lighthouse. No deployment job, upload, write token or production integration exists. After independent candidate pass and explicit coordinator approval, review the template and place it under `.github/workflows/`; run it on the exact nondeploying branch. Actions success has not been demonstrated yet. Do not describe local success as hosted CI success.

Lighthouse uses official pinned test-only tools outside the product:

```sh
npm install --prefix /tmp/effect-stage6-audit --ignore-scripts --save-exact lighthouse@12.8.2 axe-core@4.10.3
node scripts/lighthouse.mjs
AXE_PATH=/tmp/effect-stage6-audit/node_modules/axe-core/axe.min.js python3 scripts/stage5_audit.py
```

`LIGHTHOUSE_CLI`, `CHROME_PATH`, `AUDIT_BASE`, `AUDIT_OUTPUT` can override local tool paths. Library and Tilt must each score performance ≥85, accessibility ≥95, best practices ≥95 and SEO ≥95. Reports remain local. Review console/CSP violations as well as scores. Hosted previews may intentionally send `X-Robots-Tag: noindex` (for example some provider preview services). Preserve that protection and report the resulting SEO limitation; never weaken Lighthouse or enable preview indexing to chase 95. CI measures all four categories on the local production-mode static build with its test-only loopback origin. Hosted preview verification separately covers routing, 404, headers/cache/CSP, hydration and intentional noindex. Final production indexability is an owner release smoke check.

A complete release still requires independent H6 on the exact commit, Actions branch PASS, verified external preview and owner tasks below. A score is not a human content or device review.

## Host-dependent steps (blocked until selected)

SUN must confirm provider, account/project identity, access, nonproduction preview target, and that connecting the repository cannot deploy main. No provider configuration is fabricated before this decision. Provider-specific routes, headers, build variables, preview settings, HTTPS/DNS instructions, official integration and rollback controls must then be recorded and tested on that target. No external preview may be created before confirmation.

Production integration must remain disconnected/disabled through candidate review. H2's automatic production deploy on main is a future owner-enabled setting, gated by independent PASS and separate production release authorization. Even after release approval, the owner performs production setup and deployment. Never enable integration merely to test CI or a PR.

Once the provider is known, the owner or separately authorized operator must:

1. Record project ID/account, production branch, build command (`npm run build` with required environment), publish directory (`dist`), exact routing/header configuration and last-good deployment ID.
2. Complete domain purchase and verification; enter only provider-documented DNS values; verify certificate issuance and HTTPS redirect. Record propagation and certificate checks. Do not guess DNS records.
3. Configure settings/secrets in host/GitHub dashboards only. Current local checks require no repository secrets. Identify the provider's exact required settings after selection; do not invent secret names.
4. Confirm automatic production is still disabled; create the confirmed nonproduction preview only under separate authorization. Verify every route, refresh, JS-off details, assets, canonical target, sitemap/robots, headers, privacy/terms/feedback, console and both Lighthouse pages there.
5. Freeze exact reviewed SHA, record independent PASS and branch Actions run. Owner signs off all 18 entries, legal/assets and production release. Only then owner enables the official main integration and releases the approved SHA. No agent deploy or `v1.0.0` tag.
6. Smoke-test the real public domain using the checklist below. Owner tags `v1.0.0` only after smoke success. Candidate `v1.0.0-rc.1` also requires a later explicit tag instruction; no tag exists from this task.

## Rollback and post-release smoke

Before production, record the host's exact immutable last-good deployment identifier and dashboard rollback procedure here. Without a provider/account those executable provider steps are **blocked**; this generic contract alone does not satisfy the complete H2 runbook gate. Roll back by owner-promoting the recorded last-good artifact; do not force-push or rewrite Git history. If integration would redeploy a bad main, owner pauses it first. If a source fix is needed, use a reviewed revert/fix PR and rerun all gates. Verify headers, canonical URLs and assets after rollback; preserve the failed deployment and logs for diagnosis.

Smoke checklist: Gallery shows 18 effects; all 18 direct detail URLs and Guide refresh; unknown path returns 404; JS disabled still shows names/aliases/descriptions/prompts; representative pointer, scroll, modal and clipboard work; EN/ZH preference survives refresh; reduced motion has no autoplay and manual runs finish; no CSP/console errors; sitemap contains exactly the 20 published routes on approved origin; robots references it; approved OG image/favicon/manifest resolve; hashed assets immutable and HTML no-cache; feedback and exact legal text present; real HTTPS and certificate valid; both mobile Lighthouse gates pass. Record date, SHA, deployment URL/ID, tester and rollback ID.

## Human tasks remaining

Host/account/preview target and access; final site name/domain and trademark checks; domain purchase/DNS/HTTPS; approved share image and favicon; code license and content terms; feedback destination; host/GitHub settings or secrets once known; Search Console verification; native Chinese and terminology review; personal final read-through of all 18 entries and prompts; explicit independent pass and separate owner production release/tag. None is implied complete by automated tests.
