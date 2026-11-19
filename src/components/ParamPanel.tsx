import type { Effect, Values } from '../types';
export function ParamPanel({ effect, values, onChange, reset }: { effect: Effect; values: Values; onChange: (key: string, value: Values[string]) => void; reset: () => void }) {
  return <section className="panel"><div className="section-heading"><h2>调整参数</h2><button onClick={reset}>恢复默认</button></div><div className="params">
    {effect.params.map(param => <label key={param.key} className="param" htmlFor={`param-${param.key}`}>
      <span>{param.label}{param.kind === 'number' && <output> {values[param.key]}{param.unit}</output>}</span>
      {param.kind === 'number' ? <input id={`param-${param.key}`} type="range" min={param.min} max={param.max} step={param.step} value={Number(values[param.key])} onChange={event => onChange(param.key, Number(event.target.value))}/> : param.kind === 'boolean' ? <input id={`param-${param.key}`} type="checkbox" checked={values[param.key] === true} onChange={event => onChange(param.key, event.target.checked)}/> : <select id={`param-${param.key}`} value={String(values[param.key])} onChange={event => onChange(param.key, event.target.value)}>{param.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>}
    </label>)}
  </div></section>;
}
