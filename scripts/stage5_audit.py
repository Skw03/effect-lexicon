"""Real axe-core audit, using a fixed external installation (no product dependency).
Start production preview on 4173. AXE_PATH and AUDIT_BASE may override defaults.
Raw reports go to /tmp/effect-stage5-audit/reports, never into the repository.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('AUDIT_BASE', 'http://127.0.0.1:4173')
AXE = os.environ.get('AXE_PATH', '/tmp/effect-stage5-audit/node_modules/axe-core/axe.min.js')
OUT = Path('/tmp/effect-stage5-audit/reports')
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
    page.goto(BASE)
    expect(page.locator('.effect-title')).to_have_count(18)
    routes = ['/'] + page.locator('.effect-title').evaluate_all('(ls) => ls.map(a => a.getAttribute("href"))') + ['/guide']
    summary = []
    for route in routes + ['/effects/modal-scale-fade']:
        modal = len(summary) == len(routes)
        page.goto(BASE + route)
        expect(page.locator('h1')).to_be_visible()
        if modal:
            page.get_by_role('button', name='打开对话框', exact=True).click()
            expect(page.get_by_role('dialog')).to_be_visible()
        page.add_script_tag(path=AXE)
        result = page.evaluate("async () => await axe.run({rules: {'label-content-name-mismatch': {enabled: true}}})")
        name = ('library' if route == '/' else route.strip('/').replace('/', '-')) + ('-open' if modal else '')
        (OUT / (name + '.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2))
        serious = [v for v in result['violations'] if v['impact'] in ['critical', 'serious']]
        row = {'route': route, 'modal': modal, 'axe': result['testEngine']['version'], 'violations': [{'id': v['id'], 'impact': v['impact'], 'nodes': len(v['nodes'])} for v in result['violations']], 'critical_serious': len(serious)}
        summary.append(row)
        print(json.dumps(row, ensure_ascii=False), flush=True)
    (OUT / 'summary.json').write_text(json.dumps({'base': BASE, 'browser': browser.version, 'results': summary}, ensure_ascii=False, indent=2))
    browser.close()
    assert all(row['critical_serious'] == 0 for row in summary), 'axe critical/serious violations remain'
