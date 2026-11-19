import { useEffect, useState } from 'react';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { publishedEffects } from '../content';
import { discover } from '../search';
import { categories, emptyState, filterEffects, readState, triggers, types, writeState } from '../search/filters';
import type { DiscoveryState } from '../search/filters';
import { SearchBox } from '../components/SearchBox';
import { FilterBar } from '../components/FilterBar';
import { EffectCard } from '../components/EffectCard';
export function Library() {
  const [params, setParams] = useSearchParams();
  const state = readState(params);
  const location = useLocation();
  const navigationType = useNavigationType();
  const [input, setInput] = useState(state.q);
  // Own replace updates may finish after another keystroke; never overwrite
  // the draft from those updates. Only history navigation restores the input.
  useEffect(() => {
    if (navigationType === 'POP') setInput(readState(new URLSearchParams(location.search)).q);
  }, [location.key, location.search, navigationType]);
  useEffect(() => {
    if (input === state.q) return;
    const timer = window.setTimeout(() => setParams(writeState({ ...readState(params), q: input }), { replace: true }), 150);
    return () => window.clearTimeout(timer);
  }, [input, state.q, params, setParams]);
  const change = (next: DiscoveryState) => setParams(writeState({ ...next, q: input }), { replace: true });
  const { hits, nearest } = discover(filterEffects(publishedEffects, state), state.q);
  const active = !!(state.q || state.triggers.length || state.categories.length || state.type);
  const summary = [state.q && `搜索：${state.q}`, ...triggers.filter(([key]) => state.triggers.includes(key)).map(([, label]) => label), ...categories.filter(([key]) => state.categories.includes(key)).map(([, label]) => label), types.find(([key]) => state.type === key)?.[1]].filter(Boolean).join(' · ');
  return <><h1>效果 Library</h1><SearchBox value={input} onChange={setInput}/><FilterBar state={state} onChange={change}/>
    <div className="result-line"><p role="status" aria-live="polite" aria-atomic="true">共 {hits.length} 个效果{nearest.length > 0 && `，另有 ${nearest.length} 个相近推荐`}</p>{(active || input) && <button onClick={() => { setInput(''); setParams(writeState(emptyState), { replace: true }); }}>清除筛选</button>}</div>
    {active && <p className="active-summary">当前：{summary}</p>}
    {hits.length === 0 && <section className="empty-state"><h2>没有找到完全匹配的效果</h2><p>试试其他描述，或用上方「它什么时候动？」筛选；相近推荐也遵循当前筛选。</p>{nearest.length > 0 ? <h3>相近的效果</h3> : <p>当前筛选下没有相近的效果，可以清除筛选再试。</p>}</section>}
    <div className="gallery-grid">{(hits.length ? hits : nearest).map(hit => <EffectCard key={hit.effect.id} hit={hit} approximate={!hits.length}/>)}</div>
  </>;
}
