import type { DemoProps } from '../types';
import { useDemoPointer } from './useDemoPointer';
import './MagneticButton.css';
export function MagneticButton({ values, virtualPointer, paused = false, reducedMotion }: DemoProps) {
  const { ref, rect, point, handlers } = useDemoPointer<HTMLDivElement>();
  const target = paused ? undefined : virtualPointer ?? (!reducedMotion ? point : undefined);
  const dx = ((target?.x ?? .5)-.5) * (rect.current?.width ?? 320);
  const dy = ((target?.y ?? .5)-.5) * (rect.current?.height ?? 212);
  // Distance to the resting button's edge, not its moving bounding box.
  const within = Math.hypot(Math.max(0,Math.abs(dx)-80),Math.max(0,Math.abs(dy)-26)) <= Number(values.radius);
  const length = Math.hypot(dx,dy);
  const scale = target && within ? Math.min(Number(values.strength),14 / (length || 1)) : 0;
  return <div ref={ref} className="magnetic-area" {...handlers}>
    <button className="magnetic-button" aria-description="磁吸按钮，方向键调整，Escape 复位" style={{ transform: `translate(${dx*scale}px, ${dy*scale}px)`, transition: `transform ${reducedMotion && !virtualPointer ? 0 : target && within ? 100 : 500}ms ${target && within ? 'ease-out' : 'cubic-bezier(.34,1.56,.64,1)'}` }}>靠近一点</button>
  </div>;
}
