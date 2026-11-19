import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { DemoProps } from '../types';
import './Glassmorphism.css';
export function Glassmorphism({ values, compact = false }: DemoProps) {
  const [background, setBackground] = useState(0);
  const style = { '--fill': values.fillOpacity, backdropFilter: `blur(${values.blur}px) saturate(140%)`, WebkitBackdropFilter: `blur(${values.blur}px) saturate(140%)`, borderColor: `rgba(255,255,255,${values.borderOpacity})`, borderRadius: `${values.radius}px` } as CSSProperties;
  return <div className="glass-demo">
    <div className={`glass-scene background-${background}`}><div className="glass-pattern" aria-hidden="true"/><div className="glass-card" style={style}><span>静态视觉实验</span>{compact ? <strong>透过朦胧，看见层次</strong> : <h2>透过朦胧，看见层次</h2>}<p>背景的色彩与纹理，在面板后柔和交融。</p></div></div>
    {!compact && <div className="toolbar" aria-label="演示背景">{['彩色渐变', '条纹色块', '柔和光斑'].map((label, index) => <button key={label} aria-pressed={background === index} onClick={() => setBackground(index)}>{label}</button>)}</div>}
  </div>;
}
