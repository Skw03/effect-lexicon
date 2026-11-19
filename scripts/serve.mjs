import { canonicalPath } from '../src/release/path-policy.mjs';
// Local production-like static host; never provisions or deploys anything.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import process from 'node:process';
export const policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
const root = resolve('dist');
const routes = JSON.parse(await readFile(resolve(root, 'routes.json'), 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };
createServer(async (req, res) => {
  res.setHeader('Content-Security-Policy', policy);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cache-Control', 'no-cache');
  try {
    const target = req.url || '/';
    const split = target.indexOf('?');
    const rawPath = split < 0 ? target : target.slice(0, split);
    const query = split < 0 ? '' : target.slice(split);
    const path = decodeURIComponent(rawPath);
    const route = canonicalPath(rawPath, routes);
    if (route && rawPath !== route) {
      res.statusCode = 308; res.setHeader('Location', route + query); res.end(); return;
    }
    if (path === '/favicon.ico') { res.statusCode = 204; res.end(); return; }
    const publicFile = ['/preferences.js', '/sitemap.xml', '/robots.txt', '/routes.json', '/manifest.webmanifest', '/favicon.svg', '/og-image.png'].includes(path) || /^\/assets\/[a-zA-Z0-9_.-]+\.(?:js|css)$/.test(path);
    const filePath = route ? `.${route}/index.html` : publicFile ? `.${path}` : './404.html';
    let file = resolve(root, filePath);
    if (!route && !publicFile) res.statusCode = 404;
    let body;
    try { body = await readFile(file); } catch { file = resolve(root, '404.html'); body = await readFile(file); res.statusCode = 404; }
    if (/\/assets\/[^/]+-[\w-]+\.(js|css)$/.test(file) && res.statusCode !== 404) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.statusCode = 400; res.end('Bad request'); }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => process.stdout.write('Local static host ready\n'));
