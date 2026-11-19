import { useEffect, useRef, useState } from 'react';
import type { DemoProps } from '../types';
import { useDemoPointer } from './useDemoPointer';
import './RippleButton.css';
export function RippleButton({ values, paused = false, reducedMotion }: DemoProps) {
  const { ref, rect, position } = useDemoPointer<HTMLButtonElement>();
  const next = useRef(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const timers = useRef(new Set<number>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  useEffect(() => { if (paused) { timers.current.forEach(clearTimeout); timers.current.clear(); setRipples([]); } }, [paused]);
  return <button ref={ref} className="ripple-button" onClick={event => {
    if (paused) return;
    const p = event.detail === 0 ? { x: .5, y: .5 } : position(event);
    const id = next.current++;
    const size = 2 * Math.hypot(rect.current?.width ?? 180, rect.current?.height ?? 56);
    setRipples(old => [...old, { id, x: p.x, y: p.y, size }]);
    const timer = window.setTimeout(() => { setRipples(old => old.filter(ripple => ripple.id !== id)); timers.current.delete(timer); }, Number(values.duration));
    timers.current.add(timer);
  }}>点亮一圈{ripples.map(ripple => <span key={ripple.id} className={`ripple-wave${reducedMotion ? ' ripple-reduced' : ''}`} aria-hidden="true" style={{ left: `${ripple.x*100}%`, top: `${ripple.y*100}%`, width: ripple.size, height: ripple.size, marginLeft: -ripple.size/2, marginTop: -ripple.size/2, animationDuration: `${values.duration}ms`, opacity: Number(values.opacity), '--ripple-opacity': values.opacity } as React.CSSProperties} onAnimationEnd={() => setRipples(old => old.filter(item => item.id !== ripple.id))}/>)}</button>;
}
