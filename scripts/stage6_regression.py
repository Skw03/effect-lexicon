"""Production-like host verification; run after npm run build and npm run preview."""
import json
import os
import urllib.request
import urllib.error
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('AUDIT_BASE', 'http://127.0.0.1:4173')
routes = json.loads(Path('dist/routes.json').read_text())
results = []
def check(name, valid):
    assert valid, name
    results.append(name)
def fetch(path):
    try: return urllib.request.urlopen(BASE + path)
    except urllib.error.HTTPError as error: return error
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    plain = browser.new_context(java_script_enabled=False, reduced_motion='reduce')
    snapshots = {}
    bodies = {}
    for route in routes:
        page = plain.new_page(); response = page.goto(BASE + route)
        check(route + ' static HTTP 200', response.status == 200)
        check(route + ' no-JS real title', bool(page.locator('h1').inner_text()))
        snapshots[route] = page.locator('h1').inner_text()
        bodies[route] = page.locator('#root').inner_text()
        if route.startswith('/effects/'):
            check(route + ' no-JS descriptions aliases prompt', page.locator('.aliases').inner_text() and page.get_by_role('heading', name='怎么描述它').count() == 1 and len(page.locator('#prompt').input_value()) > 100)
        check(route + ' static HTML no-cache', response.headers['cache-control'] == 'no-cache')
        page.close()
    plain.close()
    for motion in ['reduce', 'no-preference']:
        for language in ['en', 'zh']:
            context = browser.new_context(reduced_motion=motion)
            context.add_init_script("try { localStorage.setItem('effect-lexicon-language', '" + language + "'); } catch {} window.violations=[]; addEventListener('securitypolicyviolation', e => window.violations.push(e.violatedDirective));")
            errors = []
            context.on('page', lambda page: page.on('pageerror', lambda e: errors.append(str(e))))
            page = context.new_page()
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            for route in routes:
                page.goto(BASE + route); page.wait_for_timeout(120)
                check(f'{motion}/{language}/{route} hydrated title parity', page.locator('h1').inner_text() == snapshots[route])
                if motion == 'reduce' and language == 'en':
                    check(route + ' complete static/hydrated body text parity', page.locator('#root').inner_text() == bodies[route])
                if route.startswith('/effects/'):
                    expect(page.locator('#prompt')).to_have_attribute('lang', 'zh-CN' if language == 'zh' else 'en')
                    check(f'{motion}/{language}/{route} correct visible preference', page.locator('#prompt').is_visible())
                    page.get_by_role('button', name='重置 Reset', exact=True).click()
                check(f'{motion}/{language}/{route} no CSP violation', not page.evaluate('window.violations'))
                page.reload(); page.wait_for_timeout(80)
                check(f'{motion}/{language}/{route} refresh', page.locator('h1').inner_text() == snapshots[route])
            assert not errors, errors
            check(f'{motion}/{language} no runtime/hydration errors', not errors)
            # Dynamic inline CSS and real pointer/replay actions under actual CSP.
            for slug in ['card-tilt-3d', 'spotlight-card', 'glassmorphism']:
                page.goto(BASE + '/effects/' + slug)
                page.locator('input[type=range]').first.fill(page.locator('input[type=range]').first.get_attribute('max'))
                if slug != 'glassmorphism': page.get_by_role('button', name='自动演示 Auto demo', exact=True).click()
                page.wait_for_timeout(250)
                check(f'{motion}/{language}/{slug} dynamic styles CSP', not page.evaluate('window.violations'))
            page.goto(BASE + '/?q=frosted%20glass'); expect(page.locator('.effect-title')).to_have_count(1)
            check(f'{motion}/{language} query hydration', page.locator('.effect-title').get_attribute('href') == '/effects/glassmorphism')
            context.close()
    page = browser.new_page()
    page.goto(BASE)
    canonical = page.locator('link[rel=canonical]')
    configured_origin = canonical.get_attribute('href').rstrip('/') if canonical.count() else ''
    page.locator('.effect-title').first.click()
    expect(page).to_have_title(__import__('re').compile('3D Tilt Card'))
    check('SPA metadata title updates', page.title() == page.locator('meta[property="og:title"]').get_attribute('content'))
    if configured_origin:
        check('SPA canonical updates', page.locator('link[rel=canonical]').get_attribute('href') == configured_origin + '/effects/card-tilt-3d')
    page.get_by_role('navigation', name='主导航').get_by_role('link', name='描述指南').click()
    expect(page).to_have_title(__import__('re').compile('描述指南 Guide'))
    check('SPA guide metadata updates', page.title() == page.locator('meta[name="twitter:title"]').get_attribute('content'))
    for route in ['/not-a-route', '/effects/not-published']:
        response = page.goto(BASE + route)
        check(route + ' actual 404', response.status == 404 and page.locator('h1').inner_text() == '找不到这个页面')
    response = fetch('/')
    check('CSP self only scripts', "script-src 'self'" in response.headers['Content-Security-Policy'])
    for header in ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']:
        check(header, bool(response.headers[header]))
    for file in Path('dist/assets').iterdir():
        response = fetch('/assets/' + file.name)
        check(file.name + ' immutable', response.status == 200 and 'immutable' in response.headers['Cache-Control'])
    browser.close()
print(json.dumps({'passed': len(results), 'checks': results}, ensure_ascii=False, indent=2))
