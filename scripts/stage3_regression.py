"""Stage 3 real Chromium checks; npm run dev -- --port 5173 first.
Uses the environment's existing Python Playwright and Chromium; no downloads.
"""
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE='http://127.0.0.1:5173'
SLUGS=['card-flip','spotlight-card','magnetic-button','ripple-button','sliding-fill-button','gradient-text-shimmer','staggered-text-reveal']
SELECTORS=['.flip-card','.spotlight-card','.magnetic-button','.ripple-button','.sliding-button','.text-shimmer','.staggered-text']
PARAMS={
 'card-flip':{'duration':(800,'ms'),'axis':('horizontal','')},
 'spotlight-card':{'radius':(300,'px'),'intensity':(.3,'')},
 'magnetic-button':{'strength':(.5,''),'radius':(120,'px')},
 'ripple-button':{'duration':(1000,'ms'),'opacity':(.5,'')},
 'sliding-fill-button':{'duration':(600,'ms'),'width':(200,'px')},
 'gradient-text-shimmer':{'duration':(4,'s'),'bandWidth':(30,'%')},
 'staggered-text-reveal':{'stagger':(100,'ms'),'duration':(800,'ms'),'distance':(30,'px')},
}
results=[]
def check(name,condition=True):
 assert condition,name
 results.append(name); print('PASS',name,flush=True)
def css(locator,prop): return locator.evaluate('(el,p)=>getComputedStyle(el)[p]',prop)
def move(page,locator,x=.8,y=.3):
 locator.scroll_into_view_if_needed();page.wait_for_timeout(60)
 b=locator.bounding_box();page.mouse.move(b['x']+b['width']*x,b['y']+b['height']*y)
def goto(page,slug):
 page.goto(BASE+'/effects/'+slug);expect(page.locator('.demo-stage')).to_be_visible()
 page.locator('.demo-stage').scroll_into_view_if_needed();page.wait_for_timeout(80)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1280,'height':900},permissions=['clipboard-read','clipboard-write'])
 page=context.new_page();errors=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
 page.goto(BASE);expect(page.locator('.effect-card')).to_have_count(10)
 check('exactly ten implemented homepage entries and canonical paths',page.locator('.effect-title').evaluate_all('(a)=>a.map(n=>n.getAttribute("href"))')==['/effects/'+s for s in ['card-tilt-3d','typewriter','glassmorphism']+SLUGS])
 for slug,selector in zip(SLUGS,SELECTORS):
  card=page.locator('[data-effect='+slug+']');card.scroll_into_view_if_needed();expect(card.locator(selector)).to_be_visible()
  check(slug+' compact real DOM present')
  if card.get_by_role('button',name='自动演示 Auto demo').count():
   card.get_by_role('button',name='自动演示 Auto demo').click();page.wait_for_timeout(220)
   check(slug+' gallery Auto started without navigation',card.get_by_role('button',name='停止 Stop').count()==1 and page.url==BASE+'/')
   card.get_by_role('button',name='停止 Stop').click()
  elif slug=='ripple-button':
   card.locator(selector).click();check('gallery ripple is animated',card.locator('.ripple-wave').count()>0)
  elif slug=='gradient-text-shimmer':
   a=css(card.locator('.shimmer-band'),'transform');page.wait_for_timeout(180);check('gallery shimmer moves',a!=css(card.locator('.shimmer-band'),'transform'))
  elif slug=='staggered-text-reveal':
   card.get_by_role('button',name='重播 Replay').click();page.wait_for_timeout(80);check('gallery reveal animates words',float(css(card.locator('.reveal-word').last,'opacity'))<1)
 for slug,selector in zip(SLUGS,SELECTORS):
  goto(page,slug);expect(page.locator('h1')).to_be_visible();expect(page.locator('.demo-stage '+selector)).to_be_visible()
  check(slug+' detail renders real effect')
  related=page.locator('a[href^="/effects/"]').evaluate_all('(a)=>a.map(n=>n.getAttribute("href"))')
  check(slug+' related links resolve to implemented effects',len(related)>0 and all(u.split('/')[-1] in SLUGS+['card-tilt-3d','typewriter','glassmorphism'] for u in related))
  for key,(value,unit) in PARAMS[slug].items():
   control=page.locator('#param-'+key)
   if key=='axis':control.select_option(value)
   else:control.fill(str(value))
  for lang in ['English','中文']:
   page.get_by_role('button',name=lang,exact=True).click();text=page.locator('#prompt').input_value()
   check(slug+' '+lang+' every changed value and units aligned',all(str(v)+u in text for v,u in PARAMS[slug].values()) and '{{' not in text and not re.search(r'\d(?:msms|ss|%%|pxpx)',text))
   page.get_by_role('button',name='复制提示词',exact=True).click();expect(page.locator('p[role=status]')).to_have_text('已复制到剪贴板')
   check(slug+' '+lang+' actual clipboard exact',page.evaluate('navigator.clipboard.readText()')==text)
  page.locator('.demo-stage').scroll_into_view_if_needed()
  if slug=='card-flip':
   move(page,page.locator('.flip-card'));page.wait_for_timeout(850)
   check('flip axis and duration apply', 'rotateX(180deg)' in page.locator('.flip-inner').get_attribute('style') and css(page.locator('.flip-inner'),'transitionDuration')=='0.8s')
  elif slug=='spotlight-card':
   move(page,page.locator('.spotlight-card'));page.wait_for_timeout(250)
   check('spotlight parameters reach light size and alpha',css(page.locator('.spot-fill'),'width')=='600px' and '0.3' in css(page.locator('.spot-fill'),'backgroundImage'))
  elif slug=='magnetic-button':
   move(page,page.locator('.magnetic-area'),.75,.5);page.wait_for_timeout(180)
   check('magnet cap and pointer response',page.locator('.magnetic-button').evaluate('e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.hypot(m.m41,m.m42)>0&&Math.hypot(m.m41,m.m42)<=14.01}'))
  elif slug=='ripple-button':
   page.locator('.ripple-button').click(position={'x':20,'y':20});expect(page.locator('.ripple-wave')).to_have_count(1)
   check('ripple starts at contact with current opacity and duration',css(page.locator('.ripple-wave'),'animationDuration')=='1s' and page.locator('.ripple-wave').evaluate('e=>e.style.getPropertyValue("--ripple-opacity")')=='0.5' and float(page.locator('.ripple-wave').evaluate('e=>parseFloat(e.style.left)'))<20)
   expect(page.locator('.ripple-wave')).to_have_count(0,timeout=2000);check('ripple removes completed DOM')
  elif slug=='sliding-fill-button':
   move(page,page.locator('.sliding-button'));page.wait_for_timeout(650)
   check('sliding fill parameters applied',css(page.locator('.sliding-button'),'width')=='200px' and css(page.locator('.sliding-fill'),'transitionDuration')=='0.6s' and css(page.locator('.sliding-button'),'color')=='rgb(255, 255, 255)')
   page.mouse.move(0,0);page.wait_for_timeout(50);check('sliding exit originates on right',css(page.locator('.sliding-fill'),'transformOrigin').startswith('196px'))
  elif slug=='gradient-text-shimmer':
   check('shimmer period and band width applied',css(page.locator('.shimmer-band'),'animationDuration')=='4s' and page.locator('.shimmer-band').get_attribute('width')=='180')
   page.get_by_role('button',name='暂停 Pause',exact=True).click();page.wait_for_timeout(80);a=css(page.locator('.shimmer-band'),'transform');page.wait_for_timeout(200);check('shimmer Pause freezes exact position',a==css(page.locator('.shimmer-band'),'transform'))
  else:
   page.get_by_role('button',name='重播 Replay',exact=True).click();page.wait_for_timeout(80)
   check('reveal changed timing and distance reach every word',css(page.locator('.reveal-word').last,'animationDelay')=='0.4s' and css(page.locator('.reveal-word').first,'animationDuration')=='0.8s' and page.locator('.reveal-word').first.evaluate('e=>e.style.getPropertyValue("--reveal-distance")')=='30px')
   check('reveal accessible full sentence only once',page.locator('.staggered-text').get_attribute('aria-label')=='让每个想法依次浮现' and page.locator('.reveal-word[aria-hidden=true]').count()==5)
 # Native keyboard and focus, including correct contact origin.
 goto(page,'card-flip');flip=page.locator('.flip-card');flip.focus();page.wait_for_timeout(80)
 state=flip.get_attribute('aria-pressed');flip.press('Enter');expect(flip).to_have_attribute('aria-pressed','false' if state=='true' else 'true');state=flip.get_attribute('aria-pressed');flip.press('Space');expect(flip).to_have_attribute('aria-pressed','false' if state=='true' else 'true')
 check('flip Enter and Space independently toggle',css(flip,'outlineWidth')=='2px')
 goto(page,'spotlight-card');spot=page.locator('.spotlight-card');spot.focus();spot.press('ArrowRight');page.wait_for_timeout(220)
 check('spotlight keyboard light movement and focus',css(page.locator('.spot-fill'),'opacity')=='1' and css(spot,'outlineWidth')=='2px')
 spot.press('Escape');page.wait_for_timeout(250);check('spotlight Escape clears',css(page.locator('.spot-fill'),'opacity')=='0')
 goto(page,'magnetic-button');mag=page.locator('.magnetic-button');mag.focus();mag.press('ArrowRight');page.wait_for_timeout(150);check('magnetic keyboard response and focus','translate(0px, 0px)' not in mag.get_attribute('style') and css(mag,'outlineWidth')=='2px');mag.press('Escape');page.wait_for_timeout(550);check('magnetic returns to rest',css(mag,'transform')=='matrix(1, 0, 0, 1, 0, 0)')
 goto(page,'ripple-button');ripple=page.locator('.ripple-button');ripple.focus();ripple.press('Space');expect(page.locator('.ripple-wave')).to_have_count(1);check('keyboard ripple originates at center',page.locator('.ripple-wave').evaluate('e=>e.style.left')=='50%' and css(ripple,'outlineWidth')=='2px')
 goto(page,'sliding-fill-button');fill=page.locator('.sliding-button');fill.focus();page.wait_for_timeout(350);check('sliding focus activates fill visibly',fill.get_attribute('aria-pressed')=='true' and css(fill,'outlineWidth')=='2px');state=fill.get_attribute('aria-pressed');fill.press('Space');check('sliding keyboard toggles fill',fill.get_attribute('aria-pressed')!=state)
 # Verify the small uncapped magnetic displacement as well as its sensing boundary.
 goto(page,'magnetic-button');area=page.locator('.magnetic-area');b=area.bounding_box()
 page.mouse.move(b['x']+b['width']/2+20,b['y']+b['height']/2);page.wait_for_timeout(160)
 check('magnetic default strength is .35 of a small offset',abs(page.locator('.magnetic-button').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).m41')-7)<.1)
 page.locator('#param-strength').fill('0.6');area.scroll_into_view_if_needed();page.wait_for_timeout(100);b=area.bounding_box();page.mouse.move(b['x']+b['width']/2+20,b['y']+b['height']/2);page.wait_for_timeout(160)
 check('magnetic strength changes actual uncapped displacement',abs(page.locator('.magnetic-button').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).m41')-12)<.1)
 page.mouse.move(b['x']+b['width']/2+170,b['y']+b['height']/2);page.wait_for_timeout(550)
 check('magnetic outside default 80px edge radius rests',css(page.locator('.magnetic-button'),'transform')=='matrix(1, 0, 0, 1, 0, 0)')
 page.locator('#param-radius').fill('160');area.scroll_into_view_if_needed();page.wait_for_timeout(100);b=area.bounding_box();page.mouse.move(b['x']+b['width']/2+170,b['y']+b['height']/2);page.wait_for_timeout(160)
 check('larger magnetic radius activates same distant target',abs(page.locator('.magnetic-button').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).m41')-14)<.1)
 goto(page,'ripple-button');node=page.locator('.ripple-button');node.click();page.wait_for_timeout(100);wave=page.locator('.ripple-wave');a=css(wave,'transform');page.wait_for_timeout(120)
 check('normal ripple grows and fades',a!=css(wave,'transform') and 0<float(css(wave,'opacity'))<.35)
 node.click();check('multiple ripple DOM nodes coexist',page.locator('.ripple-wave').count()==2);expect(page.locator('.ripple-wave')).to_have_count(0,timeout=1500)
 node.click();page.locator('#prompt').scroll_into_view_if_needed();expect(page.locator('.ripple-wave')).to_have_count(0);check('offscreen ripple cleans transient nodes')
 goto(page,'staggered-text-reveal');page.get_by_role('button',name='重播 Replay',exact=True).click();page.wait_for_timeout(100);page.get_by_role('button',name='暂停 Pause',exact=True).click();page.wait_for_timeout(80);a=css(page.locator('.reveal-word').first,'transform');page.wait_for_timeout(200);check('reveal Pause freezes actual word transforms',a==css(page.locator('.reveal-word').first,'transform'))
 # Off-screen loops freeze; reduced motion manual playback remains finite.
 goto(page,'gradient-text-shimmer');page.locator('#prompt').scroll_into_view_if_needed();page.wait_for_timeout(250);a=css(page.locator('.shimmer-band'),'transform');page.wait_for_timeout(250);check('detail shimmer pauses offscreen',a==css(page.locator('.shimmer-band'),'transform'))
 reduced=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce');rp=reduced.new_page();rp.on('pageerror',lambda e:errors.append(str(e)));rp.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
 for slug in SLUGS:
  goto(rp,slug)
  if slug in ['card-flip','sliding-fill-button']:
   sel='.flip-card' if slug=='card-flip' else '.sliding-button';node=rp.locator(sel);node.focus();move(rp,node);rp.wait_for_timeout(250);check(slug+' reduced focus/hover is static',node.get_attribute('aria-pressed')=='false');node.press('Enter');check(slug+' reduced explicit switch works',node.get_attribute('aria-pressed')=='true')
  elif slug=='spotlight-card':
   node=rp.locator('.spotlight-card');node.focus();move(rp,node);rp.wait_for_timeout(100);check('reduced spotlight static',css(rp.locator('.spot-fill'),'opacity')=='0')
  elif slug=='magnetic-button':
   node=rp.locator('.magnetic-button');node.focus();node.press('ArrowRight');rp.wait_for_timeout(100);check('reduced magnetic static',css(node,'transform')=='matrix(1, 0, 0, 1, 0, 0)')
  elif slug=='ripple-button':
   check('reduced ripple no autoplay',rp.locator('.ripple-wave').count()==0);rp.locator('.ripple-button').click();check('reduced ripple one fade',rp.locator('.ripple-reduced').count()==1);expect(rp.locator('.ripple-wave')).to_have_count(0,timeout=1200)
  elif slug=='gradient-text-shimmer':
   band=rp.locator('.shimmer-band');a=css(band,'transform');rp.wait_for_timeout(200);check('reduced shimmer static',css(band,'transform')==a)
   rp.get_by_role('button',name='播放 Play',exact=True).click();rp.wait_for_timeout(250);check('reduced shimmer Play moves',css(band,'transform')!=a);rp.wait_for_timeout(2600);expect(rp.get_by_role('button',name='播放 Play',exact=True)).to_be_visible();check('reduced shimmer completes once',css(band,'opacity')=='0')
   rp.get_by_role('button',name='重播 Replay',exact=True).click();rp.wait_for_timeout(200);check('reduced shimmer Replay works',css(rp.locator('.shimmer-band'),'opacity')=='1')
  else:
   check('reduced reveal complete representative sentence',rp.locator('.reveal-word').count()==0 and all(v=='1' for v in rp.locator('.staggered-text span').evaluate_all('(a)=>a.map(e=>getComputedStyle(e).opacity)')))
   rp.get_by_role('button',name='播放 Play',exact=True).click();rp.wait_for_timeout(80);check('reduced reveal explicit entrance',float(css(rp.locator('.reveal-word').last,'opacity'))<1);rp.wait_for_timeout(800);check('reduced reveal finishes visible',all(v=='1' for v in rp.locator('.reveal-word').evaluate_all('(a)=>a.map(e=>getComputedStyle(e).opacity)')))
  if slug in ['card-flip','spotlight-card','magnetic-button','sliding-fill-button']:
   rp.get_by_role('button',name='重置 Reset',exact=True).click();rp.get_by_role('button',name='自动演示 Auto demo',exact=True).click();rp.wait_for_timeout(350)
   active= {'card-flip':lambda:rp.locator('.flip-card').get_attribute('aria-pressed')=='true','spotlight-card':lambda:float(css(rp.locator('.spot-fill'),'opacity'))>0,'magnetic-button':lambda:css(rp.locator('.magnetic-button'),'transform')!='matrix(1, 0, 0, 1, 0, 0)','sliding-fill-button':lambda:rp.locator('.sliding-button').get_attribute('aria-pressed')=='true'}[slug]
   check(slug+' reduced Auto real movement',active());rp.wait_for_timeout(4300);check(slug+' Auto finite stop and rest',rp.get_by_role('button',name='自动演示 Auto demo',exact=True).count()==1 and not active())
 rp.goto(BASE);expect(rp.locator('.effect-card')).to_have_count(10)
 for slug in ['gradient-text-shimmer','staggered-text-reveal']:
  card=rp.locator('[data-effect='+slug+']');card.scroll_into_view_if_needed();rp.wait_for_timeout(150)
  check(slug+' reduced gallery no autoplay',card.get_by_role('button',name='播放 Play').count()==1)
  card.get_by_role('button',name='播放 Play').click();rp.wait_for_timeout(120);check(slug+' reduced gallery manual playback',card.get_by_role('button',name='暂停 Pause').count()==1)
 # Physical touch not claimed: Chromium mobile emulation only.
 touch=browser.new_context(viewport={'width':375,'height':700},has_touch=True,is_mobile=True);tp=touch.new_page();tp.on('pageerror',lambda e:errors.append(str(e)));tp.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
 for slug,selector in zip(SLUGS,SELECTORS):
  tp.goto(BASE);card=tp.locator('[data-effect='+slug+']');node=card.locator(selector);node.scroll_into_view_if_needed()
  if slug in ['card-flip','ripple-button','sliding-fill-button']:
   node.tap();tp.wait_for_timeout(80)
   check(slug+' touch tap activates without navigation',tp.url==BASE+'/' and (card.locator('.ripple-wave').count()==1 if slug=='ripple-button' else node.get_attribute('aria-pressed')=='true'))
  elif slug in ['spotlight-card','magnetic-button']:
   b=node.bounding_box();session=touch.new_cdp_session(tp)
   x=b['x']+b['width']*.7;y=b['y']+b['height']*.4
   session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]});tp.wait_for_timeout(220)
   check(slug+' touch contact produces real response',css(card.locator('.spot-fill'),'opacity')=='1' if slug=='spotlight-card' else css(node,'transform')!='matrix(1, 0, 0, 1, 0, 0)')
   session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});session.detach()
  else:
   card.get_by_role('button',name='重播 Replay').tap();check(slug+' touch replay does not navigate',tp.url==BASE+'/')
 for width in [320,768,1280]:
  page.set_viewport_size({'width':width,'height':800})
  for slug in SLUGS:
   goto(page,slug);check(slug+' no horizontal overflow '+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 # Keep review screenshots outside the patch.
 page.set_viewport_size({'width':1280,'height':900});page.goto(BASE);page.screenshot(path='/tmp/effect-stage3-gallery.png',full_page=True)
 goto(page,'spotlight-card');move(page,page.locator('.spotlight-card'));page.wait_for_timeout(240);page.locator('.demo-stage').screenshot(path='/tmp/effect-stage3-spotlight.png')
 check('no runtime errors',not errors);check('no external runtime requests',not external)
 browser.close()
Path('/tmp/effect-stage3-browser.json').write_text(json.dumps({'passed':len(results),'checks':results},ensure_ascii=False,indent=2))
print('TOTAL',len(results))
