import { useEffect, useRef } from 'react';
export function useRaf(active: boolean, callback: (time: number) => void) {
  const latest = useRef(callback);
  latest.current = callback;
  useEffect(() => {
    if (!active) return;
    let frame: number;
    const tick = (time: number) => { latest.current(time); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}
