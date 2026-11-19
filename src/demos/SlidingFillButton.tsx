import { useEffect, useState } from 'react';
import type { DemoProps } from '../types';
import './SlidingFillButton.css';
export function SlidingFillButton({ values, paused = false, virtualPointer, reducedMotion }: DemoProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [tapped, setTapped] = useState(false);
  const active = !paused && (tapped || (!reducedMotion && (hover || focus)) || virtualPointer !== undefined);
  const [resting, setResting] = useState(true);
  useEffect(() => { if (active) setResting(false); }, [active]);
  const instant = reducedMotion && !virtualPointer;
  const offset = active ? 0 : resting || instant ? -100 : 100;
  const duration = resting && !active || instant ? 0 : Number(values.duration);
  return <button className="sliding-button" aria-pressed={active} style={{ width: `${values.width}px`, color: active ? 'white' : '#4338ca' }}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)} onFocus={event => setFocus(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocus(false)}
    onClick={() => { setTapped(!active); setHover(false); setFocus(false); }}>
    <span className="sliding-label">向前一步</span>
    <span className="sliding-fill" aria-hidden="true" onTransitionEnd={event => {
      if (event.target === event.currentTarget && !active) setResting(true);
    }} style={{ transform: `translateX(${offset}%)`, transformOrigin: active ? 'left' : 'right', transitionDuration: `${duration}ms` }}>
      <span className="sliding-label-copy" style={{ transform: `translateX(${-offset}%)`, transitionDuration: `${duration}ms` }}>向前一步</span>
    </span>
  </button>;
}
