"""EL-IR-003: rendered glyph contrast, not computed CSS color or SVG bounds.

Run Vite in this checkout on 5183, then python3 scripts/el_ir_003_shimmer_contrast.py.
EL_IR_003_BASE can point at another local build. Requires existing Playwright,
Chromium and Pillow; installs nothing. Writes evidence only under /tmp.

The browser pauses the existing CSS animation at 25 evenly spaced phases plus
band-centre crossings of six glyph positions. Screenshots retain real paints.
A separate black silhouette (band hidden) identifies fully covered glyph pixels;
a 3x3 erosion excludes antialias edges. A text-hidden screenshot measures the
actual background at those same coordinates. Original fills/visibility are
restored before every color sample. Both mask captures are test-only and are
never used as the foreground color evidence. All sampled core pixels must meet
4.5:1; failures collect rather than abort so every scenario remains inspectable.
"""
import io
import json
import os
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('EL_IR_003_BASE', 'http://127.0.0.1:5183')
OUT = Path('/tmp/el-ir-003-shimmer')
PARAMS = [(2.5, 20), (1, 10), (1, 40), (6, 10), (6, 40)]
LINEAR = [v / 255 / 12.92 if v / 255 <= .04045 else ((v / 255 + .055) / 1.055) ** 2.4 for v in range(256)]


def luminance(rgb):
    return sum(LINEAR[c] * w for c, w in zip(rgb, (.2126, .7152, .0722)))


def screenshot(svg):
    return Image.open(io.BytesIO(svg.screenshot(animations='allow'))).convert('RGB')


def settle(page):
    page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')


def core_pixels(page, svg):
    # Mask fully opaque interiors, without guessing from actual foreground hue.
    original = svg.evaluate('''e => {
      const text=e.querySelector(':scope > text'), band=e.querySelector(':scope > g');
      const old={fill:text.getAttribute('fill'),textStyle:text.getAttribute('style'),bandStyle:band.getAttribute('style')};
      text.style.visibility='hidden';band.style.visibility='hidden';return old;
    }''')
    settle(page)
    background = screenshot(svg)
    svg.evaluate("e => {const t=e.querySelector(':scope > text');t.style.visibility='visible';t.setAttribute('fill','#000000');}")
    settle(page)
    mask = screenshot(svg)
    svg.evaluate('''(e,old) => {
      const t=e.querySelector(':scope > text'), b=e.querySelector(':scope > g');
      t.setAttribute('fill',old.fill);
      for(const [node,style] of [[t,old.textStyle],[b,old.bandStyle]]) {
        if(style===null)node.removeAttribute('style');else node.setAttribute('style',style);
      }
    }''', original)
    settle(page)
    width, height = mask.size
    pixels = mask.load()
    points = [(x,y) for y in range(1,height-1) for x in range(1,width-1)
              if all(max(pixels[x+dx,y+dy]) <= 1 for dx in (-1,0,1) for dy in (-1,0,1))]
    assert len(points) >= 100, ('insufficient interior pixels',len(points),mask.size)
    return points, background


def sample(page, svg, points, background, label, phase):
    settle(page)
    actual = screenshot(svg)
    assert actual.size == background.size
    ap, bp = actual.load(), background.load()
    worst = (100, None, None, None)
    failures = 0
    for point in points:
        fg, bg = ap[point], bp[point]
        l1, l2 = luminance(fg), luminance(bg)
        ratio = (max(l1,l2)+.05)/(min(l1,l2)+.05)
        if ratio < 4.5: failures += 1
        if ratio < worst[0]: worst = (ratio,point,fg,bg)
    return {'phase':phase,'min_contrast':worst[0],'point':worst[1],
            'foreground':worst[2],'background':worst[3],'failing_pixels':failures,
            'interior_pixels':len(points)}, actual


def main():
    OUT.mkdir(exist_ok=True)
    results, errors = [], []
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        for width in [375,1280]:
            for mode in ['no-preference','reduce']:
                context=browser.new_context(viewport={'width':width,'height':1000},device_scale_factor=2,reduced_motion=mode)
                page=context.new_page();page.on('pageerror',lambda error:errors.append(str(error)))
                for surface in ['gallery','detail']:
                    for duration,band_width in ([(2.5,20)] if surface=='gallery' else PARAMS):
                        label=f'{surface}-{width}-{mode}-{duration}-{band_width}'
                        page.goto(BASE+('/' if surface=='gallery' else '/effects/gradient-text-shimmer'))
                        svg=page.locator('[data-effect="gradient-text-shimmer"] .text-shimmer' if surface=='gallery' else '.demo-stage .text-shimmer')
                        if surface=='detail':
                            page.locator('#param-duration').fill(str(duration));page.locator('#param-bandWidth').fill(str(band_width))
                        expect(svg).to_be_visible();page.wait_for_timeout(150);svg.scroll_into_view_if_needed();settle(page)
                        band=svg.locator('.shimmer-band')
                        expect(band).to_have_attribute('width',str(600*band_width//100))
                        state=band.evaluate('e => {const a=e.getAnimations()[0];return {state:a.playState,duration:a.effect.getTiming().duration}}')
                        assert state['duration']==duration*1000
                        assert state['state']==('paused' if mode=='reduce' else 'running'),(label,state)
                        band.evaluate('e => {const a=e.getAnimations()[0];a.pause();a.currentTime=0}')
                        points,background=core_pixels(page,svg)
                        phases=[0] if mode=='reduce' else sorted(set([i/24 if i<24 else .999 for i in range(25)]+[(x+3*band_width)/840 for x in [150,210,270,330,390,450]]))
                        frames=[];worst_image=None;worst_ratio=100;first_image=None;changed=0
                        for phase in phases:
                            band.evaluate('(e,time) => {const a=e.getAnimations()[0];a.pause();a.currentTime=time}',phase*duration*1000)
                            result,actual=sample(page,svg,points,background,label,phase);frames.append(result)
                            if first_image is None:first_image=actual
                            else:
                                changed=max(changed,sum(max(abs(a-b) for a,b in zip(actual.getpixel(point),first_image.getpixel(point)))>=10 for point in points))
                            if result['min_contrast']<worst_ratio:worst_ratio=result['min_contrast'];worst_image=actual
                        if mode=='no-preference':assert changed>=20,('sweep lost visible color change',label,changed)
                        else:
                            before=band.evaluate('e=>getComputedStyle(e).transform');page.wait_for_timeout(100)
                            assert band.evaluate('e=>getComputedStyle(e).transform')==before
                        worst_image.save(OUT/(label+'.png'))
                        item={'scenario':label,'frames':frames,'min_contrast':worst_ratio,'changed_core_pixels':changed}
                        results.append(item)
                        print(label,'frames',len(frames),'interior',len(points),'minimum',round(worst_ratio,4),'changed',changed,flush=True)
                context.close()
        browser.close()
    summary={'scenarios':len(results),'frames':sum(len(x['frames']) for x in results),'minimum':min(x['min_contrast'] for x in results),'results':results,'runtime_errors':errors}
    (OUT/'results.json').write_text(json.dumps(summary,indent=2))
    assert not errors,errors
    failed=[x['scenario'] for x in results if x['min_contrast']<4.5]
    assert not failed, f'Glyph-core contrast below 4.5:1 in {failed}; evidence: {OUT}/results.json'
    print('PASS',summary['scenarios'],'scenarios',summary['frames'],'rendered frames; minimum',summary['minimum'])


if __name__=='__main__':main()
