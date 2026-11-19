"""Inject an intentional failing component on the dev server; verify boundary isolation."""
from playwright.sync_api import sync_playwright, expect
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();page.goto('http://127.0.0.1:5173/effects/glassmorphism')
 page.evaluate('''async () => {
 const source=await(await fetch('/src/main.tsx')).text();
 const dep=name=>source.split('"').find(s=>s.startsWith('/node_modules/') && s.includes('/'+name+'.js?'));
 const {default:React}=await import(dep('react')); const {default:ReactDOM}=await import(dep('react-dom_client'));
 const {DemoBoundary}=await import('/src/components/DemoBoundary.tsx');
 const div=document.createElement('div'); div.id='boundary-test';document.body.append(div);
 const Throws=()=>{throw Error('intentional demo test failure')};
 ReactDOM.createRoot(div).render(React.createElement(DemoBoundary,null,React.createElement(Throws)));
 }''')
 expect(page.locator('#boundary-test')).to_contain_text('演示暂时无法运行');expect(page.locator('#prompt')).to_be_visible();page.get_by_role('button',name='中文',exact=True).click();expect(page.locator('#prompt')).to_have_attribute('lang','zh-CN');print('PASS demo boundary Chinese fallback; surrounding prompt remains interactive (3 assertions)');b.close()
