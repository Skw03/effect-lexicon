# Stage 6 release runbook — candidate, production held

The 2026-11-19 instruction opens Stage 6 development and independent candidate verification only. Stage 7 is not authorized. This runbook is not approval to connect a host, publish a preview, activate workflows, merge into a deploying branch, or deploy. No account, domain, asset license or human read-through is assumed. The Stage 0–5 historical merge authorization remains scoped to those stages.

## Current closeout contract — 2026-11-21

This section supersedes earlier pending-name/license/assets/owner-reading and automatic-main-deploy instructions below; historical audit records remain unchanged. Name: **动效小抄 / Motion Cuebook**. Production host selected: Cloudflare Pages. Candidate canonical origin: **https://motioncuebook.com**; domain registration, ownership, DNS and TLS are **not verified**. Nothing in the build proves ownership or authorizes deployment.

Owner explicitly omitted custom favicon and social share image for Stage 6 production. This is an approved exception to original H2 asset requirements: no drafts, no favicon/image references or image-specific Twitter tags. Text metadata, canonical, sitemap, robots and an icon-free manifest remain. Production requires `VITE_RELEASE_ASSETS=false`; `true` or missing explicit choice fails. The original requirements archive is preserved.

Owner approved standard [0BSD](https://opensource.org/license/0bsd) for original code and a separate no-attribution copy/use/redistribution grant for original entries/prompts. See [LICENSE](../LICENSE), [scope and bilingual terms](../LICENSE_SCOPE.md). Brand identity/artwork and third-party material are excluded; dependencies retain their licenses. No invented rightsholder identity, extra code restrictions or CC0 waiver. These approved public values live in `src/release/approved.json`; production rejects overrides that change them.

Owner replied “已审查” on November21 to the numbered 18-entry sign-off instruction: aggregate owner-reported completion for **babdf63d203fd75a0decfd91f2f5848c00e54874** at the fixed afcd625d preview, not row-level observations or production evidence. [Human record](HUMAN_REVIEW.md) and [hosted technical audit](reviews/stage-6-live-preview-afcd625d.md) remain separate. Build verifies the audited content/demo/prompt-renderer inventory against `scripts/reviewed-content.json`; any material change blocks build until explicitly re-reviewed, never silently refresh that baseline.

### Local candidate commands (do not upload these test runs)

```sh
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm test
npm run build
npm run build:pages-preview
RELEASE_MODE=production VITE_SITE_ORIGIN=https://motioncuebook.com VITE_RELEASE_ASSETS=false npm run build:pages-production
PORT=4173 npm run preview
```

The last command serves flat Pages output locally as a simulation. Production output uses slashless routes, real 404 HTML, own-origin CSP, cache headers and indexable content; Preview has no canonical, an empty sitemap, disallow robots and noindex. Neither mode is a deployment. The manifest now exists without icons (30 files in natural Pages output); the older 29-file audit digest belongs only to babdf63.

### Required release order and exact artifact comparison

1. Prepare candidate; fresh independent H6; repair and re-review findings. No commit/push/PR in this implementation turn.
2. Once separately instructed, save candidate and open a normal PR. `.github/workflows/release-checks.yml` is now an authorized **PR-only check candidate**: read-only contents permission, checkout credentials not persisted, no secrets/deploy jobs/push triggers/settings changes. Do not use `pull_request_target`. Observe a green exact PR run **before owner merge**; record PR head SHA, tested merge SHA/tree, run URL, Node/npm/tool versions and input values. [GitHub PR event documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request) explains the tested merge ref. This local preparation is not an observed Actions run.
3. **Owner merges.** Dot then rebuilds clean main using the same lockfile, Node/npm, approved release inputs and command as the independently audited production candidate. Compare sorted relative-path/NUL/file-SHA256/LF output manifests (algorithm below), complete file inventories, and source content guard. Record actual main SHA/tree and both digests. Any mismatch stops release for review; do not normalize away differing bytes. No automatic deployment on main is configured or enabled; this owner-directed order supersedes that earlier H2 automation proposal.
4. **Owner deploys** only after matching artifacts and domain/account/target authorization. Verify exact production project, branch, custom domain, TLS and last-good rollback ID first; never substitute the historical preview project or a moving alias. Current project/account/DNS details are not supplied here. No deploy command is executed by this task.
5. Independent read-only **production** smoke: exact source/artifact binding; 20 content routes/direct/refresh/JS-off/hydration, genuine unknown404, metadata/canonical/sitemap/robots, own-origin CSP and real headers/cache, no favicon/share-image dead references, icon-free manifest, bilingual approved terms and feedback, interaction/keyboard/reduced motion, real TLS and indexability. Verify production host reporting behavior separately (Cloudflare may add NEL/Report-To). Preview noindex must not be weakened for SEO scores.
6. **Owner tags v1.0.0** after successful smoke and handles Search Console/sitemap. Candidate tags need separate explicit instruction too. Stage7 only after launch and new authorization; never infer it from local PASS.

PR CI runs the four gates, both Pages builds, and real mobile Lighthouse on locally served production-mode static output using a loopback canonical for the audit only. Thresholds remain performance85, accessibility95, best-practices95, SEO95 on Gallery and Tilt. Loopback build must never be deployed. If GitHub requires approval to run the PR workflow, obtain the normal owner approval; do not change permissions or bypass it. Actual hosted checks remain separate.

### Human tasks remaining

Domain registration/ownership, DNS/custom-domain and TLS verification; production account/project/branch and rollback target; fresh H6 and green exact PR CI; owner merge followed by identical-input main rebuild comparison; owner deployment; independent read-only production smoke; owner final release/tag and Search Console/sitemap. Existing full Preview deployment ID/dashboard classification remains unverified. Aggregate18-entry reading and selected name/license/asset omission are recorded decisions, not outstanding requests. Individual row observations were not supplied. No production completion is claimed.

## Historical release preparation and audit records

The following sections retain their earlier context; where they differ, the current closeout contract above controls.

## Current fixed-host audit — 2026-11-20

**PASS for the tested fixed preview only; full Stage 6/H2 remains BLOCKED.** Product `babdf63d203fd75a0decfd91f2f5848c00e54874` was independently verified at https://afcd625d.effect-lexicon-preview.pages.dev. All 27 publicly served files matched its clean 29-file Pages build before and after browser testing; manifest digest `0c86814501c185c97101fc361024dc864e4596891404b3d3ab75f923101e6897`. The branch alias was not used to close this gate. [Full audit](reviews/stage-6-live-preview-afcd625d.md): 58 redirects, 162 header assertions per artifact pass, 302 UI, 92 editorial and 24 supplemental checks passed; ED-001–003 passed on this host. Typecheck/lint, 160 Vitest + 69 Node tests and both builds passed during that audit.

The owner-supplied ZIP checksum is recorded separately from independently verified served bytes. Full Cloudflare deployment ID and dashboard **Preview** metadata / production inventory remain unverified. [Owner reading](HUMAN_REVIEW.md) is **0/18**, with all sign-off fields untouched. Real Actions, final branding/domain/assets/terms, production smoke and explicit production release approval remain pending; production, merge and tag are **not approved**. No new deployment, settings change or Stage 7 work is authorized. Chromium used a disclosed proxy certificate exception; curl verified certificates normally. No new hosted Lighthouse/axe, real-device TLS, other browser-engine or screen-reader coverage is claimed.

The following dated source-only and older-host records are historical; the current fixed-host result above supersedes their pending-hosted statements without changing their original evidence.

## Editorial source re-review — 2026-11-19

Product `babdf63d203fd75a0decfd91f2f5848c00e54874` passed independent local post-commit review; ED-001–003 are CLOSED for source only. See [exact review record](reviews/rereview-stage-6-editorial-babdf63.md) for actual reruns, inherited checks and limits. The refreshed artifact is prepared locally from that exact clean source, with a separate ZIP receipt; it has not been transferred or deployed. The existing d7f5ddba Preview below remains the older 8df5b37 product. Updated hosted verification and owner sign-off are pending; full Stage 6/H2 remains BLOCKED. Documentation receipt commits do not change the product source used for this artifact.

## Verified Preview status — 2026-11-19

Independent live audit: **PASS for the audited Preview only; full Stage 6/H2 remains BLOCKED**. Product source `8df5b37ebfd562c47444f6eba22e10f65bf4aaf5`; immutable target https://d7f5ddba.effect-lexicon-preview.pages.dev and moving alias https://stage-6-pages-preview.effect-lexicon-preview.pages.dev both returned200. All27 fetchable files matched the natural build; full29-file output digest remains `69a1cdd09c8a339ced68bb5ac2aa539cf38eff7776867f0e13f04ca5760fb0f1`. See [sourced live audit record](reviews/stage-6-live-preview-d7f5ddba.md) for routes, headers/noindex, hydration and interaction coverage, reruns and exclusions.

Production hostname https://effect-lexicon-preview.pages.dev returned404 Deployment Not Found; no dashboard inventory was inspected. Cloudflare injected NEL/Report-To; no related outbound traffic was observed during the audit, not proof reporting is disabled. Chromium used a certificate exception for the environment proxy; curl trust verification passed. No live Lighthouse/axe, real-device TLS, other browser engines or screen-reader verification. Owner18-entry review, real Actions, branding/domain/assets/terms and production readiness/explicit release approvals remain pending. This status supersedes the historical preparation statements below; it does not authorize further uploads or production.

## Cloudflare Pages preview preparation — historical setup context

2026-11-19: owner selected **Cloudflare Pages, preview only**, and feedback at **https://github.com/Skw03/effect-lexicon/issues**. SUN read that page and observed “New issue”; no issue or setting was changed. Owner has now registered a Cloudflare account; Pages project/access and preview target are not yet confirmed. No cross-site GitHub installation or token authorization was granted. Final name/domain/assets/legal terms remain pending. Earlier reports retain their historical state; full Stage 6 remains BLOCKED.

`npm run build:pages-preview` replaces `dist` with flat `/guide.html` and `/effects/<slug>.html`, plus root `index.html` and `404.html`. Ordinary `npm run build` remains portable directory output. Rebuild for the intended target; the portable `npm run preview` server is not the server for flat Pages output. The preview command validates effective env values before both bundles: a configured origin, production release mode, release assets, or conflicting feedback target fails closed. It supplies the approved Issues target. Preview HTML omits canonical/OG URL, has noindex, empty sitemap and robots disallow. Production origin validation remains unchanged and fail-closed; do not use a pages.dev address as production.

Generated `_redirects` normalizes known trailing slashes and terminal index.html to slashless routes with 308. Native Pages removes `.html`. There is no wildcard SPA fallback or Functions/backend. `_headers` applies own-origin CSP, security headers and noindex, with no-cache documents and immutable hashed assets. The asset rule detaches the general cache header before replacing it, avoiding conflicting duplicate directives. Inline styles remain necessary for existing parameterized demos. Pages may use no-store on 404; redirects precede header matching. Check final responses separately from redirects. A server-rendered 404 marker preserves host-rejected aliases such as `/GUIDE` during hydration and Back navigation instead of replacing them with conflicting normalized content.

Official sources checked 2026-11-19: [routing/404](https://developers.cloudflare.com/pages/configuration/serving-pages/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [redirects](https://developers.cloudflare.com/pages/configuration/redirects/), [branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [preview noindex/Access](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [local Wrangler](https://developers.cloudflare.com/pages/functions/local-development/). A local simulator is not evidence of the actual CDN/preview environment.

### Reproduce the local Pages checks

Test tool only, outside product dependencies:

```sh
npm install --prefix /tmp/effect-pages-tools --cache /tmp/effect-npm-cache --ignore-scripts --save-exact wrangler@4.45.0
npm run build:pages-preview
WRANGLER_SEND_METRICS=false XDG_CONFIG_HOME=/tmp/effect-pages-config /tmp/effect-pages-tools/node_modules/.bin/wrangler pages dev dist --ip 127.0.0.1 --port 4583 --compatibility-date=2025-10-01 --persist-to /tmp/effect-pages-state
```

Run `python3 scripts/pages_config_build_check.py` for effective-env fail-closed checks. In another terminal run `AUDIT_BASE=http://127.0.0.1:4583 python3 scripts/pages_preview_check.py`, the existing `stage6_regression.py`, and axe. No login/project/deploy command is involved. Wrangler may try to fetch generic Request.cf simulation metadata; no account or target is supplied. Generated `.wrangler` state is ignored. The standalone four-category Lighthouse gate still uses the portable local audit build, not a preview with indexing protection disabled.

### Account owner's initial setup (historical, already performed for this preview)

**Now: the account exists; wait for independent candidate acceptance before creating anything. Then the recommended first-time setup is a separate empty Direct Upload preview project, without GitHub integration. Never send passwords or API tokens to ChatGPT.** The owner authenticates on their own machine (official `wrangler login`, never share its credentials), then uses `wrangler pages project create <owner-chosen-preview-project> --production-branch=main` rather than deploy; the placeholder must be replaced by the owner, and this command is only for the later authorized setup. Production branch is explicitly `main`; it must differ from preview branch `stage-6-launch`. No assets are supplied at creation. Return only the project name, production branch and confirmation that Deployments is empty and no custom domain/Git integration exists. SUN then verifies the target and obtains separate preview authorization. If setup requires a first upload, stop before it; do not use dashboard Create/Save and Deploy.

For an existing project, inspect Workers & Pages → project → Settings. If Git-integrated, before any candidate push/build, disable automatic production branch deployments and save; set preview branch builds to None until the exact target is approved. Later, if Git access is separately authorized, restrict it to `Skw03/effect-lexicon` only, not all repositories. Preview automation may then allow only `stage-6-launch`, which must be different from the production branch. No custom domain, deploy hook, production secret or main integration activation now. New Git integration can trigger an initial production build; do not use that setup as a harmless preview test.

If no suitable project exists, a separately authorized **empty Direct Upload project** is an alternative: owner creates it with a production branch different from `stage-6-launch`, without uploading. The documented CLI project-create flow can create an empty project; dashboard first drag-and-drop/Deploy site can publish production and is not a safe first step. Only after the empty target is verified and preview is separately approved may the owner choose Preview in its deployment dialog, or use an explicit project name and `--branch=stage-6-launch`. Never use a bare deploy command or cached/default target. Direct Upload has no Git automatic production trigger and cannot later switch to native Git integration; use a separate preview project if final automatic publishing needs a Git-integrated project. These are future owner steps, not completed agent actions.

Preview URLs are public by default. **Noindex is a crawler directive, not access control or confidentiality.** If restricted access is wanted, owner must separately configure and verify Cloudflare Access before sharing preview URLs. Preview Access does not automatically protect the production pages.dev address or custom domains. Do not attach a production domain. Confirm the eventual deployment is Preview and production has no new deployment. Preserve hosted noindex even if Lighthouse SEO drops; do not relax the four-category local audit gate.

### Bind the eventual preview to its reviewed artifact

Before any separately approved upload, record the independently reviewed **full Git SHA**, confirm a clean checkout at that SHA, record Node/npm/build command and nonsecret configuration, build once, then compute a digest over the exact output. Do not rebuild between hashing and upload. Direct Upload source labels alone are not proof of source identity. This preview is bound to reviewed source commit `8df5b37ebfd562c47444f6eba22e10f65bf4aaf5`; documentation-only receipts do not change its product artifact. For a future uncommitted candidate, retain patch identity plus base until exact-commit review; never label a dirty build as its base commit artifact.

```sh
python3 - <<'PYDIGEST'
from pathlib import Path
from hashlib import sha256
root = Path('dist')
manifest = ''.join(f'{p.relative_to(root).as_posix()}\0{sha256(p.read_bytes()).hexdigest()}\n' for p in sorted(root.rglob('*')) if p.is_file())
print(sha256(manifest.encode()).hexdigest())
PYDIGEST
```

Keep that digest with the reviewed SHA and build inputs in the release receipt, outside the upload directory. After the owner uploads only that approved artifact, record dashboard environment **Preview**, deployment ID and the immutable `https://<deployment-hash>.<project>.pages.dev` URL. The branch alias is a moving pointer and is insufficient for review; record it only as secondary information. Verify on the immutable URL, and record whether a production deployment exists (and its unchanged prior ID if any), without creating one for comparison. See [official preview alias behavior](https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-aliases). The current immutable preview URL, source binding and fetched-byte match are recorded above. A full dashboard deployment inventory/identifier verification remains outside the audit; no remote dashboard was inspected.

Use [the uncompleted 18-entry human checklist](HUMAN_REVIEW.md). Hosted routing/refresh/query/404, headers/noindex and hydration were audited within the scope above; dashboard Access policy was not inspected. Name remains provisional; human content approval, assets/licenses/terms, Actions, production smoke and release remain pending.

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

Build inputs: feedback is approved; final branding and legal inputs remain pending (display name is provisional):

| Variable / file | Required decision |
| --- | --- |
| `VITE_SITE_ORIGIN` | Bare HTTPS origin, no trailing slash/path; owner-approved real domain |
| `VITE_SITE_NAME` | Final name, domain/trademark checks; existing UI name is provisional |
| `VITE_FEEDBACK_URL` | Approved GitHub Issues target above; supplied by the preview adapter |
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

## Remaining production and dashboard steps (not authorized by Preview PASS)

Cloudflare Pages preview effect-lexicon-preview is live at the audited target above. The external audit does not inspect account access, production integration settings or dashboard inventory. Production routes/headers, final build inputs, DNS/HTTPS, official integration and rollback controls still require their own evidence and authorization. A new external deployment requires separate target confirmation and approval.

Production integration must remain disconnected/disabled through candidate review. H2's automatic production deploy on main is a future owner-enabled setting, gated by independent PASS and separate production release authorization. Even after release approval, the owner performs production setup and deployment. Never enable integration merely to test CI or a PR.

Once the project/target is confirmed and the applicable action is separately authorized, the owner or separately authorized operator must:

1. Record project ID/account, production branch, build command (`npm run build` with required environment), publish directory (`dist`), exact routing/header configuration and last-good deployment ID.
2. Complete domain purchase and verification; enter only provider-documented DNS values; verify certificate issuance and HTTPS redirect. Record propagation and certificate checks. Do not guess DNS records.
3. Configure settings/secrets in host/GitHub dashboards only. Current local checks require no repository secrets. Identify the provider's exact required settings after selection; do not invent secret names.
4. Confirm automatic production is still disabled; create the confirmed nonproduction preview only under separate authorization. Verify every route, refresh, JS-off details, assets, canonical target, sitemap/robots, headers, privacy/terms/feedback, console and both Lighthouse pages there.
5. Freeze exact reviewed SHA, record independent PASS and branch Actions run. Owner signs off all 18 entries, legal/assets and production release. Only then owner enables the official main integration and releases the approved SHA. No agent deploy or `v1.0.0` tag.
6. Smoke-test the real public domain using the checklist below. Owner tags `v1.0.0` only after smoke success. Candidate `v1.0.0-rc.1` also requires a later explicit tag instruction; no tag exists from this task.

## Rollback and post-release smoke

Before production, record the host's exact immutable last-good deployment identifier and dashboard rollback procedure here. Without verified production target, deployment inventory and rollback controls, executable production steps remain **blocked**; this generic contract alone does not satisfy the complete H2 runbook gate. Roll back by owner-promoting the recorded last-good artifact; do not force-push or rewrite Git history. If integration would redeploy a bad main, owner pauses it first. If a source fix is needed, use a reviewed revert/fix PR and rerun all gates. Verify headers, canonical URLs and assets after rollback; preserve the failed deployment and logs for diagnosis.

Smoke checklist: Gallery shows 18 effects; all 18 direct detail URLs and Guide refresh; unknown path returns 404; JS disabled still shows names/aliases/descriptions/prompts; representative pointer, scroll, modal and clipboard work; EN/ZH preference survives refresh; reduced motion has no autoplay and manual runs finish; no CSP/console errors; sitemap contains exactly the 20 published routes on approved origin; robots references it; icon-free manifest resolves; no custom favicon/share-image references (approved omission); hashed assets immutable and HTML no-cache; feedback and exact legal text present; real HTTPS and certificate valid; both mobile Lighthouse gates pass. Record date, SHA, deployment URL/ID, tester and rollback ID.

## Human tasks remaining

Dashboard access/settings and production target verification (Preview already audited); final site name/domain and trademark checks; domain purchase/DNS/HTTPS; approved share image and favicon; code license and content terms; approved Issues link returned200 in the audit; host/GitHub settings or secrets once known; Search Console verification; native Chinese and terminology review; personal final read-through of all 18 entries and prompts; explicit independent pass and separate owner production release/tag. None is implied complete by automated tests.
