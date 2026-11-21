"""Local closeout smoke; run against the actual built output, never deploys.
EXPECT_ORIGIN empty checks nonindexable preview; otherwise checks production metadata.
Uses provisioned Python Playwright and Chromium, no package installation.
"""
import json
import os
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('AUDIT_BASE', 'http://127.0.0.1:4173')
ORIGIN = os.environ.get('EXPECT_ORIGIN', 'https://motioncuebook.com')
NAME = '动效小抄 / Motion Cuebook'
checks = 0

def check(ok, label):
    global checks
    assert ok, label
    checks += 1

routes = json.loads(Path('dist/routes.json').read_text())
manifest = json.loads(Path('dist/manifest.webmanifest').read_text())
check(manifest['name'] == NAME and manifest['icons'] == [], 'icon-free manifest')
check(len(routes) == 20, '20 public routes')
sitemap = Path('dist/sitemap.xml').read_text()
check(sitemap.count('<loc>') == (20 if ORIGIN else 0), 'sitemap count')
check(all(ORIGIN + route + '</loc>' in sitemap for route in routes) if ORIGIN else '<loc>' not in sitemap, 'sitemap origins')
check(('Allow: /' if ORIGIN else 'Disallow: /') in Path('dist/robots.txt').read_text(), 'robots mode')
check(not list(Path('dist').rglob('favicon*')) and not list(Path('dist').rglob('og-image*')), 'no draft artwork')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for js in [False, True]:
        context = browser.new_context(java_script_enabled=js, reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        for route in routes + ['/missing-closeout']:
            response = page.goto(BASE + route)
            page.wait_for_timeout(100)
            known = route in routes
            check(response.status == (200 if known else 404), f'{js}/{route} status')
            check(NAME in page.title(), f'{js}/{route} title')
            check(page.locator('.brand').inner_text() == NAME and NAME in page.locator('footer').inner_text(), 'brand parity')
            check('0BSD' in page.locator('footer').inner_text() and 'Other rights are not waived.' in page.locator('footer').inner_text(), 'approved terms')
            check(page.locator('link[rel=icon],meta[property^="og:image"],meta[name="twitter:image"]').count() == 0, 'no image metadata')
            check(page.locator('meta[name="twitter:card"]').get_attribute('content') == 'summary', 'text card')
            check(page.locator('link[rel=manifest]').get_attribute('href') == '/manifest.webmanifest', 'manifest reference')
            canonical = page.locator('link[rel=canonical]')
            check(canonical.get_attribute('href') == ORIGIN + route if known and ORIGIN else canonical.count() == 0, 'canonical policy')
            check(page.locator('meta[name=robots]').get_attribute('content') == ('index,follow' if known and ORIGIN else 'noindex,nofollow'), 'indexing policy')
            check("script-src 'self'" in response.headers['content-security-policy'], 'served CSP')
            check(response.headers['cache-control'] == 'no-cache', 'served HTML cache')
            page.reload()
            check(NAME in page.title(), 'refresh title')
        check(not errors, 'no runtime or hydration errors')
        context.close()
    browser.close()
for asset in Path('dist/assets').iterdir():
    with urllib.request.urlopen(BASE + '/assets/' + asset.name) as response:
        check('immutable' in response.headers['Cache-Control'], 'served asset cache')
print(f'PASS {checks} closeout checks; JS on/off; origin={ORIGIN or "preview/noindex"}')
