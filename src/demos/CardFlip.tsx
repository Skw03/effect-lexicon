import { useState } from 'react';
import type { DemoProps } from '../types';
import './CardFlip.css';
export function CardFlip({ values, virtualPointer, paused = false, reducedMotion }: DemoProps) {
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = !paused && (flipped || (!reducedMotion && (hover || focused)) || virtualPointer !== undefined);
  return <button className="flip-card" aria-description="翻转卡片，Enter 或空格切换" aria-pressed={active}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)}
    onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocused(false)}
    onClick={() => { setFlipped(!active); setHover(false); setFocused(false); }}>
    <span className="flip-inner" style={{ transform: `${values.axis === 'horizontal' ? 'rotateX' : 'rotateY'}(${active ? 180 : 0}deg)`, transitionDuration: `${reducedMotion && !virtualPointer ? 0 : values.duration}ms` }}>
      <span className="flip-face flip-front" aria-hidden={active}><strong>灵感的另一面</strong><span>轻触，翻开看看</span></span>
      <span className="flip-face flip-back" aria-hidden={!active} style={{ transform: `${values.axis === 'horizontal' ? 'rotateX' : 'rotateY'}(180deg)` }}><strong>从想法到细节</strong><span>背面承载补充说明，再次点击回到正面。</span></span>
    </span>
  </button>;
}
