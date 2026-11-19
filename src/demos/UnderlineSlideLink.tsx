import { useState } from 'react';
import type { DemoProps } from '../types';
import './UnderlineSlideLink.css';
export function UnderlineSlideLink({ values, paused = false, reducedMotion, virtualPointer }: DemoProps) {
  const [hover, setHover] = useState(-1);
  const [focus, setFocus] = useState(-1);
  const [tapped, setTapped] = useState(-1);
  const virtual = virtualPointer ? Math.min(3, Math.floor(virtualPointer.x * 4)) : -1;
  return <nav className="underline-nav" aria-label="下划线演示导航">{['发现','作品','关于','联系'].map((label, i) => {
    const active = !paused && (virtual === i || tapped === i || (hover === i || focus === i));
    return <a href="#underline-demo" key={label} onClick={e => { e.preventDefault(); setTapped(active ? -1 : i); setHover(-1); setFocus(-1); }} onPointerEnter={e => { if(e.pointerType === 'mouse') setHover(i); }} onPointerLeave={() => setHover(-1)} onFocus={e => { if(e.currentTarget.matches(':focus-visible')) setFocus(i); }} onBlur={() => setFocus(-1)}>
      {label}<span aria-hidden="true" style={{ height: `${values.thickness}px`, transform: `scaleX(${active ? 1 : 0})`, transformOrigin: active ? 'left' : 'right', transitionDuration: `${reducedMotion && !virtualPointer ? 0 : values.duration}ms` }}/>
    </a>;
  })}</nav>;
}
