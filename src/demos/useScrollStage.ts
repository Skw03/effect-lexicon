import { useEffect, useRef, useState } from 'react';
import type { DemoProps } from '../types';
// Each caller owns its scroll region. No window scroll listener or page scroll lock.
export function useScrollStage({ compact, running, paused = false, onComplete }: DemoProps, returnToTop = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [interrupted, setInterrupted] = useState(false);
  const progress = useRef(0);
  const maxScroll = useRef(0);
  useEffect(() => {
    const node = ref.current;
    if (!node || compact) return;
    let frame = 0;
    const measure = () => { maxScroll.current = node.scrollHeight - node.clientHeight; };
    const observer = new ResizeObserver(measure); observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    measure();
    const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setScrollTop(node.scrollTop)); };
    const interrupt = () => { setInterrupted(true); onComplete(); };
    node.addEventListener('scroll', scroll, { passive: true });
    node.addEventListener('wheel', interrupt, { passive: true });
    node.addEventListener('touchstart', interrupt, { passive: true });
    node.addEventListener('keydown', interrupt);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); node.removeEventListener('scroll', scroll); node.removeEventListener('wheel', interrupt); node.removeEventListener('touchstart', interrupt); node.removeEventListener('keydown', interrupt); };
  }, [compact, onComplete]);
  useEffect(() => {
    const node = ref.current;
    if (!node || compact || !running || paused || interrupted) return;
    let frame = 0, previous = 0;
    const tick = (now: number) => {
      if (previous) progress.current += Math.min(64, now - previous);
      previous = now;
      const t = Math.min(1, progress.current / 3000);
      const ease = (x: number) => (1 - Math.cos(Math.PI * x)) / 2;
      node.scrollTop = returnToTop ? Math.min(200, maxScroll.current) * ease(t < .5 ? t * 2 : (1-t)*2) : maxScroll.current * ease(t);
      if (t < 1) frame = requestAnimationFrame(tick); else onComplete();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [compact, running, paused, interrupted, returnToTop, onComplete]);
  return { ref, scrollTop };
}
