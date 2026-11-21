"""Local Wrangler Pages asset behavior; never a hosted-preview acceptance result."""
import json, os, urllib.request, urllib.error
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('AUDIT_BASE', 'http://127.0.0.1:4583')
routes = json.loads(Path('dist/routes.json').read_text())
checks = 0
def check(ok, label):
    global checks
    assert ok, label
    checks += 1
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args): return None
opener = urllib.request.build_opener(NoRedirect)
def fetch(path):
    try: return opener.open(BASE + path)
    except urllib.error.HTTPError as error: return error
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for enabled in [False, True]:
        c = b.new_context(java_script_enabled=enabled, reduced_motion='reduce')
        page = c.new_page(); errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and '404' not in m.text else None)
        for route in routes:
            response = page.goto(BASE + route)
            expected = page.locator('#root').inner_text(); title = page.title()
            check(response.status == 200, route)
            check(response.headers.get('cache-control') == 'no-cache', 'HTML cache')
            check('noindex' in response.headers.get('x-robots-tag', ''), 'preview header')
            check(page.locator('link[rel=canonical]').count() == 0, 'no invented canonical')
            check(page.locator('meta[name=robots]').get_attribute('content') == 'noindex,nofollow', 'noindex HTML')
            check(page.locator('a[href="https://github.com/Skw03/effect-lexicon/issues"]').count() == 1, 'approved feedback')
            if route.startswith('/effects/'):
                check(len(page.locator('#prompt').input_value()) > 100, 'real prompt')
            aliases = ['/index.html'] if route == '/' else [route+'/', route+'/index.html', route+'.html']
            for alias in aliases:
                response = fetch(alias+'?q=tilt&cat=cards')
                check(response.status in [301, 308] and response.headers['Location'] == route+'?q=tilt&cat=cards', 'alias query '+alias)
                page.goto(BASE+alias)
                check(page.url == BASE+route, 'slashless redirect')
                check(page.title() == title and page.locator('#root').inner_text() == expected, 'alias body parity')
                page.reload(); check(page.title() == title, 'refresh')
        for path in ['/GUIDE', '/effects/CARD-TILT-3D', '/missing', '/guide/missing']:
            response = page.goto(BASE+path); page.wait_for_timeout(150)
            check(response.status == 404, 'true404 '+path)
            check(page.locator('h1').inner_text() == '找不到这个页面', '404 hydration')
            check(page.locator('link[rel=canonical]').count() == 0, '404 metadata')
            if enabled:
                page.locator('header .brand').click(); expect(page.locator('.effect-title')).to_have_count(18)
                page.go_back(); expect(page.locator('h1')).to_have_text('找不到这个页面'); check(True, '404 back')
        for path in ['//guide', '/gu%69de']:
            page.goto(BASE+'/guide'); guide_title=page.title()
            response=page.goto(BASE+path);page.wait_for_timeout(100)
            check(response.status == 200 and page.title() == guide_title, 'native alias')
        check(not errors, str(errors));c.close()
    b.close()
for asset in Path('dist/assets').iterdir():
    check(fetch('/assets/'+asset.name).headers.get('cache-control') == 'public, max-age=31536000, immutable', 'asset cache')
check('Disallow: /' in fetch('/robots.txt').read().decode(), 'robots')
check('<loc>' not in fetch('/sitemap.xml').read().decode(), 'empty preview sitemap')
print(f'Pages local checks: {checks} PASS; hosted preview NOT RUN')
