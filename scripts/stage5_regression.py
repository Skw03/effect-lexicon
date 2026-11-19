"""Stage 5 additions; run alongside all six earlier scripts, never instead of them.
Existing Python Playwright and /usr/bin/chromium required. No downloads.
IME uses Chrome CDP's native composition events, not an installed OS Pinyin UI.
"""
import json
import os
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright, expect
BASE = os.environ.get('STAGE5_BASE', 'http://127.0.0.1:5173')
results = []
def check(name, condition=True):
    assert condition, name
    results.append(name)
    print('PASS', name, flush=True)

def query(page):
    return parse_qs(urlparse(page.url).query).get('q', [''])[0]

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':1280,'height':900}, reduced_motion='reduce')
    page = context.new_page()
    errors, external = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('request', lambda r: external.append(r.url) if not r.url.startswith(BASE) else None)
    for label in ['清除搜索', '清除筛选']:
        page.goto(BASE+'/?q=tilt')
        button = page.get_by_role('button', name=label, exact=True)
        button.focus(); page.keyboard.press('Enter')
        expect(page.locator('#effect-search')).to_be_focused()
        expect(page.locator('.effect-title')).to_have_count(18)
        check(label+' returns keyboard focus to search', query(page)=='')
        page.keyboard.press('Tab')
        check(label+' next Tab reaches first trigger chip', page.evaluate('document.activeElement.textContent')=='鼠标悬停')
    page.goto(BASE+'/?cat=cards')
    page.locator('#effect-search').focus()
    cdp = context.new_cdp_session(page)
    page.evaluate('''() => { window.announcements=[]; new MutationObserver(()=>window.announcements.push(document.querySelector('.result-line p').textContent)).observe(document.querySelector('.result-line p'),{childList:true,subtree:true,characterData:true}); }''')
    original_url = page.url
    original_titles = page.locator('.effect-title').all_text_contents()
    for text in ['ka', 'ka pian', '卡片']:
        cdp.send('Input.imeSetComposition', {'text':text,'selectionStart':len(text),'selectionEnd':len(text)})
        page.wait_for_timeout(350)
        check('IME >150ms composition stable: '+text, page.url==original_url and page.locator('.effect-title').all_text_contents()==original_titles and page.evaluate('window.announcements.length')==0)
    cdp.send('Input.insertText', {'text':'卡片'})
    expect(page.locator('.active-summary')).to_contain_text('搜索：卡片')
    check('IME commit exact Chinese URL and input', query(page)=='卡片' and page.locator('#effect-search').input_value()=='卡片')
    page.get_by_role('button', name='清除搜索', exact=True).click()
    expect(page.locator('.active-summary')).not_to_contain_text('搜索：')
    check('IME clear preserves category and resets query', query(page)=='' and 'cat=cards' in page.url)
    page.locator('#effect-search').focus()
    cdp.send('Input.imeSetComposition', {'text':'qu xiao','selectionStart':7,'selectionEnd':7})
    cdp.send('Input.imeSetComposition', {'text':'','selectionStart':0,'selectionEnd':0})
    page.wait_for_timeout(350)
    check('IME cancelled composition does not publish draft', query(page)=='' and page.locator('#effect-search').input_value()=='')
    page.locator('#effect-search').fill('毛玻璃')
    expect(page.locator('.active-summary')).to_contain_text('搜索：毛玻璃')
    page.locator('header a[href="/guide"]').click()
    page.go_back()
    expect(page.locator('#effect-search')).to_have_value('毛玻璃')
    check('history Back restores final Chinese search', query(page)=='毛玻璃')
    page.goto(BASE+'/guide')
    expect(page.locator('h1')).to_have_text('如何向 AI 描述一个动效')
    check('Guide six parts and precise before/after', page.locator('.guide-parts > li').count()==6 and page.get_by_text('卡片动起来',exact=True).count()==1 and '400ms' in page.locator('.guide-example').inner_text())
    check('header and footer guide links', page.locator('header a[href="/guide"], footer a[href="/guide"]').count()==2)
    page.locator('main a[href="/effects/card-tilt-3d"]').click()
    expect(page.locator('.tilt-card')).to_be_visible()
    check('Guide opens real tilt detail')
    page.goto(BASE)
    expect(page.locator('.effect-title')).to_have_count(18)
    routes = ['/']+page.locator('.effect-title').evaluate_all('(ls)=>ls.map(a=>a.getAttribute("href"))')+['/guide']
    for width in [320,375,768,1280]:
        page.set_viewport_size({'width':width,'height':900})
        for route in routes:
            page.goto(BASE+route); expect(page.locator('h1')).to_be_visible()
            check(f'{route} {width} no page overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            check(f'{route} {width} landmarks and one h1', page.locator('main').count()==1 and page.locator('body > #root > header').count()==1 and page.locator('footer').count()==1 and page.locator('h1').count()==1 and page.locator('html').get_attribute('lang')=='zh-CN')
            controls = page.locator('a,button,input,select,textarea,[tabindex="0"]').evaluate_all('''els=>els.filter(e=>!e.disabled && e.tabIndex>=0 && e.getBoundingClientRect().width && e.getBoundingClientRect().height && getComputedStyle(e).visibility!=='hidden').map((e,i)=>{e.dataset.stage5Control=String(i);const r=e.getBoundingClientRect();return {id:String(i),text:(e.textContent||e.id).slice(0,40),w:r.width,h:r.height}})''')
            check(f'{route} {width} every control target >=44px', all(c['w']>=43.9 and c['h']>=43.9 for c in controls))
            if page.locator('#prompt').count():
                check(f'{route} {width} readable wrapping prompt', page.locator('#prompt').evaluate("e=>getComputedStyle(e).fontSize==='16px' && e.scrollWidth<=e.clientWidth+1"))
            # Actual keyboard traversal from document start: no programmatic focus of controls.
            reached=set()
            for _ in range(len(controls)+3):
                page.keyboard.press('Tab')
                state=page.evaluate("() => {const e=document.activeElement,s=getComputedStyle(e);return {id:e.dataset.stage5Control,focus:e.matches(':focus-visible'),width:parseFloat(s.outlineWidth),style:s.outlineStyle}}")
                if state.get('id') is not None:
                    reached.add(state['id'])
                    assert state['focus'] and state['width']>=2 and state['style']!='none', (route,width,state)
                if len(reached)==len(controls):break
            check(f'{route} {width} all {len(controls)} controls reached by Tab with visible focus', reached=={c['id'] for c in controls})
            # Tab/scroll reveals every region; reduced motion must still have no active loop.
            page.wait_for_timeout(80)
            check(f'{route} {width} reduced motion no running animations', page.evaluate("document.getAnimations().filter(a=>a.playState==='running' && a.effect.getTiming().duration>0).length") == 0)
    normal=browser.new_context(viewport={'width':1280,'height':900})
    n=normal.new_page()
    for slug,selector in [('card-tilt-3d','.tilt-area'),('card-flip','.flip-card'),('spotlight-card','.spotlight-card'),('magnetic-button','.magnetic-button'),('sliding-fill-button','.sliding-button'),('underline-slide-link','.underline-nav a')]:
        n.goto(BASE+'/effects/'+slug)
        node=n.locator(selector).first
        node.focus(); n.keyboard.press('Tab'); n.keyboard.press('Shift+Tab')
        expect(node).to_be_focused()
        if slug in ['card-tilt-3d','spotlight-card','magnetic-button']: n.keyboard.press('ArrowRight')
        n.wait_for_timeout(650)
        active = node.get_attribute('aria-pressed')=='true' if slug in ['card-flip','sliding-fill-button'] else n.locator('.spot-fill').evaluate("e=>getComputedStyle(e).opacity")=='1' if slug=='spotlight-card' else n.locator('.underline-nav a span').first.evaluate("e=>getComputedStyle(e).transform")=='matrix(1, 0, 0, 1, 0, 0)' if slug=='underline-slide-link' else 'rotateY(0deg)' not in n.locator('.tilt-card').get_attribute('style') if slug=='card-tilt-3d' else node.evaluate("e=>getComputedStyle(e).transform")!='matrix(1, 0, 0, 1, 0, 0)'
        check(slug+' normal keyboard activation before blur',active)
        n.keyboard.press('Tab'); n.wait_for_timeout(650)
        resting = node.get_attribute('aria-pressed')=='false' if slug in ['card-flip','sliding-fill-button'] else n.locator('.spot-fill').evaluate("e=>getComputedStyle(e).opacity")=='0' if slug=='spotlight-card' else n.locator('.underline-nav a span').first.evaluate("e=>getComputedStyle(e).transform")=='matrix(0, 0, 0, 1, 0, 0)' if slug=='underline-slide-link' else 'rotateY(0deg)' in n.locator('.tilt-card').get_attribute('style') if slug=='card-tilt-3d' else node.evaluate("e=>getComputedStyle(e).transform")=='matrix(1, 0, 0, 1, 0, 0)'
        check(slug+' Tab blur restores resting visual',resting)
    normal.close()
    # Observe cleanup on actual SPA unmount, retaining the same window.
    tracked=browser.new_context()
    tracked.add_init_script('''(() => {
      const raf=requestAnimationFrame, cancel=cancelAnimationFrame, timeout=setTimeout, clear=clearTimeout;
      window.stage5Frames=new Set(); window.stage5Timers=new Set();
      window.requestAnimationFrame=cb=>{let id=raf(t=>{stage5Frames.delete(id);cb(t)});stage5Frames.add(id);return id};
      window.cancelAnimationFrame=id=>{stage5Frames.delete(id);cancel(id)};
      window.setTimeout=(cb,ms,...args)=>{let id=timeout(()=>{stage5Timers.delete(id);cb(...args)},ms);stage5Timers.add(id);return id};
      window.clearTimeout=id=>{stage5Timers.delete(id);clear(id)};
    })();''')
    t=tracked.new_page()
    for route in routes[1:-1]:
        t.goto(BASE+route); expect(t.locator('h1')).to_be_visible()
        auto=t.get_by_role('button',name='自动演示 Auto demo',exact=True)
        if auto.count():auto.first.click()
        t.locator('header a[href="/guide"]').click()
        t.wait_for_timeout(500)
        check(route+' unmount clears pending demo frames/timers', t.evaluate('stage5Frames.size===0 && stage5Timers.size===0'))
    tracked.close()
    check('no runtime exceptions', not errors)
    check('no external runtime requests', not external)
    Path('/tmp/effect-stage5-results.json').write_text(json.dumps({'browser':browser.version,'base':BASE,'passed':len(results),'checks':results},ensure_ascii=False,indent=2))
    browser.close()
print(f'{len(results)}/{len(results)} passed')
