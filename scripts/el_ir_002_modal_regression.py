"""EL-IR-002 mixed-input regression. Start Vite on 5182; existing Chromium only.
EL_IR_002_BASE may point to a baseline or candidate server. No files uploaded.
"""
import os
from playwright.sync_api import sync_playwright, expect
BASE=os.environ.get('EL_IR_002_BASE','http://127.0.0.1:5182')
checks=[]
def check(name,ok):
    assert ok,name
    checks.append(name);print('PASS',name,flush=True)
def trapped(page):return page.evaluate('!!document.querySelector("[role=dialog]")?.contains(document.activeElement)')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for motion in ['no-preference','reduce']:
        for touch in [False,True]:
            label=f'{motion}/'+('touch' if touch else 'mouse')
            ctx=browser.new_context(viewport={'width':1000,'height':1000},has_touch=touch,reduced_motion=motion)
            page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.add_init_script('''window.modalListeners=new Set();const add=document.addEventListener.bind(document),remove=document.removeEventListener.bind(document);document.addEventListener=(t,f,o)=>{if(t==='focusin'||t==='keydown')window.modalListeners.add(f);return add(t,f,o)};document.removeEventListener=(t,f,o)=>{window.modalListeners.delete(f);return remove(t,f,o)};''')
            page.goto(BASE+'/effects/modal-scale-fade');opener=page.locator('.modal-opener');expect(opener).to_be_visible()
            baseline=page.evaluate('window.modalListeners.size')
            def activate(node):
                node.tap() if touch else node.click()
            activate(opener);expect(page.get_by_role('dialog')).to_be_visible()
            check(label+' initial focus',trapped(page))
            for key in ['Tab','Shift+Tab','Shift+Tab','Tab']:
                page.keyboard.press(key);check(label+' traps '+key,trapped(page))
            # Real mixed input reproduces the independent review: no JS focus injection.
            activate(page.locator('#param-duration'));page.wait_for_timeout(60)
            check(label+' outside parameter contact cannot escape focus',trapped(page))
            check(label+' outside range still updates live duration',page.locator('#param-duration').input_value()!='250' and page.locator('.modal-dialog').evaluate('(e,reduced)=>Math.abs(parseFloat(getComputedStyle(e).transitionDuration)*1000-(reduced?0:Number(document.querySelector("#param-duration").value)))<.01',motion=='reduce'))
            page.keyboard.press('Tab');check(label+' Tab after external contact stays inside',trapped(page))
            page.keyboard.press('Escape');expect(page.get_by_role('dialog')).to_have_count(0)
            expect(opener).to_be_focused();check(label+' Escape closes and restores opener',True)
            check(label+' close removes document guards',page.evaluate('window.modalListeners.size')==baseline)
            page.locator('#param-duration').fill('600');page.locator('#param-startScale').fill('0.8')
            activate(opener);dialog=page.get_by_role('dialog')
            check(label+' duration parameter preserved',dialog.evaluate('e=>getComputedStyle(e).transitionDuration')==('0s' if motion=='reduce' else '0.6s'))
            for language in ['English','中文']:
                activate(page.get_by_role('button',name=language,exact=True))
                check(label+' outside language control retains focus',trapped(page))
                prompt=page.locator('#prompt').input_value();check(label+' live parameters '+language,'600ms' in prompt and '0.8' in prompt)
            check(label+' stage-contained overlay',page.locator('.modal-layer').evaluate('e=>{const a=e.getBoundingClientRect(),b=e.closest(".demo-stage").getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.top>=b.top&&a.bottom<=b.bottom&&getComputedStyle(e).position==="absolute"}'))
            activate(page.get_by_role('button',name='知道了',exact=True));expect(dialog).to_have_count(0);expect(opener).to_be_focused()
            activate(opener);activate(page.get_by_role('button',name='关闭对话框',exact=True));expect(dialog).to_have_count(0);expect(opener).to_be_focused()
            check(label+' both normal close actions restore focus',True)
            activate(opener);activate(page.get_by_role('button',name='重置 Reset',exact=True));expect(dialog).to_have_count(0)
            expect(opener).to_be_focused();check(label+' Reset releases trap and focuses replacement opener',page.evaluate('window.modalListeners.size')==baseline)
            expect(page.locator('#param-duration')).to_have_value('250');expect(page.locator('#param-startScale')).to_have_value('0.95')
            activate(page.locator('#param-duration'));check(label+' external range responds after Reset',page.locator('#param-duration').input_value()!='250')
            # Chromium touch ranges can change value without taking focus natively.
            page.locator('#param-duration').focus();expect(page.locator('#param-duration')).to_be_focused();check(label+' external focus free after Reset',True)
            activate(opener);activate(page.get_by_role('link',name='全部效果',exact=True));expect(page).to_have_url(BASE+'/')
            search=page.get_by_label('搜索效果',exact=True);search.focus();page.keyboard.press('Escape');page.wait_for_timeout(250)
            expect(search).to_be_focused();check(label+' route unmount leaves no trap or delayed focus steal',page.evaluate('window.modalListeners.size')==baseline)
            # Remove while a closing timer is pending, exercising both cleanup paths.
            page.goto(BASE+'/effects/modal-scale-fade');activate(page.locator('.modal-opener'));activate(page.get_by_role('button',name='关闭对话框',exact=True))
            page.get_by_role('link',name='全部效果',exact=True).click();expect(page).to_have_url(BASE+'/');search=page.get_by_label('搜索效果',exact=True);search.focus();page.wait_for_timeout(250);expect(search).to_be_focused()
            check(label+' close/unmount timer cleanup',not errors)
            ctx.close()
    browser.close()
print('TOTAL',len(checks))
