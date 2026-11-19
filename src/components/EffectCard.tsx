import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SearchHit } from '../search';
import { triggers, types } from '../search/filters';
import { defaults } from '../types';
import { DemoBoundary } from './DemoBoundary';
import { demoRegistry } from '../demos/registry';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useVirtualPointer } from '../hooks/useVirtualPointer';
import { previewBudget } from '../hooks/previewBudget';
export function EffectCard({ hit, approximate = false }: { hit: SearchHit; approximate?: boolean }) {
  const { effect } = hit;
  const { ref, visible } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [granted, setGranted] = useState(false);
  const [playing, setPlaying] = useState(!reduced);
  const [finished, setFinished] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [auto, setAuto] = useState(false);
  const stop = useCallback(() => setAuto(false), []);
  const complete = useCallback(() => { setPlaying(false); setFinished(true); }, []);
  const continuous = effect.triggers.includes('continuous');
  const scroll = effect.triggers.includes('scroll');
  useEffect(() => { setPlaying(!reduced); setFinished(false); setAuto(false); setReplayKey(key => key + 1); }, [reduced]);
  useEffect(() => {
    if (!visible || !continuous || !playing) { setGranted(false); return; }
    return previewBudget.subscribe(setGranted);
  }, [visible, continuous, playing]);
  useEffect(() => { if (!visible) setAuto(false); }, [visible]);
  const virtualPointer = useVirtualPointer(auto && visible, stop);
  const running = visible && !scroll && (continuous ? granted && playing : effect.demo.replayable ? playing : true);
  const Demo = demoRegistry[effect.demo.component];
  const matchLabel = hit.matchedField === 'aliases' ? '别名' : hit.matchedField === 'searchPhrases' ? '描述' : '名称或说明';
  return <article className="effect-card" data-effect={effect.slug}>
    <div ref={ref} className="mini-preview" data-running={continuous && running}>
      <DemoBoundary key={replayKey}><Demo key={replayKey} compact paused={!running} values={defaults(effect)} running={running} replayKey={replayKey} reducedMotion={reduced} virtualPointer={virtualPointer} onComplete={complete}/></DemoBoundary>
    </div>
    <div className="card-body">
      <p className="preview-hint">{scroll ? '在详情页体验滚动' : effect.slug === 'modal-scale-fade' ? '静态预览 · 在详情页打开对话框' : effect.demo.staticStyle ? '视觉样式 · 无动画' : effect.demo.autoDemo ? <><span className="fine-hint">{effect.demo.component === 'CardTilt3d' ? '悬停试试 · 方向键或手指拖动' : effect.demo.hint}</span><span className="touch-hint">{effect.demo.hintTouch}</span></> : <><span className="reduced-motion-hint">已减少动态 · 手动播放一次</span><span className="normal-motion-hint">{effect.slug === 'skeleton-shimmer' ? '观察亮带 · 详情可切换加载状态' : effect.demo.hint}</span></>}</p>
      {!scroll && (effect.demo.autoDemo || effect.demo.replayable) && <div className="preview-controls">
        {effect.demo.autoDemo && <button onClick={() => setAuto(value => !value)}>{auto ? '停止 Stop' : '自动演示 Auto demo'}</button>}
        {effect.demo.replayable && <><button onClick={() => { if (finished) { setReplayKey(key => key + 1); setFinished(false); } setPlaying(value => !value); }}>{playing ? '暂停 Pause' : '播放 Play'}</button><button onClick={() => { setReplayKey(key => key + 1); setFinished(false); setPlaying(true); }}>重播 Replay</button></>}
      </div>}
      <h2><Link className="effect-title" to={`/effects/${effect.slug}`}>{effect.name.zh}</Link><span className="card-english" lang="en">{effect.name.en}</span></h2>
      <p className="card-summary">{effect.summary}</p>
      <div className="chip-row">{effect.triggers.filter(trigger => trigger !== 'none').map(trigger => <span className="badge" key={trigger}>{triggers.find(([key]) => key === trigger)?.[1]}</span>)}<span className="badge">{types.find(([key]) => key === effect.type)?.[1]}</span></div>
      {approximate ? <p className="match-hint">相近推荐 · 不代表匹配</p> : hit.matchedText && <p className="match-hint">匹配：{matchLabel} {hit.matchedText}</p>}
      <Link className="detail-link" to={`/effects/${effect.slug}`} aria-label={`查看详情：${effect.name.zh}`}>查看详情 <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
