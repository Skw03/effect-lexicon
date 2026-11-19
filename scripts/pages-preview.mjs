// Build-time adapter only. No account, remote API or deployment operation.
import { writeFile } from 'node:fs/promises';
import { resolveReleaseConfig, validateReleaseConfig } from './release-config.mjs';
export const approvedFeedback = 'https://github.com/Skw03/effect-lexicon/issues';
export function previewConfig(config) {
  if (config.RELEASE_MODE || config.VITE_SITE_ORIGIN || config.VITE_RELEASE_ASSETS === 'true') throw Error('Pages preview requires no production mode, origin or release assets');
  if (config.VITE_FEEDBACK_URL && config.VITE_FEEDBACK_URL !== approvedFeedback) throw Error('Pages preview feedback must use the owner-approved GitHub Issues target');
  return validateReleaseConfig({ ...config, VITE_FEEDBACK_URL: approvedFeedback });
}
export function resolvePagesPreviewConfig(mode) {
  return previewConfig(resolveReleaseConfig(mode));
}
export function pagesRules(routes) {
  // Avoid overlapping Cache-Control declarations: Pages joins duplicate headers.
  const headers = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-cache

/assets/*
  ! Cache-Control
  Cache-Control: public, max-age=31536000, immutable
`;
  const redirects = ['/index.html / 308'];
  for (const route of routes.filter(route => route !== '/')) {
    redirects.push(`${route}/ ${route} 308`, `${route}/index.html ${route} 308`);
  }
  return { headers, redirects: redirects.join('\n') + '\n' };
}
export async function writePagesRules(routes) {
  const { headers, redirects } = pagesRules(routes);
  await writeFile('dist/_headers', headers);
  await writeFile('dist/_redirects', redirects);
}
