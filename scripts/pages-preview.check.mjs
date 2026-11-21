import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateReleaseConfig } from './release-config.mjs';
import { previewConfig, pagesRules, approvedFeedback } from './pages-preview.mjs';
test('preview defaults are frozen, no origin, approved feedback', () => {
  const config = previewConfig(validateReleaseConfig({}));
  assert.equal(config.VITE_SITE_ORIGIN, '');
  assert.equal(config.VITE_FEEDBACK_URL, approvedFeedback);
  assert.ok(Object.isFrozen(config));
});
for (const values of [{ RELEASE_MODE: 'production' }, { VITE_SITE_ORIGIN: 'https://preview.pages.dev' }, { VITE_SITE_ORIGIN: 'http://127.0.0.1:4173' }, { VITE_RELEASE_ASSETS: 'true' }, { VITE_FEEDBACK_URL: 'https://example.org/feedback' }]) {
  test(`preview rejects incompatible input ${Object.keys(values)[0]} ${Object.values(values)[0]}`, () => assert.throws(() => previewConfig(values)));
}
test('rules normalize only known aliases, never rewrite unknown paths to SPA', () => {
  const { headers, redirects } = pagesRules(['/', '/guide', '/effects/card-tilt-3d']);
  assert.equal(redirects.split('\n').filter(Boolean).length, 5);
  assert.ok(redirects.includes('/guide/index.html /guide 308'));
  assert.ok(!redirects.includes('*'));
  assert.ok(headers.includes('X-Robots-Tag: noindex, nofollow'));
  assert.ok(headers.includes("script-src 'self';"));
});

test('production rules remain indexable with explicit 404 exclusion', () => {
  const { headers } = pagesRules(['/', '/guide'], true);
  assert.ok(headers.includes('X-Robots-Tag: index, follow'));
  assert.ok(headers.includes('/404.html\n  ! X-Robots-Tag\n  X-Robots-Tag: noindex, nofollow'));
});
