import { useEffect, useRef, useState } from 'react';
import type { PointerPosition } from '../types';
import { useRaf } from './useRaf';
export function pointerPath(progress: number): PointerPosition {
  const t = progress < 0.5 ? progress * 4 * Math.PI : (progress - 0.5) * 4 * Math.PI;
  const envelope = Math.min(1, progress * 10, (1 - progress) * 10);
  const bound = (value: number) => Math.max(0.1, Math.min(0.9, value));
  return { x: bound(0.5 + 0.4 * Math.sin(t) * envelope), y: bound(0.5 + 0.4 * (progress < 0.5 ? Math.cos(t) : Math.sin(2 * t)) * envelope) };
}
export function useVirtualPointer(active: boolean, stop: () => void) {
  const start = useRef<number>();
  const [point, setPoint] = useState<PointerPosition>();
  useEffect(() => { start.current = undefined; if (!active) setPoint(undefined); }, [active]);
  useRaf(active, time => {
    start.current ??= time;
    const progress = (time - start.current) / 4000;
    if (progress >= 1) { setPoint(undefined); stop(); } else setPoint(pointerPath(progress));
  });
  return active ? point : undefined;
}
