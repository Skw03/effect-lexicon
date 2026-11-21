import { URL } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(readFileSync(new URL('./reviewed-content.json', import.meta.url), 'utf8'));
export function verifyReviewedContent() {
  const actual = ['src/lib/renderPrompt.ts'];
  for (const directory of ['src/content', 'src/demos']) {
    for (const file of readdirSync(directory, { recursive: true, withFileTypes: true })) {
      if (file.isFile()) actual.push(`${file.parentPath}/${file.name}`);
    }
  }
  if (JSON.stringify(actual.sort()) !== JSON.stringify(Object.keys(manifest.files).sort())) throw Error('Reviewed content inventory changed; fresh content review required');
  for (const [path, expected] of Object.entries(manifest.files)) {
    if (createHash('sha256').update(readFileSync(path)).digest('hex') !== expected) throw Error(`Reviewed content changed: ${path}; fresh content review required`);
  }
}
