"""EL-IR-001: real Chromium against a production preview, no downloads.
Usage: npm run build && npm run preview -- --port 4181
       python3 scripts/el_ir_001_search_regression.py [http://127.0.0.1:4181]
Returns failure for missing true results (approximate recommendations never count).
"""
import sys
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4181'
CASES = [
    ('点按钮后圆圈向外扩散', 'ripple-button'),
    ('点击按钮时圆圈向外散开', 'ripple-button'),
    ('鼠标移到按钮上颜色从左往右填满', 'sliding-fill-button'),
    ('文字下面出现一条线', 'underline-slide-link'),
    ('卡片向上移动并慢慢显示', 'scroll-reveal'),
    ('按下按钮后出现扩散的圆圈', 'ripple-button'),
    ('在按钮上轻点，圆形向外扩散', 'ripple-button'),
    ('按钮里圆圈散开然后消失', 'ripple-button'),
    ('指针移入按钮，颜色从左边填满', 'sliding-fill-button'),
    ('悬停按钮时背景颜色向右填充', 'sliding-fill-button'),
    ('链接的文字下面长出细线', 'underline-slide-link'),
    ('文字下方的横线向右展开', 'underline-slide-link'),
    ('卡片慢慢显示并向上滑动', 'scroll-reveal'),
    ('滚动页面时卡片上移并淡入', 'scroll-reveal'),
    ('a circle expands inside a button', 'ripple-button'),
    ('button color fills from the left', 'sliding-fill-button'),
    ('a line appears below a link', 'underline-slide-link'),
    ('cards fade into view on scroll', 'scroll-reveal'),
]
failures = []
checks = 0
def check(label, condition, detail=''):
    global checks
    checks += 1
    print(('PASS' if condition else 'FAIL'), label, detail, flush=True)
    if not condition:
        failures.append(label)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page(reduced_motion='reduce')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE)
    for query, slug in CASES:
        page.locator('#effect-search').fill(query)
        expect(page.locator('.active-summary')).to_contain_text(query)
        cards = page.locator('.effect-card')
        actual = cards.evaluate_all('(els)=>els.filter(e=>e.querySelector(".match-hint")?.textContent.startsWith("匹配：")).map(e=>e.dataset.effect)')
        check(query, slug in actual[:3], 'rank='+str(actual.index(slug)+1 if slug in actual else None)+' top3='+str(actual[:3]))
    page.locator('#effect-search').fill(CASES[0][0])
    expect(page.locator('.active-summary')).to_contain_text(CASES[0][0])
    page.get_by_role('button', name='按钮', exact=True).click()
    page.get_by_role('button', name='点击', exact=True).click()
    expect(page.get_by_role('button',name='点击',exact=True)).to_have_attribute('aria-pressed','true')
    check('category AND trigger retains true Ripple', page.locator('[data-effect=ripple-button] .match-hint').count()==1 and page.locator('[data-effect=ripple-button] .match-hint').inner_text().startswith('匹配：'))
    page.reload()
    expect(page.locator('#effect-search')).to_have_value(CASES[0][0])
    check('URL restores query and intersection', page.get_by_role('button',name='按钮',exact=True).get_attribute('aria-pressed')=='true' and page.get_by_role('button',name='点击',exact=True).get_attribute('aria-pressed')=='true')
    page.get_by_role('button',name='点击',exact=True).click()
    page.get_by_role('button',name='鼠标悬停',exact=True).click()
    expect(page.get_by_role('button',name='鼠标悬停',exact=True)).to_have_attribute('aria-pressed','true')
    check('excluded Ripple never leaks into results or recommendations', page.locator('[data-effect=ripple-button]').count()==0)
    page.get_by_role('button',name='清除筛选',exact=True).click()
    page.locator('#effect-search').fill('胡言乱语火星香蕉')
    expect(page.locator('.active-summary')).to_contain_text('胡言乱语火星香蕉')
    check('nonsense stays clearly approximate', page.get_by_text('没有找到完全匹配的效果',exact=True).count()==1 and page.locator('.match-hint').evaluate_all('(els)=>els.length===3 && els.every(e=>!e.textContent.startsWith("匹配："))'))
    check('no runtime errors', not errors)
    browser.close()
print(f'{checks-len(failures)}/{checks} passed')
sys.exit(bool(failures))
