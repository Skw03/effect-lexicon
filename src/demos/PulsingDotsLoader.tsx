import { useState } from 'react';
import type { DemoProps } from '../types';
import './PulsingDotsLoader.css';
export function PulsingDotsLoader({ values, running, paused = false, reducedMotion, onComplete }: DemoProps) {
  const [done, setDone] = useState(false);
  return <div className="pulsing-dots" role="status"><span className="sr-only">加载中</span>{[0,1,2].map(i => <span key={i} aria-hidden="true" className="pulsing-dot" style={{ width: `${values.size}px`, height: `${values.size}px`, animationDuration: `${values.duration}s`, animationDelay: `${i * .15}s`, animationIterationCount: reducedMotion ? 1 : 'infinite', animationPlayState: running && !paused && !done ? 'running' : 'paused' }} onAnimationEnd={() => { if(i === 2 && reducedMotion) { setDone(true); onComplete(); } }}/>)}</div>;
}
