"""Block the app bundle to verify preferences before hydration; local host required."""
import os
BASE = os.environ.get("AUDIT_BASE", "http://127.0.0.1:4173")
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for motion in ['reduce','no-preference']:
  for lang in ['en','zh']:
   c=b.new_context(reduced_motion=motion)
   c.add_init_script("try { localStorage.setItem('effect-lexicon-language','"+lang+"'); } catch {}")
   c.route('**/assets/*.js',lambda route:route.abort())
   page=c.new_page();page.goto(BASE + '/effects/typewriter')
   assert page.locator('#prompt').is_visible()==(lang=='en')
   assert page.locator('.motion-note').is_visible()==(motion=='reduce')
   assert not page.evaluate("document.getAnimations().some(a=>a.playState==='running')")
   page.goto(BASE + '/')
   assert page.locator('.reduced-motion-hint').first.is_visible()==(motion=='reduce')
   assert page.locator('.normal-motion-hint').first.is_visible()==(motion=='no-preference')
   c.close()
 print('PASS 20 prehydration checks, 4 preference combinations, bundle deliberately blocked')
 b.close()
