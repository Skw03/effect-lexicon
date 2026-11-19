import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import './SkeletonShimmer.css';
export function SkeletonShimmer({ values, running, paused = false, reducedMotion, onComplete, compact }: DemoProps) {
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const style = { '--skeleton-duration': `${values.duration}s`, '--skeleton-band': `${values.bandWidth}%`, '--skeleton-state': running && !paused && !done && !loaded ? 'running' : 'paused', '--skeleton-count': reducedMotion ? 1 : 'infinite' } as CSSProperties;
  return <div className="skeleton-demo" style={style}>
    <div className="skeleton-content" role="status" aria-live="polite">
      {loaded ? <div className="skeleton-loaded" style={{ animationDuration: reducedMotion ? '0ms' : '200ms' }}><span className="skeleton-avatar" aria-hidden="true">林</span><div><strong>林间手记</strong><p>留一点时间，记录今天的新发现。</p></div></div> : <><span className="sr-only">加载中</span><div className="skeleton-layout" aria-hidden="true"><span className="skeleton-block skeleton-avatar" onAnimationEnd={e => { if (reducedMotion && e.animationName === 'skeleton-sweep') { setDone(true); onComplete(); } }}/><div className="skeleton-bars">{[100,80,60].map(width => <span key={width} className="skeleton-block" style={{ width: `${width}%` }}/>)}</div></div></>}
    </div>
    {!compact && <label className="skeleton-toggle"><input type="checkbox" checked={loaded} onChange={e => setLoaded(e.target.checked)}/>显示加载完成后的内容</label>}
  </div>;
}
