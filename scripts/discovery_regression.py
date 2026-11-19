"""Stage 2 Chromium integration checks; use existing Playwright/Chromium.
Start npm run dev -- --port 5173, then python3 scripts/discovery_regression.py.
No browser/dependency downloads. Touch checks use Chromium emulation.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:5173'
results = []
def check(name, condition=True):
    assert condition, name
    results.append(name)
    print('PASS', name, flush=True)

def slugs(page):
    return page.locator('.effect-card').evaluate_all('(nodes) => nodes.map(n => n.dataset.effect)')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':1280,'height':1000})
    page = context.new_page()
    errors, external = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('request', lambda request: external.append(request.url) if not request.url.startswith(BASE) else None)
    page.goto(BASE)
    expect(page.locator('.effect-card')).to_have_count(18)
    check('eighteen canonical gallery entries', slugs(page) == ['card-tilt-3d', 'typewriter', 'glassmorphism', 'card-flip', 'spotlight-card', 'magnetic-button', 'ripple-button', 'sliding-fill-button', 'gradient-text-shimmer', 'staggered-text-reveal', 'aurora-gradient', 'underline-slide-link', 'shrinking-sticky-header', 'parallax-scroll', 'scroll-reveal', 'skeleton-shimmer', 'pulsing-dots-loader', 'modal-scale-fade'])
    check('polite atomic result count', page.locator('.result-line p[role=status]').get_attribute('aria-live') == 'polite' and page.locator('.result-line p[role=status]').get_attribute('aria-atomic') == 'true')
    history = page.evaluate('history.length')
    search = page.get_by_label('搜索效果', exact=True)
    search.fill('鼠标移上去卡片跟着动')
    check('query does not commit immediately before debounce', page.evaluate('location.search') == '')
    expect(page.locator('.effect-card').first).to_have_attribute('data-effect','card-tilt-3d')
    expect(page.locator('.match-hint').first).to_contain_text('匹配：描述')
    page.wait_for_timeout(200)
    check('typing uses replace history', page.evaluate('history.length') == history and 'q=' in page.url)
    check('Chinese query ranks Tilt first', slugs(page)[0] == 'card-tilt-3d')
    for query, expected in [('a card that follows my mouse','card-tilt-3d'),('文字像打字一样出现','typewriter'),('frosted glass','glassmorphism'),('blur background','glassmorphism'),('毛玻璃','glassmorphism')]:
        search.fill(query); expect(page.locator('.active-summary')).to_contain_text(query)
        check(query + ' real UI top-three', expected in slugs(page)[:3])
    page.reload(); expect(search).to_have_value('毛玻璃')
    check('query survives refresh with matching result', slugs(page)[0] == 'glassmorphism')
    page.locator('[data-effect=glassmorphism] .effect-title').click(); page.go_back()
    expect(search).to_have_value('毛玻璃')
    check('history restores query and results', slugs(page)[0] == 'glassmorphism')
    page.get_by_role('button',name='清除搜索',exact=True).click()
    expect(page.locator('.effect-card')).to_have_count(18)
    check('search clear removes q parameter', 'q=' not in page.url)
    page.get_by_role('button',name='鼠标跟随',exact=True).click()
    page.get_by_role('button',name='卡片',exact=True).click()
    expect(page.locator('.effect-card')).to_have_count(2)
    check('AND filter narrows to Tilt and Spotlight', slugs(page) == ['card-tilt-3d','spotlight-card'])
    check('selected chip aria-pressed', page.get_by_role('button',name='鼠标跟随',exact=True).get_attribute('aria-pressed') == 'true')
    page.get_by_role('button',name='自动循环',exact=True).click()
    page.get_by_role('button',name='文字',exact=True).click()
    expect(page.locator('.effect-card')).to_have_count(4)
    check('OR inside both groups', slugs(page) == ['card-tilt-3d','typewriter','spotlight-card','gradient-text-shimmer'])
    url = page.url; page.reload()
    expect(page.locator('.effect-card')).to_have_count(4)
    check('URL restores all filters', page.url == url and page.get_by_role('button',name='文字',exact=True).get_attribute('aria-pressed') == 'true')
    page.get_by_role('button',name='动画',exact=True).click()
    expect(page.locator('.effect-card')).to_have_count(2)
    check('single type intersects other groups', slugs(page) == ['typewriter','gradient-text-shimmer'])
    page.get_by_role('button',name='交互',exact=True).click()
    expect(page.get_by_role('button',name='动画',exact=True)).to_have_attribute('aria-pressed','false')
    check('type is exclusive', page.get_by_role('button',name='动画',exact=True).get_attribute('aria-pressed') == 'false')
    search.fill('胡言乱语火星香蕉'); expect(page.locator('.active-summary')).to_contain_text('胡言乱语火星香蕉')
    expect(page.get_by_text('没有找到完全匹配的效果',exact=True)).to_be_visible()
    check('approximate results respect filters', set(slugs(page)) == {'card-tilt-3d','spotlight-card'} and page.locator('.match-hint').all_inner_texts() == ['相近推荐 · 不代表匹配']*2)
    page.get_by_role('button',name='清除筛选',exact=True).click()
    search.fill('胡言乱语火星香蕉'); expect(page.locator('.active-summary')).to_contain_text('胡言乱语火星香蕉')
    expect(page.locator('.effect-card')).to_have_count(3)
    check('nonsense shows three approximations with zero real matches', '共 0 个效果' in page.locator('.result-line p[role=status]').inner_text() and page.get_by_text('相近的效果',exact=True).count() == 1)
    check('trigger chips available in empty state', page.get_by_role('button',name='鼠标跟随',exact=True).count() == 1)
    for index in range(5):
        page.get_by_role('button',name='清除筛选',exact=True).click()
        query='胡言乱语火星香蕉'+str(index)
        search.fill(query)
        expect(page.locator('.active-summary')).to_contain_text(query)
        expect(search).to_have_value(query)
    check('rapid clear then type preserves newest input across replace updates')
    page.get_by_role('button',name='清除筛选',exact=True).click()
    expect(search).to_have_value('')
    check('clear resets URL and results', page.url == BASE+'/' and slugs(page) == ['card-tilt-3d', 'typewriter', 'glassmorphism', 'card-flip', 'spotlight-card', 'magnetic-button', 'ripple-button', 'sliding-fill-button', 'gradient-text-shimmer', 'staggered-text-reveal', 'aurora-gradient', 'underline-slide-link', 'shrinking-sticky-header', 'parallax-scroll', 'scroll-reveal', 'skeleton-shimmer', 'pulsing-dots-loader', 'modal-scale-fade'])
    search.focus(); page.keyboard.press('Tab')
    check('keyboard reaches first chip and visible focus', page.evaluate('document.activeElement.textContent') == '鼠标悬停' and page.evaluate('getComputedStyle(document.activeElement).outlineWidth') == '2px')
    page.keyboard.press('Space')
    expect(page.get_by_role('button',name='鼠标悬停',exact=True)).to_have_attribute('aria-pressed','true')
    check('Space toggles filter', page.get_by_role('button',name='鼠标悬停',exact=True).get_attribute('aria-pressed') == 'true')
    page.get_by_role('button',name='清除筛选',exact=True).click()
    tilt = page.locator('[data-effect=card-tilt-3d]')
    area = tilt.locator('.tilt-area'); area.scroll_into_view_if_needed()
    box = area.bounding_box(); page.mouse.move(box['x']+box['width']*.85,box['y']+box['height']*.75); page.wait_for_timeout(250)
    check('mini hover actually tilts without navigation', 'rotateY(0deg)' not in tilt.locator('.tilt-card').get_attribute('style') and page.url == BASE+'/')
    page.mouse.move(0,0); area.focus(); area.press('ArrowRight'); page.wait_for_timeout(200)
    check('mini focus and arrow key tilt', 'rotateY(0deg)' not in tilt.locator('.tilt-card').get_attribute('style'))
    area.press('Escape'); page.wait_for_timeout(450)
    check('mini Escape resets', 'rotateY(0deg)' in tilt.locator('.tilt-card').get_attribute('style'))
    tilt.get_by_role('button',name='自动演示 Auto demo').click(); page.wait_for_timeout(300)
    check('mini auto demo works', 'rotateY(0deg)' not in tilt.locator('.tilt-card').get_attribute('style'))
    tilt.get_by_role('button',name='停止 Stop').click()
    typ = page.locator('[data-effect=typewriter]'); typ.scroll_into_view_if_needed(); page.wait_for_timeout(1500)
    first = typ.locator('.typewriter').inner_text(); page.wait_for_timeout(300)
    check('visible continuous preview plays', typ.locator('.mini-preview').get_attribute('data-running') == 'true' and first != '│')
    typ.get_by_role('button',name='暂停 Pause').click(); text = typ.locator('.typewriter').inner_text(); page.wait_for_timeout(700)
    check('preview pause freezes characters and caret', typ.locator('.typewriter').inner_text() == text and typ.locator('.blink').count() == 0)
    typ.get_by_role('button',name='播放 Play').click()
    check('Play resumes paused text without resetting', typ.locator('.typewriter').inner_text() == text)
    page.set_viewport_size({'width':1280,'height':400}); page.evaluate('window.scrollTo(0,0)'); page.wait_for_timeout(200)
    text = typ.locator('.typewriter').inner_text(); page.wait_for_timeout(700)
    check('offscreen preview pauses', typ.locator('.mini-preview').get_attribute('data-running') == 'false' and typ.locator('.typewriter').inner_text() == text)
    typ.scroll_into_view_if_needed(); expect(typ.locator('.mini-preview')).to_have_attribute('data-running','true')
    check('reentry resumes preview')
    page.set_viewport_size({'width':1280,'height':1000})
    glass = page.locator('[data-effect=glassmorphism]')
    check('compact glass has real blur and no internal controls', glass.locator('.glass-card').evaluate('el => getComputedStyle(el).backdropFilter') == 'blur(16px) saturate(1.4)' and glass.locator('.glass-demo button').count() == 0)
    for width, columns in [(320,1),(375,1),(768,2),(1280,3),(1440,4)]:
        page.set_viewport_size({'width':width,'height':1000})
        check(f'{width}px no horizontal page scroll', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        check(f'{width}px grid has {columns} columns', page.locator('.gallery-grid').evaluate('el => getComputedStyle(el).gridTemplateColumns.split(" ").length') == columns)
        ratios = page.locator('.mini-preview').evaluate_all('(els) => els.map(el => el.getBoundingClientRect().width / el.getBoundingClientRect().height)')
        check(f'{width}px previews remain 16:10', all(abs(r-1.6)<.02 for r in ratios))
    page.set_viewport_size({'width':1280,'height':1000}); page.screenshot(path='/tmp/effect-stage2-desktop.png',full_page=True)
    tilt.locator('.effect-title').click(); expect(page).to_have_url(BASE+'/effects/card-tilt-3d')
    check('title navigation reaches canonical detail')
    page.go_back(); expect(page.locator('.effect-card')).to_have_count(18)
    glass.locator('.detail-link').click(); expect(page).to_have_url(BASE+'/effects/glassmorphism')
    check('explicit detail link navigates independently')

    reduced = browser.new_context(viewport={'width':1280,'height':1000},reduced_motion='reduce')
    rp = reduced.new_page(); rp.goto(BASE); expect(rp.locator('.effect-card')).to_have_count(18)
    rt = rp.locator('[data-effect=typewriter]'); rt.scroll_into_view_if_needed()
    text = rt.locator('.typewriter').inner_text(); rp.wait_for_timeout(1400)
    check('reduced preview static full first phrase', len(text)>1 and rt.locator('.typewriter').inner_text()==text and rt.locator('.blink').count()==0 and rt.locator('.mini-preview').get_attribute('data-running')=='false')
    rt.get_by_role('button',name='播放 Play').click()
    expect(rt.locator('.mini-preview')).to_have_attribute('data-running','true')
    expect(rt.locator('.typewriter')).to_have_attribute('data-phase','typing')
    check('explicit reduced Play runs', rt.locator('.typewriter').inner_text()!=text)
    expect(rt.locator('.typewriter')).to_have_attribute('data-phase','done',timeout=20000)
    final = rt.locator('.typewriter').inner_text(); rp.wait_for_timeout(800)
    check('reduced Play finishes one traversal', final=='从看见到实现│' and rt.locator('.typewriter').inner_text()==final and rt.locator('.blink').count()==0)
    rt.get_by_role('button',name='重播 Replay').click()
    check('reduced Replay restarts', rt.locator('.typewriter').get_attribute('data-phase')!='done')
    ri = rp.locator('[data-effect=card-tilt-3d]'); ri.locator('.tilt-area').focus(); rp.wait_for_timeout(200)
    check('reduced tilt focus stays static', 'rotateY(0deg)' in ri.locator('.tilt-card').get_attribute('style'))
    ri.get_by_role('button',name='自动演示 Auto demo').click(); rp.wait_for_timeout(300)
    check('reduced mini Auto explicitly moves', 'rotateY(0deg)' not in ri.locator('.tilt-card').get_attribute('style'))
    rp.wait_for_timeout(4300)
    check('reduced mini Auto returns to rest', 'rotateY(0deg)' in ri.locator('.tilt-card').get_attribute('style'))

    touch = browser.new_context(viewport={'width':375,'height':700},has_touch=True,is_mobile=True)
    tp = touch.new_page(); tp.goto(BASE); expect(tp.locator('.effect-card')).to_have_count(18)
    ta=tp.locator('.tilt-area'); ta.scroll_into_view_if_needed(); box=ta.bounding_box()
    session=touch.new_cdp_session(tp)
    x=box['x']+box['width']*.8; y=box['y']+box['height']*.6
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]}); tp.wait_for_timeout(200)
    check('touch tap activates real tilt without navigating', 'rotateY(0deg)' not in tp.locator('.tilt-card').get_attribute('style') and tp.url==BASE+'/')
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    ta.scroll_into_view_if_needed(); box=ta.bounding_box(); before=tp.evaluate('scrollY')
    x=box['x']+box['width']/2; y=box['y']+box['height']*.8
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    for d in [20,45,75,100]:
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-d}]}); tp.wait_for_timeout(40)
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]}); tp.wait_for_timeout(200)
    check('vertical swipe over mini preview scrolls page', tp.evaluate('scrollY')>before)
    check('touch controls meet 44px height', tp.locator('button').evaluate_all('(els)=>els.every(el=>el.getBoundingClientRect().height>=44)'))
    # Nine copies of the existing Typewriter are test fixtures, not catalogue entries.
    page.goto(BASE+'/unknown')
    page.set_viewport_size({'width':1280,'height':1000})
    page.evaluate("""async () => {
      const source = await (await fetch('/src/main.tsx')).text();
      const dependency = (name) => source.split('\"').find(part => part.startsWith('/node_modules/') && part.includes('/'+name+'.js?'));
      const { default: React } = await import(dependency('react'));
      const { default: ReactDOM } = await import(dependency('react-dom_client'));
      const { MemoryRouter } = await import(dependency('react-router-dom'));
      const { EffectCard } = await import('/src/components/EffectCard.tsx');
      const { publishedEffects } = await import('/src/content/index.ts');
      const fixture = document.createElement('div'); fixture.className = 'budget-fixture';
      fixture.style.cssText = 'position:fixed;inset:0;background:white;display:grid;grid-template-columns:repeat(3,200px);grid-auto-rows:125px;z-index:10';
      document.body.append(fixture);
      const style = document.createElement('style'); style.textContent = '.budget-fixture .card-body{display:none}'; document.head.append(style);
      const root = ReactDOM.createRoot(fixture); const effect = publishedEffects.find(e=>e.slug==='typewriter');
      const render = (start) => root.render(React.createElement(MemoryRouter,null,Array.from({length:9-start},(_,offset)=>{ const i=offset+start; return React.createElement(EffectCard,{key:i,hit:{effect:{...effect,id:'fixture-'+i,slug:'fixture-'+i},score:0,matchedField:'',matchedText:''}}) })));
      window.renderBudgetFixture = render; window.cleanupBudgetFixture = () => { root.unmount(); fixture.remove(); style.remove(); }; render(0);
    }""")
    expect(page.locator('.budget-fixture [data-running=true]')).to_have_count(6)
    check('nine real preview instances run at most six', page.locator('.budget-fixture [data-running=false]').count()==3)
    check('waiting preview shows static representative frame', page.locator('[data-effect=fixture-8] .typewriter').inner_text()=='让灵感逐字出现│')
    page.evaluate('window.renderBudgetFixture(1)')
    expect(page.locator('[data-effect=fixture-6] .mini-preview')).to_have_attribute('data-running','true')
    check('unmount releases a budget slot to waiting preview', page.locator('.budget-fixture [data-running=true]').count()==6)
    page.evaluate('window.cleanupBudgetFixture()')
    check('no runtime page errors',errors==[])
    check('no external runtime requests',external==[])
    browser.close()
Path('/tmp/effect-stage2-discovery.json').write_text(json.dumps({'passed':len(results),'checks':results},ensure_ascii=False,indent=2))
print('TOTAL',len(results))
