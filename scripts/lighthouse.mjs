import { spawnSync } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import process from 'node:process';
const cli = process.env.LIGHTHOUSE_CLI || '/tmp/effect-stage6-audit/node_modules/lighthouse/cli/index.js';
const output = process.env.AUDIT_OUTPUT || '/tmp/effect-stage6-audit/reports';
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4173';
await mkdir(output, { recursive: true });
for (const [name, path] of [['library', '/'], ['detail', '/effects/card-tilt-3d']]) {
  const file = `${output}/${name}.json`;
  const run = spawnSync(process.execPath, [cli, base + path, '--output=json', `--output-path=${file}`, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless --no-sandbox', '--quiet'], { stdio: 'inherit', env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || '/usr/bin/chromium' } });
  if (run.status !== 0) throw Error(`Lighthouse failed: ${name}`);
  const report = JSON.parse(await readFile(file, 'utf8'));
  const scores = Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, value.score * 100]));
  process.stdout.write(JSON.stringify({ route: path, lighthouse: report.lighthouseVersion, scores }) + '\n');
  for (const [key, minimum] of Object.entries({ performance: 85, accessibility: 95, 'best-practices': 95, seo: 95 })) if (scores[key] < minimum) throw Error(`${name} ${key} ${scores[key]} < ${minimum}`);
}
