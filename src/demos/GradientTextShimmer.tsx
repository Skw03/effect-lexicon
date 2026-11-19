import { useId, useState } from 'react';
import type { DemoProps } from '../types';
import './GradientTextShimmer.css';
export function GradientTextShimmer({ values, running, paused = false, reducedMotion, onComplete }: DemoProps) {
  const id = useId().replace(/:/g,'');
  const [done, setDone] = useState(false);
  // Darker hues leave contrast headroom for the translucent white sweep.
  // SVG clipping keeps the glyphs fixed while only the highlight layer translates.
  return <svg className="text-shimmer" viewBox="0 0 600 140" role="img" aria-label="让灵感发光">
    <defs><linearGradient id={`${id}-color`}><stop stopColor="#3730a3"/><stop offset=".5" stopColor="#5b21b6"/><stop offset="1" stopColor="#9d174d"/></linearGradient>
      <linearGradient id={`${id}-band`}><stop stopColor="white" stopOpacity="0"/><stop offset=".5" stopColor="white" stopOpacity=".2"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
      <clipPath id={`${id}-clip`}><text x="300" y="90" textAnchor="middle">让灵感发光</text></clipPath>
    </defs>
    <text x="300" y="90" textAnchor="middle" fill={`url(#${id}-color)`} aria-hidden="true">让灵感发光</text>
    <g clipPath={`url(#${id}-clip)`} aria-hidden="true"><rect className="shimmer-band" x={-600*Number(values.bandWidth)/100} y="0" width={600*Number(values.bandWidth)/100} height="140" fill={`url(#${id}-band)`}
      style={{ animationDuration: `${values.duration}s`, animationPlayState: running && !paused && !done ? 'running' : 'paused', animationIterationCount: reducedMotion ? 1 : 'infinite', opacity: done ? 0 : 1 }} onAnimationEnd={() => { if (reducedMotion) { setDone(true); onComplete(); } }}/></g>
  </svg>;
}
