import { resolveReleaseConfig, releaseDefines, validateReleaseAssets } from './release-config.mjs';
import { build } from 'vite';
import { resolvePagesPreviewConfig, writePagesRules } from './pages-preview.mjs';
import tailwindcss from 'tailwindcss';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
const args = process.argv.slice(2);
const pagesPreview = args[0] === '--pages-preview';
if (pagesPreview) args.shift();
if (args.length && (args.length !== 2 || args[0] !== '--mode' || !/^[a-zA-Z0-9_-]+$/.test(args[1]))) throw Error('Usage: node scripts/build.mjs [--pages-preview] [--mode <name>]');
const mode = args[1] || 'production';
const config = pagesPreview ? resolvePagesPreviewConfig(mode) : resolveReleaseConfig(mode);
validateReleaseAssets(config);
// Both bundles consume this exact validated snapshot; Vite must not reread env files.
const options = { configFile: false, mode, envFile: false, define: releaseDefines(config), css: { postcss: { plugins: [tailwindcss()] } } };
// The custom build intentionally skips config-file re-evaluation between bundles.
// The CSS pipeline matches vite.config.ts; dev/direct Vite use the same resolver.
const temp = '.prerender';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
try {
  await build(options);
  await build({ ...options, build: { ssr: 'src/entry-server.tsx', outDir: temp } });
  const { render, routes, metadata, site } = await import(resolve(temp, 'entry-server.js'));
  const template = await readFile('dist/index.html', 'utf8');
  for (const path of [...routes, '/404']) {
    const data = metadata(path);
    const tags = [
      `<title>${escape(data.title)}</title>`,
      `<meta name="description" content="${escape(data.description)}">`,
      `<meta name="robots" content="${data.index ? 'index,follow' : 'noindex,nofollow'}">`,
      ...Object.entries({ title: data.title, description: data.description, type: 'website', locale: 'zh_CN', site_name: site.name }).map(([key,value]) => `<meta property="og:${key}" content="${escape(value)}">`),
      `<meta name="twitter:card" content="${site.assets ? 'summary_large_image' : 'summary'}">`,
      `<meta name="twitter:title" content="${escape(data.title)}">`,
      `<meta name="twitter:description" content="${escape(data.description)}">`,
    ];
    if (data.canonical) tags.push(`<link rel="canonical" href="${escape(data.canonical)}">`, `<meta property="og:url" content="${escape(data.canonical)}">`);
    if (site.assets) tags.push('<link rel="icon" href="/favicon.svg" type="image/svg+xml">', '<link rel="manifest" href="/manifest.webmanifest">', `<meta property="og:image" content="${escape(site.origin)}/og-image.png">`, `<meta name="twitter:image" content="${escape(site.origin)}/og-image.png">`, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">');
    const html = template.replace(/<title>.*?<\/title>/, tags.join('\n')).replace('<div id="root"></div>', `<div id="root"${path === '/404' ? ' data-not-found="true"' : ''}>${render(path)}</div>`);
    const file = path === '/404' ? 'dist/404.html' : pagesPreview && path !== '/' ? `dist${path}.html` : `dist${path === '/' ? '' : path}/index.html`;
    await mkdir(resolve(file, '..'), { recursive: true });
    await writeFile(file, html);
  }
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site.origin ? routes.map(path => `<url><loc>${escape(site.origin + path)}</loc></url>`).join('') : ''}</urlset>\n`);
  await writeFile('dist/robots.txt', site.origin ? `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  if (site.assets) await writeFile('dist/manifest.webmanifest', JSON.stringify({ name: site.name, short_name: site.name, lang: 'zh-CN', start_url: '/', display: 'browser', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }] }));
  await writeFile('dist/routes.json', JSON.stringify(routes));
  if (pagesPreview) await writePagesRules(routes);
  process.stdout.write(`Prerendered ${routes.length} content routes plus 404; origin: ${site.origin || 'unset (local/noindex)'}\n`);
} finally { await rm(temp, { recursive: true, force: true }); }
