"""Chromium clipboard race regressions; uses existing Playwright, no installs.
Run against npm run dev on port 5173. All cases run even when one fails.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:5173'
HOOK = """() => {
  window.copyRequests = []; window.legacyWrites = []; window.completedWrites = [];
  Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{
    writeText: text => new Promise((resolve,reject) => window.copyRequests.push({text,
      resolve: () => { window.completedWrites.push(text); resolve(); },
      reject: () => reject(new Error('controlled clipboard rejection'))
    }))
  }});
  document.execCommand = () => { window.legacyWrites.push(document.activeElement.value); return window.legacySuccess !== false; };
}"""

def setup(browser):
    context=browser.new_context()
    page=context.new_page()
    page.goto(BASE+'/effects/glassmorphism')
    page.get_by_role('button',name='English',exact=True).click()
    page.evaluate(HOOK)
    return context,page

def copy(page):
    # aria-disabled keeps the button focusable; force tests that handler guards too.
    page.locator('button.primary').click(force=True)

def settle(page, action='resolve', index=0):
    page.evaluate(f'window.copyRequests[{index}].{action}()')
    page.wait_for_timeout(100)

def feedback(page):
    return page.locator('p[role=status]').inner_text()

def language_success(page):
    snapshot=page.locator('#prompt').input_value(); copy(page)
    page.get_by_role('button',name='中文',exact=True).click()
    settle(page)
    assert feedback(page)=='', 'stale success reappeared on Chinese prompt'
    assert page.evaluate('window.completedWrites')==[snapshot]
    assert page.get_by_role('button',name='中文',exact=True).evaluate('el=>el===document.activeElement')

def parameter_rejection(page):
    snapshot=page.locator('#prompt').input_value(); copy(page)
    page.locator('#param-blur').fill('32')
    page.locator('#param-blur').focus()
    settle(page,'reject')
    assert feedback(page)=='', 'stale failure/success was announced after parameter change'
    assert page.evaluate('window.legacyWrites')==[], 'stale request ran legacy on the changed prompt'
    assert page.evaluate('window.copyRequests[0].text')==snapshot and 'blur(16px)' in snapshot
    assert page.locator('#param-blur').evaluate('el=>el===document.activeElement')

def language_failure(page):
    page.evaluate('window.legacySuccess=false'); copy(page)
    page.get_by_role('button',name='中文',exact=True).click()
    settle(page,'reject')
    assert feedback(page)=='', 'stale error shown'
    assert page.evaluate('window.legacyWrites')==[], 'stale fallback attempted'
    assert page.get_by_role('button',name='中文',exact=True).evaluate('el=>el===document.activeElement'), 'focus stolen'

def serialize(page):
    copy(page)
    assert page.locator('button.primary').evaluate('el=>el===document.activeElement'), 'pending lost focus'
    copy(page)
    page.locator('button.primary').press('Enter')
    page.locator('button.primary').press('Space')
    assert page.evaluate('window.copyRequests.length')==1, 'second concurrent write started'
    assert page.locator('button.primary').get_attribute('aria-disabled')=='true'
    settle(page)
    copy(page)
    assert page.evaluate('window.copyRequests.length')==2, 'cannot copy again after completion'
    settle(page,index=1)
    assert feedback(page)=='已复制到剪贴板'

def active_legacy_snapshot(page):
    snapshot=page.locator('#prompt').input_value(); copy(page)
    settle(page,'reject')
    assert page.evaluate('window.legacyWrites')==[snapshot], 'legacy did not copy click snapshot'
    assert feedback(page)=='已复制到剪贴板'
    assert page.locator('button.primary').evaluate('el=>el===document.activeElement'), 'legacy success changed focus'
    assert page.locator('textarea').count()==1, 'temporary legacy textarea leaked'

def route_pending(page):
    copy(page)
    page.get_by_role('link',name='全部效果',exact=True).click()
    page.locator('a.effect-title[href="/effects/typewriter"]').click()
    expect(page.locator('#prompt')).to_be_attached()
    copy(page)
    assert page.evaluate('window.copyRequests.length')==1, 'new route started concurrent write'
    settle(page,'reject')
    assert page.evaluate('window.legacyWrites')==[] and feedback(page)=='', 'unmounted request caused side effects'
    assert page.locator('button.primary').evaluate('el=>el===document.activeElement'), 'old route stole focus'
    copy(page); assert page.evaluate('window.copyRequests.length')==2
    settle(page,index=1); assert feedback(page)=='已复制到剪贴板'

def unmount_success(page):
    copy(page)
    page.get_by_role('link',name='全部效果',exact=True).click()
    target=page.locator('a.effect-title[href="/effects/typewriter"]'); target.focus()
    settle(page)
    assert page.locator('p[role=status]').count()==1 and page.locator('p[role=status]').inner_text()=='共 18 个效果' and page.evaluate('window.legacyWrites')==[]
    assert target.evaluate('el=>el===document.activeElement')

def change_back(page):
    copy(page)
    page.get_by_role('button',name='中文',exact=True).click()
    page.get_by_role('button',name='English',exact=True).click()
    settle(page)
    assert feedback(page)=='', 'same text after changing back revived old request'

cases=[language_success,parameter_rejection,language_failure,serialize,active_legacy_snapshot,route_pending,unmount_success,change_back]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for case in cases:
        context,page=setup(browser)
        try:
            case(page); results.append({'case':case.__name__,'passed':True}); print('PASS',case.__name__,flush=True)
        except AssertionError as error:
            results.append({'case':case.__name__,'passed':False,'error':str(error)}); print('FAIL',case.__name__,str(error),flush=True)
        finally: context.close()
    browser.close()
Path('/tmp/effect-clipboard-regression.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(sum(result['passed'] for result in results),'/',len(results),'passed')
raise SystemExit(0 if all(result['passed'] for result in results) else 1)
