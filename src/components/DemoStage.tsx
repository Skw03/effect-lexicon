import { useCallback, useEffect, useState } from 'react';
import type { Effect, Values } from '../types';
import { demoRegistry } from '../demos/registry';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useVirtualPointer } from '../hooks/useVirtualPointer';
export function DemoStage({ effect, values, reset }: { effect: Effect; values: Values; reset: () => void }) {
  const reduced = useReducedMotion();
  const scroll = effect.triggers.includes('scroll');
  const { ref, visible } = useInView<HTMLDivElement>();
  const [playing, setPlaying] = useState(!reduced && !scroll);
  const [finished, setFinished] = useState(false);
  const [manualStarted, setManualStarted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [auto, setAuto] = useState(false);
  const stop = useCallback(() => setAuto(false), []);
  const complete = useCallback(() => { setFinished(true); setPlaying(false); }, []);
  const virtualPointer = useVirtualPointer(auto && visible, stop);
  useEffect(() => { setPlaying(!reduced && !scroll); setManualStarted(false); setFinished(false); setAuto(false); setReplayKey(key => key + 1); }, [reduced, scroll]);
  const replay = () => { setManualStarted(true); setReplayKey(key => key + 1); setFinished(false); setPlaying(true); };
  const Demo = demoRegistry[effect.demo.component];
  return <section className="panel"><h2>亲手试一试</h2><p className="fine-hint">{effect.demo.hint}</p><p className="touch-hint">{effect.demo.hintTouch}</p>
    {effect.demo.autoDemo && <p className="muted">{effect.demo.component === 'CardTilt3d' ? '键盘聚焦卡片后用方向键调整，Escape 回正；也可自动演示。' : '也可按自动演示体验一次，随时按停止中断。'}</p>}
    {reduced && !effect.demo.staticStyle && <p className="motion-note">已开启减少动态：默认静止，手动播放仅演示一次，可再次重播。</p>}
    <div ref={ref} className="demo-stage"><Demo key={replayKey} values={values} paused={!visible || (scroll && manualStarted && !playing && !finished)} running={playing && visible} replayKey={replayKey} reducedMotion={reduced} virtualPointer={virtualPointer} onComplete={complete}/></div>
    <div className="toolbar">
      {effect.demo.replayable && <><button onClick={replay}>重播 Replay</button><button onClick={() => { if (finished) replay(); else { setManualStarted(true); setPlaying(value => !value); } }}>{playing ? '暂停 Pause' : '播放 Play'}</button></>}
      <button onClick={() => { reset(); setManualStarted(false); setAuto(false); setReplayKey(key => key + 1); setFinished(false); setPlaying(!reduced && !scroll); }}>重置 Reset</button>
      {effect.demo.autoDemo && <button onClick={() => setAuto(value => !value)}>{auto ? '停止 Stop' : '自动演示 Auto demo'}</button>}
    </div>
    {effect.demo.staticStyle && <p className="badge">视觉样式 · 无动画</p>}
  </section>;
}
