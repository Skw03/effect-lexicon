"""Stage 4 Chromium regression. Start Vite on 5173; uses installed Chromium/Playwright.
Touch gestures are browser emulation, not physical-device testing.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE='http://127.0.0.1:5173'
OLD=['card-tilt-3d','typewriter','glassmorphism','card-flip','spotlight-card','magnetic-button','ripple-button','sliding-fill-button','gradient-text-shimmer','staggered-text-reveal']
NEW=['aurora-gradient','underline-slide-link','shrinking-sticky-header','parallax-scroll','scroll-reveal','skeleton-shimmer','pulsing-dots-loader','modal-scale-fade']
SELECTORS=['.aurora','.underline-nav','.sticky-stage','.parallax-stage','.reveal-stage','.skeleton-demo','.pulsing-dots','.modal-demo']
PARAMS=[{'duration':(8,'s'),'blur':(35,'px')},{'duration':(400,'ms'),'thickness':(4,'px')},{'threshold':(80,'px'),'collapsedHeight':(40,'px')},{'backgroundSpeed':(.3,''),'midgroundSpeed':(.9,'')},{'distance':(40,'px'),'duration':(900,'ms')},{'duration':(.8,'s'),'bandWidth':(60,'%')},{'size':(20,'px'),'duration':(.6,'s')},{'duration':(600,'ms'),'startScale':(.8,'')}]
SCROLL=[('shrinking-sticky-header','.sticky-stage'),('parallax-scroll','.parallax-stage'),('scroll-reveal','.reveal-stage')]
QUERIES=[('鼠标移上去卡片跟着动',['card-tilt-3d','spotlight-card']),('a card that follows my mouse',['card-tilt-3d','spotlight-card']),('点一下卡片翻过来',['card-flip']),('文字像打字一样出现',['typewriter']),('frosted glass',['glassmorphism']),('blur background',['glassmorphism']),('毛玻璃',['glassmorphism']),('加载时灰色条闪光',['skeleton-shimmer']),('滚动时背景比内容慢',['parallax-scroll']),('按钮被鼠标吸过去',['magnetic-button']),('点击按钮出现水波纹',['ripple-button']),('向下滚动内容渐渐出现',['scroll-reveal']),('彩色流动的背景',['aurora-gradient']),('导航链接下面划线滑出来',['underline-slide-link'])]
results=[]
def check(name,condition=True):
 assert condition,name
 results.append(name);print('PASS',name,flush=True)
def css(node,prop,pseudo=None):return node.evaluate('(e,a)=>getComputedStyle(e,a[1])[a[0]]',[prop,pseudo])
def top(node):return node.evaluate('e=>e.scrollTop')
def goto(page,slug):
 page.goto(BASE+'/effects/'+slug);page.locator('.demo-stage').scroll_into_view_if_needed();page.wait_for_timeout(100)
def set_top(node,value):node.evaluate('(e,v)=>e.scrollTop=v',value)
def wheel(page,node,amount):
 box=node.bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.wheel(0,amount);page.wait_for_timeout(300)
def gesture(context,page,node):
 b=node.bounding_box();x=b['x']+b['width']*.6;y=b['y']+b['height']*.75
 cdp=context.new_cdp_session(page)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for distance in [25,60,100,150]:
  cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-distance}]});page.wait_for_timeout(40)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});cdp.detach();page.wait_for_timeout(300)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 errors=[];external=[]
 def observe(page):
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:external.append(r.url) if not r.url.startswith(BASE) else None)
 context=browser.new_context(viewport={'width':1280,'height':900},permissions=['clipboard-read','clipboard-write'])
 page=context.new_page();observe(page);page.goto(BASE)
 expect(page.locator('.effect-card')).to_have_count(18)
 check('all eighteen canonical entries in original then new order',page.locator('.effect-title').evaluate_all('(a)=>a.map(e=>e.pathname.split("/").pop())')==OLD+NEW)
 for slug,selector in zip(NEW,SELECTORS):
  card=page.locator('[data-effect='+slug+']');card.scroll_into_view_if_needed();expect(card.locator(selector)).to_be_visible()
  check(slug+' representative gallery frame visible')
  if slug in [s for s,_ in SCROLL]:
   check(slug+' gallery no scroll or focus trap',card.get_by_text('在详情页体验滚动',exact=True).count()==1 and card.locator('[tabindex],.preview-controls').count()==0 and css(card.locator(selector),'overflowY')=='hidden')
  if slug=='modal-scale-fade':check('modal gallery open but no dialog semantics or focus targets',card.locator('.modal-dialog').is_visible() and card.locator('[role=dialog],button,[tabindex]').count()==0)
  check(slug+' total running previews stays at most six',page.locator('.mini-preview[data-running=true]').count()<=6)
 page.screenshot(path='/tmp/effect-stage4-gallery.png',full_page=True)
 for query,targets in QUERIES:
  page.locator('#effect-search').fill(query);expect(page.locator('.active-summary')).to_contain_text(query)
  slugs=page.locator('.effect-card').evaluate_all('(a)=>a.map(e=>e.dataset.effect)')[:3]
  for target in targets:check(query+' top-three '+target,target in slugs)
 page.goto(BASE)
 for slug in OLD+NEW:
  goto(page,slug);expect(page.locator('h1')).to_be_visible()
  links=page.locator('main a[href^="/effects/"]').evaluate_all('(a)=>a.map(e=>e.pathname.split("/").pop())')
  check(slug+' real detail and strictly resolved related links',len(links)>0 and all(s in OLD+NEW for s in links))
 for slug,selector,params in zip(NEW,SELECTORS,PARAMS):
  goto(page,slug)
  for key,(value,unit) in params.items():page.locator('#param-'+key).fill(str(value))
  for lang in ['English','中文']:
   page.get_by_role('button',name=lang,exact=True).click();text=page.locator('#prompt').input_value()
   check(slug+' '+lang+' live parameters and rendered template',all(str(v)+u in text for v,u in params.values()) and '{{' not in text)
   page.get_by_role('button',name='复制提示词',exact=True).click();expect(page.locator('p[role=status]')).to_have_text('已复制到剪贴板')
   check(slug+' '+lang+' clipboard exact',page.evaluate('navigator.clipboard.readText()')==text)
  page.locator('.demo-stage').scroll_into_view_if_needed();page.wait_for_timeout(100)
  if slug=='aurora-gradient':
   n=page.locator('.aurora-blob').first
   check('aurora real blur and period',css(n,'filter')=='blur(35px)' and css(n,'animationDuration')=='8s')
  elif slug=='underline-slide-link':
   n=page.locator('.underline-nav a').first;n.hover();page.wait_for_timeout(450)
   check('underline hover width duration thickness',css(n.locator('span'),'height')=='4px' and css(n.locator('span'),'transitionDuration')=='0.4s' and css(n.locator('span'),'transform')=='matrix(1, 0, 0, 1, 0, 0)')
   page.mouse.move(0,0);page.wait_for_timeout(450);check('underline exits right',css(n.locator('span'),'transform').startswith('matrix(0,') and css(n.locator('span'),'transformOrigin').startswith('44px'))
   n.focus();page.keyboard.press('Tab');page.keyboard.press('Shift+Tab');page.wait_for_timeout(450);check('underline keyboard focus shows line and outline',css(n,'outlineWidth')=='2px' and css(n.locator('span'),'transform').startswith('matrix(1,'))
   n.press('Enter');page.wait_for_timeout(450);check('underline Enter toggles without navigation',css(n.locator('span'),'transform').startswith('matrix(0,') and page.url.endswith(slug))
   n.blur();page.get_by_role('button',name='自动演示 Auto demo',exact=True).click();page.wait_for_timeout(400);check('underline Auto active',any(css(e,'transform')!='matrix(0, 0, 0, 1, 0, 0)' for e in page.locator('.underline-nav span').all()));page.wait_for_timeout(4300);check('underline Auto stops',page.get_by_role('button',name='自动演示 Auto demo',exact=True).count()==1)
  elif slug=='shrinking-sticky-header':
   n=page.locator(selector);set_top(n,60);page.wait_for_timeout(250);check('sticky threshold live before crossing',css(page.locator('.sticky-demo-header'),'height')=='72px')
   set_top(n,150);expect(page.locator('.sticky-demo-header')).to_have_css('height','40px');expect(page.locator('.sticky-header-surface')).to_have_css('opacity','1');check('sticky threshold height surface live',css(page.locator('.sticky-demo-header'),'height')=='40px' and css(page.locator('.sticky-header-surface'),'opacity')=='1')
  elif slug=='parallax-scroll':
   n=page.locator(selector);set_top(n,200);page.wait_for_timeout(100)
   check('parallax factors truly affect layers',page.locator('.parallax-back').evaluate('e=>Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42-140)<1') and page.locator('.parallax-mid').evaluate('e=>Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42-20)<1'))
  elif slug=='scroll-reveal':
   check('reveal timing distance live',css(page.locator('.scroll-reveal-card').first,'animationDuration')=='0.9s' and page.locator('.scroll-reveal-card').first.evaluate('e=>e.style.getPropertyValue("--scroll-distance")')=='40px')
   n=page.locator(selector);set_top(n,1000);page.wait_for_timeout(1250);check('last card reveals with own observer root',css(page.locator('.scroll-reveal-card').last,'opacity')=='1');set_top(n,0);page.wait_for_timeout(100);check('once revealed card remains revealed',css(page.locator('.scroll-reveal-card').last,'opacity')=='1')
  elif slug=='skeleton-shimmer':
   n=page.locator('.skeleton-block').first
   check('skeleton pseudo period and band live',css(n,'animationDuration','::after')=='0.8s' and page.locator('.skeleton-demo').evaluate('e=>e.style.getPropertyValue("--skeleton-band")')=='60%')
   check('skeleton semantic loading label hidden visually',page.locator('.skeleton-content[role=status]').inner_text()=='加载中' and css(page.locator('.skeleton-content .sr-only'),'width')=='1px')
   page.get_by_label('显示加载完成后的内容').check();expect(page.locator('.skeleton-loaded')).to_be_visible();check('skeleton toggle real content no loading announcement',page.locator('.skeleton-content').inner_text().find('林间手记')>=0 and page.locator('.skeleton-block').count()==0)
   page.get_by_label('显示加载完成后的内容').uncheck();expect(n).to_be_visible()
  elif slug=='pulsing-dots-loader':
   check('dots size period delays and accessible status',css(page.locator('.pulsing-dot').first,'width')=='20px' and css(page.locator('.pulsing-dot').first,'animationDuration')=='0.6s' and [css(e,'animationDelay') for e in page.locator('.pulsing-dot').all()]==['0s','0.15s','0.3s'] and page.locator('.pulsing-dots[role=status]').inner_text()=='加载中' and page.locator('.pulsing-dot[aria-hidden=true]').count()==3)
  else:
   page.get_by_role('button',name='打开对话框',exact=True).click();dialog=page.get_by_role('dialog',name='留住这个想法');expect(dialog).to_be_visible();expect(page.get_by_role('button',name='关闭对话框',exact=True)).to_be_focused()
   check('modal params animate actual scale and duration',css(dialog,'transitionDuration')=='0.6s' and float(dialog.evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).a'))<1)
   page.keyboard.press('Shift+Tab');expect(page.get_by_role('button',name='知道了',exact=True)).to_be_focused();page.keyboard.press('Tab');expect(page.get_by_role('button',name='关闭对话框',exact=True)).to_be_focused();check('modal focus wraps both directions')
   page.keyboard.press('Escape');page.wait_for_timeout(180);expect(page.get_by_role('dialog')).to_have_count(0);expect(page.get_by_role('button',name='打开对话框',exact=True)).to_be_focused();check('modal Escape closes and returns focus')
   page.get_by_role('button',name='打开对话框',exact=True).click();page.get_by_role('button',name='关闭对话框',exact=True).click();page.wait_for_timeout(180);expect(page.get_by_role('button',name='打开对话框',exact=True)).to_be_focused();check('modal close button returns focus')
  page.get_by_role('button',name='恢复默认',exact=True).click()
  check(slug+' defaults restore',all(page.locator('#param-'+k).input_value()!=str(v) for k,(v,u) in params.items()))
 # Native wheel, keyboard, edge chaining, replay and user interruption per scroll demo.
 for slug,selector in SCROLL:
  goto(page,slug);n=page.locator(selector);check(slug+' no auto scroll on mount',top(n)==0)
  if slug=='shrinking-sticky-header':
   set_top(n,41);page.wait_for_timeout(700);check('sticky threshold does not oscillate from scroll anchoring',abs(top(n)-41)<1 and css(page.locator('.sticky-demo-header'),'height')=='48px');set_top(n,0);page.wait_for_timeout(250)
  wheel(page,n,150);check(slug+' actual mouse wheel scroll',top(n)>50)
  n.focus();before=top(n);n.press('PageDown');page.wait_for_timeout(400);check(slug+' native keyboard scroll',top(n)>before)
  n.press('Tab');check(slug+' Tab releases region',not n.evaluate('e=>e===document.activeElement'))
  page.get_by_role('button',name='重播 Replay',exact=True).click();page.wait_for_timeout(800);n=page.locator(selector);check(slug+' Replay moves own container',top(n)>0)
  page.get_by_role('button',name='暂停 Pause',exact=True).click();page.wait_for_timeout(80);a=top(n);page.wait_for_timeout(150);check(slug+' Pause freezes scroll',top(n)==a)
  page.get_by_role('button',name='播放 Play',exact=True).click();page.wait_for_timeout(250);check(slug+' Play resumes scroll',top(n)!=a)
  wheel(page,n,80);a=top(n);page.wait_for_timeout(250);check(slug+' real wheel cancels scripted motion',abs(top(n)-a)<2)
  page.get_by_role('button',name='重播 Replay',exact=True).click();page.wait_for_timeout(3300);expect(page.get_by_role('button',name='播放 Play',exact=True)).to_be_visible();check(slug+' Replay finite completion',top(n)<1 if slug==SCROLL[0][0] else top(n)>400)
  n.scroll_into_view_if_needed();set_top(n,10000);page.wait_for_timeout(100);y=page.evaluate('scrollY');wheel(page,n,500);check(slug+' bottom edge chains to document',page.evaluate('scrollY')>y)
 # Continuous loops: movement, pause, off-screen freeze; reduced finite playback.
 loops=[('aurora-gradient','.aurora-blob',None,8),('skeleton-shimmer','.skeleton-block','::after',.8),('pulsing-dots-loader','.pulsing-dot',None,.6)]
 for slug,selector,pseudo,duration in loops:
  goto(page,slug);n=page.locator(selector).first;a=css(n,'transform',pseudo);page.wait_for_timeout(200);check(slug+' true continuous motion',css(n,'transform',pseudo)!=a)
  page.get_by_role('button',name='暂停 Pause',exact=True).click();page.wait_for_timeout(80);a=css(n,'transform',pseudo);page.wait_for_timeout(200);check(slug+' Pause exact freeze',css(n,'transform',pseudo)==a)
  page.get_by_role('button',name='播放 Play',exact=True).click();page.locator('#prompt').scroll_into_view_if_needed();page.wait_for_timeout(150);a=css(n,'transform',pseudo);page.wait_for_timeout(200);check(slug+' detail off-screen freeze',css(n,'transform',pseudo)==a)
  page.goto(BASE);card=page.locator('[data-effect='+slug+']');card.scroll_into_view_if_needed();page.wait_for_timeout(200);n=card.locator(selector).first;a=css(n,'transform',pseudo);page.wait_for_timeout(200);check(slug+' gallery visible moves',css(n,'transform',pseudo)!=a)
  page.locator('#effect-search').scroll_into_view_if_needed();page.wait_for_timeout(150);a=css(n,'transform',pseudo);page.wait_for_timeout(150);check(slug+' gallery off-screen freeze',css(n,'transform',pseudo)==a)
 reduced=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce');rp=reduced.new_page();observe(rp)
 for slug,selector,pseudo,duration in loops:
  goto(rp,slug);n=rp.locator(selector).first;a=css(n,'transform',pseudo);rp.wait_for_timeout(150);check(slug+' reduced static initial',css(n,'transform',pseudo)==a)
  rp.locator('#param-duration').fill(str(duration));rp.get_by_role('button',name='播放 Play',exact=True).click();rp.wait_for_timeout(150);check(slug+' reduced explicit Play moves',css(n,'transform',pseudo)!=a)
  rp.wait_for_timeout(int(duration*1000+500));expect(rp.get_by_role('button',name='播放 Play',exact=True)).to_be_visible();a=css(n,'transform',pseudo);rp.wait_for_timeout(150);check(slug+' reduced finite completion',css(n,'transform',pseudo)==a)
  rp.get_by_role('button',name='重播 Replay',exact=True).click();rp.wait_for_timeout(180);check(slug+' reduced Replay works',rp.get_by_role('button',name='暂停 Pause',exact=True).count()==1)
 for slug,selector in SCROLL:
  goto(rp,slug);n=rp.locator(selector);wheel(rp,n,180)
  if slug=='parallax-scroll':check('reduced natural scroll has no parallax',css(rp.locator('.parallax-back'),'transform')=='matrix(1, 0, 0, 1, 0, 0)')
  elif slug=='scroll-reveal':check('reduced all cards immediately visible',all(css(e,'opacity')=='1' for e in rp.locator('.scroll-reveal-card').all()))
  else:check('reduced sticky instant transition',css(rp.locator('.sticky-demo-header'),'transitionDuration')=='0s')
  rp.get_by_role('button',name='重播 Replay',exact=True).click();rp.wait_for_timeout(600);check(slug+' reduced explicit finite scroll runs',top(rp.locator(selector))>0);rp.wait_for_timeout(2800);expect(rp.get_by_role('button',name='播放 Play',exact=True)).to_be_visible();check(slug+' reduced scroll stops')
 goto(rp,'underline-slide-link');rp.locator('.underline-nav a').first.hover();check('reduced underline does not animate hover',css(rp.locator('.underline-nav span').first,'transitionDuration')=='0s');rp.get_by_role('button',name='自动演示 Auto demo',exact=True).click();rp.wait_for_timeout(200);check('reduced underline Auto motion allowed',css(rp.locator('.underline-nav span').first,'transitionDuration')=='0.25s');rp.wait_for_timeout(4300);check('reduced underline Auto ends',rp.get_by_role('button',name='自动演示 Auto demo',exact=True).count()==1)
 goto(rp,'modal-scale-fade');rp.get_by_role('button',name='打开对话框',exact=True).click();expect(rp.get_by_role('button',name='关闭对话框',exact=True)).to_be_focused();check('reduced modal instant with focus',css(rp.get_by_role('dialog'),'transitionDuration')=='0s');rp.keyboard.press('Escape');expect(rp.get_by_role('button',name='打开对话框',exact=True)).to_be_focused();check('reduced modal Escape restores focus')
 rp.goto(BASE)
 for slug,selector,pseudo,duration in loops:
  card=rp.locator('[data-effect='+slug+']');card.scroll_into_view_if_needed();rp.wait_for_timeout(100);n=card.locator(selector).first;a=css(n,'transform',pseudo);rp.wait_for_timeout(150);check(slug+' reduced gallery static',css(n,'transform',pseudo)==a and card.locator('.mini-preview').get_attribute('data-running')=='false')
  card.get_by_role('button',name='播放 Play',exact=True).click();rp.wait_for_timeout(200);check(slug+' reduced gallery manual runs',css(n,'transform',pseudo)!=a)
 # H6: reduced motion removes transitions, not hover/keyboard state feedback.
 for mode in ['no-preference','reduce']:
  feedback=browser.new_context(viewport={'width':1280,'height':900},reduced_motion=mode)
  fp=feedback.new_page();observe(fp);goto(fp,'underline-slide-link')
  link=fp.locator('.underline-nav a').first;line=link.locator('span')
  link.hover();expect(line).to_have_css('transform','matrix(1, 0, 0, 1, 0, 0)')
  check(mode+' underline hover visibly active',css(line,'transitionDuration')==('0s' if mode=='reduce' else '0.25s'))
  fp.mouse.move(0,0);expect(line).to_have_css('transform','matrix(0, 0, 0, 1, 0, 0)');check(mode+' underline hover exit clears')
  link.focus();fp.keyboard.press('Tab');fp.keyboard.press('Shift+Tab');expect(link).to_be_focused();expect(line).to_have_css('transform','matrix(1, 0, 0, 1, 0, 0)')
  check(mode+' underline keyboard focus visibly active',css(link,'outlineWidth')=='2px')
  fp.keyboard.press('Tab');expect(line).to_have_css('transform','matrix(0, 0, 0, 1, 0, 0)');check(mode+' underline keyboard blur clears')
  feedback.close()
 # Mobile emulation, real touch events and no horizontal overflow at required widths.
 touch=browser.new_context(viewport={'width':375,'height':800},has_touch=True,is_mobile=True);tp=touch.new_page();observe(tp)
 for slug,selector in SCROLL:
  goto(tp,slug);n=tp.locator(selector);gesture(touch,tp,n);check(slug+' native touch gesture scrolls',top(n)>30)
  set_top(n,10000);tp.wait_for_timeout(150);y=tp.evaluate('scrollY');gesture(touch,tp,n);check(slug+' touch at bottom releases page',tp.evaluate('scrollY')>y)
 goto(tp,'underline-slide-link');tp.locator('.underline-nav a').first.tap();tp.wait_for_timeout(300);check('underline tap activates without navigation',css(tp.locator('.underline-nav span').first,'transform').startswith('matrix(1,') and tp.url.endswith('underline-slide-link'))
 goto(tp,'modal-scale-fade');tp.get_by_role('button',name='打开对话框',exact=True).tap();expect(tp.get_by_role('dialog')).to_be_visible();tp.get_by_role('button',name='关闭对话框',exact=True).tap();expect(tp.get_by_role('dialog')).to_have_count(0);check('modal actual touch open close')
 # H6: native touch must chain through card text at both boundaries at all widths.
 for width in [320,375,390,768,1280]:
  edge=browser.new_context(viewport={'width':width,'height':800},has_touch=True,is_mobile=True)
  ep=edge.new_page();observe(ep);goto(ep,'scroll-reveal');region=ep.locator('.reveal-stage')
  for bottom in [True,False]:
   set_top(region,10000 if bottom else 0);ep.wait_for_timeout(850)
   ep.evaluate('window.scrollTo(0, document.querySelector(".reveal-stage").getBoundingClientRect().top + scrollY - 200)')
   card=ep.locator('.scroll-reveal-card').last if bottom else ep.locator('.scroll-reveal-card').first
   box=card.locator('p').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
   check(str(width)+(' bottom' if bottom else ' top')+' touch starts on card text',ep.evaluate('([x,y])=>document.elementFromPoint(x,y)?.tagName',[x,y])=='P')
   initial=ep.evaluate('scrollY');cdp=edge.new_cdp_session(ep)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for d in [25,60,100,150]:
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-d if bottom else y+d}]});ep.wait_for_timeout(40)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});ep.wait_for_timeout(300);cdp.detach()
   check(str(width)+(' bottom' if bottom else ' top')+' native text swipe releases page',ep.evaluate('scrollY')>initial if bottom else ep.evaluate('scrollY')<initial)
  edge.close()
 for width in [320,768,1280]:
  page.set_viewport_size({'width':width,'height':900})
  for slug in ['']+NEW:
   page.goto(BASE+('/effects/'+slug if slug else ''));page.wait_for_timeout(80)
   check(str(width)+' '+(slug or 'library')+' no horizontal overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
 check('all observed contexts no uncaught errors',errors==[])
 check('all observed contexts no external runtime requests',external==[])
 page.screenshot(path='/tmp/effect-stage4-detail.png',full_page=True)
 browser.close()
Path('/tmp/effect-stage4-results.json').write_text(json.dumps({'passed':len(results),'checks':results},ensure_ascii=False,indent=2))
print('TOTAL',len(results),'PASS')
