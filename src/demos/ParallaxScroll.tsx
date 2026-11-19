import type { DemoProps } from '../types';
import { useScrollStage } from './useScrollStage';
import './ParallaxScroll.css';
export function ParallaxScroll(props: DemoProps) {
  const { values, compact, reducedMotion, running } = props;
  const { ref, scrollTop } = useScrollStage(props);
  const amount = reducedMotion && !running ? 0 : scrollTop;
  return <div ref={ref} className={`parallax-stage${compact ? ' parallax-static' : ''}`} tabIndex={compact ? undefined : 0} role={compact ? undefined : 'region'} aria-label="分层视差滚动演示"><div className="parallax-world">
    <div className="parallax-back" aria-hidden="true" style={{ transform: `translate3d(0,${amount * (1-Number(values.backgroundSpeed))}px,0)` }}><span/><span/></div>
    <div className="parallax-mid" aria-hidden="true" style={{ transform: `translate3d(0,${amount * (1-Number(values.midgroundSpeed))}px,0)` }}><span/><span/></div>
    <div className="parallax-front"><h3>远近之间</h3><p>向下滚动，看不同图层缓缓错开。</p></div>
    {!compact && <div className="parallax-end"><h3>留一点距离</h3><p>文字正常滚动，远处的形状移动得更慢。</p></div>}
  </div></div>;
}
