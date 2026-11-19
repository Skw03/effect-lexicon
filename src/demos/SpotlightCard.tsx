import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import { useDemoPointer } from './useDemoPointer';
import './SpotlightCard.css';
export function SpotlightCard({ values, virtualPointer, paused = false, reducedMotion }: DemoProps) {
  const { ref, rect, point, handlers } = useDemoPointer<HTMLDivElement>();
  const target = paused ? undefined : virtualPointer ?? (!reducedMotion ? point : undefined);
  const size = Number(values.radius) * 2;
  const style = { '--x': `${(target?.x ?? .5) * (rect.current?.width ?? 320)}px`, '--y': `${(target?.y ?? .5) * (rect.current?.height ?? 200)}px`, '--spot-size': `${size}px`, '--spot-intensity': values.intensity, '--spot-opacity': target ? 1 : 0, '--spot-duration': reducedMotion && !virtualPointer ? '0ms' : '200ms' } as CSSProperties;
  return <div ref={ref} className="spotlight-card" style={style} tabIndex={0} role="group" aria-label="聚光卡片，方向键移动光斑，Escape 复位" {...handlers}>
    <span className="spot-border" aria-hidden="true"><span className="spot-light"/></span><span className="spot-light spot-fill" aria-hidden="true"/>
    <strong>光随你而来</strong><span>移动指针，照亮一处细节</span>
  </div>;
}
