import { useEffect, useState } from 'react';
import type { DemoProps } from '../types';
import { advanceType, initialTypeState, phrases } from './typewriterMachine';
import './Typewriter.css';
export function Typewriter({ values, running, reducedMotion, onComplete }: DemoProps) {
  const [state, setState] = useState(initialTypeState);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!running || state.phase === 'done') return;
    setStarted(true);
    const delay = state.phase === 'intro' ? 1060 : state.phase === 'holding' ? Number(values.pauseAfter) : Number(state.phase === 'deleting' ? values.deleteSpeed : values.typingSpeed);
    const timer = window.setTimeout(() => setState(current => advanceType(current, values.loop === true && !reducedMotion)), delay);
    return () => window.clearTimeout(timer);
  }, [running, state, values.pauseAfter, values.deleteSpeed, values.typingSpeed, values.loop, reducedMotion]);
  useEffect(() => { if (state.phase === 'done') onComplete(); }, [state.phase, onComplete]);
  const representative = reducedMotion && !started;
  const phrase = phrases[representative ? 0 : state.phrase];
  const text = representative ? phrase : Array.from(phrase).slice(0, state.count).join('');
  const blink = running && !representative && (state.phase === 'holding' || state.phase === 'intro');
  return <div className="typewriter" role="img" aria-label={phrase} data-phase={state.phase}>
    <span aria-hidden="true">{text}<span className={`caret ${blink ? 'blink' : ''}`}>│</span></span>
  </div>;
}
