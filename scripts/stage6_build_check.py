"""Check generated route/metadata/asset contract without a browser or dependencies."""
import json
import os
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
origin = os.environ.get('VITE_SITE_ORIGIN', '')
class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.links = {}; self.assets = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta': self.meta[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'link': self.links[a.get('rel')] = a.get('href')
        if tag == 'script' and a.get('src'): self.assets.append(a['src'])
routes = json.loads(Path('dist/routes.json').read_text())
assert len(routes) == 20 and len(set(routes)) == 20
for route in routes:
    html = Path('dist' + ('' if route == '/' else route) + '/index.html').read_text()
    head = Head(); head.feed(html)
    assert '<html lang="zh-CN">' in html and '<h1>' in html
    assert head.meta['description'] and head.meta['og:title'] and head.meta['twitter:title']
    assert head.meta['robots'] == ('index,follow' if origin else 'noindex,nofollow')
    assert head.links.get('canonical', '') == (origin + route if origin else '')
    for asset in head.assets + [head.links['stylesheet']]: assert Path('dist' + asset).is_file()
locs = [x.text for x in ET.parse('dist/sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert locs == ([origin + route for route in routes] if origin else [])
assert Path('dist/robots.txt').read_text() == (f'User-agent: *\nAllow: /\nSitemap: {origin}/sitemap.xml\n' if origin else 'User-agent: *\nDisallow: /\n')
assert 'noindex,nofollow' in Path('dist/404.html').read_text()
assert not Path('.prerender').exists()
print('PASS 20 HTML route contracts, published sitemap/robots, 404 noindex and temporary bundle cleanup')
