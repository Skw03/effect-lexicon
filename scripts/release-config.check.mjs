import { verifyReviewedContent } from './verify-reviewed-content.mjs';
// Defensive configuration checks: inert URLs/text only, no executable payloads.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { releaseKeys, resolveReleaseConfig, validateReleaseConfig, releaseDefines, validateReleaseAssets } from './release-config.mjs';
import { canonicalPath } from '../src/release/path-policy.mjs';
const release = { RELEASE_MODE: 'production', VITE_RELEASE_ASSETS: 'false' };
for (const origin of ['https://host.localdomain','https://host.corp','https://host.private','https://preview.owner.com','https://your-domain.com','https://127.0.0.2','https://127.0.0.1','https://10.0.0.1','https://172.16.0.1','https://192.168.1.1','https://169.254.1.1','https://0.0.0.0','https://192.0.2.1','https://8.8.8.8','https://[::1]','https://[fc00::1]','https://[fe80::1]','https://localhost','https://localhost.','https://app.localhost','https://host.internal','https://host.local','https://host.test','https://example.com','https://www.example.com','https://example.org','https://example.net','https://example.org.','https://project.pages.dev','https://branch.project.vercel.app','https://project.netlify.app','https://owner.github.io','http://www.iana.org','https://www.iana.org:8443']) {
  test(`release rejects non-production origin ${origin}`, () => assert.throws(() => validateReleaseConfig({ ...release, VITE_SITE_ORIGIN: origin })));
}
test('public DNS HTTPS syntax accepted; validation does not assert ownership or deployment', () => assert.equal(validateReleaseConfig({ ...release, VITE_SITE_ORIGIN: 'https://www.iana.org' }).VITE_SITE_ORIGIN, 'https://www.iana.org'));
for (const origin of ['http://127.0.0.1:4173','http://[::1]:4173','https://preview.pages.dev']) test(`audit mode allows explicit test origin ${origin}`, () => assert.equal(validateReleaseConfig({ VITE_SITE_ORIGIN: origin }).VITE_SITE_ORIGIN, origin));
for (const origin of ['https://example.org/path','https://example.org/','https://example.org?x=1','https://example.org#fragment','https://user@example.org','ftp://example.org',' https://example.org']) test(`all modes reject malformed origin ${origin}`, () => assert.throws(() => validateReleaseConfig({ VITE_SITE_ORIGIN: origin })));
for (const key of ['VITE_FEEDBACK_URL','VITE_CODE_LICENSE_URL']) test(`${key} rejects inert non-HTTPS scheme`, () => assert.throws(() => validateReleaseConfig({ [key]: 'ftp://example.org/terms' })));
test('unconfigured local configuration remains empty and frozen', () => { const c = validateReleaseConfig({}); assert.equal(c.VITE_SITE_ORIGIN, ''); assert.ok(Object.isFrozen(c)); assert.equal(releaseDefines(c)['import.meta.env.VITE_SITE_ORIGIN'], '""'); });
test('Vite file precedence, process precedence, interpolation and mode isolation', () => {
  const dir = mkdtempSync(join(tmpdir(), 's6-config-'));
  const saved = Object.fromEntries(releaseKeys.map(key => [key, process.env[key]]));
  try {
    for (const key of releaseKeys) delete process.env[key];
    for (const [file, port] of [['.env',4101],['.env.local',4102],['.env.production',4103],['.env.production.local',4104]]) {
      writeFileSync(join(dir,file), `VITE_SITE_ORIGIN=http://127.0.0.1:${port}\n`);
      assert.equal(resolveReleaseConfig('production',dir).VITE_SITE_ORIGIN, `http://127.0.0.1:${port}`);
    }
    writeFileSync(join(dir,'.env.audit'), 'AUDIT_ORIGIN=http://127.0.0.1:4105\nVITE_SITE_ORIGIN=${AUDIT_ORIGIN}\n');
    assert.equal(resolveReleaseConfig('audit',dir).VITE_SITE_ORIGIN, 'http://127.0.0.1:4105');
    process.env.VITE_SITE_ORIGIN='http://127.0.0.1:4106';
    assert.equal(resolveReleaseConfig('production',dir).VITE_SITE_ORIGIN, process.env.VITE_SITE_ORIGIN);
    process.env.VITE_SITE_ORIGIN='';
    assert.equal(resolveReleaseConfig('production',dir).VITE_SITE_ORIGIN, '');
    delete process.env.VITE_SITE_ORIGIN;
    writeFileSync(join(dir,'.env.production.local'), 'VITE_SITE_ORIGIN=https://example.org/unapproved-path\n');
    assert.throws(() => resolveReleaseConfig('production',dir));
    writeFileSync(join(dir,'.env.production.local'), 'VITE_RELEASE_ASSETS=true\n');
    assert.throws(() => validateReleaseAssets(resolveReleaseConfig('production',dir),dir));
  } finally { for (const key of releaseKeys) { if (saved[key] === undefined) delete process.env[key]; else process.env[key]=saved[key]; } rmSync(dir,{recursive:true,force:true}); }
});
const routes=['/','/guide','/effects/card-tilt-3d'];
for (const [input,expected] of [['/','/'],['/index.html','/'],['/guide/','/guide'],['/GUIDE','/guide'],['//guide','/guide'],['/guide/index.html','/guide'],['/effects/%63ard-tilt-3d','/effects/card-tilt-3d'],['/effects/card-tilt-3d/index.html','/effects/card-tilt-3d'],['/unknown',''],['/effects/missing',''],['/%zz',''],['/%2e%2e/package.json',''],['/guide\\extra','']]) test(`shared path policy ${input}`, () => assert.equal(canonicalPath(input,routes),expected));

test('production rejects unapproved legal or name overrides and image drafts', () => {
  const valid = { ...release, VITE_SITE_ORIGIN: 'https://motioncuebook.com' };
  assert.equal(validateReleaseConfig(valid).VITE_CODE_LICENSE, '0BSD');
  for (const values of [{ VITE_RELEASE_ASSETS: 'true' }, { VITE_RELEASE_ASSETS: '' }, { VITE_CODE_LICENSE: 'unapproved' }, { VITE_CONTENT_TERMS: 'unapproved' }, { VITE_SITE_NAME: 'unapproved' }]) assert.throws(() => validateReleaseConfig({ ...valid, ...values }));
});

test('reviewed content guard rejects changed bytes and added content', () => {
  const original = process.cwd();
  const dir = mkdtempSync(join(tmpdir(), 'reviewed-content-'));
  try {
    mkdirSync(join(dir, 'src/lib'), { recursive: true });
    for (const path of ['src/content', 'src/demos', 'src/lib/renderPrompt.ts']) cpSync(path, join(dir, path), { recursive: true });
    process.chdir(dir);
    verifyReviewedContent();
    writeFileSync('src/content/unreviewed.txt', 'inert extra file');
    assert.throws(verifyReviewedContent, /inventory changed/);
    rmSync('src/content/unreviewed.txt');
    writeFileSync('src/lib/renderPrompt.ts', 'inert changed fixture');
    assert.throws(verifyReviewedContent, /Reviewed content changed/);
  } finally { process.chdir(original); rmSync(dir, { recursive: true, force: true }); }
});

test('production omission refuses artwork files even without metadata references', () => {
  const dir = mkdtempSync(join(tmpdir(), 'no-artwork-'));
  try {
    mkdirSync(join(dir, 'public'));
    writeFileSync(join(dir, 'public/favicon.svg'), 'inert fixture');
    const config = validateReleaseConfig({ ...release, VITE_SITE_ORIGIN: 'https://motioncuebook.com' });
    assert.throws(() => validateReleaseAssets(config, dir), /omits them/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
