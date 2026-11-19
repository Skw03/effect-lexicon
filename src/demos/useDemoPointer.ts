import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, KeyboardEvent } from 'react';
import type { PointerPosition } from '../types';
// Cache layout outside input handlers; a single observer/listener set per mounted demo.
export function useDemoPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const rect = useRef<DOMRect>();
  const [point, setPoint] = useState<PointerPosition>();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => { rect.current = node.getBoundingClientRect(); };
    let frame = 0;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(node);
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule); };
  }, []);
  const position = (event: { clientX: number; clientY: number }) => {
    const box = rect.current;
    return box ? { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height } : { x: .5, y: .5 };
  };
  const move = (event: PointerEvent<T>) => setPoint(position(event));
  const clear = () => setPoint(undefined);
  const key = (event: KeyboardEvent<T>) => {
    if (event.key === 'Escape') { clear(); return; }
    const delta: Record<string, [number, number]> = { ArrowLeft: [-.15,0], ArrowRight: [.15,0], ArrowUp: [0,-.15], ArrowDown: [0,.15] };
    const d = delta[event.key];
    if (d) { event.preventDefault(); setPoint(old => ({ x: Math.max(0, Math.min(1,(old?.x ?? .5)+d[0])), y: Math.max(0, Math.min(1,(old?.y ?? .5)+d[1])) })); }
  };
  return { ref, rect, point, position, handlers: { onPointerEnter: move, onPointerMove: move, onPointerDown: move, onPointerLeave: clear, onPointerCancel: clear, onPointerUp: (event: PointerEvent<T>) => { if (event.pointerType !== 'mouse') clear(); }, onFocus: () => setPoint({ x: .65, y: .4 }), onBlur: clear, onKeyDown: key } };
}
