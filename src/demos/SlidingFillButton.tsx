import { useState } from 'react';
import type { DemoProps } from '../types';
import './SlidingFillButton.css';
export function SlidingFillButton({ values, paused = false, virtualPointer, reducedMotion }: DemoProps) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [tapped, setTapped] = useState(false);
  const active = !paused && (tapped || (!reducedMotion && (hover || focus)) || virtualPointer !== undefined);
  return <button className="sliding-button" aria-pressed={active} style={{ width: `${values.width}px`, color: active ? 'white' : '#4338ca' }}
    onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)} onFocus={event => setFocus(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocus(false)}
    onClick={() => { setTapped(!active); setHover(false); setFocus(false); }}>
    <span className="sliding-fill" aria-hidden="true" style={{ transform: `scaleX(${active ? 1 : 0})`, transformOrigin: active ? 'left' : 'right', transitionDuration: `${reducedMotion && !virtualPointer ? 0 : values.duration}ms` }}/><span className="sliding-label">向前一步</span>
  </button>;
}
