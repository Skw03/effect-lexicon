import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { DemoProps, PointerPosition } from '../types';
import { useRaf } from '../hooks/useRaf';
import './CardTilt3d.css';
const center: PointerPosition = { x: 0.5, y: 0.5 };
export function CardTilt3d({ values, virtualPointer, paused = false, reducedMotion }: DemoProps) {
  const host = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect>();
  const [pointer, setPointer] = useState<PointerPosition>();
  const [smooth, setSmooth] = useState(center);
  const target = paused ? undefined : virtualPointer ?? (!reducedMotion ? pointer : undefined);
  const active = target !== undefined;
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const measure = () => { rect.current = node.getBoundingClientRect(); };
    let measurementFrame = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(measurementFrame);
      measurementFrame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener('scroll', scheduleMeasure, { passive: true, capture: true });
    window.addEventListener('resize', scheduleMeasure);
    return () => { observer.disconnect(); cancelAnimationFrame(measurementFrame); window.removeEventListener('scroll', scheduleMeasure, true); window.removeEventListener('resize', scheduleMeasure); };
  }, []);
  useRaf(active, () => {
    if (target) setSmooth(previous => ({ x: previous.x + (target.x - previous.x) * 0.2, y: previous.y + (target.y - previous.y) * 0.2 }));
  });
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    const box = rect.current;
    if (!box) return;
    setPointer({ x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) });
  };
  const x = active ? smooth.x : 0.5;
  const y = active ? smooth.y : 0.5;
  const duration = reducedMotion && !virtualPointer ? 0 : Number(values.returnDuration);
  return <div ref={host} className="tilt-area" data-static-feedback={reducedMotion && !paused && pointer !== undefined && !virtualPointer || undefined} tabIndex={0} role="group" aria-label="倾斜卡片演示，方向键调整，Escape 回正"
    onPointerEnter={move} onPointerMove={move} onPointerDown={move} onPointerLeave={() => setPointer(undefined)}
    onPointerUp={event => { if (event.pointerType !== 'mouse') setPointer(undefined); }} onPointerCancel={() => setPointer(undefined)}
    onFocus={() => setPointer({ x: 0.7, y: 0.35 })} onBlur={() => setPointer(undefined)}
    onKeyDown={event => {
      if (event.key === 'Escape') { setPointer(undefined); return; }
      const offsets: Record<string, PointerPosition> = { ArrowLeft: { x: -0.15, y: 0 }, ArrowRight: { x: 0.15, y: 0 }, ArrowUp: { x: 0, y: -0.15 }, ArrowDown: { x: 0, y: 0.15 } };
      const offset = offsets[event.key];
      if (offset) { event.preventDefault(); setPointer(previous => ({ x: Math.max(0, Math.min(1, (previous?.x ?? 0.5) + offset.x)), y: Math.max(0, Math.min(1, (previous?.y ?? 0.5) + offset.y)) })); }
    }}>
    <div className="tilt-card" style={{ transform: `perspective(${values.perspective}px) rotateX(${-(y - 0.5) * 2 * Number(values.maxTilt)}deg) rotateY(${(x - 0.5) * 2 * Number(values.maxTilt)}deg) scale(${active ? values.scale : 1})`, transition: active ? 'none' : `transform ${duration}ms ease-out`, willChange: active ? 'transform' : undefined }}>
      <span className="tilt-eyebrow">POINTER / PERSPECTIVE</span><strong>换个角度，看见灵感</strong><span>移动指针 · 方向键 · 手指拖动</span>
      {values.glare === true && <span className="tilt-glare" style={{ opacity: active ? 1 : 0, transform: `translate(${(x - 0.5) * (rect.current?.width ?? 320)}px, ${(y - 0.5) * (rect.current?.height ?? 200)}px)`, transition: active ? 'none' : `opacity ${duration}ms ease-out` }} />}
    </div>
  </div>;
}
