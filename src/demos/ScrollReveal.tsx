import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import { useScrollStage } from './useScrollStage';
import './ScrollReveal.css';
const titles = ['观察','收集','整理','尝试','打磨','分享'];
export function ScrollReveal(props: DemoProps) {
  const { values, compact, reducedMotion, running, paused = false } = props;
  const { ref } = useScrollStage(props);
  const [seen, setSeen] = useState<Record<number, number>>({});
  const staticView = compact || (reducedMotion && !running);
  useEffect(() => {
    const node = ref.current;
    if (!node || staticView) return;
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio >= .2) {
        const index = Number((entry.target as HTMLElement).dataset.index);
        const delay = order++ * 80;
        setSeen(old => ({ ...old, [index]: delay }));
        observer.unobserve(entry.target);
      }
    }, { root: node, threshold: .2 });
    node.querySelectorAll('.scroll-reveal-slot').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [ref, staticView]);
  return <div ref={ref} className={`reveal-stage${compact ? ' reveal-static' : ''}`} tabIndex={compact ? undefined : 0} role={compact ? undefined : 'region'} aria-label="卡片渐显滚动演示"><div className="reveal-list">{titles.map((title,i) => <div className="scroll-reveal-slot" data-index={i} key={title}><article className={`scroll-reveal-card${staticView ? ' is-static' : seen[i] !== undefined ? ' is-seen' : ''}`} style={{ '--scroll-distance': `${values.distance}px`, animationDuration: `${values.duration}ms`, animationDelay: `${seen[i] ?? 0}ms`, animationPlayState: paused ? 'paused' : 'running' } as CSSProperties}><strong>0{i+1} · {title}</strong><p>让每个小想法，都有被看见的机会。</p></article></div>)}</div></div>;
}
