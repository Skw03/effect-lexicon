import { loadEnv } from 'vite';
import { isIP } from 'node:net';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
export const releaseKeys = ['VITE_SITE_ORIGIN', 'VITE_SITE_NAME', 'VITE_FEEDBACK_URL', 'VITE_CODE_LICENSE', 'VITE_CODE_LICENSE_URL', 'VITE_CONTENT_TERMS', 'VITE_RELEASE_ASSETS', 'RELEASE_MODE'];
const reserved = ['localhost', 'localdomain', 'corp', 'private', 'local', 'internal', 'intranet', 'lan', 'home', 'test', 'invalid', 'example', 'onion', 'alt', 'arpa', 'example.com', 'example.net', 'example.org'];
const previews = ['pages.dev', 'vercel.app', 'netlify.app', 'github.io', 'gitlab.io', 'workers.dev', 'surge.sh', 'web.app', 'firebaseapp.com', 'onrender.com', 'ngrok.io', 'ngrok-free.app', 'trycloudflare.com'];
export function validateReleaseConfig(values) {
  const config = Object.fromEntries(releaseKeys.map(key => [key, values[key] || '']));
  for (const [key, value] of Object.entries(config)) if (value.trim() !== value || [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) throw Error(`${key}: whitespace/control characters are not supported`);
  if (!['', 'true', 'false'].includes(config.VITE_RELEASE_ASSETS)) throw Error('VITE_RELEASE_ASSETS must be true or false');
  if (!['', 'production'].includes(config.RELEASE_MODE)) throw Error('RELEASE_MODE must be unset or production');
  const origin = config.VITE_SITE_ORIGIN;
  let url;
  if (origin) {
    url = new URL(origin);
    if (url.origin !== origin || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw Error('VITE_SITE_ORIGIN must be a bare HTTP(S) origin without path, credentials or trailing slash');
  }
  for (const key of ['VITE_FEEDBACK_URL', 'VITE_CODE_LICENSE_URL']) {
    if (!config[key]) continue;
    const link = new URL(config[key]);
    const mail = key === 'VITE_FEEDBACK_URL' && link.protocol === 'mailto:' && /^[^\s@/?#]+@[^\s@/?#]+\.[^\s@/?#]+$/.test(link.pathname) && !link.search && !link.hash;
    if (!mail && (link.protocol !== 'https:' || !link.hostname || link.username || link.password)) throw Error(`${key} requires an HTTPS link or plain feedback mailto address`);
  }
  if (config.RELEASE_MODE === 'production') {
    if (!url || url.protocol !== 'https:' || url.port) throw Error('Production requires an explicit HTTPS origin on the default port');
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    // Production is deliberately DNS-name-only: reject all IP literals, including
    // public IPs, rather than maintaining an incomplete private/reserved IP table.
    const labels = host.split('.');
    if (isIP(host.replace(/^\[|\]$/g, '')) || labels.length < 2 || !/^[a-z]{2,63}$/.test(labels.at(-1)) || labels.some(label => ['example', 'placeholder', 'yourdomain', 'your-domain', 'preview', 'staging'].includes(label)) || labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) || [...reserved, ...previews].some(domain => host === domain || host.endsWith('.' + domain))) throw Error('Production origin must be a public DNS name, not a local/reserved/example or provider preview address');
    for (const key of ['VITE_SITE_NAME', 'VITE_FEEDBACK_URL', 'VITE_CODE_LICENSE', 'VITE_CODE_LICENSE_URL', 'VITE_CONTENT_TERMS']) if (!config[key]) throw Error(`Owner input required: ${key}`);
    if (config.VITE_RELEASE_ASSETS !== 'true') throw Error('Production requires approved release assets');
  }
  return Object.freeze(config);
}
export function resolveReleaseConfig(mode, directory = process.cwd()) {
  // Vite owns .env < .env.local < .env.[mode] < .env.[mode].local precedence
  // and interpolation; existing process values have highest priority.
  return validateReleaseConfig(loadEnv(mode, directory, ''));
}
export function releaseDefines(config) {
  return Object.fromEntries(releaseKeys.filter(key => key.startsWith('VITE_')).map(key => [`import.meta.env.${key}`, JSON.stringify(config[key])]));
}
export function validateReleaseAssets(config, directory = process.cwd()) {
  if (config.VITE_RELEASE_ASSETS !== 'true') return;
  const png = readFileSync(resolve(directory, 'public/og-image.png'));
  readFileSync(resolve(directory, 'public/favicon.svg'));
  if (png.length < 24 || png.toString('hex', 0, 8) !== '89504e470d0a1a0a' || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) throw Error('Owner share image must be a 1200 × 630 PNG');
}
