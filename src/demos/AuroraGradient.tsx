import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import './AuroraGradient.css';
export function AuroraGradient({ values, running, paused = false, reducedMotion, onComplete }: DemoProps) {
  const [done, setDone] = useState(false);
  return <div className="aurora" style={{ '--aurora-blur': `${values.blur}px` } as CSSProperties}>
    <div className="aurora-blobs" aria-hidden="true">{[1, .9, 1.1].map((factor, i) => <span key={i} className={`aurora-blob blob-${i}`} style={{ animationDuration: `${Number(values.duration) * (reducedMotion ? 1 : factor)}s`, animationDelay: `${reducedMotion ? 0 : -i * 4}s`, animationPlayState: running && !paused && !done ? 'running' : 'paused', animationIterationCount: reducedMotion ? 1 : 'infinite' }} onAnimationEnd={() => { if (i === 0 && reducedMotion) { setDone(true); onComplete(); } }}/>)}</div>
    <div className="aurora-shade" aria-hidden="true"/><strong>让灵感慢慢流动</strong>
  </div>;
}
