"""Benign route aliases and unknown paths: actual HTTP plus JS-on/off parity."""
import json
import os
import urllib.request
import urllib.error
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('AUDIT_BASE','http://127.0.0.1:4173')
routes=json.loads(Path('dist/routes.json').read_text())
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args): return None
opener=urllib.request.build_opener(NoRedirect)
checks=0
def check(value):
    global checks
    assert value
    checks+=1
def response(path):
    try:return opener.open(BASE+path)
    except urllib.error.HTTPError as error:return error
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for enabled in [False,True]:
        c=b.new_context(java_script_enabled=enabled,reduced_motion='reduce')
        page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        for route in routes:
            page.goto(BASE+route)
            expected_title=page.title();expected_body=page.locator('#root').inner_text()
            expected_canonical=page.locator('link[rel=canonical]').get_attribute('href') if page.locator('link[rel=canonical]').count() else ''
            variants=['/index.html'] if route=='/' else [route+'/',route.upper(),'/'+route,route+'/index.html',route.replace(route[1],'%'+format(ord(route[1]),'02x'),1)]
            if route.startswith('/effects/'):
                prefix, slug = route.rsplit('/',1)
                variants.append(prefix+'/%'+format(ord(slug[0]),'02x')+slug[1:])
            for alias in variants:
                reply=response(alias+'?q=tilt&cat=cards')
                check(reply.status==308 and reply.headers['Location']==route+'?q=tilt&cat=cards')
                reply=page.goto(BASE+alias);page.wait_for_timeout(40)
                check(reply.status==200 and page.url==BASE+route)
                check(page.title()==expected_title and page.locator('#root').inner_text()==expected_body)
                canonical=page.locator('link[rel=canonical]')
                check((canonical.get_attribute('href') if canonical.count() else '')==expected_canonical)
                page.reload();check(page.title()==expected_title)
        for unknown in ['/unknown','/effects/unpublished','/guide/other','/404.html']:
            reply=page.goto(BASE+unknown);check(reply.status==404)
            check(page.locator('h1').inner_text()=='找不到这个页面')
            check(page.locator('meta[name=robots]').get_attribute('content')=='noindex,nofollow' and page.locator('link[rel=canonical]').count()==0)
        check(not errors);c.close()
    check(response('/%zz').status==400)
    b.close()
print(f'PASS {checks} HTTP/JS-on/off path checks across all 20 canonical pages and supported aliases')
