"""H6 magnetic sensing-area regression in existing Chromium (no downloads).
Run after npm run dev -- --port 5173. Physical touch / other browsers not claimed.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE = 'http://127.0.0.1:5173'
checks = []
def check(name, ok):
    assert ok, name
    checks.append(name)
    print('PASS', name, flush=True)
def displacement(page):
    return page.locator('.demo-stage .magnetic-button').evaluate('e => {const m=new DOMMatrix(getComputedStyle(e).transform);return [m.m41,m.m42]}')
def setup(page, radius):
    page.goto(BASE+'/effects/magnetic-button')
    page.locator('#param-radius').fill(str(radius))
    page.locator('.magnetic-area').scroll_into_view_if_needed()
    page.wait_for_timeout(120)
def point(page, dy):
    area=page.locator('.magnetic-area').bounding_box()
    x=area['x']+area['width']/2
    y=area['y']+area['height']/2+dy
    return x,y,area
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1280,'height':1000})
    page=context.new_page()
    setup(page,160)
    # Original independent H6 reproduction, checked before any new geometry assumption.
    for dy in [140,155]:
        x,y,_=point(page,dy);page.mouse.move(x,y);page.wait_for_timeout(650)
        shift=displacement(page)
        check('H6 center +'+str(dy)+'px stays attracted at radius 160',abs(shift[0])<.1 and abs(shift[1]-14)<.1)
    for width in [320,768,1280]:
        page.set_viewport_size({'width':width,'height':1000})
        for radius in [40,80,160]:
            setup(page,radius)
            for sign in [-1,1]:
                inside=sign*(26+radius-2)
                outside=sign*(26+radius+12)
                x,y,area=point(page,inside)
                check(f'{width}/{radius}/{sign} inner point inside real listener',area['y']<y<area['y']+area['height'])
                page.mouse.move(x,y);page.wait_for_timeout(180)
                check(f'{width}/{radius}/{sign} attracts inside radius',abs(displacement(page)[1]-sign*14)<.1)
                # Moving the button cannot shift its resting center/range.
                page.wait_for_timeout(350)
                check(f'{width}/{radius}/{sign} stationary pointer stable',abs(displacement(page)[1]-sign*14)<.1)
                x,y,area=point(page,outside)
                check(f'{width}/{radius}/{sign} outer point still in listener',area['y']<y<area['y']+area['height'])
                page.mouse.move(x,y);page.wait_for_timeout(600)
                check(f'{width}/{radius}/{sign} outside radius returns within listener',all(abs(v)<.1 for v in displacement(page)))
        check(str(width)+' no page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    # Browser CSS-pixel geometry must stay stable on a high-density device.
    high=browser.new_context(viewport={'width':768,'height':1000},device_scale_factor=2)
    hp=high.new_page();setup(hp,160);x,y,_=point(hp,155);hp.mouse.move(x,y);hp.wait_for_timeout(650)
    check('DPR 2 retains +155px attraction',abs(displacement(hp)[1]-14)<.1)
    zoom=high.new_cdp_session(hp)
    zoom.send('Emulation.setPageScaleFactor',{'pageScaleFactor':1.25})
    hp.wait_for_timeout(120)
    check('browser visual viewport scale is 1.25',hp.evaluate('visualViewport.scale')==1.25)
    x,y,_=point(hp,155);hp.mouse.move(x,y);hp.wait_for_timeout(650)
    check('125% viewport zoom keeps +155px attraction',abs(displacement(hp)[1]-14)<.1)
    x,y,_=point(hp,198);hp.mouse.move(x,y);hp.wait_for_timeout(650)
    check('125% viewport zoom returns outside radius',all(abs(v)<.1 for v in displacement(hp)))
    reduced=browser.new_context(viewport={'width':768,'height':1000},reduced_motion='reduce')
    rp=reduced.new_page();setup(rp,160);x,y,_=point(rp,155);rp.mouse.move(x,y);rp.wait_for_timeout(650)
    check('reduced motion +155px remains static',all(abs(v)<.1 for v in displacement(rp)))
    rp.get_by_role('button',name='自动演示 Auto demo',exact=True).click();rp.wait_for_timeout(350)
    check('reduced Auto still moves',sum(abs(v) for v in displacement(rp))>1)
    rp.wait_for_timeout(4300);check('reduced Auto ends at rest',all(abs(v)<.1 for v in displacement(rp)))
    touch=browser.new_context(viewport={'width':375,'height':1000},has_touch=True,is_mobile=True)
    tp=touch.new_page();setup(tp,160);x,y,_=point(tp,155);session=touch.new_cdp_session(tp)
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]});tp.wait_for_timeout(250)
    check('touch contact reaches +155px sensing area',abs(displacement(tp)[1]-14)<.1)
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});tp.wait_for_timeout(600)
    check('touch release returns to rest',all(abs(v)<.1 for v in displacement(tp)))
    tp.goto(BASE);card=tp.locator('[data-effect=magnetic-button]');card.scroll_into_view_if_needed()
    area=card.locator('.magnetic-area').bounding_box();preview=card.locator('.mini-preview').bounding_box()
    check('compact listener stays inside preview',area['height']<=preview['height'] and area['width']<=preview['width'])
    check('compact keeps 16:10 frame',abs(preview['width']/preview['height']-1.6)<.02)
    card.get_by_role('button',name='自动演示 Auto demo').tap();tp.wait_for_timeout(350)
    check('compact touch Auto retains movement without navigation',tp.url==BASE+'/' and card.locator('.magnetic-button').evaluate('e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.hypot(m.m41,m.m42)>1}'))
    browser.close()
Path('/tmp/effect-magnetic-boundary.json').write_text(json.dumps({'passed':len(checks),'checks':checks},ensure_ascii=False,indent=2))
print('TOTAL',len(checks))
