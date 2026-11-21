"""ED-001–003 Chromium regression. Existing Playwright/Pillow only; no installs.
AUDIT_BASE defaults to the local dev server. Screenshots stay outside the repo.
Transition clocks are paused at intermediate frames for repeatable pixel checks.
"""
import io
import os
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('AUDIT_BASE', 'http://127.0.0.1:5173')
OUT = Path('/tmp/effect-editorial-frames')
OUT.mkdir(exist_ok=True)
checks = []

def check(name, condition):
    assert condition, name
    checks.append(name)

def css(node, prop):
    return node.evaluate('(el, p) => getComputedStyle(el)[p]', prop)

def visit(page, slug):
    page.goto(BASE + '/effects/' + slug)
    page.locator('.demo-stage').scroll_into_view_if_needed()
    page.mouse.move(0, 0)

def freeze(button, fraction):
    button.evaluate('''(el, fraction) => {
      for (const animation of el.getAnimations({subtree:true})) {
        animation.pause();
        animation.currentTime = animation.effect.getTiming().duration * fraction;
      }
    }''', fraction)

def finish(button):
    button.evaluate('el => el.getAnimations({subtree:true}).forEach(a => a.finish())')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':1280,'height':900}, permissions=['clipboard-read','clipboard-write'])
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    for width in [120, 160, 240]:
        for duration in [100, 300, 800]:
            visit(page, 'sliding-fill-button')
            page.locator('#param-width').fill(str(width))
            page.locator('#param-duration').fill(str(duration))
            button = page.locator('.sliding-button')
            button.scroll_into_view_if_needed()
            resting = Image.open(io.BytesIO(button.screenshot())).convert('RGB')
            # Solid glyph interiors, excluding the border and antialiased edges.
            ink = [(x,y) for x in range(8, width-8) for y in range(12,40)
                   if max(abs(a-b) for a,b in zip(resting.getpixel((x,y)), (67,56,202))) < 8]
            check(f'{width}/{duration} reference glyph pixels', len(ink) > 30)
            for phase in ['entry', 'exit']:
                if phase == 'entry':
                    button.hover()
                else:
                    page.mouse.move(0, 0)
                page.wait_for_timeout(20)
                for fraction in [.125, .5, .875]:
                    freeze(button, fraction)
                    shot = Image.open(io.BytesIO(button.screenshot())).convert('RGB')
                    shot.save(OUT / f'{width}-{duration}-{phase}-{fraction}.png')
                    compared = 0
                    for x,y in ink:
                        # Background near each glyph column identifies the clipped fill.
                        bg = shot.getpixel((x, 8))
                        neighbors = [shot.getpixel((max(2,min(width-3,x+d)),8)) for d in [-2,2]]
                        if any(max(abs(a-b) for a,b in zip(bg,n)) > 10 for n in neighbors):
                            continue  # Exclude the moving clip's antialiased edge only.
                        expected = (255,255,255) if bg[0] < 100 else (67,56,202)
                        actual = shot.getpixel((x,y))
                        assert max(abs(a-b) for a,b in zip(actual,expected)) < 45, (width,duration,phase,fraction,x,y,actual,expected)
                        compared += 1
                    check(f'{width}/{duration} {phase} {fraction} readable stationary glyphs', compared > 30)
                finish(button)
                page.wait_for_timeout(30)
            expect(button).to_have_accessible_name('向前一步')
            check(f'{width}/{duration} single accessible label', button.locator('[aria-hidden=true]').count() == 1)
    visit(page, 'sliding-fill-button')
    button = page.locator('.sliding-button')
    button.focus()
    expect(button).to_have_attribute('aria-pressed', 'true')
    button.press('Space')
    expect(button).to_have_attribute('aria-pressed', 'false')
    check('keyboard focus and activation', True)
    # Interrupt both directions; paired transforms must still cancel exactly.
    for entering in [True, False, True]:
        button.hover() if entering else page.mouse.move(0,0)
        page.wait_for_timeout(45)
        freeze(button, .4)
        offsets = button.locator('.sliding-fill, .sliding-label-copy').evaluate_all('els => els.map(el => new DOMMatrix(getComputedStyle(el).transform).m41)')
        check('interrupted label stays stationary', abs(sum(offsets)) < .01)
        button.evaluate('el => el.getAnimations({subtree:true}).forEach(a => a.play())')
    for language, phrase in [('English','Show white text only over the accent fill'), ('中文','填色范围内显示白字')]:
        page.get_by_role('button', name=language, exact=True).click()
        text = page.locator('#prompt').input_value()
        check(language + ' truthful prompt', phrase in text and 'scaleX' not in text)
        page.locator('button.primary').click()
        expect(page.locator('p[role=status]')).to_have_text('已复制到剪贴板')
        check(language + ' actual copied prompt', page.evaluate('navigator.clipboard.readText()') == text)
    visit(page, 'ripple-button')
    check('opacity label', page.locator('label[for=param-opacity]').inner_text().startswith('起始不透明度'))
    check('opacity value preserved', page.locator('#param-opacity').input_value() == '0.35')
    reduced = browser.new_context(reduced_motion='reduce', viewport={'width':1280,'height':900})
    rp = reduced.new_page()
    visit(rp, 'sliding-fill-button')
    button = rp.locator('.sliding-button')
    button.hover(); button.focus()
    expect(button).to_have_attribute('aria-pressed', 'false')
    button.press('Enter')
    expect(button).to_have_attribute('aria-pressed', 'true')
    check('reduced direct activation has no transition', button.evaluate('el => el.getAnimations({subtree:true}).length') == 0)
    button.press('Space')
    expect(button).to_have_attribute('aria-pressed', 'false')
    check('reduced exit has no transition', css(rp.locator('.sliding-fill'), 'transitionDuration') == '0s')
    visit(rp, 'card-tilt-3d')
    card = rp.locator('.tilt-card'); area = rp.locator('.tilt-area')
    shadow = css(card, 'boxShadow'); transform = css(card, 'transform')
    area.hover()
    check('reduced hover static feedback', css(card,'boxShadow') != shadow and css(card,'transform') == transform and card.evaluate('el => el.getAnimations().length') == 0)
    rp.mouse.move(0,0)
    check('reduced hover feedback clears', css(card,'boxShadow') == shadow)
    area.focus()
    check('reduced focus feedback retained', css(card,'borderTopWidth') == '2px')
    rp.get_by_role('button',name='自动演示 Auto demo').click(); rp.wait_for_timeout(250)
    check('reduced explicit tilt Auto retained', css(card,'transform') != transform)
    touch = browser.new_context(has_touch=True, is_mobile=True, reduced_motion='reduce', viewport={'width':375,'height':700})
    tp = touch.new_page(); visit(tp,'sliding-fill-button')
    tp.locator('.sliding-button').tap()
    expect(tp.locator('.sliding-button')).to_have_attribute('aria-pressed','true')
    check('reduced touch instant toggle', tp.locator('.sliding-button').evaluate('el => el.getAnimations({subtree:true}).length') == 0)
    visit(tp, 'card-tilt-3d')
    area = tp.locator('.tilt-area'); card = tp.locator('.tilt-card')
    shadow = css(card, 'boxShadow')
    area.dispatch_event('pointerdown', {'pointerType':'touch','buttons':1,'clientX':180,'clientY':200})
    check('reduced touch static feedback', css(card,'boxShadow') != shadow and card.evaluate('el => el.getAnimations().length') == 0)
    area.dispatch_event('pointercancel', {'pointerType':'touch'})
    check('touch cancellation clears feedback', css(card,'boxShadow') == shadow)
    check('no page errors', not errors)
    browser.close()
print(f'PASS {len(checks)} editorial checks; intermediate screenshots: {OUT}')
