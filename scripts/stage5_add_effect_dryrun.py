"""README five-step integration proof. Creates only a fresh /tmp copy; never adds content here.
Uses already installed node_modules, existing Chromium and Python Playwright.
The copy and its logs remain available for inspection. No git writes or deployment.
"""
import hashlib
import json
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
def source_hashes():
    return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'src').rglob('*') if p.is_file()}
original_sources = source_hashes()
TARGET = Path(tempfile.mkdtemp(prefix='effect-stage5-nineteenth-'))
shutil.copytree(ROOT, TARGET, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git','node_modules','dist','__pycache__'))
(TARGET/'node_modules').symlink_to(ROOT/'node_modules', target_is_directory=True)
# Step 1: complete original content, exported in the ordinary index.
(TARGET/'src/content/effects/review-pulse-card.ts').write_text('''import type { Effect } from '../../types';
export const reviewPulseCard: Effect = {
 id: 'review-pulse-card', slug: 'review-pulse-card', status: 'published',
 name: { zh: '缩放提示卡', en: 'Pulse Hint Card' },
 aliases: { zh: ['提示卡缩放'], en: ['hint card pulse'] },
 searchPhrases: { zh: ['提示卡轻轻放大一次', '点一下提示卡再缩回', '卡片缩放提醒'], en: ['pulse a hint card once', 'grow then settle a hint', 'a card scales once'] },
 category: 'cards', type: 'animation', triggers: ['click'], tags: ['pulse', 'hint'],
 summary: '点击播放后，提示卡放大再回到原尺寸。', whatYouSee: '提示卡短暂放大，再平稳回到原尺寸。',
 behavior: ['点击播放。', '卡片放大后回正。'], useCases: ['提示信息'], terminologyNote: 'Pulse 是常用描述，此处仅指一次缩放，不代表统一命名。', related: ['card-tilt-3d'],
 demo: { component: 'ReviewPulseCard', hint: '点击播放', hintTouch: '轻触播放', replayable: true, autoDemo: false },
 params: [{key:'duration',label:'时长',kind:'number',default:600,min:200,max:1200,step:100,unit:'ms'}, {key:'scale',label:'放大倍数',kind:'number',default:1.05,min:1,max:1.1,step:0.01}],
 prompt: { en: 'Build a pulse hint card. Element: one hint card. Trigger: explicit Play. Behavior: grow then return. Motion (suggested values): {{duration}}, scale {{scale}}. Animate transform only. Under prefers-reduced-motion stay static by default; keyboard and touch Play runs once with visible focus.', zh: '请制作缩放提示卡。作用对象：提示卡。触发方式：点击播放。行为：放大后回正。运动建议值：时长 {{duration}}，放大 {{scale}} 倍。只动画 transform。prefers-reduced-motion 下默认静止，键盘和触屏播放仅一次，保留清晰焦点。' }
};
''')
p=TARGET/'src/content/index.ts';s=p.read_text();s="import { reviewPulseCard } from './effects/review-pulse-card';\n"+s;s=s.replace('skeletonShimmer, pulsingDotsLoader, modalScaleFade];','skeletonShimmer, pulsingDotsLoader, modalScaleFade, reviewPulseCard];');p.write_text(s)
# Step 2: working finite demo with the existing props contract.
(TARGET/'src/demos/ReviewPulseCard.tsx').write_text('''import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import './ReviewPulseCard.css';
export function ReviewPulseCard({values,running,paused,onComplete,reducedMotion}: DemoProps) {
 const [started,setStarted]=useState(false);
 useEffect(()=>{if(running&&!paused)setStarted(true);},[running,paused]);
 return <div className={started?'review-pulse-card review-pulsing':'review-pulse-card'} data-reduced={reducedMotion} style={{'--scale':values.scale,animationDuration:`${values.duration}ms`,animationPlayState:running&&!paused?'running':'paused'} as CSSProperties} onAnimationEnd={onComplete}>记住这一刻</div>;
}
''')
(TARGET/'src/demos/ReviewPulseCard.css').write_text('.review-pulse-card { padding: 24px; background: #eef2ff; color: #1c1917; border-radius: 12px; }\n.review-pulsing { animation: review-pulse 600ms ease-in-out 1; }\n@keyframes review-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(var(--scale)); } }\n')
# Step 3: registration, no new routes or product page branches.
p=TARGET/'src/demos/registry.ts';s="import { ReviewPulseCard } from './ReviewPulseCard';\n"+p.read_text();s=s.replace('SkeletonShimmer, PulsingDotsLoader, ModalScaleFade };','SkeletonShimmer, PulsingDotsLoader, ModalScaleFade, ReviewPulseCard };');p.write_text(s)
# Step 4: preserve every original catalog entry and search expectation; add the new one.
p=TARGET/'src/content/content.test.ts';s=p.read_text().replace("'pulsing-dots-loader', 'modal-scale-fade']);", "'pulsing-dots-loader', 'modal-scale-fade', 'review-pulse-card']);").replace('exactly eighteen effects','exactly nineteen effects');p.write_text(s)
p=TARGET/'src/search/search.test.ts';p.write_text(p.read_text()+"\ntest('isolated nineteenth entry is searchable', () => expect(ids('hint card pulse')[0]).toBe('review-pulse-card'));\n")
# Step 5: four gates plus real browser integration; exact-count old browser fixtures remain
# the 18-item release baseline in ROOT, and are run there, never weakened for the dry run.
for command in ['typecheck','lint','test','build']:
    result=subprocess.run(['npm','run',command],cwd=TARGET,capture_output=True,text=True)
    (TARGET/(command+'.log')).write_text(result.stdout+result.stderr)
    assert result.returncode==0, (command,result.stdout,result.stderr)
    print('PASS dry-run '+command,flush=True)
log=(TARGET/'preview.log').open('w')
server=subprocess.Popen(['node',str(ROOT/'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port','4175','--strictPort'],cwd=TARGET,stdout=log,stderr=subprocess.STDOUT)
try:
    time.sleep(1)
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=b.new_page(reduced_motion='reduce',permissions=['clipboard-read','clipboard-write'])
        page.goto('http://127.0.0.1:4175/')
        expect(page.locator('.effect-title')).to_have_count(19)
        page.locator('#effect-search').fill('hint card pulse')
        expect(page.locator('.effect-title').first).to_have_attribute('href','/effects/review-pulse-card')
        page.locator('.effect-title').first.click()
        expect(page.locator('h1')).to_contain_text('缩放提示卡')
        assert page.locator('.review-pulse-card').evaluate("e=>getComputedStyle(e).animationName")=='none'
        page.get_by_role('button',name='播放 Play',exact=True).click()
        page.wait_for_timeout(200)
        assert page.locator('.review-pulse-card').evaluate("e=>getComputedStyle(e).transform") not in ['none','matrix(1, 0, 0, 1, 0, 0)']
        page.wait_for_timeout(600)
        expect(page.get_by_role('button',name='播放 Play',exact=True)).to_be_visible()
        for lang in ['English','中文']:
            page.get_by_role('button',name=lang,exact=True).click()
            page.locator('#param-duration').fill('900')
            assert '900ms' in page.locator('#prompt').input_value()
            page.get_by_role('button',name='复制提示词',exact=True).click()
            expect(page.get_by_role('button',name='已复制',exact=True)).to_be_visible()
            assert page.evaluate('navigator.clipboard.readText()')==page.locator('#prompt').input_value()
        assert page.locator('a[href="/effects/card-tilt-3d"]').count()==1
        b.close()
        print('PASS dry-run 19 entries/search/detail/finite motion/params/bilingual clipboard/related',flush=True)
finally:
    server.terminate();server.wait(timeout=10);log.close()
assert source_hashes()==original_sources, 'formal source files changed during dry run'
print(json.dumps({'temporary_copy':str(TARGET),'formal_repository_entries':18,'formal_repository_unchanged':True}))
