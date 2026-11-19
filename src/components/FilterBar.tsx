import { categories, triggers, types } from '../search/filters';
import type { DiscoveryState } from '../search/filters';
export function FilterBar({ state, onChange }: { state: DiscoveryState; onChange: (state: DiscoveryState) => void }) {
  const toggle = <T,>(values: T[], value: T) => values.includes(value) ? values.filter(item => item !== value) : [...values, value];
  return <div className="filter-bar">
    <fieldset><legend>它什么时候动？</legend><div className="chip-row">{triggers.map(([value, label]) => <button key={value} aria-pressed={state.triggers.includes(value)} onClick={() => onChange({ ...state, triggers: toggle(state.triggers, value) })}>{label}</button>)}</div></fieldset>
    <fieldset><legend>用在哪里？</legend><div className="chip-row">{categories.map(([value, label]) => <button key={value} aria-pressed={state.categories.includes(value)} onClick={() => onChange({ ...state, categories: toggle(state.categories, value) })}>{label}</button>)}</div></fieldset>
    <fieldset><legend>类型</legend><div className="chip-row">{([['', '全部'], ...types] as const).map(([value, label]) => <button key={value} aria-pressed={state.type === value} onClick={() => onChange({ ...state, type: value })}>{label}</button>)}</div></fieldset>
  </div>;
}
