# Effect Lexicon Stage 6 — fixed hosted preview audit

**Verdict: PASS for the fixed preview’s tested technical scope only. Full Stage 6/H2 and final release remain BLOCKED on their separate outstanding gates.**

- Independent reviewer: fresh audit session; no participation in the implementation or fixes.
- Audit date: 2026-11-20 UTC, in the designated project audit environment.
- Sole hosted target: https://afcd625d.effect-lexicon-preview.pages.dev
- Repository: https://github.com/Skw03/effect-lexicon.git
- Product SHA: `babdf63d203fd75a0decfd91f2f5848c00e54874`.
- Branch head observed: `aee1c73fea1699fefeab554d0ec31814d56a92ac`; independently confirmed its difference from the product SHA is four documentation files only.
- Main observed and left unchanged: `0dba59fb0a833d40f8e54da430f199c6ebe58dbc`.
- Owner-supplied ZIP SHA-256: `a60b62df591a23a0c0f9f588bc0136b0beeaa275f8e759acc4da7fc6e86c62f4`. This audit did not possess/re-hash that ZIP; it independently built the exact product SHA and compared served bytes.

## Scope and source binding

Read repository governance, ROADMAP, recent PROGRESS, RELEASE, REVIEW_POLICY, REQUIREMENTS_SOURCE and the editorial rereview at the docs-only head. Historical statuses remain historical. The explicit handoff authorizes this hosted, read-only audit only. No deployment, login, settings changes, source edits, commits, pushes, merges or tags occurred. The original checkout remained clean during the audit. Audit scripts, dependency installation, builds and raw evidence were kept outside the repository. This later documentation archive is separately authorized; it does not change the audited product.

A clean `git archive` of the exact product SHA supplied the build input. After testing, all **158 tracked source files** were checked byte-for-byte against that SHA with zero differences. Node `v24.22.1`, npm `11.9.0`, Vite `6.3.5`; Chromium `156.0.8078.79` via installed Python Playwright. No product dependency or lockfile was changed.

The natural `npm run build:pages-preview` output contained **29 files**. Using the RELEASE manifest algorithm (sorted relative path, NUL, file SHA-256, newline), its manifest digest is:

`0c86814501c185c97101fc361024dc864e4596891404b3d3ab75f923101e6897`

All **27 publicly served files** matched the build byte-for-byte both before and after the complete browser testing. A separate intermediate comparison also passed and is retained separately. `_headers` and `_redirects` are the two deployment configuration files; their bytes are not publicly retrievable. Their observable effects were checked. Public requests for both returned the expected 404 body.

Cloudflare route mapping was accounted for: `index.html` → `/`; content `.html` → slashless content route; `404.html` → an unknown route with HTTP 404. Supporting assets, `preferences.js`, `robots.txt`, `sitemap.xml` and `routes.json` were fetched at their actual public paths. No branch-alias result was used or fetched in this audit.

## Acceptance evidence

| Item | Status | Independent evidence |
| --- | --- | --- |
| Fresh executor access | PASS | Normal curl request immediately returned HTTP 200; no Envoy CONNECT 403. |
| Exact artifact binding | PASS | 29-file clean build; 27/27 public byte matches before and after all UI tests. |
| Redirects | PASS | **58** known root/index, trailing slash, terminal index.html and native .html aliases; HTTP 301/308 and exact slashless Location with `?q=tilt&cat=cards` preserved. |
| Headers | PASS | **162 assertions per artifact pass**: exact CSP, Permissions-Policy, Referrer-Policy, nosniff, noindex/nofollow and cache policy across 27 responses. Hashed assets immutable for one year; normal documents no-cache; 404 no-store. |
| Routes / refresh / hydration | PASS | All **20** content routes directly opened and refreshed with JS disabled and enabled; correct successful status/title, noindex, no invented canonical; all 18 detail pages contain heading and real prompt. |
| Unknown paths | PASS | Unknown and case-variant routes returned actual 404 and correct server body. Four routes also retained 404 UI with JS on/off and correct Back behavior after Gallery navigation. Six HTTP-only 404 checks include hidden host config files. |
| Preview indexing protection | PASS | X-Robots-Tag and HTML noindex/nofollow; robots disallows `/`; sitemap has no loc entries. Protection was not weakened for testing. |
| ED-001 Sliding Fill | PASS / hosted closure supported | **92-check editorial suite** passed, including 54 paused intermediate screenshots across widths 120/160/240 and durations 100/300/800 ms, entry/exit, reverse interruptions, aligned glyphs, single accessible name, keyboard, emulated touch, reduced-motion activation and actual bilingual copied prompts. Additional independently authored probe sampled 16 intermediate frames at widths 120/240, 800 ms, fractions .2/.4/.6/.8 in both directions: **1,822 solid glyph pixels; minimum contrast 7.6881362463:1**, above 4.5:1. |
| ED-002 Tilt | PASS / hosted closure supported | Editorial suite confirms reduced-motion hover/focus/touch static feedback, touch cancellation and retained explicit Auto. Independent supplemental probe confirms stable transform with changed shadow and zero transition on hover, clearing on leave/Escape, arrow-key static feedback, manual Auto motion and finite return to flat. |
| ED-003 Ripple | PASS / hosted closure supported | Visible label is `起始不透明度`; default .35 preserved. Independent interaction at .1/.35/.6 confirms actual rendered initial opacity. English and Chinese prompt text and **six real clipboard reads** match each selected value exactly. |
| Runtime errors / requests | PASS within observed scope | **302 custom UI assertions** passed; captured page/console errors empty. All recorded requests during route traversal stayed on the fixed host. |
| Quality gates | PASS | typecheck, lint, 160 Vitest + 69 Node tests, portable build and Pages preview build all exited 0. |
| Full deployment ID / Preview dashboard metadata | BLOCKED, separate | No authorized Cloudflare read-only metadata connection or preexisting dashboard evidence was available in this session. URL hash is not substituted for the full deployment ID or proof of environment classification / production inventory. No login or account probing attempted. |

The supplementary independent probe has **24 passing assertions** (including the 16 contrast frames and Tilt checks). The 302 UI assertions, 92 existing editorial assertions and 24 supplemental assertions are separate suites; pixel samples and repeated artifact checks are not inflated into unique functional test counts.

Relevant exact-SHA source locations: `src/demos/SlidingFillButton.tsx:20`, `src/demos/SlidingFillButton.css:2`; `src/demos/CardTilt3d.tsx:41`, `src/demos/CardTilt3d.css:10`; `src/content/effects/ripple-button.ts:79` and `:88`. Source-only ED closure was previously recorded; this report adds observed fixed-host evidence without rewriting the old report.

## Reproduction and preserved runs

Use an isolated checkout at the product SHA, Node 24 and the committed lockfile. The following builds locally; it does not publish anything. Choose a writable npm cache if the default is unavailable.

```sh
git switch --detach babdf63d203fd75a0decfd91f2f5848c00e54874
npm ci --ignore-scripts
npm run typecheck
npm run lint
npm test
npm run build
npm run build:pages-preview
curl -sS -I --max-time 30 https://afcd625d.effect-lexicon-preview.pages.dev
```

Reproduce the artifact digest and public byte comparison from that built checkout with Python 3 and curl (normal certificate verification, no redirect following):

```python
from pathlib import Path
from hashlib import sha256
import subprocess

root = Path('dist')
base = 'https://afcd625d.effect-lexicon-preview.pages.dev'
files = sorted(p for p in root.rglob('*') if p.is_file())
manifest = ''.join(f'{p.relative_to(root).as_posix()}\0{sha256(p.read_bytes()).hexdigest()}\n' for p in files)
assert len(files) == 29
assert sha256(manifest.encode()).hexdigest() == '0c86814501c185c97101fc361024dc864e4596891404b3d3ab75f923101e6897'
count = 0
for p in files:
    rel = p.relative_to(root).as_posix()
    if rel in ('_headers', '_redirects'):
        continue
    path = ('/' if rel == 'index.html' else '/audit-unknown-404' if rel == '404.html'
            else '/' + rel.removesuffix('.html') if rel.endswith('.html') else '/' + rel)
    body = subprocess.check_output(['curl', '-sS', '--max-time', '45', base + path])
    assert body == p.read_bytes(), rel
    count += 1
assert count == 27
print('27 public files match; check response status and headers separately')
```

For HTTP checks, iterate `dist/routes.json`: root alias `/index.html`, and each non-root route with `/`, `/index.html`, `.html`. Append `?q=tilt&cat=cards`, request without redirect following, and require HTTP 301/308 and exact slashless Location with that query retained (58 cases). Fetch each mapped public artifact and compare the five security/indexing headers to generated `_headers`, plus cache policy (162 assertions). For `404.html` expect HTTP 404 and `no-store`; test `/GUIDE`, `/effects/CARD-TILT-3D`, `/missing`, `/guide/missing`, `/_headers`, `/_redirects` as genuine 404s. Repeat the 27-byte comparisons after browser testing.

The checked-in `scripts/editorial_regression.py` is the 92-assertion regression entry point; set `AUDIT_BASE` to the fixed host. In an external harness copy, this audit added only browser certificate exceptions, a local screenshot destination, a DOM readiness check and 350 ms settling after scrolling before interaction. Product and checked-in test source stayed unchanged. The certificate exception is an environment limitation, not a required product configuration.

Additional independent browser checks used installed Python Playwright and Chromium: traverse all 20 routes in JS-disabled and JS-enabled contexts with direct visit and refresh; use load/network-idle and locator expectations; preserve unknown-route 404 through hydration and Back. Capture console/page errors and request origins. On Ripple, settle scrolling before clicking; at opacity .1/.35/.6, pause the real CSS animation at time zero, read computed opacity, then select each language, copy with the real UI and read `navigator.clipboard.readText()` (six copies). The supplemental contrast method identifies solid indigo glyph pixels at rest, samples entry and exit at .2/.4/.6/.8 of 800 ms at widths 120/240, pauses real CSS transition clocks, samples background in the same x-column, excludes the moving two-pixel clip boundary, and computes WCAG relative-luminance contrast from observed RGB. Tilt checks compare computed transform/shadow/transition under reduced motion and wait for finite Auto completion. These are deterministic paused-frame measurements, not video measurements or full-device certification.

Original infrastructure failures and successful runs remain distinct:

1. Initial dependency installation failed (exit 254) because the default npm cache was unavailable, with tar warnings. A separate rerun using a writable temporary cache succeeded; all subsequent quality gates passed.
2. Initial Chromium navigation with normal trust failed with `net::ERR_CERT_AUTHORITY_INVALID`. Browser tests then used `ignore_https_errors=True` for the audit proxy. Curl retained normal certificate verification throughout. This is not independent real-device TLS certification.
3. The completed hosted HTTP, editorial, custom UI and supplemental test runs all passed on their first test execution; no product assertion was weakened or failed-result log overwritten. An incidental log-display command errored and was corrected; it did not run a test or alter evidence.

Raw logs, response bodies/headers, screenshots, copied prompts and custom harnesses remain private audit evidence; they are not published in this archive. Public evidence here is the exact source/digest binding, reproducible build and byte check, named checks, counts, methods and limits. The later docs-only archive validates documentation scope and links; it does not claim another hosted or browser rerun.

## Limits and remaining gates

- Contrast checks cover solid glyph interiors. The moving clipped boundary and font antialiasing are excluded within the stated two-pixel edge neighborhood; these results do not certify every rendered edge, device or browser. Screenshots are local evidence only.
- Chromium desktop and emulated mobile/touch only; no physical phone, other browser engine, native screen reader or OS input-method verification.
- No new hosted Lighthouse/axe, full 18-entry editorial rereading, all-effect interaction regression, Actions run, production smoke or production inventory audit. Earlier reports are not described as new runs.
- Cloudflare adds NEL/Report-To. No off-origin traffic was observed in the recorded route session; this does not prove browser reporting is disabled.
- The ZIP checksum is owner-supplied provenance, not newly verified ZIP bytes. Public artifacts independently match the clean source build; private host configuration bytes and Cloudflare control-plane identity remain outside public byte verification.
- Owner's personal reading of all 18 entries, final brand/domain/assets/terms, full deployment ID and Preview metadata, Actions and release/production approval remain separate. No release, merge, tag or Stage 7 authority follows from this PASS.

## Current handoff

This report adds fixed-host evidence to the [source-only rereview](rereview-stage-6-editorial-babdf63.md). The [older hosted audit](stage-6-live-preview-d7f5ddba.md) remains unchanged and applies to its older product/host only. The [owner checklist](../HUMAN_REVIEW.md) now points to this tested immutable host, with **0/18** entries signed off. Full Cloudflare deployment ID and Preview dashboard metadata remain unverified. Production, merge and tag remain unapproved; no new deployment or settings change is authorized by this archive. Continue those separate human and release gates under [RELEASE](../RELEASE.md) and [REVIEW_POLICY](../REVIEW_POLICY.md).
