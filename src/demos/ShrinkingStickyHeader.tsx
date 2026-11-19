import type { DemoProps } from '../types';
import { useScrollStage } from './useScrollStage';
import './ShrinkingStickyHeader.css';
export function ShrinkingStickyHeader(props: DemoProps) {
  const { values, compact, reducedMotion, running } = props;
  const { ref, scrollTop } = useScrollStage(props, true);
  const collapsed = compact || scrollTop > Number(values.threshold);
  return <div ref={ref} className={`sticky-stage${compact ? ' scroll-static' : ''}`} tabIndex={compact ? undefined : 0} role={compact ? undefined : 'region'} aria-label="导航收缩滚动演示">
    <div className="sticky-document"><header className="sticky-demo-header" data-collapsed={collapsed} style={{ height: `${collapsed ? values.collapsedHeight : 72}px`, transitionDuration: reducedMotion && !running ? '0ms' : '200ms' }}>
      <span className="sticky-header-surface" aria-hidden="true" style={{ opacity: collapsed ? 1 : 0, transitionDuration: reducedMotion && !running ? '0ms' : '200ms' }}/><strong>山间</strong><nav aria-label="演示导航">{['路线','手记'].map(label => compact ? <span key={label}>{label}</span> : <a href="#sticky-demo" key={label} onClick={e => e.preventDefault()}>{label}</a>)}</nav>
    </header><div className="sticky-story"><h3>向山而行</h3><p>慢一点，看看路上的风景。</p>{['清晨出发','沿溪而上','林间小憩','山顶远望'].map((title,i) => <section key={title}><h4>0{i+1} · {title}</h4><p>在一段安静的路上，给新的发现留出空间。</p></section>)}</div></div>
  </div>;
}
