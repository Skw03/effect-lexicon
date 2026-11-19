import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import './StaggeredTextReveal.css';
const words = ['让', '每个', '想法', '依次', '浮现'];
export function StaggeredTextReveal({ values, running, paused = false, reducedMotion, onComplete }: DemoProps) {
  const [started, setStarted] = useState(false);
  useEffect(() => { if (running && !paused) setStarted(true); }, [running, paused]);
  return <div className="staggered-text" role="img" aria-label={words.join('')}>
    {words.map((word,index) => <span key={word} aria-hidden="true" className={started ? 'reveal-word' : ''} style={{ '--reveal-distance': `${values.distance}px`, animationDuration: `${values.duration}ms`, animationDelay: `${index*Number(values.stagger)}ms`, animationPlayState: running && !paused ? 'running' : 'paused', opacity: !started && !reducedMotion ? 0 : undefined } as CSSProperties} onAnimationEnd={() => { if (index === words.length-1) onComplete(); }}>{word}</span>)}
  </div>;
}
